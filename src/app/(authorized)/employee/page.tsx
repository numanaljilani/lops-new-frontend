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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
} from "@/redux/query/employee";
import { useEffect, useState, useCallback } from "react";
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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash.debounce";

function Employees() {
  const router = useRouter();
  const [employee, setEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [employeeApi, { data, isSuccess, error, isError, isLoading: isEmployeeApiLoading }] = useEmployeeMutation();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();

  const getEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await employeeApi({ page }).unwrap();
      console.log("Default Employees API Response:", JSON.stringify(res, null, 2));
      setEmployee(res?.data || []);
    } catch (err: any) {
      console.error("Default Employees Fetch Error:", JSON.stringify(err, null, 2));
      setEmployee([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setIsLoading(true);
      try {
        const res = await employeeApi({ search: query, page }).unwrap();
        console.log("Search Employees API Response:", JSON.stringify(res, null, 2));
        setEmployee(res?.data || []);
        if (res?.data?.length === 0) {
          console.log("Search Results: No employees found");
        } else {
          console.log("Search Results:", res.data);
        }
      } catch (err: any) {
        console.error("Search Employees Fetch Error:", JSON.stringify(err, null, 2));
        setEmployee([]);
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [employeeApi, page]
  );

  const deleteEmployee = async () => {
    try {
      const res = await deleteEmployeeApi({ id: itemToDelete?._id }).unwrap();
      console.log("Delete Employee Response:", JSON.stringify(res, null, 2));
      setIsDialogOpen(false);
      setItemToDelete(null);
      getEmployees();
    } catch (err: any) {
      console.error("Delete Employee Error:", JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    getEmployees();
  }, [page]);

  useEffect(() => {
    if (!isDialogOpen) {
      getEmployees();
    }
  }, [isDialogOpen, page]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Response from server:", JSON.stringify(data, null, 2));
      setEmployee(data?.data || []);
      setIsLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <TabsList className="hidden sm:flex bg-gray-100 rounded-lg">
                <TabsTrigger value="all" className="text-sm text-gray-800">All</TabsTrigger>
                <TabsTrigger value="Sales" className="text-sm text-gray-800">Sales</TabsTrigger>
                <TabsTrigger value="Team Leads" className="text-sm text-gray-800">Team Leads</TabsTrigger>
                <TabsTrigger value="Team Members" className="text-sm text-gray-800">Team Members</TabsTrigger>
                <TabsTrigger value="Sub-Contractors" className="text-sm text-gray-800">Sub-Contractors</TabsTrigger>
                <TabsTrigger value="Accounts" className="text-sm text-gray-800">Accounts</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-3 py-1 text-sm">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by employee name, etc."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Link href="/employee/create-employee">
                  <Button size="sm" className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Employee
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Employees
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your employees and view their performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[80px]">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Name</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Status</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Salary</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Total Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Created at
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-16 w-16 rounded-md" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : employee?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-sm text-gray-600">No employees found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        employee?.map(
                          (
                            data: {
                              user: { name: string };
                              createdAt: string;
                              _id: string;
                              salary: string;
                              status: boolean;
                            },
                            index: number
                          ) => (
                            <TableRow
                              key={index}
                              onClick={() => router.push(`/employee/${data?._id}`)}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Employee Image"
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={`https://ui-avatars.com/api/?name=${data?.user?.name}&color=fff&background=3A72EC&rounded=true&font-size=0.44`}
                                  width="64"
                                />
                              </TableCell>
                              <TableCell className="text-sm text-gray-800 font-medium max-w-[150px] truncate">
                                {data?.user?.name?.slice(0, 50) || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-sm">
                                  {data?.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-800">
                                {data?.salary || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                0
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {formatDate(data?.createdAt) || "-"}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                      className="bg-gray-100 hover:bg-gray-200 h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="text-sm text-gray-800">
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/employee/${data?._id}`)}
                                      className="text-sm text-gray-800"
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setIsDialogOpen(true);
                                        setItemToDelete(data);
                                      }}
                                      className="text-sm text-gray-800"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        )
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
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent className="bg-white rounded-xl shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-semibold text-gray-800">
                  Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600">
                  Are you sure you want to delete {itemToDelete?.user?.name || "this employee"}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 text-sm">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm"
                  onClick={deleteEmployee}
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

export default Employees;