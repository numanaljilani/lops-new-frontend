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
import { useComponiesMutation } from "@/redux/query/componiesApi";
import {
  useEmployeeDetailsMutation,
  usePatchEmployeeMutation,
} from "@/redux/query/employee";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/errors/ErrorMessage";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  contact: z.string().min(1, "Contact number is required"),
  description: z.string().optional(),
  company: z.string().optional(),
  position: z.string().min(1, "Designation is required"),
  salary: z.number().min(0, "Salary must be positive"),
  Currency: z.string().default("AED"),
  costPerHour: z.number().min(0, "Hourly rate must be positive"),
  status: z.boolean(),
  access: z.array(z.string()).optional(),
});

function Skeleton({ className }: any) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />;
}

const accessLevels = [
  { id: "admin", label: "Admin" },
  { id: "team lead", label: "Team Lead" },
  { id: "sales", label: "Sales" },
  { id: "subcontractor", label: "Sub Contractor" },
  { id: "accounts", label: "Accounts" },
  { id: "team member", label: "Team Member" },
];

function Employee() {
  const { id } = useParams();
  const router = useRouter();
  const [updateView, setUpdateView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState<any>({
    userId: { name: "", email: "", access: []},
    contact: "",
    description: "",
    location: "",
    company: {_id : ""},
    position: "",
    salary: 0,
    costPerHour: 0,
    Currency: "",
    status: false,
  });

  const [employeeApi, { data, isSuccess, isLoading: isEmployeeLoading }] =
    useEmployeeDetailsMutation();
  const [
    patchEmployeeApi,
    { isSuccess: patchIsSuccess, isLoading: isPatchLoading },
  ] = usePatchEmployeeMutation();
  const [
    companiesApi,
    {
      data: companiesData,
      isSuccess: companiesIsSuccess,
      isLoading: isCompaniesLoading,
    },
  ] = useComponiesMutation();

  const [companies, setCompanies] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } :any = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      contact: "",
      description: "",
      company: data?.company?._id,
      position: "",
      salary: 0,
      Currency: "AED",
      costPerHour: 0,
      status: false,
      access: data?.access,
    },
  });

  const getEmployeeDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await employeeApi({ id });
      console.log(res, "response from the server");
    } catch (err) {
      console.error("Error fetching employee:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanies = async () => {
    try {
      const res = await companiesApi({});
      console.log(res, "companies response");
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data, "UPDAT DATA");
    if (!id) return;
    try {
      const res = await patchEmployeeApi({
        id,
        details: {
          userId: { name: data.name, email: data.email },
          contact: data.contact,
          description: data.description,
          location: data.location,
          company: data.company,
          position: data.position,
          salary: data.salary,
          costPerHour: data.costPerHour,
          Currency: data.Currency,
          status: data.status,
          access: data.access,
        },
      });
      console.log(res, "updated");
      toast("Updated", {
        description: "Employee information has been updated.",
      });
      setUpdateView(false);
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
    getCompanies();
  }, [id]);

  useEffect(() => {
    if (isSuccess && data?.employee) {
      const emp = data.employee;
      setEmployeeDetails(emp);
      setValue("name", emp.userId.name);
      setValue("email", emp.userId.email);
      setValue("location", emp.location);
      setValue("contact", emp.contact);
      setValue("description", emp.description);
      setValue("company", emp.company?._id);
      setValue("position", emp.position);
      setValue("salary", emp.salary);
      setValue("Currency", emp.Currency);
      setValue("costPerHour", emp.costPerHour);
      setValue("status", emp.status);
      setValue("access", emp.access);
    }
  }, [isSuccess, data, setValue]);

  useEffect(() => {
    if (patchIsSuccess) {
      getEmployeeDetails();
    }
  }, [patchIsSuccess]);

  useEffect(() => {
    if (companiesIsSuccess && companiesData?.data) {
      setCompanies(companiesData.data);
    }
  }, [companiesIsSuccess, companiesData]);

  return (
    <div className="flex  min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex  flex-col gap-4 p-4 sm:p-6 md:p-8">
        {updateView ? (
          <main className="grid w-full flex-1 items-start gap-4 mx-auto">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h1 className="text-xl font-semibold tracking-tight">
                  Update Employee
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
                    onClick={handleSubmit(onSubmit)}
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
                    <CardTitle>Employee Details</CardTitle>
                    <CardDescription>
                      Enter the employee details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Hamdan Al Maktoom"
                              {...register("name")}
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@gmail.com"
                              {...register("email")}
                            />
                            {errors.email && (
                              <p className="text-red-500 text-sm">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="location">Location</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="location"
                              type="text"
                              placeholder="Dubai, Abu Dhabi, Sharjah"
                              {...register("location")}
                            />
                            {errors.location && (
                              <p className="text-red-500 text-sm">
                                {errors.location.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="contact">Contact</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="contact"
                              type="tel"
                              placeholder="+971 999999999"
                              {...register("contact")}
                            />
                            {errors.contact && (
                              <p className="text-red-500 text-sm">
                                {errors.contact.message}
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
                          <Select
                            onValueChange={(value) =>
                              setValue("status", value === "true")
                            }
                            defaultValue={employeeDetails?.status.toString()}
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
                      </div>
                      <div />
                      <div className="grid w-screen gap-3 ">
                        <Label htmlFor="access">Access Levels</Label>
                        <Controller
                          name="access"
                          control={control}
                          defaultValue={employeeDetails?.userId?.access || []}
                          render={({ field }) => (
                            <div className="flex w-full  gap-5">
                              {accessLevels.map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <Checkbox
                                    id={level.id}
                                    checked={field.value?.includes(level.id)}
                                    onCheckedChange={(checked) => {
                                      const newAccess = checked
                                        ? [...(field.value || []), level.id] // Add if checked
                                        : field.value?.filter(
                                            (v: any) => v !== level.id
                                          ); // Remove if unchecked
                                      field.onChange(newAccess);
                                    }}
                                  />
                                  <Label htmlFor={level.id}>
                                    {level.label}
                                  </Label>
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
                      <div className="grid gap-3 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        {isLoading ? (
                          <Skeleton className="h-32 w-full" />
                        ) : (
                          <div>
                            <Textarea
                              id="description"
                              className="min-h-32"
                              {...register("description")}
                            />
                            {errors.description && (
                              <p className="text-red-500 text-sm">
                                {errors.description.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="company">Company</Label>
                        {isCompaniesLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Select
                              onValueChange={(value) =>
                                setValue("company", value)
                              }
                              defaultValue={employeeDetails?.company?._id}
                            >
                              <SelectTrigger id="company">
                                <SelectValue placeholder="Select Company" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((data: any, index) => (
                                  <SelectItem key={index} value={data._id}>
                                    {data?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.company && (
                              <p className="text-red-500 text-sm">
                                {errors.company.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="position">Designation</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Select
                              onValueChange={(value) =>
                                setValue("position", value)
                              }
                              defaultValue={employeeDetails?.position}
                            >
                              <SelectTrigger id="position">
                                <SelectValue placeholder="Select Designation" />
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
                            {errors.position && (
                              <p className="text-red-500 text-sm">
                                {errors.position.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="salary">Salary (AED)</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="salary"
                              type="number"
                              placeholder="5000 AED"
                              {...register("salary", { valueAsNumber: true })}
                            />
                            {errors.salary && (
                              <p className="text-red-500 text-sm">
                                {errors.salary.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="currency">Currency</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Select
                              onValueChange={(value) =>
                                setValue("Currency", value)
                              }
                              defaultValue={employeeDetails?.Currency || "AED"}
                            >
                              <SelectTrigger id="currency">
                                <SelectValue placeholder="Select Currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AED">AED</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.Currency && (
                              <p className="text-red-500 text-sm">
                                {errors.Currency.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="costPerHour">Hourly Rate (AED)</Label>
                        {isLoading ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <div>
                            <Input
                              id="costPerHour"
                              type="number"
                              placeholder="20 AED"
                              {...register("costPerHour", {
                                valueAsNumber: true,
                              })}
                            />
                            {errors.costPerHour && (
                              <p className="text-red-500 text-sm">
                                {errors.costPerHour.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
                  onClick={handleSubmit(onSubmit)}
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
                <h1 className="text-xl font-semibold tracking-tight">
                  Employee
                </h1>
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
                    <CardTitle>Employee Details</CardTitle>
                    <CardDescription>
                      Employee details and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.userId.name || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.userId.email || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="location">Location</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.location || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="contact">Contact</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.contact || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-1/2" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-3 w-3 rounded-full ${
                                employeeDetails?.status
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <h4 className="font-semibold text-lg">
                              {employeeDetails?.status ? "Active" : "Inactive"}
                            </h4>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="status">Access</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-1/2" />
                        ) : (
                          <div className="flex items-center gap-2 ">
                            {employeeDetails?.userId?.access?.map(
                              (name: string, index: number) => (
                                <div key={index} className=' px-r-4'>
                                  <span
                                    className={`h-3 w-3 rounded-full ${"bg-green-500"}`}
                                  />
                                  <h4 className="font-semibold text-lg">
                                    {name} |
                                  </h4>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        {isLoading ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <h4 className="font-semibold text-base">
                            {employeeDetails?.description || "-"}
                          </h4>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="company">Company</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg text-wrap">
                            {employeeDetails?.company?.name || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="position">Designation</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.position || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="salary">Salary (AED)</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.salary || "-"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="currency">Currency</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.Currency || "AED"}
                          </h4>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="costPerHour">Hourly Rate (AED)</Label>
                        {isLoading ? (
                          <Skeleton className="h-6 w-3/4" />
                        ) : (
                          <h4 className="font-semibold text-lg">
                            {employeeDetails?.costPerHour || "-"}
                          </h4>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        )}
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={employeeDetails}
        />
      </div>
    </div>
  );
}

export default Employee;
