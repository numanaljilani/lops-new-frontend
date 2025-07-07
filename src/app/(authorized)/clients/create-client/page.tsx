"use client";
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
import { useCreateClientMutation } from "@/redux/query/clientsApi";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

export default function CreateClient() {
  const router = useRouter();
  const [createClientApi, { data, isSuccess, error, isError, isLoading }] =
    useCreateClientMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_name: "",
      contact_info: "",
      contact_person: "",
      contact_number: "",
      aob: "",
      company_name: "",
      type: "",
      status: true,
      about: "",
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    const res = await createClientApi({
      data: { ...data },
      token: "",
    });
    router.replace("/clients");
  };

  useEffect(() => {
    if (isSuccess) {
      toast(`client has been created.`, {
        description: `${data?.client_name} has been created.`,
      });
      router.replace("/clients");
    }
  }, [isSuccess]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Create Client
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" onClick={handleSubmit(onSubmit)}>
                  {isLoading && (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  Save
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                    <CardDescription>Enter the Client details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                placeholder="Khan"
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
                                placeholder="-"
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
                          <Label htmlFor="contact_person">Contact Person</Label>
                          <Controller
                            name="contact_person"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="contact_person"
                                type="text"
                                className="w-full"
                                placeholder="-"
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
                          <Label htmlFor="contact_number">Contact No.</Label>
                          <Controller
                            name="contact_number"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="contact_number"
                                type="text"
                                className="w-full"
                                placeholder="Khan"
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
                                placeholder="LITES"
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
                          <Label htmlFor="contact_info">Contact email</Label>
                          <Controller
                            name="contact_info"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="contact_info"
                                type="text"
                                className="w-full"
                                placeholder="LITES"
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
                          <Label htmlFor="type">Service</Label>
                          <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger id="type" aria-label="Select Service">
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
                    <CardTitle>Client Status</CardTitle>
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
                              <SelectTrigger id="status" aria-label="Select status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
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
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleSubmit(onSubmit)}>
                Save Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}