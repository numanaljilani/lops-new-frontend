"use client";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
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
import { useUserDashboardMutation } from "@/redux/query/dashboardsApi";
import { formatDate } from "@/lib/dateFormat";
import { useRouter } from "next/navigation";

function NonAdminDasboard() {
    const router = useRouter();
  const [dasboardApi, { data: dasboardData }] = useUserDashboardMutation();
  const [dasboard, { data }] = useUserDashboardMutation();
  const getDasboardData = async () => {
    const res = await dasboardApi({});
    console.log(res, "dasboard");
  };

  useEffect(() => {
    getDasboardData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* <Card x-chunk="dashboard-01-chunk-0">
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
                +20.1% from last month
                -
              </p>
            </CardContent>
          </Card> */}
          {/* <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dasboardData?.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
                -
              </p>
            </CardContent>
          </Card> */}
          {/* <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{dasboardData?.totalSales} AED</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
                -
              </p>
            </CardContent>
          </Card> */}
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dasboardData?.pendingCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* +201 from last month */}-
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 ">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>
                  My completed and pending tasks. 
                </CardDescription>
              </div>
              {/* <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button> */}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job No.</TableHead>
                    <TableHead className=" xl:table-column">
                      Project Name
                    </TableHead>
                    <TableHead className=" xl:table-column">
                      Completion %
                    </TableHead>
                    
                    <TableHead className="text-right">Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dasboardData?.tasks?.map((data: any, index: number) => {
                    return (
                      <TableRow key={index} onClick={()=>router.push(`projects/${data?.project[0]?._id}`) } className="cursor-pointer">
                        <TableCell>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {data?.project[0]?.projectId || "-"}
                          </div>
                        </TableCell>
                      
                        
                        <TableCell className=" md:table-cell  xl:table-column">
                          {data?.project[0]?.project_name}
                        </TableCell>
                        <TableCell className=" xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            {data.completion_percentage}%
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            data.type == "payment"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {formatDate(data.due_date)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default NonAdminDasboard;
