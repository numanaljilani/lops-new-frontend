"use client";
import { useEffect, useState } from "react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const [rfqsApi, { data, isSuccess, error, isError, isLoading: isRFQsLoading }] = useAllRFQsMutation();
  const [createRFQApi] = useCreateRFQMutation();
  const [deleteRFQApi] = useDeleteRfqMutation();

  const getRFQs = async () => {
    try {
      setLoading(true);
      const res = await rfqsApi({ page }).unwrap();
      console.log("RFQs API Response:", JSON.stringify(res, null, 2));
      if (res?.data) {
        setRFQs(res.data);
        setFilteredRFQs(res.data);
      } else {
        toast.warning("No RFQs found.");
        setRFQs([]);
        setFilteredRFQs([]);
      }
    } catch (err: any) {
      console.error("RFQs Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch RFQs: " + (err?.data?.message || err.message || "Unknown error"));
      setRFQs([]);
      setFilteredRFQs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!isCreateRFQDialogOpen){

      getRFQs();
    }
  }, [page,isCreateRFQDialogOpen]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    try {
      setLoading(true);
      if (query === "") {
        await getRFQs();
      } else {
        const res = await rfqsApi({ search: query, page }).unwrap();
        console.log("Search RFQs API Response:", JSON.stringify(res, null, 2));
        if (res?.data) {
          setFilteredRFQs(res.data);
        } else {
          toast.warning("No RFQs found for the search query.");
          setFilteredRFQs([]);
        }
      }
    } catch (err: any) {
      console.error("Search RFQs Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to search RFQs: " + (err?.data?.message || err.message || "Unknown error"));
      setFilteredRFQs(rfqs);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      console.log("Create RFQ Data:", data);
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
      console.log("Deleting RFQ:", itemToDelete._id);
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
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-6">
        <main className="grid flex-1 items-start gap-4 mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">RFQs</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 transition-all duration-200"
              onClick={() => setIsCreateRFQDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate RFQ
            </Button>
          </div>

          <Card className="shadow-lg border-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-blue-50 border-b border-gray-200">
              {/* <CardTitle className="text-2xl font-semibold text-gray-800">RFQ List</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your RFQs and view their status.
              </CardDescription> */}
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by RFQ ID..."
                    className="pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-gray-700 font-semibold">RFQ ID</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Quotation No.</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Client</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Project</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Scope of Work</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Quotation</TableHead>
                    <TableHead className="text-gray-700 font-semibold hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Job</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <TableRow key={index} className="border-b border-gray-100">
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredRFQs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                        No RFQs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRFQs.map((data: any, index: number) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <TableCell
                          className="font-medium text-blue-600 hover:underline cursor-pointer"
                          onClick={() => router.push(`/rfqs/${data._id}`)}
                        >
                          {data?.rfqId || "N/A"}
                        </TableCell>
                        <TableCell
                          className="font-medium text-gray-900"
                          onClick={() => router.push(`/rfqs/${data._id}`)}
                        >
                          {data?.quotationNo || "N/A"}
                        </TableCell>
                        <TableCell
                          className="font-medium text-gray-900 cursor-pointer"
                          onClick={() => router.push(`/rfqs/${data._id}`)}
                        >
                          {data?.client?.client_name || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-900">{data?.project_type || "N/A"}</TableCell>
                        <TableCell className="text-gray-900">{data?.scope_of_work || "N/A"}</TableCell>
                        <TableCell className="text-gray-900">{data?.quotation_amount || "N/A"}</TableCell>
                        <TableCell className="hidden md:table-cell text-gray-900">
                          {data?.createdAt ? formatDate(data.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className={`h-8 rounded-lg font-semibold transition-all duration-200 ${
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
                                className="rounded-full hover:bg-gray-200"
                              >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-lg shadow-lg">
                              <DropdownMenuLabel className="text-gray-700">Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-red-50"
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
            <CardFooter className="flex justify-center py-4">
              <PaginationComponent
                setPage={setPage}
                totalPages={data?.data?.totalPages || 1}
                page={data?.data?.page || 1}
              />
            </CardFooter>
          </Card>
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