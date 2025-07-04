"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/dateFormat";
import {
  useAllRFQsMutation,
  useCreateRFQMutation,
  useDeleteRfqMutation,
} from "@/redux/query/rfqsApi";
import Alert from "@/components/dialogs/Alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Toaster } from "@/components/ui/sonner";
import CreateDialog from "@/components/dialogs/CreateDialog";
import CreateProject from "@/components/dialogs/CreateLPO";
import debounce from "lodash.debounce";

function RFQs() {
  const companyId = "6850144a18d7f8eeea750c20";
  const router = useRouter();
  const [rfqs, setRFQs] = useState<any[]>([]);
  const [filteredRFQs, setFilteredRFQs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isCreateLPODialogOpen, setIsCreateLPODialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const [rfqsApi, { data, isSuccess, error, isError, isLoading: isRFQsLoading }] = useAllRFQsMutation();
  const [createRFQApi] = useCreateRFQMutation();
  const [deleteRFQApi] = useDeleteRfqMutation();

  const getRFQs = async () => {
    try {
      setIsLoading(true);
      const res = await rfqsApi({ page }).unwrap();
      console.log("Default RFQs API Response:", JSON.stringify(res, null, 2));
      if (res?.data) {
        setRFQs(res.data);
        setFilteredRFQs(res.data);
      } else {
        toast.warning("No RFQs found.");
        setRFQs([]);
        setFilteredRFQs([]);
      }
    } catch (err: any) {
      console.error("Default RFQs Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch RFQs: " + (err?.data?.message || err.message || "Unknown error"));
      setRFQs([]);
      setFilteredRFQs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setPage(1);
      try {
        setIsLoading(true);
        if (query === "") {
          await getRFQs();
        } else {
          const res = await rfqsApi({ search: query, page }).unwrap();
          console.log("Search RFQs API Response:", JSON.stringify(res, null, 2));
          if (res?.data) {
            setFilteredRFQs(res.data);
            console.log("Search Results:", res.data);
          } else {
            console.log("Search Results: No RFQs found");
            toast.warning("No RFQs found for the search query.");
            setFilteredRFQs([]);
          }
        }
      } catch (err: any) {
        console.error("Search RFQs Error:", JSON.stringify(err, null, 2));
        toast.error("Failed to search RFQs: " + (err?.data?.message || err.message || "Unknown error"));
        setFilteredRFQs([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [rfqsApi, page]
  );

  const handleSubmit = async (data: any) => {
    try {
      console.log("Create RFQ Data:", JSON.stringify(data, null, 2));
      const res = await createRFQApi({ data }).unwrap();
      toast.success("RFQ created successfully!");
      getRFQs();
      return res;
    } catch (err: any) {
      console.error("RFQ Creation Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to create RFQ: " + (err?.data?.message || err.message || "Unknown error"));
      throw err;
    }
  };

  const deleteRFQ = async () => {
    if (!itemToDelete?._id) return;
    try {
      console.log("Delete RFQ Response:", itemToDelete._id);
      await deleteRFQApi({ id: itemToDelete._id }).unwrap();
      toast.success("RFQ deleted successfully!");
      setIsDialogOpen(false);
      getRFQs();
    } catch (err: any) {
      console.error("Delete RFQ Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to delete RFQ: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <TabsList className="hidden sm:flex bg-gray-100 rounded-lg">
                <TabsTrigger value="all" className="text-sm text-gray-800">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-sm text-gray-800">Pending</TabsTrigger>
                <TabsTrigger value="approved" className="text-sm text-gray-800">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="text-sm text-gray-800">Rejected</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by RFQ ID, client, etc."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setIsCreateRFQDialogOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Generate RFQ
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    RFQ List
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your RFQs and view their status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="text-sm font-medium text-gray-700">RFQ ID</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Quotation No.</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Client</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Project</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Scope of Work</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Quotation</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">Created</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Job</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index} className="border-b border-gray-100">
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 rounded-lg" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredRFQs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-sm text-gray-600">
                            No RFQs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRFQs.map((data: any, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                          >
                            <TableCell
                              className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {data?.rfqId || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {data?.quotationNo || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium cursor-pointer"
                              onClick={() => router.push(`/rfqs/${data._id}`)}
                            >
                              {data?.client?.client_name?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800">
                              {data?.project_type || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800 max-w-[150px] truncate">
                              {data?.scope_of_work?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800">
                              {data?.quotation_amount || "-"}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-800">
                              {data?.createdAt ? formatDate(data.createdAt) : "-"}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className={`h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                                  data.projectId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                                onClick={() => {
                                  if (data?.projectId) {
                                    router.push(`/projects/${data.projectId}`);
                                  } else {
                                    setSelectedRFQ(data);
                                    setIsCreateLPODialogOpen(true);
                                  }
                                }}
                              >
                                {data?.projectId ? (
                                  <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                  <PlusCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    className="bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-lg"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-lg shadow-lg">
                                  <DropdownMenuLabel className="text-sm text-gray-800">Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setItemToDelete(data);
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="p-4 flex justify-center">
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                    page={data?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={itemToDelete?.rfqId || "this RFQ"}
        />
        <CreateDialog
          setIsDialogOpen={setIsCreateRFQDialogOpen}
          isDialogOpen={isCreateRFQDialogOpen}
          handleSubmit={handleSubmit}
        />
        <CreateProject
          setIsDialogOpen={setIsCreateLPODialogOpen}
          isDialogOpen={isCreateLPODialogOpen}
          data={selectedRFQ}
        />
      </div>
    </div>
  );
}

export default RFQs;