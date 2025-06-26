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
import { retry } from "@reduxjs/toolkit/query";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useAdminDashboardMutation } from "@/redux/query/dashboardsApi";

function Dashboard() {
  const [dasboardApi, { data: dasboardData }] = useAdminDashboardMutation();
  const getDasboardData = async () => {
    const res = await dasboardApi({});
    console.log(res, "dasboard");
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

  const getJobs = async () => {
    const res = await jobApi({});
    console.log(res, "response");
  };

  const [transactionApi, { data, isSuccess, error, isError }] =
    useTransactionsMutation();
  const transactions = async () => {
    try {
      const res = await transactionApi({});
      console.log(res, "transaction api");
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
    console.log(data?.data);
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
