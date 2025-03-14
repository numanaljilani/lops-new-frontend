"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  useComponiesMutation,
  useDeleteCompanyMutation,
} from "@/redux/query/componiesApi";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import { useDeleteClientMutation } from "../../../redux/query/clientsApi";
import Alert from "@/components/dialogs/Alert";
import {
  useAllRFQsMutation,
  useCreateRFQMutation,
  useDeleteRfqMutation,
} from "@/redux/query/rfqsApi";
import CreateDialog from "@/components/dialogs/CreateDialog";
import CreateLPO from "@/components/dialogs/CreateLPO";
import { Input } from "@/components/ui/input"; // Import Input component for the search bar

function RFQs() {
  const router = useRouter();
  const [rfqs, setRFQs] = useState([]);
  const [filteredRFQs, setFilteredRFQs] = useState([]); // State for filtered RFQs
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isCreateLPODialogOpen, setIsCreateLPODialogOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>({});
  const [rfq, setRfq] = useState<{
    project_type: string;
    scope_of_work: string;
    quotation_number: string;
    quotation_amount: string;
    status: string;
    remarks: string;
    client: string;
  }>({
    project_type: "",
    scope_of_work: "",
    quotation_number: "",
    quotation_amount: "",
    status: "",
    remarks: "",
    client: "",
  });

  const [rfqsApi, { data, isSuccess, error, isError }] = useAllRFQsMutation();
  const [createRFQApi] = useCreateRFQMutation();
  const [deleteRFQApi] = useDeleteRfqMutation();

  // Fetch RFQs
  const getRFQs = async () => {
    const res = await rfqsApi({});
  };

  useEffect(() => {
    getRFQs();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setRFQs(data.results);
      setFilteredRFQs(data.results); // Initialize filtered RFQs with all RFQs
    }
  }, [isSuccess, data]);

  // Dummy search function
  const handleSearch = (query: string) => {
    // setSearchQuery(query);
    // if (query === "") {
    //   setFilteredRFQs(rfqs); // Reset to all RFQs if search query is empty
    // } else {
    //   const filtered = rfqs.filter((rfq: any) =>
    //     rfq.rfq_id.toLowerCase().includes(query.toLowerCase())
    //   );
    //   setFilteredRFQs(filtered);
    // }
  };

  const handleSubmit = async () => {
    setIsCreateRFQDialogOpen(false);
    console.log(rfq, "RFQ .....");
    // const res = await createRFQApi({ data: { ...rfq }, token: "" });
    // console.log(res, "response");
    getRFQs();
  };

  const deleteRFQ = async () => {
    console.log(itemToDelete);
    const res = await deleteRFQApi({
      id: itemToDelete.rfq_id,
      token: "",
    });
    console.log(res, ">>>>");
    getRFQs();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center gap-10">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by RFQ ID..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
            

                <Button
                  size="sm"
                  className="h-7 gap-1"
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
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>RFQ's</CardTitle>
                  <CardDescription>
                    Manage your RFQ's and view their Status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          RFQ Id
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Brif of scope</TableHead>
                        <TableHead>Quotation</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created
                        </TableHead>
                        <TableHead>Create Job</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRFQs?.map((data: any, index: number) => (
                        <TableRow className="cursor-pointer" key={index}>
                          <TableCell
                            className="font-medium"
                            onClick={() => router.push(`/rfqs/${data.rfq_id}`)}
                          >
                            {data?.rfq_id}
                          </TableCell>
                          <TableCell
                            className="font-medium"
                            onClick={() => router.push(`/rfqs/${data.rfq_id}`)}
                          >
                            {data?.client_name}
                          </TableCell>
                          <TableCell
                            className="hidden md:table-cell"
                            onClick={() => router.push(`/rfqs/${data.rfq_id}`)}
                          >
                            {data?.project_type}
                          </TableCell>
                          <TableCell
                            className="hidden md:table-cell"
                            onClick={() => router.push(`/rfqs/${data.rfq_id}`)}
                          >
                            {data?.scope_of_work}
                          </TableCell>
                          <TableCell
                            className="hidden md:table-cell"
                            onClick={() => router.push(`/rfqs/${data.rfq_id}`)}
                          >
                            {data?.quotation_amount}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(data?.rfq_date)}
                          </TableCell>
                          <TableCell className="md:table-cell">
                            <Button
                              size="sm"
                              className="h-7 gap-1"
                              onClick={() => {
                                setSelectedRFQ(data);
                                setIsCreateLPODialogOpen(true);
                              }}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
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
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>{filteredRFQs.length}</strong>{" "}
                    RFQs
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={itemToDelete?.id}
        />
        <CreateDialog
          setIsDialogOpen={setIsCreateRFQDialogOpen}
          isDialogOpen={isCreateRFQDialogOpen}
          rfq={rfq}
          setRfq={setRfq}
          handleSubmit={handleSubmit}
        />
        <CreateLPO
          setIsDialogOpen={setIsCreateLPODialogOpen}
          isDialogOpen={isCreateLPODialogOpen}
          data={selectedRFQ}
        />
      </div>
    </div>
  );
}

export default RFQs;