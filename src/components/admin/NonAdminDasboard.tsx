
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
import { Skeleton } from "@/components/ui/skeleton";
import { useUserDashboardMutation } from "@/redux/query/dashboardsApi";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/lib/dateFormat";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast, Toaster } from "sonner";

function NonAdminDashboard() {
  const router = useRouter();
  const selectedCompany = useSelector(
    (state: any) => state?.user?.selectedCompany || null
  );
  const [dasboardApi, { data: dasboardData, isLoading, error, isError }] = useUserDashboardMutation();
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

  useEffect(() => {
    getDasboardData();
  }, [selectedCompany]);

  // Placeholder for infinite scroll (for future card additions)
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          setTimeout(() => {
            // Simulate loading more cards (placeholder for future implementation)
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
          {isLoading ? (
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
              {/* <Card x-chunk="dashboard-01-chunk-0" className="bg-white shadow-lg rounded-xl border-none">
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
              </Card> */}
              {/* <Card x-chunk="dashboard-01-chunk-1" className="bg-white shadow-lg rounded-xl border-none">
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
              </Card> */}
              {/* <Card x-chunk="dashboard-01-chunk-2" className="bg-white shadow-lg rounded-xl border-none">
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
              </Card> */}
              <Card x-chunk="dashboard-01-chunk-3" className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Pending Tasks
                  </CardTitle>
                  <Activity className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-gray-800">
                    {dasboardData?.pendingCount || 0}
                  </div>
                  <p className="text-xs text-gray-600">
                    {dasboardData?.pendingCount ? "-" : "-"}
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
        <div className="grid gap-3 md:gap-4">
          <Card className="bg-white shadow-lg rounded-xl border-none" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-base font-semibold text-gray-800">
                  My Tasks
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  My completed and pending tasks.
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="ml-auto h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
              >
                <Link href="/tasks">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium text-gray-700">Job No.</TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 xl:table-column">
                      Project Name
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 xl:table-column">
                      Completion %
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-700 text-right">Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || !dasboardData?.tasks ? (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="xl:table-column">
                            <Skeleton className="h-6 w-full bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="xl:table-column">
                            <Skeleton className="h-6 w-1/2 bg-gray-200 rounded-lg" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-6 w-3/4 bg-gray-200 rounded-lg" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : dasboardData.tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-gray-600">
                        No tasks available
                      </TableCell>
                    </TableRow>
                  ) : (
                    dasboardData.tasks.map((data: any, index: number) => (
                      <TableRow
                        key={index}
                        onClick={() =>
                          router.push(`projects/${data?.project[0]?._id}`)
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="text-sm text-gray-800">
                            {data?.project[0]?.projectId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-800 xl:table-column">
                          {data?.project[0]?.project_name || "-"}
                        </TableCell>
                        <TableCell className="xl:table-column">
                          <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                            {data.completion_percentage || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right text-sm ${
                            data.type === "payment" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {formatDate(data.due_date) || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default NonAdminDashboard;