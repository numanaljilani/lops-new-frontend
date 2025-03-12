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
import { useComponiesMutation } from "@/redux/query/componiesApi";
import { useCreateEmployeeMutation } from "@/redux/query/employee";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Checkbox component

export default function CreateEmployee() {
  // Define access levels
  const accessLevels = [
    { id: "admin", label: "Admin"  },
    { id: "team_lead", label: "Team Lead" },
    { id: "sales", label: "Sales" },
    { id: "sub-contractor", label: "Sub Contractor" },
    { id: "accounts", label: "Accounts" },
    { id: "hr", label: "HR" },
  ];

  // Update the zod schema to include the access field
  const employeeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    contact: z.string(),
    description: z.string(),
    location: z.string(),
    company: z.any(),
    position: z.string(),
    salary: z.string(),
    currency: z.string(),
    status: z.boolean().default(true),
    access: z.array(z.string()).min(1, "At least one access level is required"), // Add this line
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(employeeSchema) });

  const [createEmployeeApi, { data, isSuccess, error, isError, isLoading }] =
    useCreateEmployeeMutation();

  useEffect(() => {
    console.log(errors);
    toast(`Error.`, {
      description: `All fields are required.`,
      icon: <CircleAlert color="#E9D502" />,
      style: {
        backgroundColor: "#fcebbb",
      },
    });
  }, [errors]);

  useEffect(() => {
    if (isSuccess) {
      toast(`User has been created.`, {
        description: `New employee has been added as ${watch("position")} in ${watch(
          "company"
        )}`,
      });
      router.replace("/employee");
    }
  }, [isSuccess]);

  const [companies, setCompanies] = useState([]);
  const [
    companiesApi,
    {
      data: comapniesData,
      isSuccess: companiesIsSuccess,
      error: companiesError,
      isError: companiesIsError,
    },
  ] = useComponiesMutation();

  const getCompanies = async () => {
    await companiesApi({});
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (companiesIsSuccess) {
      if (comapniesData) {
        setCompanies(comapniesData.results);
      }
    }
  }, [companiesIsSuccess]);

  async function onSubmit(data: any) {
    await createEmployeeApi({ ...data, hourly_rate });
  }

  const salary = watch("salary", "");
  const hourly_rate = (salary / 207).toFixed(2);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Create Employee
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button size="sm" type="submit">
                    {isLoading && (
                      <LoaderCircle
                        className="-ms-1 me-2 animate-spin"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                    Save Employee
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Employee Details</CardTitle>
                      <CardDescription>
                        Enter the employee details
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
                            placeholder="Hamdan Al Maktoom"
                            {...register("name")}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            className="w-full"
                            placeholder="example@gmail.com"
                            {...register("email")}
                          />
                          {errors?.email && (
                            <ErrorMessage
                              message={errors?.email?.message?.toString()}
                            />
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="access">Access Levels</Label>
                          <Controller
                            name="access"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                              <div className="flex flex-col gap-2">
                                {accessLevels.map((level) => (
                                  <div key={level.id} className="flex items-center gap-2">
                                    <Checkbox
                                      id={level.id}
                                      checked={field.value?.includes(level.id)}
                                      onCheckedChange={(checked) => {
                                        const newAccess = checked
                                          ? [...(field.value || []), level.id] // Add if checked
                                          : field.value?.filter((v : any) => v !== level.id); // Remove if unchecked
                                        field.onChange(newAccess);
                                      }}
                                    />
                                    <Label htmlFor={level.id}>{level.label}</Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                          {errors.access && (
                            <ErrorMessage
                              message={errors.access.message?.toString()}
                            />
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Location</Label>
                          <Input
                            id="location"
                            type="text"
                            className="w-full"
                            placeholder="Dubai , Abu dhabi , Sharjah"
                            {...register("location")}
                          />
                          {errors?.location && (
                            <ErrorMessage
                              message={errors?.location?.message?.toString()}
                            />
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Contact</Label>
                          <Input
                            id="contact"
                            type="number"
                            className="w-full"
                            placeholder="+971 999999999"
                            {...register("contact")}
                          />
                          {errors?.contact && (
                            <ErrorMessage
                              message={errors?.contact?.message?.toString()}
                            />
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            className="min-h-32"
                            {...register("description")}
                          />
                          {errors?.description && (
                            <ErrorMessage
                              message={errors?.description?.message?.toString()}
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Details Section (Unchanged) */}
                  <Card x-chunk="dashboard-07-chunk-1">
                    <CardHeader>
                      <CardTitle>Company Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-3">
                          <Label htmlFor="category">Company</Label>
                          <Controller
                            name="company"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                              >
                                <SelectTrigger
                                  id="category"
                                  aria-label="Select Company"
                                >
                                  <SelectValue placeholder="Select Company" />
                                </SelectTrigger>
                                <SelectContent>
                                  {companies.map(
                                    (
                                      data: { name: string; url: string },
                                      index
                                    ) => {
                                      return (
                                        <SelectItem
                                          key={index}
                                          value={data?.url}
                                        >
                                          {data?.name}
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />

                          {errors?.description && (
                            <ErrorMessage
                              message={errors?.description?.message?.toString()}
                            />
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Designation</Label>
                          <Controller
                            name="position"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                              >
                                <SelectTrigger
                                  id="subcategory"
                                  aria-label="Select Designation"
                                >
                                  <SelectValue placeholder="Select subcategory" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Sales Member">
                                    Sales Member
                                  </SelectItem>
                                  <SelectItem value="Team Leads">
                                    Team Leads
                                  </SelectItem>
                                  <SelectItem value="Team Members">
                                    Team Members
                                  </SelectItem>
                                  <SelectItem value="Sub-Contractors">
                                    Sub-Contractors
                                  </SelectItem>
                                  <SelectItem value="Accountant Members">
                                    Accountant Members
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Salary">Salary (AED)</Label>
                          <Input
                            id="Salary"
                            type="number"
                            className="w-full"
                            placeholder="5000 AED"
                            {...register("salary")}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Currency</Label>
                          <Controller
                            name="currency"
                            control={control}
                            defaultValue="AED"
                            render={({ field }) => (
                              <Select
                                {...register("currency")}
                              >
                                <SelectTrigger
                                  id="subcategory"
                                  aria-label="Select Currency"
                                >
                                  <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AED">AED</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Hourly">Hourly Rate</Label>

                          <h4 className="font-semibold">{`${hourly_rate} AED / hour`}</h4>
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
                          <Select {...register("status")}>
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={"Active"}>Active</SelectItem>
                              <SelectItem value={"Inactive"}>
                                Inactive
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                <Button type="submit" size="sm">
                  Save Employee
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}