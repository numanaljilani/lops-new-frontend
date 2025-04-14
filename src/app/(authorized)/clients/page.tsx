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
import { PaginationComponent } from "@/components/PaginationComponent";

function Clients() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page , setPage] = useState(1)

  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const [deleteClientApi] = useDeleteClientMutation();
  const [clientsApi, { data, isSuccess, error, isError }] =
    useClientsMutation();

  const getClients = async () => {
    const res = await clientsApi({page });
    console.log(res, "response");
  };

  useEffect(() => {
    getClients();
  }, []);
  useEffect(() => {
    if (isDialogOpen) {
      getClients();
    }
  }, [isDialogOpen , page]);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setCompanies(data.results);
      }
    }
  }, [isSuccess]);

  const deleteClient = async () => {
    const res = await deleteClientApi({
      id: itemToDelete.client_id,
      token: "",
    });
    console.log(res, ">>>>");
    getClients();
  };

  const update = async (url: string) => {
    router.push(`/clients/${url}`);
  };
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
                      Add Client
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>
                    Manage your Clients and view their Projects Status.
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
                        <TableHead>Client</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>AOB</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Contact Persopn
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Contact No.
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies?.map(
                        (
                          data: {
                            client_name: string;
                            created_at: string;
                            name: string;
                            contact_info: string;
                            status: boolean;
                            client_id: string;
                            company_name: string;
                            contact_person: string;
                            contact_number: string;
                          },
                          index: number
                        ) => {
                          return (
                            <TableRow key={index} onClick={() => update(data.client_id)} className="cursor-pointer">
                              <TableCell className="hidden sm:table-cell">
                               {index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.client_name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {data?.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {0}
                              </TableCell>
                              <TableCell className="font-medium">
                                {data?.contact_person}
                              </TableCell>
                              {/* <TableCell>{data?.name}</TableCell> */}
                              <TableCell className="hidden md:table-cell">
                                {data?.contact_info || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                              {data?.contact_number}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {formatDate(data?.created_at)}
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
                                      onClick={() => update(data.client_id)}
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
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                      <PaginationComponent setPage={setPage} numberOfPages={data?.count} page={page}/>
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
          handleDelete={deleteClient}
          name={itemToDelete?.client_name}
        />
      </div>
    </div>
  );
}

export default Clients;
