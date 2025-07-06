"use client";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardMutation } from "@/redux/query/dashboardsApi";
import { useTransactionsMutation } from "@/redux/query/transactionApi";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useTimesheetMutation } from "@/redux/query/timesheet";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { PaginationComponent } from "../PaginationComponent";
import { date, timeFormat } from "@/lib/dateFormat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { toast, Toaster } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

function Dashboard() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [timesheet, setTimeSheet] = useState([]);
  const selectedCompany = useSelector((state: any) => state?.user?.selectedCompany || null);
  const [dasboardApi, { data: dasboardData, isLoading: isDashboardLoading, error: dashboardError, isError: isDashboardError }] =
    useAdminDashboardMutation();
  const [
    jobApi,
    { data: jobData, isSuccess: jobSuccess, error: jobError, isError: jobIsError, isLoading: isJobsLoading },
  ] = useJobsMutation();
  const [
    timeSheetApi,
    { data: timeSheetData, isSuccess: timeSheetSuccess, error: timeSheetError, isError: timesheetIsError, isLoading: isTimesheetLoading },
  ] = useTimesheetMutation();
  const [
    transactionApi,
    { data, isSuccess, error, isError, isLoading: isTransactionsLoading },
  ] = useTransactionsMutation();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getDasboardData = async () => {
    if (!selectedCompany?._id) {
      toast.error("No company selected", {
        description: "Please select a company to view dashboard data.",
        style: { backgroundColor: "#fcebbb" },
      });
      return;
    }
    try {
      const res = await dasboardApi({ companyId: selectedCompany._id }).unwrap();
      console.log("Dashboard API Response:", JSON.stringify(res, null, 2));
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch dashboard data", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  const getTimeSheetData = async () => {
    try {
      const res = await timeSheetApi({ page, admin: true }).unwrap();
      console.log("Timesheet API Response:", JSON.stringify(res, null, 2));
      if (timeSheetSuccess && timeSheetData) {
        setTimeSheet(timeSheetData.data || []);
      }
    } catch (err: any) {
      console.error("Timesheet Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch timesheet data", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  const getJobs = async () => {
    try {
      const res = await jobApi({}).unwrap();
      console.log("Jobs API Response:", JSON.stringify(res, null, 2));
    } catch (err: any) {
      console.error("Jobs Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch jobs data", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  const transactions = async () => {
    try {
      const res = await transactionApi({}).unwrap();
      console.log("Transactions API Response:", JSON.stringify(res, null, 2));
    } catch (err: any) {
      console.error("Transactions Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch transactions data", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  useEffect(() => {
    getDasboardData();
    transactions();
    getJobs();
  }, [selectedCompany]);

  useEffect(() => {
    getTimeSheetData();
  }, [page]);

  useEffect(() => {
    if (timeSheetSuccess && timeSheetData) {
      setTimeSheet(timeSheetData.data || []);
    }
  }, [timeSheetSuccess, timeSheetData]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          setTimeout(() => {
            console.log("Fetching more cards...");
            setIsFetchingMore(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Toaster richColors position="top-right" />
      <main className="flex flex-1 flex-col gap-3 p-3 sm:p-4 md:gap-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {isDashboardLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-white shadow-lg rounded-xl border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-6 w-1/2 bg-gray-200 rounded-lg" />
                    <Skeleton className="h-4 w-4 bg-gray-200 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-3/4 bg-gray-200 rounded-lg" />
                    <Skeleton className="h-4 w-1/3 mt-2 bg-gray-200 rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card x-chunk="dashboard-01-chunk-0" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">
                    {dasboardData?.totalNetProfit || 0} AED
                  </div>
                  <p className="text-xs text-gray-600">
                    {dasboardData?.totalNetProfit ? "+20.1% from last month" : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-1" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Active Clients
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">
                    {dasboardData?.activeClients || 0}
                  </div>
                  <p className="text-xs text-gray-600">
                    {dasboardData?.activeClients ? "+180.1% from last month" : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-2" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Sales
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">
                    {dasboardData?.totalSales || 0} AED
                  </div>
                  <p className="text-xs text-gray-600">
                    {dasboardData?.totalSales ? "+19% from last month" : "-"}
                  </p>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Active Projects
                  </CardTitle>
                  <Activity className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">
                    {dasboardData?.activeProjects || 0}
                  </div>
                  <p className="text-xs text-gray-600">
                    {dasboardData?.activeProjects ? "-": "-"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
          {isFetchingMore && (
            <div className="col-span-full">
              <Skeleton className="h-24 w-full bg-gray-200 rounded-xl" />
            </div>
          )}
          <div ref={loadMoreRef} className="h-1"></div>
        </div>

        <main className="grid flex-1 items-start gap-3 p-3 sm:p-4 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              {/* <TabsList className="bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="all"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="Sales"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Sales
                </TabsTrigger>
                <TabsTrigger
                  value="Team Leads"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Team Leads
                </TabsTrigger>
                <TabsTrigger
                  value="Team Members"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Team Members
                </TabsTrigger>
                <TabsTrigger
                  value="Sub-Contractors"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Sub-Contractors
                </TabsTrigger>
                <TabsTrigger
                  value="Accounts"
                  className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
                >
                  Accounts
                </TabsTrigger>
              </TabsList> */}
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <ListFilter className="h-3.5 w-3.5 mr-1" />
                      <span className="sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-300 rounded-lg shadow-lg">
                    <DropdownMenuLabel className="text-sm text-gray-600">Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked className="text-sm text-gray-800">
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="text-sm text-gray-800">
                      Sales Member
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="text-sm text-gray-800">
                      Team Leads
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="text-sm text-gray-800">
                      Team Members
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="text-sm text-gray-800">
                      Sub-Contractors
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem className="text-sm text-gray-800">
                      Accounts Members
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-100"
                >
                  <File className="h-3.5 w-3.5 mr-1" />
                  <span className="sm:whitespace-nowrap">Export</span>
                </Button>
                <Link href="/timesheet/create-timesheet">
                  <Button
                    size="sm"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    <span className="sm:whitespace-nowrap">Add</span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-800">Time & Logs</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your Times and logs and view performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="overflow-x-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-medium text-gray-700">Job No.</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Project Name</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Name</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Date</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Start</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          End
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Hours Logged
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Amount
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Remark
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isTimesheetLoading || !timesheet ? (
                        <>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-full bg-gray-200 rounded-lg" /></TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : timesheet.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-sm text-gray-600">
                            No timesheet data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        timesheet.map(
                          (
                            data: {
                              projectId: any;
                              userId: any;
                              _id: string;
                              created_at: string;
                              startTime: string;
                              endTime: string;
                              date_logged: string;
                              added_date: string;
                              hours_logged: string;
                              remarks: string;
                              total_amount: string;
                              url: string;
                            },
                            index: number
                          ) => (
                            <TableRow key={index} className="cursor-pointer hover:bg-gray-50">
                              <TableCell
                                className="text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.projectId?.projectId || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.projectId?.project_name || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.userId?.userId?.name || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {date(data?.created_at) || "-"}
                              </TableCell>
                              <TableCell
                                className="text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.startTime ? timeFormat(data?.startTime) : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data?.endTime ? timeFormat(data?.endTime) : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell text-sm text-gray-800"
                                onClick={() => router.push(`/timesheet/${data._id}`)}
                              >
                                {data.hours_logged || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {Number(data?.total_amount)?.toFixed(2) || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {data.remarks || "-"}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={timeSheetData?.totalPages || 1}
                    page={timeSheetData?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <div className="grid gap-3 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Card x-chunk="dashboard-01-chunk-4" className="xl:col-span-2 bg-white shadow-lg rounded-xl border-none">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-base font-semibold text-gray-800">Transactions</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Recent transactions from your companies.
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="ml-auto h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                <Link href="/transactions">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium text-gray-700">Customer</TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 hidden xl:table-column">
                      Type
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isTransactionsLoading || !data?.data ? (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                            <Skeleton className="h-4 w-1/2 mt-1 bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="hidden xl:table-column">
                            <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="hidden xl:table-column">
                            <Skeleton className="h-6 w-1/2 bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="hidden xl:table-column">
                            <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-3/4 bg-gray-200 rounded-lg" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-gray-600">
                        No transactions available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((data: any, index: number) => (
                      <TableRow key={index} className="cursor-pointer hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm font-medium text-gray-800">
                            {data.type === "payment" ? data?.projectId?.company?.name || "-" : "-"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {data?.projectId?.projectId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-800 hidden xl:table-column">
                          Sale
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-800 hidden xl:table-column">
                          {data?.date || "2023-06-23"}
                        </TableCell>
                        <TableCell
                          className={`text-right text-sm ${
                            data.type === "payment" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {data.amount || 0} AED
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5" className="bg-white shadow-lg rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-800">Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {isJobsLoading || !jobData?.data ? (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-9 w-9 bg-gray-200 rounded-full" />
                      <div className="grid gap-1 flex-1">
                        <Skeleton className="h-6 w-3/4 bg-gray-200 rounded-lg" />
                        <Skeleton className="h-4 w-1/2 bg-gray-200 rounded-lg" />
                      </div>
                      <Skeleton className="h-6 w-1/4 bg-gray-200 rounded-lg" />
                    </div>
                  ))}
                </>
              ) : jobData.data.length === 0 ? (
                <div className="text-sm text-gray-600">No recent projects available</div>
              ) : (
                jobData.data.map((data: any, index: number) => (
                  <div className="flex items-center gap-4" key={index}>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarFallback className="bg-gray-200 text-gray-800">OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium text-gray-800">
                        {data?.rfq?.client?.client_name || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data?.rfq?.client?.contact_info || "-"}
                      </p>
                    </div>
                    <div className="ml-auto text-sm font-medium text-gray-800">
                      +{data?.final_amount || 0} AED
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;