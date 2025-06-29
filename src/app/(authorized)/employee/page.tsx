"use client";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Router,
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
import { Input } from "@/components/ui/input";

function Employee() {
  const router = useRouter();
  const [employee, setEmployee] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [employeeApi, { data, isSuccess, error, isError }] =
    useEmployeeMutation();

  const [deleteEmployeeApi] = useDeleteEmployeeMutation();

  const getEmployes = async () => {
    const res = await employeeApi({});
    // console.log(res, "response");
  };

  useEffect(() => {
    getEmployes();
  }, []);
  useEffect(() => {
    getEmployes();
  }, [page]);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setEmployee(data.data);
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
    getEmployes();
    setItemToDelete(null);
  };


    
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    let res;
    if (query === "") {
      // If the search query is empty, reset to all RFQs
      res = await employeeApi({ search: query, page });
    } else {
      res = await employeeApi({ search: query, page });

    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by client name , contact person , etc "
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Link href="/employee/create-employee">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Employee
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Employee</CardTitle>
                  <CardDescription>
                    Manage your employee and view their performance.
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
                        <TableHead>Salary</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Total Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
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
                            user: { name: string };
                            createdAt: string;
                            _id: string;
                            salary: string;
                            status: boolean;
                          },
                          index
                        ) => {
                          return (
                            <TableRow
                              key={index}
                              onClick={() =>
                                router.push(`/employee/${data?._id}`)
                              }
                              className="cursor-pointer"
                            >
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Employee Image"
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={`https://ui-avatars.com/api/?name=${data?.user?.name}&&color=fff&&background=3A72EC&&rounded=true&&font-size=0.44`}
                                  width="64"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.user?.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {data.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{data?.salary}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                0
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(data?.createdAt)}
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
                                        router.push(`/employee/${data?._id}`)
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
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                    page={data?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  {`Are you sure you want to delete ${itemToDelete?.name}? This action
                  cannot be undone.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteEmployee(itemToDelete?.url)}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
}

export default Employee;
