"use client";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/dateFormat";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/dialogs/Alert";
import { useAllRFQsMutation, useCreateRFQMutation } from "@/redux/query/rfqsApi";
import CreateDialog from "@/components/dialogs/CreateDialog";
import { useDeleteJobCardMutation, useJobsMutation } from "@/redux/query/jobApi";
import { usePaymentBallsListMutation } from "@/redux/query/accountsApi";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationComponent } from "@/components/PaginationComponent";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";

function Accounts() {
  const router = useRouter();
      const selectedCompany = useSelector(
      (state: any) => state?.user?.selectedCompany || null
    );
  const [jobs, setJobs] = useState([]);
  const [payemtes, setPayments] = useState<[]>([]);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rfq, setRfq] = useState<any>();
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const [jobApi, { data, isSuccess, error, isError, isLoading: isJobApiLoading }] = useJobsMutation();
  const [deleteJobCardApi] = useDeleteJobCardMutation();
  const [createRFQApi] = useCreateRFQMutation();
  const [paymentBallsListApi] = usePaymentBallsListMutation();

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setLoading(true);
      try {
        const res = await jobApi({ search: query, page , companyId : selectedCompany._id }).unwrap();
        console.log("Search Jobs API Response:", JSON.stringify(res, null, 2));
        setJobs(res?.data || []);
        if (res?.data?.length === 0) {
          console.log("Search Results: No jobs found");
        } else {
          console.log("Search Results:", res.data);
        }
      } catch (err: any) {
        console.error("Search Jobs Fetch Error:", JSON.stringify(err, null, 2));
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [jobApi, page]
  );

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi({ page , companyId : selectedCompany._id }).unwrap();
      console.log("Default Jobs API Response:", JSON.stringify(res, null, 2));
      setJobs(res?.data || []);
    } catch (err: any) {
      console.error("Default Jobs Fetch Error:", JSON.stringify(err, null, 2));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, [page]);

  useEffect(() => {
    if (!isDialogOpen) {
      getJobs();
    }
  }, [isDialogOpen, page,selectedCompany]);

  useEffect(() => {
    if (isSuccess) {
      setJobs(data?.data || []);
      setLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by Job No, RFQ ID..."
                  className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Accounts
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your Accounts and view their Status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[100px]">
                          Job No
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[100px]">
                          Project Name
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Client</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Scope</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Status</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Deadline
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                          <TableRow key={index}>
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
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : jobs?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-sm text-gray-600">No data available.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        jobs?.map((data: any, index: number) => (
                          <TableRow key={index} className="cursor-pointer">
                            <TableCell
                              className="hidden sm:table-cell text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/accounts/${data._id}`)}
                            >
                              {data?.projectId}
                            </TableCell>
                            <TableCell
                              className="hidden sm:table-cell text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/accounts/${data._id}`)}
                            >
                              {data?.project_name || '-'}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 font-medium"
                              onClick={() => router.push(`/accounts/${data._id}`)}
                            >
                              {data?.rfq?.client?.client_name || "-"}
                            </TableCell>
                            <TableCell
                              className="text-sm text-gray-800 max-w-[150px] truncate"
                              onClick={() => router.push(`/accounts/${data._id}`)}
                            >
                              {data?.scope_of_work?.slice(0, 50) || "-"}
                            </TableCell>
                            <TableCell
                              onClick={() => router.push(`/accounts/${data._id}`)}
                            >
                              <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-sm">
                                {data?.completion_percentage}%
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-gray-800">
                              {formatDate(data?.delivery_timelines)}
                            </TableCell>
                          </TableRow>
                        ))
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
        </main>
        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={() => {}}
          name={itemToDelete?.client_name}
        />
        {/* <CreateDialog
          isDialogOpen={false}
          setIsDialogOpen={() => {}}
          handleSubmit={() => {}}
          rfq={rfq}
          setRfq={setRfq}
        /> */}
      </div>
    </div>
  );
}

export default Accounts;