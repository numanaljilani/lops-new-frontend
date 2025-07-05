"use client";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  File,
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
import { useTransactionsMutation } from "@/redux/query/transactionApi";
import { useEffect, useState } from "react";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useAdminDashboardMutation } from "@/redux/query/dashboardsApi";
import { useTimesheetMutation } from "@/redux/query/timesheet";
import { useRouter } from "next/navigation";
import { PaginationComponent } from "../PaginationComponent";
import { date, timeFormat } from "@/lib/dateFormat";

import { Tabs, TabsContent } from "../ui/tabs";

function Dashboard() {
  const router = useRouter();
    const [page, setPage] = useState(1);
    const [timesheet, setTimeSheet] = useState([]);
  const [dasboardApi, { data: dasboardData }] = useAdminDashboardMutation();
  const getDasboardData = async () => {
    const res = await dasboardApi({});
    // console.log(res, "dasboard");
  };
  const [
    jobApi,
    {
      data: jobData,
      isSuccess: jobSuccess,
      error: jobError,
      isError: jobIsError,
    },
  ] = useJobsMutation();

    const [timeSheetApi, { data :timeSheetData , isSuccess :timeSheetSuccess, error :timeSheetError, isError :timesheetIsError}] =
      useTimesheetMutation();
    
  
    const getTimeSheetData = async () => {
      const res = await timeSheetApi({ page , admin : true });
      // console.log(res, "response");
    };
  
    useEffect(() => {
      getTimeSheetData();
    }, [page]);
  
    useEffect(() => {
      if (timeSheetSuccess) {
        console.log(timeSheetData, "response from server");
        if (timeSheetData) {
          setTimeSheet(timeSheetData.data);
        }
      }
    }, [timeSheetSuccess]);
  const getJobs = async () => {
    const res = await jobApi({});
    // console.log(res, "response");
  };

  const [transactionApi, { data, isSuccess, error, isError }] =
    useTransactionsMutation();
  const transactions = async () => {
    try {
      const res = await transactionApi({});
      // console.log(res, "transaction api");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDasboardData();
    transactions();
    getJobs();
  }, []);
  useEffect(() => {
    // console.log(data?.data);
  }, [isSuccess]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dasboardData?.totalNetProfit} AED
              </div>
              <p className="text-xs text-muted-foreground">
                {/* +20.1% from last month */}
                -
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dasboardData?.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                {/* +180.1% from last month */}
                -
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dasboardData?.totalSales} AED</div>
              <p className="text-xs text-muted-foreground">
                {/* +19% from last month */}
                -
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dasboardData?.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {/* +201 from last month */}
                -
              </p>
            </CardContent>
          </Card>
        </div>


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
                        {/* <Link href="/timesheet/create-timesheet">
                          <Button size="sm" className="h-7 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              Add
                            </span>
                          </Button>
                        </Link> */}
                      </div>
                    </div>
                    <TabsContent value="all">
                      <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                          <CardTitle>Time & Logs</CardTitle>
                          <CardDescription>
                            {/* Manage your Times and logs and view performance. */}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {/* <TableHead>Name</TableHead> */}
                                <TableHead>Job No.</TableHead>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead className="hidden md:table-cell">
                                  End
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Hours Logged
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Amount
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                  Remark
                                </TableHead>
                                <TableHead>
                                  <span className="sr-only">Actions</span>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {timesheet?.map(
                                (
                                  data: {
                                    projectId : any,
                                    userId : any,
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
                                ) => {
                                
                                  return (
                                    <TableRow key={index} className="cursor-pointer">
                                      <TableCell
                                        className="font-medium"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data?.projectId?.projectId}
                                      </TableCell>
                                      <TableCell
                                        className="font-medium"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data?.projectId?.project_name}
                                      </TableCell>
                                      <TableCell
                                        className="font-medium"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data?.userId?.userId?.name}
                                      </TableCell>
                                      <TableCell
                                        className="font-medium"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {date(data?.created_at)}
                                      </TableCell>
                                      {/* <TableCell>
                                      <Badge variant="outline">{data?.active ? "Active" : "Inactive"}</Badge>
                                    </TableCell> */}
                                      <TableCell
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data?.startTime
                                          ? timeFormat(data?.startTime)
                                          : "-"}
                                      </TableCell>
                                      <TableCell
                                        className="hidden md:table-cell"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data?.endTime
                                          ? timeFormat(data?.endTime)
                                          : "-"}
                                      </TableCell>
                                      <TableCell
                                        className="hidden md:table-cell"
                                        onClick={() =>
                                          router.push(`/timesheet/${data._id}`)
                                        }
                                      >
                                        {data.hours_logged}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {Number(data?.total_amount)?.toFixed(2)}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {data.remarks}
                                      </TableCell>
                                      {/* <TableCell>
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
                                              onClick={() => update(data._id)}
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
                                      </TableCell> */}
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
                            totalPages={timeSheetData?.totalPages || 1}
                            page={timeSheetData?.page || 1}
                          />
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </main>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your companies.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden xl:table-column">
                      Type
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((data: any, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">
                            {data.type == "payment"
                              ? data?.projectId?.company?.name
                              : "-"}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {data?.projectId?.projectId}
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          Sale
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                          2023-06-23
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            data.type == "payment"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {data.amount} AED
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {jobData?.data.map((data: any, index: number) => {
                return (
                  <div className="flex items-center gap-4" key={index}>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {data?.rfq?.client?.client_name || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data?.rfq?.client?.contact_info || "-"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      + {data?.final_amount} AED
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
