"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/dateFormat";
import {
  useComponiesMutation,
  useDeleteCompanyMutation,
} from "@/redux/query/componiesApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import {
  useClientsMutation,
  useDeleteClientMutation,
} from "../../../redux/query/clientsApi";
import Alert from "@/components/dialogs/Alert";
import { usePaymentBallsListMutation } from "@/redux/query/accountsApi";
import AlertAccountStatus from "@/components/dialogs/AlertAccountStatus";
import Wave from "react-wavify";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components

function Accounts() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentBalls, setPaymentBalls] = useState<any>([]);
  const [item, setItem] = useState<any>(null);
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
    await paymentApi({});
  };

  useEffect(() => {
    if (paymentIsSuccess) {
      console.log(payementData);
      setPaymentBalls(payementData.results);
      setLoading(false); // Set loading to false after data is fetched
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    if (!isDialogOpen) {
      getPaymentBalls();
    }
  }, [isDialogOpen]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paymentBalls.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* Add any additional buttons or filters here */}
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>
                    Manage and approve the Quotations and pay the bills etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-10">
                  {loading ? (
                    // Skeleton loading UI
                    Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-40 w-40 rounded-full"
                      />
                    ))
                  ) : currentItems.length === 0 ? (
                    // No data message
                    <div className="w-full text-center py-10">
                      <p className="text-muted-foreground">
                        No data available.
                      </p>
                    </div>
                  ) : (
                    // Display data
                    currentItems.map((data: any, index: number) => (
                      <div
                        key={index}
                        className={`border cursor-pointer size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}

                        // onClick={() =>
                        //   router.push(`/accounts/${data?.payment_id}`)
                        // }
                      >
                        <Wave
                          fill={
                            data?.verification_status == "paid"
                              ? "#17B169"
                              : data?.verification_status == "invoiced"
                              ? "#DA498D"
                              : "#662d91"
                          }
                          paused={true}
                          style={{
                            display: "flex",
                            position: "absolute",
                            bottom: 0,
                            flex: 1,
                            height: `${100}%`,
                          }}
                          options={{
                            height: -20,
                            amplitude: 2,
                          }}
                        ></Wave>

                        <Card
                          x-chunk="dashboard-01-chunk-0"
                          className="rounded-full size-64 flex justify-center items-center"
                        >
                          <div className="z-30">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              {/* <CardTitle className="text-md text-center font-medium">
                                {data?.assignee_name}
                              </CardTitle> */}
                            </CardHeader>
                            <CardContent>
                              <div
                                onClick={() => {
                                  setItem(data);
                                  setIsDialogOpen(true);
                                }}
                                className="text-xl font-bold text-center text-white"
                              >
                                {data?.amount} AED
                              </div>
                              <div   onClick={() => {
                          setItem(data);
                          setIsDialogOpen(true);
                        }} className="text-sm tracking-wider font-light text-white text-center">
                                {data?.verification_status}
                              </div>

                              <Button
                                variant={"link"}
                                onClick={() =>
                                  router.push(`/accounts/${data?.payment_id}`)
                                }
                                className="text-white underline text-xs"
                              >
                                More details
                              </Button>
                            </CardContent>
                          </div>
                        </Card>
                      </div>
                    ))
                  )}
                </CardContent>
                {/* Pagination */}
                <CardFooter className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => paginate(currentPage - 1)}
                          // disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => paginate(currentPage + 1)}
                          // disabled={indexOfLastItem >= paymentBalls.length}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <AlertAccountStatus
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          item={item}
        />
      </div>
    </div>
  );
}

export default Accounts;
