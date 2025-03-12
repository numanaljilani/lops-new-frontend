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
     await paymentApi({});
    
  };

  useEffect(() => {
    if (paymentIsSuccess) {
      console.log(payementData, "payementData.result");
      setPaymentBalls(payementData.results);
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    if(!isDialogOpen){

      getPaymentBalls();
    }
  }, [isDialogOpen]);
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
                {/* <Link href="/clients/create-client">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Accounts
                    </span>
                  </Button>
                </Link> */}
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Accounts</CardTitle>
                  <CardDescription>
                    Manage and approve the Qoutations and pay the
                    bills etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-10">
                  {paymentBalls &&
                    paymentBalls?.map(
                      (
                        data: {
                          client_name: string;
                          created_at: string;
                          amount: string;
                          contact_info: string;
                          status: boolean;
                          company_name: string;
                          verification_status: string;
                          contact_number: string;
                          project_status: string;
                          project_percentage: string;
                          completion_percentage: string;
                        },
                        index: number
                      ) => {
                        return (
                          <div
                            key={index}
                            className={`border  cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                            onClick={() => {
                              // getTasks(paymentBalls.job_card);
                              setItem(data);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Wave
                              // fill="#60a5fa"
                              fill={
                                data?.verification_status == "paid" ? "#17B169" : data?.verification_status ==  "invoiced" ?  "#DA498D" : "#662d91"
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
                                // speed: 0.15,
                                // points: 3,
                              }}
                            ></Wave>

                            <Card
                              x-chunk="dashboard-01-chunk-0"
                              className="rounded-full size-64 flex justify-center items-center "
                            >
                              <div className="z-30">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  {/* <CardTitle className="text-md text-center font-medium">
                                    {data?.assignee_name}
                                  </CardTitle> */}
                                </CardHeader>
                                <CardContent>
                                  <div className="text-xl font-bold text-center text-white">
                                    {data?.amount} AED
                                  </div>

                                  <div className="text-sm tracking-wider font-light text-white text-center">
                                    {data?.verification_status}
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          </div>
                        
                        );
                      }
                    )}
                </CardContent>
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
