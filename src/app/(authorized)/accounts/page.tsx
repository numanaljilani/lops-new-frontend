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

function Accounts() {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentBalls, setPaymentBalls] = useState<any>([]);
  const [item, setItem] = useState<any>(null);


  const update = async (url: string) => {
    router.push(`/accounts`);
  };

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
    const res = await paymentApi({});
    console.log(res, "AALL");
  };

  useEffect(() => {
    if (paymentIsSuccess) {
      console.log(payementData, "payementData.result");
      setPaymentBalls(payementData.results);
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    getPaymentBalls();
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                <DropdownMenu>
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
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Link href="/clients/create-client">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Accounts
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>
                    Manage and approve the RFQ's and Qoutations and pay the
                    bills etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead> */}
                        <TableHead>Sr. No.</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Project Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Project %
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Amount
                        </TableHead>
                   
                        <TableHead className="hidden md:table-cell">
                          Payment
                        </TableHead>
                 
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentBalls &&
                        paymentBalls?.map(
                          (
                            data: {
                              client_name: string;
                              created_at: string;
                              amount: string;
                              contact_info: string;
                              status: boolean;
                              project_percentage: string;
                              company_name: string;
                              verification_status: string;
                              contact_number: string;
                              project_status: string;
                            },
                            index: number
                          ) => {
                            return (
                              <TableRow key={index}>
                                <TableCell className="hidden sm:table-cell">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {data?.client_name}
                                </TableCell>

                                <TableCell className="font-medium">
                                  {data.project_status}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {data?.project_percentage + "%" || "-"}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {data?.amount}
                                </TableCell>

                       
                                <TableCell className="hidden md:table-cell">
                                  {data?.verification_status}
                                </TableCell>
                             
                                <TableCell>
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
                                      {/* <DropdownMenuItem
                                        onClick={() => update(data)}
                                      >
                                        Edit
                                      </DropdownMenuItem> */}
                                      <DropdownMenuItem
                                        onClick={() => {
                                    setItem(data)
                                          setIsDialogOpen(true);
                                        }}
                                      >
                                        Verify
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>{payementData?.count}</strong>{" "}
                    products
                  </div>
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
