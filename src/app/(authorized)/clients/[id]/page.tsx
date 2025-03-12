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
import {
  useClientDetailsMutation,
  usePatchClientMutation,
} from "@/redux/query/clientsApi";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define Zod schema for form validation
const clientSchema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  aob: z.string().min(1, "AOB is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  contact_info: z.string().email("Invalid email address"),
  company_name: z.string().min(1, "Company name is required"),
  type: z.string().min(1, "Service type is required"),
  status: z.boolean(),
  about: z.string().min(1, "About is required"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function Client() {
  const router = useRouter();
  const path = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateRFQDialogOpen, setIsCreateRFQDialogOpen] = useState(false);
  const [updateView, setUpdateView] = useState(false);

  const [clientsDetailsApi, { data, isSuccess, error, isError }] =
    useClientDetailsMutation();
  const [patchClientApi] = usePatchClientMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_name: "",
      aob: "",
      contact_person: "",
      contact_number: "",
      contact_info: "",
      company_name: "",
      type: "",
      status: true,
      about: "",
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      reset(data); // Reset form with fetched data
    }
  }, [isSuccess, data, reset]);

  const getClientDetails = async () => {
    const res = await clientsDetailsApi({
      id: path.split("/").reverse()[0],
      token: "",
    });
    console.log(res, "response from the server");
  };

  useEffect(() => {
    getClientDetails();
  }, []);

  const saveCompanyDetails = async (formData: ClientFormValues) => {
    const res = await patchClientApi({
      id: path.split("/").reverse()[0],
      details: formData,
      token: "",
    });
    toast(`Updated`, {
      description: "Client information has been updated.",
    });
    setUpdateView(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {updateView ? (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem]  w-full flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4 ">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Client
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpdateView(false)}
                  >
                    Discard
                  </Button>
                  <Button size="sm" onClick={handleSubmit(saveCompanyDetails)}>
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
                      <form onSubmit={handleSubmit(saveCompanyDetails)}>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="client_name">Name</Label>
                            <Controller
                              name="client_name"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="client_name"
                                  type="text"
                                  className="w-full"
                                  placeholder="Client Name"
                                />
                              )}
                            />
                            {errors.client_name && (
                              <p className="text-red-500 text-sm">
                                {errors.client_name.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="aob">AOB</Label>
                            <Controller
                              name="aob"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="aob"
                                  type="text"
                                  className="w-full"
                                  placeholder="AOB"
                                />
                              )}
                            />
                            {errors.aob && (
                              <p className="text-red-500 text-sm">
                                {errors.aob.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="contact_person">
                              Contact Person
                            </Label>
                            <Controller
                              name="contact_person"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="contact_person"
                                  type="text"
                                  className="w-full"
                                  placeholder="Contact Person"
                                />
                              )}
                            />
                            {errors.contact_person && (
                              <p className="text-red-500 text-sm">
                                {errors.contact_person.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="contact_number">
                              Contact Number
                            </Label>
                            <Controller
                              name="contact_number"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="contact_number"
                                  type="text"
                                  className="w-full"
                                  placeholder="Contact Number"
                                />
                              )}
                            />
                            {errors.contact_number && (
                              <p className="text-red-500 text-sm">
                                {errors.contact_number.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="contact_info">Contact Email</Label>
                            <Controller
                              name="contact_info"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="contact_info"
                                  type="email"
                                  className="w-full"
                                  placeholder="Contact Email"
                                />
                              )}
                            />
                            {errors.contact_info && (
                              <p className="text-red-500 text-sm">
                                {errors.contact_info.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Controller
                              name="company_name"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="company_name"
                                  type="text"
                                  className="w-full"
                                  placeholder="Company Name"
                                />
                              )}
                            />
                            {errors.company_name && (
                              <p className="text-red-500 text-sm">
                                {errors.company_name.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="type">Service</Label>
                            <Controller
                              name="type"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    id="type"
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
                              )}
                            />
                            {errors.type && (
                              <p className="text-red-500 text-sm">
                                {errors.type.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="about">About</Label>
                            <Controller
                              name="about"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  id="about"
                                  className="min-h-32"
                                  placeholder="About"
                                />
                              )}
                            />
                            {errors.about && (
                              <p className="text-red-500 text-sm">
                                {errors.about.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </form>
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
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(value === "true")
                                }
                                value={field.value ? "true" : "false"}
                              >
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Active</SelectItem>
                                  <SelectItem value="false">
                                    Inactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUpdateView(false)}
                >
                  Discard
                </Button>
                <Button size="sm" onClick={handleSubmit(saveCompanyDetails)}>
                  Save Changes
                </Button>
              </div>
            </div>
            <AlertDialogAlert
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              itemToDelete={data}
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
                        Checkout the client project and their status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>
                          <h4 className="font-semibold text-lg">
                            {data?.client_name}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="company">Company</Label>
                          <h4 className="font-semibold text-lg">
                            {data?.company_name || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="company">AOB</Label>
                          <h4 className="font-semibold text-lg">
                            {data?.aob || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Contact Person</Label>
                          <h4 className="font-semibold text-lg">
                            {data?.contact_person}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Phone </Label>
                          <h4 className="font-semibold text-lg">
                            {data?.contact_number}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Contact</Label>
                          <h4 className="font-semibold text-lg">
                            {data?.contact_info}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">About</Label>
                          <h4 className="font-medium text-lg">
                            {data?.about}
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
                            {data?.status ? "Active" : "Inactive"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        You can update and delete the client.
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
          </main>
        )}
      </div>
      {
        <CreateDialog
          setIsDialogOpen={setIsCreateRFQDialogOpen}
          isDialogOpen={isCreateRFQDialogOpen}
          rfq={{}}
          setRfq={() => {}}
          handleSubmit={() => {}}
        />
      }
    </div>
  );
}
