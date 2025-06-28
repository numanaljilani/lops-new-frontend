"use client";

import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEmployeeMutation } from "@/redux/query/employee";
import { formatDate } from "@/lib/dateFormat";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCreateSubcontractTaskMutation } from "@/redux/query/subcontractor";
import { useCreateTaskMutation } from "@/redux/query/taskApi";

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
  const [assignmentType, setAssignmentType] = useState<"employee" | "subcontractor">("employee");
  const [subcontractors, setSubcontractors] = useState([]);
  
  // Employee Task Schema
  const EmployeeTaskSchema = z.object({
    task_brief: z.string().min(1, "Task brief is required"),
    weightage: z.string().min(1, "Weightage is required"),
    due_date: z.date({
      required_error: "A due date is required.",
    }),
    remarks: z.string().min(1, "Remarks are required"),
    status: z.string().min(1, "Status is required"),
    assigne: z.string().min(1, "Assignee is required"),
  });

  // Subcontractor Task Schema
  const SubcontractorTaskSchema = z.object({
    subcontract_brief: z.string().min(1, "Subcontract brief is required"),
    weightage: z.string().min(1, "Weightage is required").max(100,"max weightage is 100"),
    due_date: z.date({
      required_error: "A due date is required.",
    }),
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

  const [employee, setEmployee] = useState([]);
  const [open, setOpen] = useState(false); 
  const [employeeApi, { data: employeeData, isSuccess: employeeSuccess }] = useEmployeeMutation();
  const [subcontractorApi, { data: subcontractorData, isSuccess: subcontractorSuccess }] = useEmployeeMutation(); // Adjust this to your actual subcontractor API
  const [createTaskApi] = useCreateTaskMutation();
  const [createSubcontractTaskApi] = useCreateSubcontractTaskMutation();

  const getEmployees = async () => {
    const res = await employeeApi({ page: 1 });
    // console.log(res, "EMP");
  };
  // console.log(details)
    

  const getSubcontractors = async () => {
    const res = await subcontractorApi({ page: 1 }); // Adjust to your subcontractor API call
    // console.log(res, "Subcontractors");
  };

  useEffect(() => {
    getEmployees();
    getSubcontractors();
  }, []);

  useEffect(() => {
    // console.log(employeeData , "EMPLOYEE DATA")
    if (employeeSuccess && employeeData) {
     
      setEmployee(employeeData?.data);
    }
    if (subcontractorSuccess && subcontractorData) {
      setSubcontractors(subcontractorData?.results);
    }
  }, [employeeSuccess, subcontractorSuccess]);

  async function onSubmitEmployeeTask(data: any) {
    if (!ball?._id) {
      toast("Warning", {
        description: "Please select the payment ball in which you want to create the task.",
      });
    } else {
      const res : any = await createTaskApi({
        data: { ...data, paymentId: ball?._id, due_date: format(new Date(data.due_date), 'yyyy-MM-dd') },
      });
      console.log(res , "response")
      if (res?.data) {
        setIsDialogOpen(false);
        toast("Success", {
          description: "Task created successfully!",
        });
      }
      if(res.error){
            toast("Success", {
          description: res?.error?.data?.message || "Something went wrong.",
        });
      }
      getTasks(ball?._id);
    }
  }

  async function onSubmitSubcontractorTask(data: any) {
    if (!ball?.payment_id) {
      toast("Warning", {
        description: "Please select the payment ball in which you want to create the task.",
      });
    } else {
      const res = await createSubcontractTaskApi({
        data: { 
          ...data, 
          payment_ball: ball?.payment_id, 
          due_date: format(new Date(data.due_date), 'yyyy-MM-dd'),
          contract_amount: parseFloat(data.contract_amount),
          weightage: parseFloat(data.weightage),
          completion_percentage: data.completion_percentage ? parseFloat(data.completion_percentage) : 0,
        },
      });
      console.log(res , "response")
      if (res?.data) {
        setIsDialogOpen(false);
        toast("Success", {
          description: "Subcontract task created successfully!",
        });
      }
      getTasks(ball?.payment_id);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Select task type and fill out the form to create tasks.
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          defaultValue="employee" 
          className="w-full"
          onValueChange={(value) => setAssignmentType(value as "employee" | "subcontractor")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee">Assign to Employee</TabsTrigger>
            <TabsTrigger value="subcontractor">Assign to Subcontractor</TabsTrigger>
          </TabsList>

          <TabsContent value="employee">
            <Form {...taskForm}>
              <form onSubmit={taskForm.handleSubmit(onSubmitEmployeeTask)}>
                <div className="space-y-4 border p-5 rounded-lg shadow-lg">
                  <div className="text-gray-500 text-xs">
                    <div>
                      Job Id: <span className="text-gray-700 text-sm">{details?.projectId}</span>
                    </div>
                    <div>
                      Job Number: <span className="text-gray-700 text-sm">{details?.lpo_number}</span>
                    </div>
                    <div>
                      Deadline: <span className="text-gray-700 text-sm">{formatDate(details?.delivery_timelines)}</span>
                    </div>
                  </div>

                  <FormField
                    control={taskForm.control}
                    name="task_brief"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="task_brief">Task brief</Label>
                        <Input id="task_brief" type="text" className="w-full" {...field} />
                        <FormMessage>{taskForm.formState.errors.task_brief?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="task">Task Weightage</Label>
                        <div className="space-y-2">
                          <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                            <Input
                              id="task"
                              aria-label="Task Weightage"
                              className="-me-px rounded-e-none ps-6 shadow-none"
                              placeholder="0.00"
                              type="text"
                              {...field}
                            />
                            <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <FormMessage>{taskForm.formState.errors.weightage?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto z-[1000] p-0" align="start">
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
                        <FormMessage>{taskForm.formState.errors.due_date?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="assigne"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="employee">Employee</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="assigne" aria-label="Select Employee">
                            <SelectValue placeholder="Select Employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employee?.map((data: any, index) => (
                              <SelectItem key={index} value={data._id}>
                                {data?.user?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{taskForm.formState.errors.assigne?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="Status" aria-label="Select Status">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">InProgress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage>{taskForm.formState.errors.status?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="remarks">Remark</Label>
                        <Textarea id="remarks" className="min-h-32" {...field} />
                        <FormMessage>{taskForm.formState.errors.remarks?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-6">
                  <Button
                    aria-label="Cancel creating task"
                    variant={"secondary"}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    aria-label="Create task" 
                    size="sm" 
                    type="submit"
                    disabled={taskForm.formState.isSubmitting}
                  >
                    {taskForm.formState.isSubmitting ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="subcontractor">
            <Form {...subcontractorForm}>
              <form onSubmit={subcontractorForm.handleSubmit(onSubmitSubcontractorTask)}>
                <div className="space-y-4 border p-5 rounded-lg shadow-lg">
                  <div className="text-gray-500 text-xs">
                    <div>
                      Job Id: <span className="text-gray-700 text-sm">{details?.projectId}</span>
                    </div>
                    <div>
                      Job Number: <span className="text-gray-700 text-sm">{details?.lpo_numberlpo_numberlpo_number}</span>
                    </div>
                    <div>
                      Deadline: <span className="text-gray-700 text-sm">{formatDate(details?.delivery_timelines)}</span>
                    </div>
                  </div>

                  <FormField
                    control={subcontractorForm.control}
                    name="subcontract_brief"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="subcontract_brief">Subcontract Brief</Label>
                        <Input id="subcontract_brief" type="text" className="w-full" {...field} />
                        <FormMessage>{subcontractorForm.formState.errors.subcontract_brief?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="weightage">Weightage</Label>
                        <div className="space-y-2">
                          <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                            <Input
                              id="weightage"
                              aria-label="Weightage"
                              className="-me-px rounded-e-none ps-6 shadow-none"
                              placeholder="0.00"
                              type="text"
                              {...field}
                            />
                            <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <FormMessage>{subcontractorForm.formState.errors.weightage?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="contract_amount"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="contract_amount">Contract Amount</Label>
                        <Input
                          id="contract_amount"
                          type="text"
                          placeholder="0.00"
                          {...field}
                        />
                        <FormMessage>{subcontractorForm.formState.errors.contract_amount?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto z-[1000] p-0" align="start">
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
                        <FormMessage>{subcontractorForm.formState.errors.due_date?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="subcontractor"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="subcontractor">Subcontractor</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="subcontractor" aria-label="Select Subcontractor">
                            <SelectValue placeholder="Select Subcontractor" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcontractors?.map((data: any, index) => (
                              <SelectItem key={index} value={data.url}>
                                {data.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{subcontractorForm.formState.errors.subcontractor?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="Status" aria-label="Select Status">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="InProgress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Awarded">Awarded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage>{subcontractorForm.formState.errors.status?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="is_awarded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <Label htmlFor="is_awarded">Awarded</Label>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="is_awarded" className="text-sm font-medium leading-none">
                              {field.value ? "Yes" : "No"}
                            </Label>
                            <input
                              type="checkbox"
                              id="is_awarded"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                        <Label htmlFor="completion_percentage">Completion Percentage</Label>
                        <div className="space-y-2">
                          <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                            <Input
                              id="completion_percentage"
                              aria-label="Completion Percentage"
                              className="-me-px rounded-e-none ps-6 shadow-none"
                              placeholder="0.00"
                              type="text"
                              {...field}
                            />
                            <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <FormMessage>{subcontractorForm.formState.errors.completion_percentage?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={subcontractorForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="remarks">Remark</Label>
                        <Textarea id="remarks" className="min-h-32" {...field} />
                        <FormMessage>{subcontractorForm.formState.errors.remarks?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-6">
                  <Button
                    aria-label="Cancel creating task"
                    variant={"secondary"}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    aria-label="Create subcontract task" 
                    size="sm" 
                    type="submit"
                    disabled={subcontractorForm.formState.isSubmitting}
                  >
                    {subcontractorForm.formState.isSubmitting ? "Creating..." : "Create Subcontract Task"}
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