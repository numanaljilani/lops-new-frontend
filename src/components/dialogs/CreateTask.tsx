"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEmployeeMutation } from "@/redux/query/employee";
import { formatDate } from "@/lib/dateFormat";
import { useParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCreateSubcontractTaskMutation } from "@/redux/query/subcontractor";
import { useCreateTaskMutation } from "@/redux/query/taskApi";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function ErrorMessage({ message }: { message: string }) {
  return <p className="text-xs text-red-500">{message}</p>;
}

function CreateTask({
  isDialogOpen,
  setIsDialogOpen,
  details,
  ball,
  getTasks,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  details: any;
  ball: any;
  getTasks: any;
}) {
  const params = useParams();
  const [assignmentType, setAssignmentType] = useState<
    "employee" | "subcontractor"
  >("employee");
  const [employee, setEmployee] = useState<any[]>([]);
  const [defaultEmployeeOptions, setDefaultEmployeeOptions] = useState<any[]>(
    []
  );
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const [subcontractors, setSubcontractors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const EmployeeTaskSchema = z.object({
    task_brief: z.string().min(1, "Task brief is required"),
    weightage: z.string().min(1, "Weightage is required"),
    due_date: z.date({ required_error: "A due date is required." }),
    remarks: z.string().min(1, "Remarks are required"),
    status: z.string().min(1, "Status is required"),
    assigne: z.string().min(1, "Assignee is required"),
  });

  const SubcontractorTaskSchema = z.object({
    subcontract_brief: z.string().min(1, "Subcontract brief is required"),
    weightage: z
      .string()
      .min(1, "Weightage is required")
      .max(100, "Max weightage is 100"),
    due_date: z.date({ required_error: "A due date is required." }),
    status: z.string().min(1, "Status is required"),
    subcontractor: z.string().min(1, "Subcontractor is required"),
    contract_amount: z.string().min(1, "Contract amount is required"),
    remarks: z.string().min(1, "Remarks are required"),
    completion_percentage: z.string().optional(),
    is_awarded: z.boolean().default(false),
  });

  const taskForm = useForm({
    resolver: zodResolver(EmployeeTaskSchema),
    defaultValues: {
      task_brief: "",
      weightage: "",
      due_date: undefined,
      remarks: "",
      status: "",
      assigne: "",
    },
  });

  const subcontractorForm = useForm({
    resolver: zodResolver(SubcontractorTaskSchema),
    defaultValues: {
      subcontract_brief: "",
      weightage: "",
      due_date: undefined,
      status: "",
      subcontractor: "",
      contract_amount: "",
      remarks: "",
      completion_percentage: "",
      is_awarded: false,
    },
  });

  const {
    control,
    formState: { errors },
  } = taskForm;

  const [
    employeeApi,
    {
      data: employeeData,
      isSuccess: employeeSuccess,
      isError: employeeIsError,
      error: employeeError,
    },
  ] = useEmployeeMutation();
  const [
    subcontractorApi,
    {
      data: subcontractorData,
      isSuccess: subcontractorSuccess,
      isError: subcontractorIsError,
      error: subcontractorError,
    },
  ] = useEmployeeMutation();
  const [createTaskApi] = useCreateTaskMutation();
  const [createSubcontractTaskApi] = useCreateSubcontractTaskMutation();

  const getEmployees = async () => {
    try {
      setIsEmployeeLoading(true);
      const res = await employeeApi({ page: 1 }).unwrap();
      console.log("Employees API Response:", JSON.stringify(res, null, 2));
      setEmployee(res?.data || []);
      const options =
        res?.data?.slice(0, 10).map((emp: any) => ({
          value: emp._id,
          label: emp.user.name,
        })) || [];
      setDefaultEmployeeOptions(options);
    } catch (err: any) {
      console.error("Employees Fetch Error:", JSON.stringify(err, null, 2));
      toast.error(
        `Failed to fetch employees: ${
          err?.data?.message || err.message || "Unknown error"
        }`,
        {
          style: { backgroundColor: "#fcebbb" },
        }
      );
      setEmployee([]);
      setDefaultEmployeeOptions([]);
    } finally {
      setIsEmployeeLoading(false);
    }
  };

  const getSubcontractors = async () => {
    try {
      const res = await subcontractorApi({ page: 1 }).unwrap();
      console.log("Subcontractors API Response:", JSON.stringify(res, null, 2));
      setSubcontractors(res?.results || []);
    } catch (err: any) {
      console.error(
        "Subcontractors Fetch Error:",
        JSON.stringify(err, null, 2)
      );
      toast.error(
        `Failed to fetch subcontractors: ${
          err?.data?.message || err.message || "Unknown error"
        }`,
        {
          style: { backgroundColor: "#fcebbb" },
        }
      );
      setSubcontractors([]);
    }
  };

  const loadEmployees = useCallback(
    debounce(async (inputValue: string, callback: (options: any[]) => void) => {
      try {
        setIsEmployeeLoading(true);
        const res = await employeeApi({ page: 1, search: inputValue }).unwrap();
        console.log(
          "Employee Search API Response:",
          JSON.stringify(res, null, 2)
        );
        callback(
          res?.data?.map((emp: any) => ({
            value: emp._id,
            label: emp.user.name,
          })) || []
        );
      } catch (err: any) {
        console.error("Employee Search Error:", JSON.stringify(err, null, 2));
        toast.error(
          `Failed to search employees: ${
            err?.data?.message || err.message || "Unknown error"
          }`,
          {
            style: { backgroundColor: "#fcebbb" },
          }
        );
        callback([]);
      } finally {
        setIsEmployeeLoading(false);
      }
    }, 500),
    [employeeApi]
  );

  const getEmployeeLabel = (id: string) => {
    const emp = employee.find((e: any) => e._id === id);
    return emp ? emp.user.name : id;
  };

  useEffect(() => {
    getEmployees();
    getSubcontractors();
  }, []);

  useEffect(() => {
    if (employeeSuccess && employeeData) {
      setEmployee(employeeData?.data || []);
      setDefaultEmployeeOptions(
        employeeData?.data?.slice(0, 10).map((emp: any) => ({
          value: emp._id,
          label: emp.user.name,
        })) || []
      );
    }
    if (subcontractorSuccess && subcontractorData) {
      setSubcontractors(subcontractorData?.results || []);
    }
  }, [employeeSuccess, employeeData, subcontractorSuccess, subcontractorData]);

  async function onSubmitEmployeeTask(data: any) {
    if (!ball?._id) {
      toast.error("Warning", {
        description:
          "Please select the payment ball in which you want to create the task.",
        style: { backgroundColor: "#fcebbb" },
      });
      return;
    }
    try {
      const res: any = await createTaskApi({
        data: {
          ...data,
          paymentId: ball?._id,
          due_date: format(new Date(data.due_date), "yyyy-MM-dd"),
        },
      }).unwrap();
      console.log("Create Task Response:", JSON.stringify(res, null, 2));
      setIsDialogOpen(false);
      toast.success("Task created successfully!", {
        style: {
          backgroundColor: "#d4edda",
          color: "green",
          borderColor: "green",
        },
      });
      getTasks(ball?._id);
    } catch (err: any) {
      console.error("Create Task Error:", JSON.stringify(err, null, 2));
      toast.error(
        `Failed to create task: ${
          err?.data?.message || err.message || "Unknown error"
        }`,
        {
          style: { backgroundColor: "#fcebbb" },
        }
      );
    }
  }

  async function onSubmitSubcontractorTask(data: any) {
    if (!ball?.payment_id) {
      toast.error("Warning", {
        description:
          "Please select the payment ball in which you want to create the task.",
        style: { backgroundColor: "#fcebbb" },
      });
      return;
    }
    try {
      const res = await createSubcontractTaskApi({
        data: {
          ...data,
          payment_ball: ball?.payment_id,
          due_date: format(new Date(data.due_date), "yyyy-MM-dd"),
          contract_amount: parseFloat(data.contract_amount),
          weightage: parseFloat(data.weightage),
          completion_percentage: data.completion_percentage
            ? parseFloat(data.completion_percentage)
            : 0,
        },
      }).unwrap();
      console.log(
        "Create Subcontract Task Response:",
        JSON.stringify(res, null, 2)
      );
      setIsDialogOpen(false);
      toast.success("Subcontract task created successfully!", {
        style: {
          backgroundColor: "#d4edda",
          color: "green",
          borderColor: "green",
        },
      });
      getTasks(ball?.payment_id);
    } catch (err: any) {
      console.error(
        "Create Subcontract Task Error:",
        JSON.stringify(err, null, 2)
      );
      toast.error(
        `Failed to create subcontract task: ${
          err?.data?.message || err.message || "Unknown error"
        }`,
        {
          style: { backgroundColor: "#fcebbb" },
        }
      );
    }
  }

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: errors.assigne ? "red" : "#d1d5db",
      "&:hover": { borderColor: errors.assigne ? "red" : "#d1d5db" },
      borderRadius: "0.375rem",
      padding: "0.25rem",
      boxShadow: errors.assigne ? "0 0 0 1px red" : base.boxShadow,
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      maxHeight: "15rem",
      overflowY: "auto",
    }),
    option: (base: any, { isFocused }: any) => ({
      ...base,
      backgroundColor: isFocused ? "#f9fafb" : "white",
      color: "#1f2937",
      fontSize: "0.875rem",
    }),
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <Toaster richColors position="top-right" />
      <DialogContent className="overflow-x-scroll no-scrollbar border border-gray-300 rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Create Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Select task type and fill out the form to create tasks.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="employee"
          className="w-full"
          onValueChange={(value) =>
            setAssignmentType(value as "employee" | "subcontractor")
          }
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
            <TabsTrigger
              value="employee"
              className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
            >
              Assign to Employee
            </TabsTrigger>
            {/* <TabsTrigger
              value="subcontractor"
              className="text-sm text-gray-800 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-md"
            >
              Assign to Subcontractor
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="employee">
            <Form {...taskForm}>
              <form onSubmit={taskForm.handleSubmit(onSubmitEmployeeTask)}>
                <div className="space-y-4 border border-gray-200 p-5 rounded-lg shadow-lg bg-white">
                  <div className="text-gray-500 text-xs">
                    <div>
                      Job Id:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.projectId || "-"}
                      </span>
                    </div>
                    <div>
                      Job Number:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.lpo_number || "-"}
                      </span>
                    </div>
                    <div>
                      Deadline:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.delivery_timelines
                          ? formatDate(details.delivery_timelines)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <FormField
                    control={taskForm.control}
                    name="task_brief"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="task_brief"
                          className="text-sm text-gray-700"
                        >
                          Task Brief
                        </Label>
                        <Input
                          id="task_brief"
                          type="text"
                          className="w-full border-gray-300 text-sm focus:ring-blue-500"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="weightage"
                          className="text-sm text-gray-700"
                        >
                          Task Weightage
                        </Label>
                        <div className="relative flex rounded-lg">
                          <Input
                            id="weightage"
                            className="rounded-e-none border-gray-300 text-sm focus:ring-blue-500"
                            placeholder="0.00"
                            type="text"
                            {...field}
                          />
                          <span className="inline-flex items-center rounded-e-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                            %
                          </span>
                        </div>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label
                          htmlFor="due_date"
                          className="text-sm text-gray-700"
                        >
                          Due Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] pl-3 text-left text-sm border-gray-300",
                                  !field.value && "text-gray-500"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "dd/MM/yyyy")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto z-[1000] p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-3">
                    <Label htmlFor="assigne" className="text-sm text-gray-700">
                      Employee
                    </Label>
                    <Controller
                      name="assigne"
                      control={control}
                      render={({ field }) => (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={defaultEmployeeOptions}
                          // @ts-ignore
                          loadOptions={loadEmployees}
                          isLoading={isEmployeeLoading}
                          placeholder="Search for an employee..."
                          noOptionsMessage={() => "No employees found"}
                          onChange={(option) =>
                            field.onChange(option ? option.value : "")
                          }
                          value={
                            field.value
                              ? {
                                  value: field.value,
                                  label: getEmployeeLabel(field.value),
                                }
                              : null
                          }
                          isClearable
                          isSearchable
                          styles={customStyles}
                        />
                      )}
                    />
                    {errors.assigne && (
                      <ErrorMessage
                        message={
                          errors.assigne.message || "Assignee is required"
                        }
                      />
                    )}
                  </div>

                  <FormField
                    control={taskForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="status"
                          className="text-sm text-gray-700"
                        >
                          Status
                        </Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id="status"
                              className={ "w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}
                            >
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                            <SelectItem
                              value="Pending"
                              className="text-sm text-gray-800 hover:bg-gray-50"
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value="In Progress"
                              className="text-sm text-gray-800 hover:bg-gray-50"
                            >
                              In Progress
                            </SelectItem>
                            <SelectItem
                              value="Completed"
                              className="text-sm text-gray-800 hover:bg-gray-50"
                            >
                              Completed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="remarks"
                          className="text-sm text-gray-700"
                        >
                          Remark
                        </Label>
                        <Textarea
                          id="remarks"
                          className="min-h-32 border-gray-300 text-sm"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-6">
                  <Button
                    variant="secondary"
                    className="h-8 border-gray-300 text-gray-800 hover:bg-gray-100 text-sm rounded-lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                    disabled={taskForm.formState.isSubmitting}
                  >
                    {taskForm.formState.isSubmitting
                      ? "Creating..."
                      : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="subcontractor">
            <Form {...subcontractorForm}>
              <form
                onSubmit={subcontractorForm.handleSubmit(
                  onSubmitSubcontractorTask
                )}
              >
                <div className="space-y-4 border border-gray-200 p-5 rounded-lg shadow-lg bg-white">
                  <div className="text-gray-500 text-xs">
                    <div>
                      Job Id:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.projectId || "-"}
                      </span>
                    </div>
                    <div>
                      Job Number:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.lpo_number || "-"}
                      </span>
                    </div>
                    <div>
                      Deadline:{" "}
                      <span className="text-gray-700 text-sm">
                        {details?.delivery_timelines
                          ? formatDate(details.delivery_timelines)
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <FormField
                    control={subcontractorForm.control}
                    name="subcontract_brief"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="subcontract_brief"
                          className="text-sm text-gray-700"
                        >
                          Subcontract Brief
                        </Label>
                        <Input
                          id="subcontract_brief"
                          type="text"
                          className="w-full border-gray-300 text-sm focus:ring-blue-500"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="weightage"
                          className="text-sm text-gray-700"
                        >
                          Weightage
                        </Label>
                        <div className="relative flex rounded-lg">
                          <Input
                            id="weightage"
                            className="rounded-e-none border-gray-300 text-sm focus:ring-blue-500"
                            placeholder="0.00"
                            type="text"
                            {...field}
                          />
                          <span className="inline-flex items-center rounded-e-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                            %
                          </span>
                        </div>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="contract_amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="contract_amount"
                          className="text-sm text-gray-700"
                        >
                          Contract Amount
                        </Label>
                        <Input
                          id="contract_amount"
                          type="text"
                          placeholder="0.00"
                          className="border-gray-300 text-sm focus:ring-blue-500"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label
                          htmlFor="due_date"
                          className="text-sm text-gray-700"
                        >
                          Due Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] pl-3 text-left text-sm border-gray-300",
                                  !field.value && "text-gray-500"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "dd/MM/yyyy")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto z-[1000] p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="subcontractor"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="subcontractor"
                          className="text-sm text-gray-700"
                        >
                          Subcontractor
                        </Label>
                        <select
                          id="subcontractor"
                          className="w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        >
                          <option value="" disabled>
                            Select Subcontractor
                          </option>
                          {subcontractors?.map((data: any, index) => (
                            <option key={index} value={data.url}>
                              {data.name}
                            </option>
                          ))}
                        </select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="status"
                          className="text-sm text-gray-700"
                        >
                          Status
                        </Label>
                        <select
                          id="status"
                          className="w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        >
                          <option value="" disabled>
                            Select Status
                          </option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Awarded">Awarded</option>
                        </select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="is_awarded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                        <Label
                          htmlFor="is_awarded"
                          className="text-sm text-gray-700"
                        >
                          Awarded
                        </Label>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="is_awarded"
                              className="text-sm font-medium text-gray-700"
                            >
                              {field.value ? "Yes" : "No"}
                            </Label>
                            <input
                              type="checkbox"
                              id="is_awarded"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="completion_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="completion_percentage"
                          className="text-sm text-gray-700"
                        >
                          Completion Percentage
                        </Label>
                        <div className="relative flex rounded-lg">
                          <Input
                            id="completion_percentage"
                            className="rounded-e-none border-gray-300 text-sm focus:ring-blue-500"
                            placeholder="0.00"
                            type="text"
                            {...field}
                          />
                          <span className="inline-flex items-center rounded-e-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                            %
                          </span>
                        </div>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <Label
                          htmlFor="remarks"
                          className="text-sm text-gray-700"
                        >
                          Remark
                        </Label>
                        <Textarea
                          id="remarks"
                          className="min-h-32 border-gray-300 text-sm"
                          {...field}
                        />
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-6">
                  <Button
                    variant="secondary"
                    className="h-8 border-gray-300 text-gray-800 hover:bg-gray-100 text-sm rounded-lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                    disabled={subcontractorForm.formState.isSubmitting}
                  >
                    {subcontractorForm.formState.isSubmitting
                      ? "Creating..."
                      : "Create Subcontract Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTask;
