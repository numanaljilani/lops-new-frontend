"use client";
import { File, ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/dateFormat";
import {
  useComponiesMutation,
  useDeleteCompanyMutation,
} from "@/redux/query/componiesApi";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import {
  useClientsMutation,
  useDeleteClientMutation,
} from "../../../redux/query/clientsApi";
import Alert from "@/components/dialogs/Alert";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash.debounce";

function Clients() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteClientApi] = useDeleteClientMutation();
  const [clientsApi, { data, isSuccess, error, isError, isLoading: isClientsApiLoading }] = useClientsMutation();
  const [companiesApi] = useComponiesMutation();
  const [deleteCompanyApi] = useDeleteCompanyMutation();

  const getClients = async () => {
    setIsLoading(true);
    try {
      const res = await clientsApi({ page }).unwrap();
      console.log("Default Clients API Response:", JSON.stringify(res, null, 2));
      setCompanies(res?.data || []);
    } catch (err: any) {
      console.error("Default Clients Fetch Error:", JSON.stringify(err, null, 2));
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setIsLoading(true);
      try {
        const res = await clientsApi({ search: query, page }).unwrap();
        console.log("Search Clients API Response:", JSON.stringify(res, null, 2));
        setCompanies(res?.data || []);
        if (res?.data?.length === 0) {
          console.log("Search Results: No clients found");
        } else {
          console.log("Search Results:", res.data);
        }
      } catch (err: any) {
        console.error("Search Clients Fetch Error:", JSON.stringify(err, null, 2));
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [clientsApi, page]
  );

  const deleteClient = async () => {
    try {
      const res = await deleteClientApi({
        id: itemToDelete.client_id,
        token: "",
      }).unwrap();
      console.log("Delete Client Response:", JSON.stringify(res, null, 2));
      setIsDialogOpen(false);
      getClients();
    } catch (err: any) {
      console.error("Delete Client Error:", JSON.stringify(err, null, 2));
    }
  };

  const update = async (url: string) => {
    router.push(`/clients/${url}`);
  };

  useEffect(() => {
    getClients();
  }, [page]);

  useEffect(() => {
    if (!isDialogOpen) {
      getClients();
    }
  }, [isDialogOpen, page]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Response from server:", JSON.stringify(data, null, 2));
      setCompanies(data?.data || []);
      setIsLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {/* <TabsList className="hidden sm:flex bg-gray-100 rounded-lg">
                <TabsTrigger value="all" className="text-sm text-gray-800">All</TabsTrigger>
                <TabsTrigger value="Sales" className="text-sm text-gray-800">Sales</TabsTrigger>
                <TabsTrigger value="Team Leads" className="text-sm text-gray-800">Team Leads</TabsTrigger>
                <TabsTrigger value="Team Members" className="text-sm text-gray-800">Team Members</TabsTrigger>
                <TabsTrigger value="Sub-Contractors" className="text-sm text-gray-800">Sub-Contractors</TabsTrigger>
                <TabsTrigger value="Accounts" className="text-sm text-gray-800">Accounts</TabsTrigger>
              </TabsList> */}
              <div className="ml-auto flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by client name, contact person, etc."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Link href="/clients/create-client">
                  <Button size="sm" className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Client
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card className="bg-white shadow-lg rounded-xl border-none w-full">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Clients
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage your Clients and view their Projects Status
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden sm:table-cell text-sm font-medium text-gray-700 w-[80px]">
                          Sr. No.
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Client</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">Type</TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">AOB</TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Contact Person
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Email
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Contact No.
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-sm font-medium text-gray-700">
                          Created
                        </TableHead>
                        <TableHead className="text-sm font-medium text-gray-700">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell className="hidden sm:table-cell">
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
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : companies?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <p className="text-sm text-gray-600">No clients found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        companies?.map(
                          (
                            data: {
                              client_name: string;
                              createdAt: string;
                              name: string;
                              contact_info: string;
                              status: boolean;
                              _id: string;
                              company_name: string;
                              contact_person: string;
                              contact_number: string;
                              client_id: string;
                            },
                            index: number
                          ) => (
                            <TableRow
                              key={index}
                              onClick={() => update(data._id)}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="hidden sm:table-cell text-sm text-gray-800">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-sm text-gray-800 font-medium max-w-[150px] truncate">
                                {data?.client_name?.slice(0, 50) || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-gray-100 text-gray-800 border-gray-300 text-sm">
                                  {data?.status ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-800 font-medium">{0}</TableCell>
                              <TableCell className="text-sm text-gray-800 font-medium">
                                {data?.contact_person || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {data?.contact_info || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {data?.contact_number || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-sm text-gray-800">
                                {formatDate(data?.createdAt) || "-"}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                      className="bg-gray-100 hover:bg-gray-200 h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="text-sm text-gray-800">
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => update(data._id)}
                                      className="text-sm text-gray-800"
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setItemToDelete(data);
                                        setIsDialogOpen(true);
                                      }}
                                      className="text-sm text-gray-800"
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        )
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
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={itemToDelete}
          deleteCompany={true}
        />
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