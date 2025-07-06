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
import { CircleAlert, LoaderCircle, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateEmployeePage() {
  // Define access levels
  const accessLevels = [
    { id: "admin", label: "Admin" },
    { id: "team lead", label: "Team Lead" },
    { id: "sales", label: "Sales" },
    { id: "subcontractor", label: "Sub Contractor" },
    { id: "accounts", label: "Accounts" },
    { id: "team member", label: "Team Member" },
  ];

  // Zod schema
  const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    contact: z.string().min(1, "Contact is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    company: z.array(z.string()).min(1, "At least one company is required"),
    position: z.string().min(1, "Designation is required"),
    salary: z.string().min(1, "Salary is required"),
    currency: z.string().min(1, "Currency is required"),
    status: z.boolean().default(true),
    access: z.array(z.string()).min(1, "At least one access level is required"),
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  }:any = useForm({ resolver: zodResolver(employeeSchema), defaultValues: { company: [], access: [], currency: "AED" } });

  const [createEmployeeApi, { data, isSuccess, error, isError, isLoading }] = useCreateEmployeeMutation();
  const [companies, setCompanies] = useState([]);
  const [companiesApi, { data: companiesData, isSuccess: companiesIsSuccess, error: companiesError, isError: companiesIsError, isLoading: isCompaniesLoading }] = useComponiesMutation();
  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const getCompanies = async () => {
    try {
      const res = await companiesApi({}).unwrap();
      console.log("Companies API Response:", JSON.stringify(res, null, 2));
      setCompanies(res?.data || []);
    } catch (err: any) {
      console.error("Companies Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch companies: " + (err?.data?.message || err.message || "Unknown error"));
      setCompanies([]);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast("User has been created.", {
        description: `New employee has been added as ${watch("position")} in ${watch("company")?.length} companies`,
      });
      router.replace("/employee");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast("Error.", {
        description: "Please fill all required fields correctly.",
        icon: <CircleAlert color="#E9D502" />,
        style: { backgroundColor: "#fcebbb" },
      });
    }
  }, [errors]);

  async function onSubmit(data: any) {
    try {
      const res = await createEmployeeApi({ ...data, costPerHour: hourly_rate }).unwrap();
      console.log("Create Employee Response:", JSON.stringify(res, null, 2));
    } catch (err: any) {
      console.error("Create Employee Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to create employee: " + (err?.data?.message || err.message || "Unknown error"));
    }
  }

  const salary = watch("salary", "");
  const hourly_rate = salary ? (parseFloat(salary) / 207).toFixed(2) : "0.00";

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company: { name: string }) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        <main className="grid gap-3 md:gap-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <h1 className="flex-1 text-xl font-semibold text-gray-800">
                  Create Employee
                </h1>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-3 py-1 text-sm"
                    type="button"
                    onClick={() => router.replace("/employee")}
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                    disabled={isSubmitting}
                  >
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-4 md:col-span-2">
                  <Card className="bg-white shadow-lg rounded-xl border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        Employee Details
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Enter the employee details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                          placeholder="Hamdan Al Maktoom"
                          {...register("name")}
                        />
                        {errors.name && <ErrorMessage message={errors.name.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                          placeholder="example@gmail.com"
                          {...register("email")}
                        />
                        {errors.email && <ErrorMessage message={errors.email.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="access" className="text-sm font-medium text-gray-700">
                          Access Levels
                        </Label>
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
                                        ? [...(field.value || []), level.id]
                                        : field.value?.filter((v: any) => v !== level.id);
                                      field.onChange(newAccess);
                                    }}
                                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <Label htmlFor={level.id} className="text-sm text-gray-800">
                                    {level.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                        {errors.access && <ErrorMessage message={errors.access.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                          Location
                        </Label>
                        <Input
                          id="location"
                          type="text"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                          placeholder="Dubai, Abu Dhabi, Sharjah"
                          {...register("location")}
                        />
                        {errors.location && <ErrorMessage message={errors.location.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                          Contact
                        </Label>
                        <Input
                          id="contact"
                          type="tel"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                          placeholder="+971 999999999"
                          {...register("contact")}
                        />
                        {errors.contact && <ErrorMessage message={errors.contact.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 min-h-24"
                          placeholder="Enter employee description"
                          {...register("description")}
                        />
                        {errors.description && <ErrorMessage message={errors.description.message?.toString()} />}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white shadow-lg rounded-xl border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        Company Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                          Companies
                        </Label>
                        <Controller
                          name="company"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <div className="relative">
                              <div
                                className="w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 cursor-pointer p-2 flex flex-wrap gap-1 min-h-[38px]"
                                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                              >
                                {field.value?.length > 0 ? (
                                  field.value.map((companyId: string) => {
                                    const company = companies.find((c: any) => c._id === companyId);
                                    return (
                                      <span
                                        key={companyId}
                                        className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-md"
                                      >
                                        {company?.name || companyId}
                                        <button
                                          type="button"
                                          className="ml-1 text-gray-500 hover:text-gray-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            field.onChange(field.value.filter((id: string) => id !== companyId));
                                            console.log("Selected Companies:", field.value.filter((id: string) => id !== companyId));
                                          }}
                                        >
                                          &times;
                                        </button>
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-gray-500">Select companies</span>
                                )}
                              </div>
                              {isCompanyDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  <div className="p-2 border-b border-gray-200">
                                    <div className="relative">
                                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                      <Input
                                        type="text"
                                        placeholder="Search companies..."
                                        className="w-full pl-8 rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                                        value={companySearch}
                                        onChange={(e) => setCompanySearch(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </div>
                                  {isCompaniesLoading ? (
                                    <div className="p-2">
                                      {Array.from({ length: 3 }).map((_, index) => (
                                        <Skeleton key={index} className="h-8 w-full rounded-lg mb-1" />
                                      ))}
                                    </div>
                                  ) : filteredCompanies.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-600">No companies found</div>
                                  ) : (
                                    filteredCompanies.map((company: { _id: string; name: string }) => (
                                      <div
                                        key={company._id}
                                        className={`p-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer ${
                                          field.value.includes(company._id) ? "bg-blue-50" : ""
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newValue = field.value.includes(company._id)
                                            ? field.value.filter((id: string) => id !== company._id)
                                            : [...field.value, company._id];
                                          field.onChange(newValue);
                                          console.log("Selected Companies:", newValue);
                                        }}
                                      >
                                        {company.name}
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        />
                        {errors.company && <ErrorMessage message={errors.company.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                          Designation
                        </Label>
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
                                id="position"
                                className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                              >
                                <SelectValue placeholder="Select designation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sales Member">Sales Member</SelectItem>
                                <SelectItem value="Team Leads">Team Leads</SelectItem>
                                <SelectItem value="Team Members">Team Members</SelectItem>
                                <SelectItem value="Sub-Contractors">Sub-Contractors</SelectItem>
                                <SelectItem value="Accountant Members">Accountant Members</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.position && <ErrorMessage message={errors.position.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                          Salary (AED)
                        </Label>
                        <Input
                          id="salary"
                          type="number"
                          className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                          placeholder="5000"
                          {...register("salary")}
                        />
                        {errors.salary && <ErrorMessage message={errors.salary.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                          Currency
                        </Label>
                        <Controller
                          name="currency"
                          control={control}
                          defaultValue="AED"
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger
                                id="currency"
                                className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                              >
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AED">AED</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.currency && <ErrorMessage message={errors.currency.message?.toString()} />}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hourly" className="text-sm font-medium text-gray-700">
                          Hourly Rate
                        </Label>
                        <p className="text-sm font-semibold text-gray-800">{`${hourly_rate} AED / hour`}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4">
                  <Card className="bg-white shadow-lg rounded-xl border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        Employee Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                          Status
                        </Label>
                        <Controller
                          name="status"
                          control={control}
                          defaultValue={true}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => field.onChange(value === "Active")}
                              value={field.value ? "Active" : "Inactive"}
                            >
                              <SelectTrigger
                                id="status"
                                className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.status && <ErrorMessage message={errors.status.message?.toString()} />}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}