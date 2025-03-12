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
import { usePathname, useRouter } from "next/navigation";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import { useDeleteClientMutation } from "../../../redux/query/clientsApi";
import Alert from "@/components/dialogs/Alert";
import {
  useAllRFQsMutation,
  useCreateRFQMutation,
  useDeleteRfqMutation,
} from "@/redux/query/rfqsApi";
import CreateDialog from "@/components/dialogs/CreateDialog";
import CreateLPO from "@/components/dialogs/CreateLPO";

function RFQs() {
  const router = useRouter();
  const [rfqs, setRFQs] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [isCreateLPODialogOpen, setIsCreateLPODialogOpen] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<any>({});
  const [rfq, setRfq] = useState<{
    project_type: string;
    scope_of_work: string;
    quotation_number: string;
    quotation_amount: string;
    status: string;
    remarks: string;
    client: string;
  }>({
    project_type: "",
    scope_of_work: "",
    quotation_number: "",
    quotation_amount: "",
    status: "",
    remarks: "",
    client: "",
  });
  const [lpo, setLpo] = useState<{
    project_type: string;
    scope_of_work: string;
    quotation_number: string;
    quotation_amount: string;
    status: string;
    remarks: string;
    client: string;
  }>({
    project_type: "",
    scope_of_work: "",
    quotation_number: "",
    quotation_amount: "",
    status: "",
    remarks: "",
    client: "",
  });

  const [rfqsApi, { data, isSuccess, error, isError }] = useAllRFQsMutation();

  const [createRFQApi] = useCreateRFQMutation();

  const handleSubmit = async () => {
    setIsCreateRFQDialogOpen(false);
    const res = await createRFQApi({ data: { ...rfq }, token: "" });
    console.log(res, "response");
    getRFQs();
  };
  const [deleteRFQApi] = useDeleteRfqMutation();

  const getRFQs = async () => {
    const res = await rfqsApi({});
  };

  useEffect(() => {
    getRFQs();
  }, []);
  useEffect(() => {
    if (isDialogOpen) {
      getRFQs();
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setRFQs(data.results);
      }
    }
  }, [isSuccess]);

  const deleteRFQ = async () => {
    console.log(itemToDelete)
    const res = await deleteRFQApi({
      id: itemToDelete.rfq_id,
      token: "",
    });
    console.log(res, ">>>>");
    getRFQs();
  };

  const update = async (url: string) => {
    // router.push(`/clients/${url}`);
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
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
                {/* <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}

                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => setIsCreateRFQDialogOpen(true)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Generate RFQ
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>RFQ's</CardTitle>
                  <CardDescription>
                    Manage your RFQ's and view their Status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="hidden w-[100px] sm:table-cell">
                          Sr. No.
                        </TableHead> */}
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          RFQ Id
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Project</TableHead>
                        {/* <TableHead>Scope</TableHead> */}
                        <TableHead>Brif of scope</TableHead>
                        <TableHead>Quotation</TableHead>

                        <TableHead className="hidden md:table-cell">
                          Created
                        </TableHead>
                        <TableHead>Create Job</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rfqs?.map(
                        (
                          data: {
                            rfq_id: string;
                            client_name: string;
                            project_type: string;
                            quotation_amount: string;
                            scope_of_work: string;
                            active: boolean;
                            rfq_date: string;
                            client: string;
                          },
                          index: number
                        ) => {
                          return (
                            <TableRow className="cursor-pointer" key={index}>
                              {/* <TableCell className="hidden sm:table-cell">
                                {data?.rfq_id}
                              </TableCell> */}
                              <TableCell
                                className="font-medium "
                                onClick={() =>
                                  router.push(`/rfqs/${data.rfq_id}`)
                                }
                              >
                                {data?.rfq_id}
                              </TableCell>
                              <TableCell
                                className="font-medium"
                                onClick={() =>
                                  router.push(`/rfqs/${data.rfq_id}`)
                                }
                              >
                                {data?.client_name}
                              </TableCell>

                              <TableCell
                                className="hidden md:table-cell"
                                onClick={() =>
                                  router.push(`/rfqs/${data.rfq_id}`)
                                }
                              >
                                {data?.project_type}
                              </TableCell>
                              <TableCell className="hidden md:table-cell" onClick={() =>
                              router.push(`/rfqs/${data.rfq_id}`)
                            }>
                                {data?.scope_of_work}
                              </TableCell>

                              <TableCell className="hidden md:table-cell " onClick={() =>
                              router.push(`/rfqs/${data.rfq_id}`)
                            }>
                                {data?.quotation_amount}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(data?.rfq_date)}
                              </TableCell>

                              <TableCell className=" md:table-cell" >
                                <Button
                                  size="sm"
                                  className="h-7 gap-1"
                                  onClick={() => {
                                    setSelectedRFQ(data);
                                    setIsCreateLPODialogOpen(true);
                                  }}
                                >
                                  <PlusCircle className="h-3.5 w-3.5" />
                                </Button>
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
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        {/* <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={itemToDelete}
          deleteCompany={true}
        /> */}
        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={itemToDelete?.id}
        />
        {
          <CreateDialog
            setIsDialogOpen={setIsCreateRFQDialogOpen}
            isDialogOpen={isCreateRFQDialogOpen}
            rfq={rfq}
            setRfq={setRfq}
            handleSubmit={handleSubmit}

            // client={path.split("/").reverse()[0]}
          />
        }
        {
          <CreateLPO
            setIsDialogOpen={setIsCreateLPODialogOpen}
            isDialogOpen={isCreateLPODialogOpen}
            data={selectedRFQ}
          />
        }
      </div>
    </div>
  );
}

export default RFQs;
