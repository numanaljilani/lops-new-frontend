"use client";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useComponiesMutation } from "@/redux/query/componiesApi";
import {
  useEmployeeDetailsMutation,
  usePatchEmployeeMutation,
} from "@/redux/query/employee";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import {
  useDeleteTimesheetMutation,
  useTimesheetMutation,
} from "@/redux/query/timesheet";
import debounce from "lodash.debounce";
import { addYears, endOfYear, format, startOfYear } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { date, timeFormat } from "@/lib/dateFormat";
import { defaultStaticRanges } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { PaginationComponent } from "@/components/PaginationComponent";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; 

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  contact: z.string().min(1, "Contact number is required"),
  description: z.string().optional(),
  company: z.array(z.string()).min(1, "At least one company is required"),
  position: z.string().min(1, "Designation is required"),
  salary: z.number().min(0, "Salary must be positive"),
  Currency: z.string().default("AED"),
  costPerHour: z.number().min(0, "Hourly rate must be positive"),
  status: z.boolean(),
  access: z.array(z.string()).min(1, "At least one access level is required"),
});

const accessLevels = [
  { id: "admin", label: "Admin" },
  { id: "team lead", label: "Team Lead" },
  { id: "sales", label: "Sales" },
  { id: "subcontractor", label: "Sub Contractor" },
  { id: "accounts", label: "Accounts" },
  { id: "team member", label: "Team Member" },
];

function EmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [updateView, setUpdateView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState<any>({
    userId: { name: "", email: "", access: [] },
    contact: "",
    description: "",
    location: "",
    company: [],
    position: "",
    salary: 0,
    costPerHour: 0,
    Currency: "AED",
    status: false,
  });

  const [
    employeeApi,
    {
      data,
      isSuccess,
      isLoading: isEmployeeLoading,
      error: employeeError,
      isError: isEmployeeError,
    },
  ] = useEmployeeDetailsMutation();
  const [
    patchEmployeeApi,
    {
      isSuccess: patchIsSuccess,
      isLoading: isPatchLoading,
      error: patchError,
      isError: patchIsError,
    },
  ] = usePatchEmployeeMutation();
  const [
    companiesApi,
    {
      data: companiesData,
      isSuccess: companiesIsSuccess,
      isLoading: isCompaniesLoading,
      error: companiesError,
      isError: companiesIsError,
    },
  ] = useComponiesMutation();

  const [companies, setCompanies] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  }: any = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      contact: "",
      description: "",
      company: [],
      position: "",
      salary: 0,
      Currency: "AED",
      costPerHour: 0,
      status: false,
      access: [],
    },
  });

  const salary = watch("salary", 0);
  const costPerHour = salary ? (salary / 207).toFixed(2) : "0.00";

  const getEmployeeDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await employeeApi({ id }).unwrap();
      console.log("Employee API Response:", JSON.stringify(res, null, 2));
      setEmployeeDetails(res.employee);
    } catch (err: any) {
      console.error("Employee Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch employee details", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanies = async () => {
    try {
      const res = await companiesApi({}).unwrap();
      console.log("Companies API Response:", JSON.stringify(res, null, 2));
      setCompanies(res?.data || []);
    } catch (err: any) {
      console.error("Companies Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch companies", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
    }
  };

  const onSubmit = async (data: any) => {
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
          costPerHour: parseFloat(costPerHour),
          Currency: data.Currency,
          status: data.status,
          access: data.access,
        },
      }).unwrap();
      console.log("Update Employee Response:", JSON.stringify(res, null, 2));
      toast.success("Employee Updated", {
        description: `Employee ${data.name} has been updated successfully.`,
        style: { backgroundColor: "#d4edda" },
      });
      setUpdateView(false);
    } catch (err: any) {
      console.error("Update Employee Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to update employee", {
        description: err?.data?.message || err.message || "Unknown error",
        style: { backgroundColor: "#fcebbb" },
      });
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
      setValue("name", emp.userId?.name || "");
      setValue("email", emp.userId?.email || "");
      setValue("location", emp.location || "");
      setValue("contact", emp.contact || "");
      setValue("description", emp.description || "");
      setValue(
        "company",
        Array.isArray(emp.company)
          ? emp.company.map((c: any) => c._id || c)
          : emp.company?._id
          ? [emp.company._id]
          : []
      );
      setValue("position", emp.position || "");
      setValue("salary", emp.salary || 0);
      setValue("Currency", emp.Currency || "AED");
      setValue("costPerHour", emp.costPerHour || 0);
      setValue("status", emp.status || false);
      setValue("access", emp.userId?.access || []);
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

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company: { name: string }) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const selectedCompany = useSelector(
    (state: any) => state?.user?.selectedCompany || null
  );
  const [timesheet, setTimeSheet] = useState([]);
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [
    timeSheetApi,
    {
      data: timeSheetData,
      isSuccess: isTimeSheetSuccess,
      error,
      isError,
      isLoading: isTimeSheetLoading,
    },
  ] = useTimesheetMutation();
  const [deleteTimeSheetApi] = useDeleteTimesheetMutation();

  const getTimeSheetData = async () => {
    if (!selectedCompany?._id) {
      console.error("No company selected");
      setTimeSheet([]);
      return;
    }
    try {
      const params = {
        page,
        userId : id,
        companyId: selectedCompany._id,
        search: searchQuery,
        startDate: dateRange[0].startDate
          ? dateRange[0].startDate.toISOString()
          : undefined,
        endDate: dateRange[0].endDate
          ? dateRange[0].endDate.toISOString()
          : undefined,
      };
      const res = await timeSheetApi(params).unwrap();
      console.log("Timesheet API Response:", JSON.stringify(res, null, 2));
      setTimeSheet(res?.data || []);
    } catch (err: any) {
      console.error("Timesheet Fetch Error:", JSON.stringify(err, null, 2));
      setTimeSheet([]);
    }
  };

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      console.log("Search Input:", query);
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  const handleDateRangeSelect = (ranges: any) => {
    setDateRange([ranges.selection]);
    setPage(1);
    setShowDatePicker(false);
  };

  const handleYearSelect = (year: number) => {
    setDateRange([
      {
        startDate: startOfYear(new Date(year, 0, 1)),
        endDate: endOfYear(new Date(year, 0, 1)),
        key: "selection",
      },
    ]);
    setPage(1);
    setShowDatePicker(false);
  };

  const deleteTimeSheet = async () => {
    if (!itemToDelete?._id) return;
    try {
      console.log("Delete Timesheet ID:", itemToDelete._id);
      await deleteTimeSheetApi({ id: itemToDelete._id }).unwrap();
      setIsDialogOpen(false);
      getTimeSheetData();
    } catch (err: any) {
      console.error("Delete Timesheet Error:", JSON.stringify(err, null, 2));
    }
  };

  const update = async (url: string) => {
    console.log("Update Timesheet ID:", url);
    router.push(`/timesheet/${url}`);
  };

  useEffect(() => {
    getTimeSheetData();
  }, [page, selectedCompany, searchQuery, dateRange]);

  useEffect(() => {
    if (isTimeSheetSuccess && timeSheetData) {
      console.log(
        "Timesheet Data from Server:",
        JSON.stringify(timeSheetData, null, 2)
      );
      setTimeSheet(timeSheetData?.data || []);
    }
  }, [isTimeSheetSuccess, timeSheetData]);
  const formatDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return "Select Date Range";
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getDate() === 1 &&
      startDate.getMonth() === 0 &&
      endDate.getDate() === 31 &&
      endDate.getMonth() === 11
    ) {
      return startDate.getFullYear().toString();
    }
    return `${format(startDate, "MMM d, yyyy")} - ${format(
      endDate,
      "MMM d, yyyy"
    )}`;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-3 p-3 sm:p-4 w-full">
        {updateView ? (
          <main className="grid gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">
                Update Employee
              </h1>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setUpdateView(false)}
                  disabled={isPatchLoading}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPatchLoading}
                >
                  {isPatchLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isPatchLoading}
                >
                  Delete
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
                  <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="name"
                            type="text"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="Hamdan Al Maktoom"
                            {...register("name")}
                          />
                          {errors.name && (
                            <ErrorMessage message={errors.name.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="email"
                            type="email"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="example@gmail.com"
                            {...register("email")}
                          />
                          {errors.email && (
                            <ErrorMessage message={errors.email.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label
                        htmlFor="access"
                        className="text-sm font-medium text-gray-700"
                      >
                        Access Levels
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <Controller
                          name="access"
                          control={control}
                          render={({ field }) => (
                            <div className="flex flex-wrap gap-4">
                              {accessLevels.map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    id={level.id}
                                    checked={field.value?.includes(level.id)}
                                    onCheckedChange={(checked) => {
                                      const newAccess = checked
                                        ? [...(field.value || []), level.id]
                                        : field.value?.filter(
                                            (v: any) => v !== level.id
                                          );
                                      field.onChange(newAccess);
                                    }}
                                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  />
                                  <Label
                                    htmlFor={level.id}
                                    className="text-sm text-gray-800"
                                  >
                                    {level.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                      )}
                      {errors.access && (
                        <ErrorMessage message={errors.access.message} />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700"
                      >
                        Location
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="location"
                            type="text"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="Dubai, Abu Dhabi, Sharjah"
                            {...register("location")}
                          />
                          {errors.location && (
                            <ErrorMessage message={errors.location.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="contact"
                        className="text-sm font-medium text-gray-700"
                      >
                        Contact
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="contact"
                            type="tel"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="+971 999999999"
                            {...register("contact")}
                          />
                          {errors.contact && (
                            <ErrorMessage message={errors.contact.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700"
                      >
                        Description
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-24 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Textarea
                            id="description"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 min-h-24"
                            placeholder="Enter employee description"
                            {...register("description")}
                          />
                          {errors.description && (
                            <ErrorMessage
                              message={errors.description.message}
                            />
                          )}
                        </div>
                      )}
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
                      <Label
                        htmlFor="company"
                        className="text-sm font-medium text-gray-700"
                      >
                        Companies
                      </Label>
                      {isCompaniesLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <Controller
                          name="company"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <div
                                className="w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 cursor-pointer p-2 flex flex-wrap gap-1 min-h-[38px]"
                                onClick={() =>
                                  setIsCompanyDropdownOpen(
                                    !isCompanyDropdownOpen
                                  )
                                }
                              >
                                {field.value?.length > 0 ? (
                                  field.value.map((companyId: string) => {
                                    const company = companies.find(
                                      (c: any) => c._id === companyId
                                    );
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
                                            field.onChange(
                                              field.value.filter(
                                                (id: string) => id !== companyId
                                              )
                                            );
                                            console.log(
                                              "Selected Companies:",
                                              field.value.filter(
                                                (id: string) => id !== companyId
                                              )
                                            );
                                          }}
                                        >
                                          ×
                                        </button>
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-gray-500">
                                    Select companies
                                  </span>
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
                                        onChange={(e) =>
                                          setCompanySearch(e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                  </div>
                                  {isCompaniesLoading ? (
                                    <div className="p-2">
                                      {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                          <Skeleton
                                            key={index}
                                            className="h-8 w-full rounded-lg mb-1"
                                          />
                                        )
                                      )}
                                    </div>
                                  ) : filteredCompanies.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-600">
                                      No companies found
                                    </div>
                                  ) : (
                                    filteredCompanies.map(
                                      (company: {
                                        _id: string;
                                        name: string;
                                      }) => (
                                        <div
                                          key={company._id}
                                          className={`p-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer ${
                                            field.value.includes(company._id)
                                              ? "bg-blue-50"
                                              : ""
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const newValue =
                                              field.value.includes(company._id)
                                                ? field.value.filter(
                                                    (id: string) =>
                                                      id !== company._id
                                                  )
                                                : [...field.value, company._id];
                                            field.onChange(newValue);
                                            console.log(
                                              "Selected Companies:",
                                              newValue
                                            );
                                          }}
                                        >
                                          {company.name}
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        />
                      )}
                      {errors.company && (
                        <ErrorMessage message={errors.company.message} />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="position"
                        className="text-sm font-medium text-gray-700"
                      >
                        Designation
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Controller
                            name="position"
                            control={control}
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
                          {errors.position && (
                            <ErrorMessage message={errors.position.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="salary"
                        className="text-sm font-medium text-gray-700"
                      >
                        Salary (AED)
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="salary"
                            type="number"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="5000"
                            {...register("salary", { valueAsNumber: true })}
                          />
                          {errors.salary && (
                            <ErrorMessage message={errors.salary.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="currency"
                        className="text-sm font-medium text-gray-700"
                      >
                        Currency
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Controller
                            name="Currency"
                            control={control}
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
                          {errors.Currency && (
                            <ErrorMessage message={errors.Currency.message} />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="costPerHour"
                        className="text-sm font-medium text-gray-700"
                      >
                        Hourly Rate (AED)
                      </Label>
                      {isLoading ? (
                        <Skeleton className="h-8 w-full rounded-lg" />
                      ) : (
                        <div>
                          <Input
                            id="costPerHour"
                            type="number"
                            className="w-full rounded-lg border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
                            placeholder="20"
                            value={costPerHour}
                            readOnly
                          />
                          {errors.costPerHour && (
                            <ErrorMessage
                              message={errors.costPerHour.message}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setUpdateView(false)}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </Button>
              </div>
            </div>
          </main>
        ) : (
          <main className="grid gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800">Employee</h1>
              <div className="flex gap-2 ml-auto sm:flex-row flex-col">
                <Button
                  size="sm"
                  className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setUpdateView(true)}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white shadow-lg rounded-xl border-none">
                <CardHeader className="p-4">
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Employee Details
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Employee details and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.userId?.name || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.userId?.email || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-700"
                    >
                      Location
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.location || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="contact"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.contact || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-1/2 rounded-lg" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            employeeDetails?.status
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <p className="text-sm font-semibold text-gray-800">
                          {employeeDetails?.status ? "Active" : "Inactive"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="access"
                      className="text-sm font-medium text-gray-700"
                    >
                      Access
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-1/2 rounded-lg" />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {employeeDetails?.userId?.access?.length > 0 ? (
                          employeeDetails.userId.access.map(
                            (name: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-md"
                              >
                                {name}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-600">-</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-20 w-full rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.description || "-"}
                      </p>
                    )}
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
                    <Label
                      htmlFor="company"
                      className="text-sm font-medium text-gray-700"
                    >
                      Companies
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(employeeDetails?.company) &&
                        employeeDetails.company.length > 0 ? (
                          employeeDetails.company.map(
                            (company: any, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-md"
                              >
                                {company?.name || company?._id || "-"}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-600">-</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="position"
                      className="text-sm font-medium text-gray-700"
                    >
                      Designation
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.position || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="salary"
                      className="text-sm font-medium text-gray-700"
                    >
                      Salary (AED)
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.salary || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="currency"
                      className="text-sm font-medium text-gray-700"
                    >
                      Currency
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.Currency || "AED"}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="costPerHour"
                      className="text-sm font-medium text-gray-700"
                    >
                      Hourly Rate (AED)
                    </Label>
                    {isLoading ? (
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">
                        {employeeDetails?.costPerHour || "-"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        )}
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={employeeDetails}
        />

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search by remarks..."
                    className="w-full rounded-lg border-gray-300 pl-8 text-sm focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto h-7 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg px-3 py-1 text-sm"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    {formatDateRange()}
                  </Button>
                  {showDatePicker && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-full sm:w-[600px] max-w-[90vw]">
                      <DateRangePicker
                        ranges={dateRange}
                        onChange={handleDateRangeSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={1}
                        direction="vertical"
                        className="w-full"
                        staticRanges={[
                          ...defaultStaticRanges,
                          {
                            label: "This Year",
                            range: () => ({
                              startDate: startOfYear(new Date()),
                              endDate: endOfYear(new Date()),
                            }),
                            isSelected: (range) =>
                              range.startDate?.getFullYear() ===
                                new Date().getFullYear() &&
                              range.endDate?.getFullYear() ===
                                new Date().getFullYear(),
                          },
                          {
                            label: "Last Year",
                            range: () => ({
                              startDate: startOfYear(addYears(new Date(), -1)),
                              endDate: endOfYear(addYears(new Date(), -1)),
                            }),
                            isSelected: (range) =>
                              range.startDate?.getFullYear() ===
                                addYears(new Date(), -1).getFullYear() &&
                              range.endDate?.getFullYear() ===
                                addYears(new Date(), -1).getFullYear(),
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">

                {/* <Link href="/timesheet/create-timesheet">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add
                    </span>
                  </Button>
                </Link> */}
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Time & Logs</CardTitle>
                  <CardDescription>
                    Manage your Times and logs and view performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead className="hidden md:table-cell">
                          End
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Hours Logged
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Amount
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Remark
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
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
                      ) : timesheet?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-sm text-gray-600">
                              No data available.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        timesheet?.map(
                          (
                            data: {
                              _id: string;
                              created_at: string;
                              startTime: string;
                              endTime: string;
                              date_logged: string;
                              added_date: string;
                              hours_logged: string;
                              remarks: string;
                              total_amount: string;
                              url: string;
                            },
                            index: number
                          ) => (
                            <TableRow key={index} className="cursor-pointer">
                              <TableCell
                                className="font-medium"
                                onClick={() =>
                                  router.push(`/timesheet/${data._id}`)
                                }
                              >
                                {data?.created_at ? date(data.created_at) : "-"}
                              </TableCell>
                              <TableCell
                                onClick={() =>
                                  router.push(`/timesheet/${data._id}`)
                                }
                              >
                                {data?.startTime
                                  ? timeFormat(data.startTime)
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell"
                                onClick={() =>
                                  router.push(`/timesheet/${data._id}`)
                                }
                              >
                                {data?.endTime ? timeFormat(data.endTime) : "-"}
                              </TableCell>
                              <TableCell
                                className="hidden md:table-cell"
                                onClick={() =>
                                  router.push(`/timesheet/${data._id}`)
                                }
                              >
                                {data.hours_logged || "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data?.total_amount
                                  ? Number(data.total_amount).toFixed(2)
                                  : "-"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {data.remarks || "-"}
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
                                      onClick={() => update(data._id)}
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
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <PaginationComponent
                    setPage={setPage}
                    totalPages={timeSheetData?.totalPages || 1}
                    page={timeSheetData?.page || 1}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default EmployeePage;
