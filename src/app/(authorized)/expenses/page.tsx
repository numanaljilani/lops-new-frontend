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
import CreateExpense from "@/components/dialogs/CreateExpenses";
import { useExpensesMutation } from "@/redux/query/expensesApi";

function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateExpensesDialogOpen, setIsCreateExpensesDialogOpen] =
    useState(false);
  const [expenseApi, { data, isSuccess, error, isError }] =
    useExpensesMutation();

  const [deleteEmployeeApi] = useDeleteEmployeeMutation();

  const getExpenses = async () => {
    const res = await expenseApi({});
    console.log(res, "expense res");
    // console.log(res, "response");
  };

  useEffect(() => {
    if (!isCreateExpensesDialogOpen) {
      getExpenses();
    }
  }, [isCreateExpensesDialogOpen]);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "expenses response from server");
      if (data) {
        setExpenses(data.results);
      }
    }
  }, [isSuccess]);

  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const deleteEmployee = async (url: string) => {
    // Add your deletion logic here
    console.log(`Deleting employee at ${url}`);
    console.log(url.split("/")[6]);
    const res = await deleteEmployeeApi({ id: url.split("/")[6] });
    console.log(res, ">>>>");
    getExpenses();
    setItemToDelete(null);
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              {/* <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Sales">Sales</TabsTrigger>
            <TabsTrigger value="Team Leads">Team Leads</TabsTrigger>
            <TabsTrigger value="Team Members">Team Members</TabsTrigger>
            <TabsTrigger value="Sub-Contractors">Sub-Contractors</TabsTrigger>
            <TabsTrigger value="Accounts">Accounts</TabsTrigger>
          </TabsList> */}
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
                {/* <Link href="/employee/create-employee"> */}
                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => setIsCreateExpensesDialogOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add expense
                  </span>
                </Button>
                {/* </Link> */}
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>
                    Manage expenses and reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expense Id</TableHead>
                        <TableHead>Project Id</TableHead>
                        <TableHead> Category</TableHead>
                        <TableHead>Expenses Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date
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
                      {expenses?.map(
                        (
                          data: {
                            expense_id: string;
                            job_card: string;

                            category_name: string;

                            expense_type: string;
                            created_at: string;
                            url: string;
                            amount: string;
                            date: string;
                            status: boolean;
                          },
                          index
                        ) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {data?.expense_id}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.job_card}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.category_name}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.expense_type}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.amount}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(data?.date)}
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
                                    {/* <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/employee/${
                                            data?.url?.split("/")[6]
                                          }`
                                        )
                                      }
                                    >
                                      Edit
                                    </DropdownMenuItem> */}
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
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
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

        {
          <CreateExpense
            setIsDialogOpen={setIsCreateExpensesDialogOpen}
            isDialogOpen={isCreateExpensesDialogOpen}
            data={{}}
          />
        }
      </div>
    </div>
  );
}

export default Expenses;
