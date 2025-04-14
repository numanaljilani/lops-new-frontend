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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@/components/dialogs/Alert";
import {
  useAllRFQsMutation,
  useCreateRFQMutation,
} from "@/redux/query/rfqsApi";
import CreateDialog from "@/components/dialogs/CreateDialog";
import {
  useDeleteJobCardMutation,
  useJobsMutation,
} from "@/redux/query/jobApi";

import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components
import { PaginationComponent } from "@/components/PaginationComponent";
import { usePaymentBallsListMutation } from "@/redux/query/accountsApi";

function Accounts() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [payemtes, setPayments] = useState<[]>([]);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rfq, setRfq] = useState<any>();
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Number of items per page


  const [
    paymentApi,
    {
      data: payementData,
      isSuccess: paymentIsSuccess,
      error: paymentError,
      isError: paymentIsError,
    },
  ] = usePaymentBallsListMutation();

  const getPaymentBalls = async () => {
    setLoading(true); // Set loading to true before fetching data
    await paymentApi({ page , percentage : 100});
  };
  useEffect(() => {
    getPaymentBalls();
  }, []);

  useEffect(() => {
    if (paymentIsSuccess) {
      console.log(payementData.results, ">>>>>>>>");
      setPayments(payementData.results);
      setLoading(false)
    }
  }, [paymentIsSuccess]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by RFQ ID..."
                    className="w-full rounded-lg bg-background pl-8"
                    // value={searchQuery}
                    // onChange={(e) => handleSearch(e.target.value)}
                  />
                </div> */}
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>
                    Manage your Accounts and view their Status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          Invoice Id
                        </TableHead>
                        <TableHead>Job Id</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Brief</TableHead>
                        <TableHead>Net Value without VAT</TableHead>
                        <TableHead>2.5% chairity</TableHead>
                        <TableHead>VAT</TableHead>
                        <TableHead>Total</TableHead>
                        {/* <TableHead className="hidden md:table-cell">
                          Deadline at
                        </TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        // Skeleton loading UI
                        Array.from({ length: itemsPerPage }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : payemtes.length === 0 ? (
                        // No data message
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <p className="text-muted-foreground">
                              No data available.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        // Display data
                        payemtes?.map((data: any, index: number) => (
                          <TableRow key={index} className="cursor-pointer">
                            <TableCell
                              className="hidden sm:table-cell hover:underline"
                              onClick={() =>
                                router.push(`/accounts/${data.job_card}`)
                              }
                            >
                              {data?.invoice_number || "-"}
                            </TableCell>
                            <TableCell
                              className="hidden sm:table-cell hover:underline"
                              onClick={() =>
                                router.push(`/accounts/${data.job_card}`)
                              }
                            >
                              {data?.job_number}
                            </TableCell>
                            <TableCell
                              className="font-medium"
                              onClick={() =>
                                router.push(`/accounts/${data.job_card}`)
                              }
                            >
                              {data?.client_name || "-"}
                            </TableCell>
                            <TableCell
                              className="font-medium"
                              onClick={() =>
                                router.push(`/accounts/${data.job_card}`)
                              }
                            >
                              {data?.project_name || "-"}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                router.push(`/accounts/${data.job_card}`)
                              }
                            >
                              {data?.brief_scope || ""}
                            </TableCell>

                            <TableCell className="hidden md:table-cell hover:underline">
                              {Number(data?.amount)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {Number(data?.charity_amount)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {data?.vat_amount}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {Number(data?.amount) +
                                Number(data?.amount) * 0.05}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                {/* Pagination */}
                <CardFooter className="flex justify-center">
                  <PaginationComponent
                    setPage={setPage}
                    numberOfPages={payementData?.count}
                    page={page}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Accounts;
