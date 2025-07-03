"use client";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Router,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
} from "@/redux/query/employee";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dateFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { PaginationComponent } from "@/components/PaginationComponent";
import { useSubcontractorsMutation } from "@/redux/query/subcontractor";
import CreateSubcontractor from "@/components/dialogs/CreateSubcontractor";

function Employee() {
  const router = useRouter();
  const [employee, setSubcontractor] = useState([]);
  const [page, setPage] = useState(1);
  const [subcontractorApi, { data, isSuccess, error, isError }] =
    useSubcontractorsMutation();

  const [deleteEmployeeApi] = useDeleteEmployeeMutation();

  const getSubcontractor = async () => {
    const res = await subcontractorApi({});
    // console.log(res, "response");
  };

  useEffect(() => {
    getSubcontractor();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setSubcontractor(data.results);
      }
    }
  }, [isSuccess]);

  // const deleteEmployee = async (emp: string) => {
  //   // console.log(emp.split("/")[6]);
  //   // const res = await deleteEmployeeApi({ id: emp.split("/")[6] });
  //   // console.log(res, ">>>>");
  //   // getEmployes();
  // };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const deleteEmployee = async (url: string) => {
    // Add your deletion logic here
    console.log(`Deleting employee at ${url}`);
    console.log(url.split("/")[6]);
    const res = await deleteEmployeeApi({ id: url.split("/")[6] });
    console.log(res, ">>>>");
    getSubcontractor();
    setItemToDelete(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <DropdownMenu>
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
                </DropdownMenu> */}
                {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}

                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Subcontractor
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Subcontractor</CardTitle>
                  <CardDescription>
                    Manage your subcontractor and view their performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Contact
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Company Name
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee?.map(
                        (
                          data: {
                            name: string;
                            created_at: string;
                            url: string;
                            email: string;
                            contact: string;
                            company_name: string;
                            status: boolean;
                          },
                          index
                        ) => {
                          return (
                            <TableRow
                              key={index}
                              onClick={() =>
                                router.push(
                                  `/employee/${data?.url?.split("/")[6]}`
                                )
                              }
                              className="cursor-pointer"
                            >
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Employee Image"
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={`https://ui-avatars.com/api/?name=${data?.name}&&color=fff&&background=3A72EC&&rounded=true&&font-size=0.44`}
                                  width="64"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {data.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{data?.email}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data?.contact}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data?.company_name}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(data?.created_at)}
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
                                      onClick={() =>
                                        router.push(
                                          `/employee/${
                                            data?.url?.split("/")[6]
                                          }`
                                        )
                                      }
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setIsDialogOpen(true);
                                        setItemToDelete(data);
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
                  {/* <PaginationComponent
                    setPage={setPage}
                    numberOfPages={data?.count}
                    page={page}
                  /> */}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <CreateSubcontractor
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            
          />
        </main>
      </div>
    </div>
  );
}

export default Employee;
