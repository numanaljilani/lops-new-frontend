"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
import { useDeleteJobCardMutation, useJobsMutation } from "@/redux/query/jobApi";
import CreateTask from "@/components/dialogs/CreateTask";
import CreateExpense from "@/components/dialogs/CreateExpenses";

function Projects() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [projectDetails, setProjectDetails] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
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

  const [jobApi, { data, isSuccess, error, isError }] = useJobsMutation(); 
  const [deleteJobCardApi ] = useDeleteJobCardMutation()
 
  const [createRFQApi] = useCreateRFQMutation();

  const handleSubmit = async () => {
    setIsCreateRFQDialogOpen(false);
    const res = await createRFQApi({ data: { ...rfq, client: 1 }, token: "" });
    console.log(res, "response");
    getJobs();
  };

  const getJobs = async () => {
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

  const update = async (url: string) => {
    // router.push(`/clients/${url}`);
  };


// LETS-JN-YYMM1001

// {
//   error : {
//     status : 400 ,
//     message : "sdfsd afdf"
//   }
// }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Sales Member
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Team Leads
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Team Members
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Sub-Contractors
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Accounts Members
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>

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
                        {/* <TableHead>Qoutation Amount</TableHead> */}

                        <TableHead className="hidden md:table-cell">
                          Deadline at
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs?.map(
                        (
                          data: {
                            job_id: string;
                            job_number: string;
                            status: string;
                            quotation_amount: string;
                            client_name: string;
                            scope_of_work: string;
                            active: boolean;
                            delivery_timelines: string;
                            completion_percentage: string;
                            profit: string;
                          },
                          index: number
                        ) => {
                          return (
                            <TableRow key={index} className="cursor-pointer"   >
                              <TableCell className="hidden sm:table-cell"  onClick={() =>
                              router.push(`/projects/${data.job_id}`)
                            }>
                                {data?.job_number}
                              </TableCell>
                              <TableCell className="font-medium"  onClick={() =>
                              router.push(`/projects/${data.job_id}`)
                            }>
                                {data?.client_name || "-"}
                              </TableCell>
                              <TableCell className="font-medium"  onClick={() =>
                              router.push(`/projects/${data.job_id}`)
                            }>
                                {data?.scope_of_work}
                              </TableCell>
                              <TableCell  onClick={() =>
                              router.push(`/projects/${data.job_id}`)
                            }>
                                <Badge variant="outline">{data?.completion_percentage}%</Badge>
                              </TableCell>
                              {/* <TableCell>{data?.company_name}</TableCell> */}
                              <TableCell className="hidden md:table-cell"  onClick={() =>
                              router.push(`/projects/${data.job_id}`)
                            }>
                                {data?.profit}
                              </TableCell>
                              {/* <TableCell className="hidden md:table-cell">
                                {data?.quotation_amount}
                              </TableCell> */}
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
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
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
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        {/* <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={itemToDelete}
          deleteCompany={true}
        /> */}
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
            // client={path.split("/").reverse()[0]}
          />
        }
        {/* {
          <CreateTask
            isDialogOpen={isTaskDialogOpen}
            setIsDialogOpen={setIsTaskDialogOpen}
            details={projectDetails}
          />
        } */}

      
      </div>
    </div>
  );
}

export default Projects;
