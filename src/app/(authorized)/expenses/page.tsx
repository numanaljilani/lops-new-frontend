"use client";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import CreateExpenseFromPage from "@/components/dialogs/CreateExpensesFromPage";
import { useExpensesMutation } from "@/redux/query/expensesApi";
import { useJobsMutation } from "@/redux/query/jobApi";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Input } from "@/components/ui/input";

function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [alljobs, setAllJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
  const [isCreateExpensesDialogOpen, setIsCreateExpensesDialogOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseApi, { data, isSuccess, error, isError }] =
    useExpensesMutation();
  const [jobApi, { data: jobs, isSuccess: jobsIsSuccess }] = useJobsMutation();

  const getJobs = async () => {
    const res = await jobApi({});
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (jobsIsSuccess) {
      setAllJobs(jobs.data);
    }
  }, [jobsIsSuccess]);

  const getExpenses = async () => {
    setIsLoading(true);
    const res = await expenseApi({ page });
    console.log(res, "Expenses RESPONSE");

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isCreateExpensesDialogOpen) {
      getExpenses();
    }
  }, [isCreateExpensesDialogOpen, page]);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        setExpenses(data?.data);
      }
    }
  }, [isSuccess]);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
    const handleSearch = async (query: string) => {
    setSearchQuery(query);
    let res;
    if (query === "") {
      // If the search query is empty, reset to all RFQs
      res = await expenseApi({ search: query, page });
    } else {
      res = await expenseApi({ search: query, page });
      // Hide loading state after fetching
    }
    console.log(res )

  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between">
              {/* <TabsList className="hidden sm:flex">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList> */}
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
                    placeholder="Search by job No. job Id or exp id..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
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
              </div>
            </div>
            <TabsContent value="all">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>
                    Manage expenses and reports.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : expenses?.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground">
                        No expenses found.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Expense Id</TableHead>
                            <TableHead>Project Id</TableHead>
                            <TableHead>Category</TableHead>
                            {/* <TableHead>Expenses Type</TableHead> */}
                            <TableHead>Amount</TableHead>
                            {/* <TableHead className="hidden md:table-cell">
                              Date
                            </TableHead> */}
                            <TableHead className="hidden md:table-cell">
                              Created at
                            </TableHead>
                            <TableHead>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses?.map((data: any, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-muted/50 transition-colors"
                            >
                              <TableCell
                                className="font-medium cursor-pointer"
                                onClick={() =>
                                  router.push(`/expenses/${data._id}`)
                                }
                              >
                                {data?.expenseId}
                              </TableCell>
                              <TableCell
                                className=" cursor-pointer"
                                onClick={() =>
                                  router.push(`/expenses/${data._id}`)
                                }
                              >
                                {data?.project?.projectId || "-"}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  router.push(`/expenses/${data._id}`)
                                }
                                className=" cursor-pointer"
                              >
                                {data?.category_display}
                              </TableCell>
                              {/* <TableCell
                                onClick={() =>
                                  router.push(`/expenses/${data._id}`)
                                }
                                className=" cursor-pointer"
                              >
                                {data?.expense_type}
                              </TableCell> */}
                              <TableCell
                                onClick={() =>
                                  router.push(`/expenses/${data._id}`)
                                }
                                className=" cursor-pointer"
                              >
                                {data?.amount}
                              </TableCell>
                              {/* <TableCell className="hidden md:table-cell">
                                {formatDate(data?.date)}
                              </TableCell> */}
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
                                      className="hover:bg-muted"
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-row">
                  {/* <div className="text-xs text-muted-foreground">
                    Showing <strong>1-{expenses.length}</strong> of{" "}
                    <strong>{data?.count}</strong> expenses
                  </div> */}
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages}
                    page={page}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  {`Are you sure you want to delete this expense? This action cannot be undone.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                // onClick={() => deleteEmployee(itemToDelete?.url)}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>

        {
          <CreateExpenseFromPage
            setIsDialogOpen={setIsCreateExpensesDialogOpen}
            isDialogOpen={isCreateExpensesDialogOpen}
            data={alljobs}
          />
        }
      </div>
    </div>
  );
}

export default Expenses;
