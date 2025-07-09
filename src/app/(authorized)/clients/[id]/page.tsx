"use client";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  useClientDetailsMutation,
  useDeleteClientMutation,
  usePatchClientMutation,
} from "@/redux/query/clientsApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Alert from "@/components/dialogs/Alert";

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

function Skeleton({ className } : any) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />;
}

export default function Client() {
  const { id } = useParams();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateView, setUpdateView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [clientsDetailsApi, { data, isSuccess, isLoading: isClientLoading }] =
    useClientDetailsMutation();
      const [deleteClientApi] = useDeleteClientMutation();
  const [patchClientApi, { isLoading: isPatchLoading }] = usePatchClientMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
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

  const getClientDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await clientsDetailsApi({ id });
      console.log(res, "response from the server");
    } catch (err) {
      console.error("Error fetching client:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClientDetails();
  }, [id]);

  useEffect(() => {
    if (isSuccess && data) {
      reset(data);
      setValue("status", data.status);
    }
  }, [isSuccess, data, reset, setValue]);

  const saveClientDetails = async (formData: ClientFormValues) => {
    if (!id) return;
    try {
      const res = await patchClientApi({
        id,
        details: formData,
        token: "",
      });
      toast("Updated", {
        description: "Client information has been updated.",
      });
      setUpdateView(false);
      getClientDetails();
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

   const deleteClient = async () => {
    try {
      const res = await deleteClientApi({
        id: data._id,
      }).unwrap();
      router.replace('/clients')
      console.log("Delete Client Response:", JSON.stringify(res, null, 2));
      setIsDialogOpen(false);
   
    } catch (err: any) {
      console.error("Delete Client Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
        {updateView ? (
          <main className="grid flex-1 items-start gap-4 w-full mx-auto">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h1 className="text-xl font-semibold tracking-tight">
                  Update Client
                </h1>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpdateView(false)}
                    disabled={isPatchLoading}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(saveClientDetails)}
                    disabled={isPatchLoading}
                  >
                    {isPatchLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-200 text-red-700 hover:bg-red-300"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={isPatchLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                    <CardDescription>Update the client details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(saveClientDetails)}>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-3">
                          <Label htmlFor="client_name">Name</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="client_name"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="client_name"
                                    type="text"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="aob">AOB</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="aob"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="aob"
                                    type="text"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact_person">Contact Person</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="contact_person"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="contact_person"
                                    type="text"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact_number">Contact Number</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="contact_number"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="contact_number"
                                    type="tel"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact_info">Contact Email</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="contact_info"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="contact_info"
                                    type="email"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="company_name">Company Name</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="company_name"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    id="company_name"
                                    type="text"
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="type">Service</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <div>
                              <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger id="type">
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
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          {isLoading ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
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
                                  <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          )}
                        </div>
                        <div className="grid gap-3 sm:col-span-2">
                          <Label htmlFor="about">About</Label>
                          {isLoading ? (
                            <Skeleton className="h-32 w-full" />
                          ) : (
                            <div>
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
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setUpdateView(false)}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleSubmit(saveClientDetails)}
                >
                  Save
                </Button>
              </div>
            </div>
          </main>
        ) : (
          <main className="grid flex-1 items-start gap-4 w-full mx-auto">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h1 className="text-xl font-semibold tracking-tight">Client</h1>
                <div className="flex gap-2 ml-auto sm:flex-row flex-col">
                  <Button size="sm" onClick={() => setUpdateView(true)}>
                    Update
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
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                    <CardDescription>
                      Checkout the client project and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="client_name">Name</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.client_name || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="company_name">Company</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.company_name || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="aob">AOB</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.aob || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="contact_person">Contact Person</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.contact_person || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="contact_number">Phone</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.contact_number || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="contact_info">Contact Email</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.contact_info || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="type">Service</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">{data?.type || "-"}</h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-1/2" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-3 w-3 rounded-full ${data?.status ? "bg-green-500" : "bg-red-500"}`}
                            />
                            <h4 className="font-semibold text-lg">
                              {data?.status ? "Active" : "Inactive"}
                            </h4>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 sm:col-span-2">
                        <Label htmlFor="about">About</Label>
                        {isLoading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <h4 className="font-medium text-base">{data?.about || "-"}</h4>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        )}
       <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteClient}
          name={data?.client_name}
        />
      </div>
    </div>
  );
}