"use client";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
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
} from "@/redux/query/rfqsApi";
import CreateDialog from "@/components/dialogs/CreateDialog";
import {
  useDeleteJobCardMutation,
  useJobsMutation,
} from "@/redux/query/jobApi";
import CreateTask from "@/components/dialogs/CreateTask";
import CreateExpense from "@/components/dialogs/CreateExpenses";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Import Pagination components

function Projects() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [projectDetails, setProjectDetails] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rfq , setRfq] = useState<any>()
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Number of items per page

  const [jobApi, { data, isSuccess, error, isError }] = useJobsMutation();
  const [deleteJobCardApi] = useDeleteJobCardMutation();
  const [createRFQApi] = useCreateRFQMutation();

  const handleSubmit = async () => {
    setIsCreateRFQDialogOpen(false);
    const res = await createRFQApi({ data: { ...rfq, client: 1 }, token: "" });
    console.log(res, "response");
    getJobs();
  };

  const getJobs = async () => {
    setLoading(true); // Set loading to true before fetching data
    const res = await jobApi({});
    console.log(res, "response");
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      getJobs();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setJobs(data.results);
        setLoading(false); // Set loading to false after data is fetched
      }
    }
  }, [isSuccess]);

  const deleteJobCard = async () => {
    const res = await deleteJobCardApi({
      id: itemToDelete.job_id,
      token: "",
    });
    console.log(res, ">>>>");
    getJobs();
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by RFQ ID..."
                    className="w-full rounded-lg bg-background pl-8"
                    // value={searchQuery}
                    // onChange={(e) => handleSearch(e.target.value)}
                  />
                </div> */}

                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => router.push("/rfqs")}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create Project
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Manage your projects and view their Status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          Job No
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Brief of scope</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Deadline at
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        // Skeleton loading UI
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : currentItems.length === 0 ? (
                        // No data message
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <p className="text-muted-foreground">No data available.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Display data
                        currentItems.map((data: any, index: number) => (
                          <TableRow key={index} className="cursor-pointer">
                            <TableCell
                              className="hidden sm:table-cell"
                              onClick={() =>
                                router.push(`/projects/${data.job_id}`)
                              }
                            >
                              {data?.job_number}
                            </TableCell>
                            <TableCell
                              className="font-medium"
                              onClick={() =>
                                router.push(`/projects/${data.job_id}`)
                              }
                            >
                              {data?.client_name || "-"}
                            </TableCell>
                            <TableCell
                              className="font-medium"
                              onClick={() =>
                                router.push(`/projects/${data.job_id}`)
                              }
                            >
                              {data?.scope_of_work}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                router.push(`/projects/${data.job_id}`)
                              }
                            >
                              <Badge variant="outline">
                                {data?.completion_percentage}%
                              </Badge>
                            </TableCell>
                            <TableCell
                              className="hidden md:table-cell"
                              onClick={() =>
                                router.push(`/projects/${data.job_id}`)
                              }
                            >
                              {data?.profit}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(data?.delivery_timelines)}
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
                                      setIsTaskDialogOpen(true);
                                      setProjectDetails(data);
                                    }}
                                  >
                                    Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/projects/${data.job_id}`)
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                {/* Pagination */}
                <CardFooter className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => paginate(currentPage - 1)}
                          // disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => paginate(currentPage + 1)}
                          // disabled={indexOfLastItem >= jobs.length}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteJobCard}
          name={itemToDelete?.client_name}
        />
        {
          <CreateDialog
            setIsDialogOpen={setIsCreateRFQDialogOpen}
            isDialogOpen={isCreateRFQDialogOpen}
            rfq={rfq}
            setRfq={setRfq}
            handleSubmit={handleSubmit}
          />
        }
      </div>
    </div>
  );
}

export default Projects;