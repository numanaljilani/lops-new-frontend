"use client";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import CreateDialog from "@/components/dialogs/CreateDialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/dateFormat";
import { useClientDetailsMutation, usePatchClientMutation } from "@/redux/query/clientsApi";
import { useCreateRFQMutation, useRfqsMutation } from "@/redux/query/rfqsApi";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { TabsContent } from "@radix-ui/react-tabs";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Client() {
  const router = useRouter();
  const path = usePathname();
  //   console.log(path.split("/").reverse()[0] , "Path")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [updateView, setUpdateView] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<{
    client_name: string;
    company_name: string;
    contact_info: string;
    type: string;
    status: boolean;
  }>({
    client_name: "",
    company_name: "",
    contact_info: "",
    type: "",
    status: false,
  });

  const [clientsDetailsApi, { data, isSuccess, error, isError }] =
    useClientDetailsMutation();

  const [rfqsApi] = useRfqsMutation();
  const [patchClientApi] = usePatchClientMutation();

  const [rfq, setRfq] = useState<{
    project_type: string;
    scope_of_work: string;
    status: boolean;
    remarks: string;
    client: string;
  }>({
    project_type: "",
    scope_of_work: "",
    status: false,
    remarks: "",
    client: "",
  });

  const [createRFQApi] = useCreateRFQMutation();

  const handleSubmit = async () => {
    const res = await createRFQApi({
      data: { ...rfq, client: path.split("/").reverse()[0] },
      token: "",
    });
    console.log(res, "response");
  };

  const getClientDetails = async () => {
    console.log(companyDetails);
    const res = await clientsDetailsApi({
      id: path.split("/").reverse()[0],
      token: "",
    });
    console.log(res, "response from the server");
  };
  const getRFQs = async () => {
    console.log(companyDetails);
    const res = await rfqsApi({
      id: path.split("/").reverse()[0],
      token: "",
    });
    console.log(res, "response from the server");
  };

  useEffect(() => {
    getClientDetails();
  }, []);

  const saveCompanyDetails = async () => {
    console.log(companyDetails);
    setUpdateView(false);
    const res = await patchClientApi({
      id: path.split("/").reverse()[0],
      details: companyDetails,
      token: "",
    });
    toast(`Updated`,
      
      {
      description: "Client information has been updated.",
    
    });
    console.log(res, "response from the server");
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      setCompanyDetails(data);
    }
  }, [isSuccess]);

  const [companies, setCompanies] = useState([]);

  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const getEmployes = async () => {
    const res = await [];
    console.log(res, "response");
  };

  const deleteCompany = async (url: string) => {
    console.log(url.split("/")[6]);
    const res = await [];
    getEmployes();
  };

  const update = async (url: string) => {};
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {updateView ? (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Client
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                  <Button size="sm" onClick={saveCompanyDetails}>
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-200 text-red-700 hover:bg-red-300"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Client Details</CardTitle>
                      <CardDescription>
                        Update the Client details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            type="text"
                            className="w-full"
                            placeholder="LITES"
                            onChange={(e) => {
                              e.preventDefault();
                              setCompanyDetails({
                                ...companyDetails,
                                client_name: e.target.value,
                              });
                            }}
                            defaultValue={companyDetails.client_name}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="loction">Contact</Label>
                          <Input
                            id="loction"
                            type="text"
                            className="w-full"
                            placeholder="Dubai , Sharjah"
                            onChange={(e) => {
                              e.preventDefault();
                              setCompanyDetails({
                                ...companyDetails,
                                contact_info: e.target.value,
                              });
                            }}
                            defaultValue={companyDetails.contact_info}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Service</Label>
                          <Select
                            onValueChange={(value) =>
                              setCompanyDetails({
                                ...companyDetails,
                                type: value,
                              })
                            }
                            value={companyDetails.type}
                          >
                            <SelectTrigger
                              id="Service"
                              aria-label="Select Service"
                            >
                              <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Consultancy Services">
                                Consultancy Services
                              </SelectItem>
                              <SelectItem value="General Contracting">
                                General Contracting
                              </SelectItem>
                              <SelectItem value="Electro-Mechanical Works">
                                Electro-Mechanical Works
                              </SelectItem>
                              <SelectItem value="Design & Drafting Services">
                                Design & Drafting Services
                              </SelectItem>
                              <SelectItem value="IT Solutions">
                                IT Solutions
                              </SelectItem>
                              <SelectItem value="Video Production Services">
                                Video Production Services
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Employee Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            onValueChange={(value) =>
                              setCompanyDetails({
                                ...companyDetails,
                                status: value === "true",
                              })
                            }
                          >
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* <SelectItem value="draft">On Leave</SelectItem> */}
                              <SelectItem value={"true"}>Active</SelectItem>
                              <SelectItem value={"false"}>Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                 { <Card x-chunk="dashboard-07-chunk-5 hidden">
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        You can update and delete the Client.
                      </CardDescription>
                    </CardHeader>
                    {/* <CardContent>
                      <div className="flex justify-between gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          //   onClick={() => setUpdateView(true)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-200 text-red-700 hover:bg-red-300 flex-1"
                          onClick={() => setIsDialogOpen(true)}
                          variant="secondary"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent> */}
                  </Card>}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save Product</Button>
              </div>
            </div>
            <AlertDialogAlert
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              itemToDelete={companyDetails}
              deleteCompany={true}
            />
          </main>
        ) : (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Client
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Client Details</CardTitle>
                      <CardDescription>
                        Checkout the client project and thier status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>

                          <h4 className="font-semibold text-lg">
                            {companyDetails.client_name}
                          </h4>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="name">Contact</Label>

                          <h4 className="font-semibold text-lg">
                            {companyDetails.contact_info}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Company</Label>

                          <h4 className="font-semibold text-lg">
                            {companyDetails.company_name
                              ? companyDetails.company_name
                              : "-"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Client Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <h4 className="font-semibold text-lg">
                            {companyDetails.status ? "Active" : "Inactive"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                   <Card x-chunk="dashboard-07-chunk-5">
                   <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        You can update and delete the employee.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setUpdateView(true)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-200 text-red-700 hover:bg-red-300 flex-1"
                          onClick={() => setIsDialogOpen(true)}
                          variant="secondary"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Tabs defaultValue="all">
                  <div className="flex items-center">
                    <div className="ml-auto mb-5 flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1"
                          >
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

                      <Button
                        size="sm"
                        onClick={() => setIsCreateRFQDialogOpen(true)}
                        className="h-7 gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Client
                        </span>
                      </Button>
                    </div>
                  </div>
                  <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                      <CardHeader>
                        <CardTitle>RFQ's</CardTitle>
                        <CardDescription>
                          Manage your RFQ's and view Progress.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                              </TableHead>
                              <TableHead>Project</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Service
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Created at
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
                                  name: string;
                                  added_date: string;
                                  location: string;
                                  type: string;
                                  active: boolean;
                                  url: string;
                                },
                                index: number
                              ) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell className="hidden sm:table-cell">
                                      <Image
                                        alt="Employee Image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={`https://ui-avatars.com/api/?name=${data?.name}&&color=fff&&background=3A72EC&&rounded=true&&font-size=0.44`}
                                        width="64"
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {data?.name}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {data?.active ? "Active" : "Inactive"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{data?.location}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {data?.type}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {formatDate(data?.added_date)}
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
                                            onClick={() => update(data.url)}
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
                        <div className="text-xs text-muted-foreground">
                          Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                          products
                        </div>
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
            </div>
          </main>
        )}
      </div>
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
    </div>
  );
}
