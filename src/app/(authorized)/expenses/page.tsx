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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import CreateExpenseFromPage from "@/components/dialogs/CreateExpensesFromPage";
import { useExpensesMutation } from "@/redux/query/expensesApi";
import { useJobsMutation } from "@/redux/query/jobApi";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

function Expenses() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [alljobs, setAllJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateExpensesDialogOpen, setIsCreateExpensesDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseApi, { data, isSuccess, error, isError, isLoading: isExpenseApiLoading }] = useExpensesMutation();
  const [jobApi, { data: jobs, isSuccess: jobsIsSuccess }] = useJobsMutation();
const itemsPerPage = 5;
  const getJobs = async () => {
    try {
      const res = await jobApi({}).unwrap();
      console.log("Default Jobs API Response:", JSON.stringify(res, null, 2));
      setAllJobs(res?.data || []);
    } catch (err: any) {
      console.error("Default Jobs Fetch Error:", JSON.stringify(err, null, 2));
      setAllJobs([]);
    }
  };

  const getExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await expenseApi({ page }).unwrap();
      console.log("Default Expenses API Response:", JSON.stringify(res, null, 2));
      setExpenses(res?.data || []);
    } catch (err: any) {
      console.error("Default Expenses Fetch Error:", JSON.stringify(err, null, 2));
      setExpenses([]);
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
        const res = await expenseApi({ search: query, page }).unwrap();
        console.log("Search Expenses API Response:", JSON.stringify(res, null, 2));
        setExpenses(res?.data || []);
        if (res?.data?.length === 0) {
          console.log("Search Results: No expenses found");
        } else {
          console.log("Search Results:", res.data);
        }
      } catch (err: any) {
        console.error("Search Expenses Fetch Error:", JSON.stringify(err, null, 2));
        setExpenses([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [expenseApi, page]
  );

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (jobsIsSuccess) {
      setAllJobs(jobs?.data || []);
    }
  }, [jobsIsSuccess, jobs]);

  useEffect(() => {
    if (!isCreateExpensesDialogOpen) {
      getExpenses();
    }
  }, [isCreateExpensesDialogOpen, page]);

  useEffect(() => {
    if (isSuccess) {
      setExpenses(data?.data || []);
    }
  }, [isSuccess, data]);

  const [itemToDelete, setItemToDelete] = useState<any>(null);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <TabsList className="hidden sm:flex bg-gray-100 rounded-lg">
                <TabsTrigger value="all" className="text-sm text-gray-800">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-sm text-gray-800">Pending</TabsTrigger>
                <TabsTrigger value="completed" className="text-sm text-gray-800">Completed</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
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
                    placeholder="Search by Job No, Job ID, or Exp ID..."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
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
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Expenses
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage expenses and reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {isLoading ? (
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
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
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
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
                      ) : expenses?.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-gray-600">No expenses found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-sm font-medium text-gray-700">Expense ID</TableHead>
                            <TableHead className="text-sm font-medium text-gray-700">Project ID</TableHead>
                            <TableHead className="text-sm font-medium text-gray-700">Category</TableHead>
                            <TableHead className="text-sm font-medium text-gray-700">Amount</TableHead>
                            <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                              Created at
                            </TableHead>
                            <TableHead className="text-sm font-medium text-gray-700">
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses?.map((data: any, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell
                                className="text-sm text-gray-800 font-medium cursor-pointer"
                                onClick={() => router.push(`/expenses/${data._id}`)}
                              >
                                {data?.expenseId || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800 cursor-pointer"
                                onClick={() => router.push(`/expenses/${data._id}`)}
                              >
                                {data?.project?.projectId || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800 max-w-[150px] truncate cursor-pointer"
                                onClick={() => router.push(`/expenses/${data._id}`)}
                              >
                                {data?.category_display?.slice(0, 50) || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800 cursor-pointer"
                                onClick={() => router.push(`/expenses/${data._id}`)}
                              >
                                {data?.amount || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {formatDate(data?.created_at) || "-"}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 flex justify-center">
                  <div className="text-xs text-gray-600">
                    Showing <strong>1-{expenses.length}</strong> of{" "}
                    <strong>{data?.count}</strong> expenses
                  </div>
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={data?.totalPages || 1}
                    page={page}
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
                  Are you sure you want to delete this expense? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 text-sm">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
        <CreateExpenseFromPage
          setIsDialogOpen={setIsCreateExpensesDialogOpen}
          isDialogOpen={isCreateExpensesDialogOpen}
          data={alljobs}
        />
      </div>
    </div>
  );
}

export default Expenses;