"use client"; // Ensure client-side rendering

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
import { useCreateTaskMutation } from "@/redux/query/paymentApi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  const TaskSchema = z.object({
    task_brief: z.string().min(1, "Task brief is required"),
    weightage: z.string().min(1, "Weightage is required"),
    due_date: z.date({
      required_error: "A due date is required.",
    }),
    remarks: z.string().min(1, "Remarks are required"),
    status: z.string().min(1, "Status is required"),
    assigne: z.string().min(1, "Assignee is required"),
  });

  const form = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      task_brief: "",
      weightage: "",
      due_date: undefined,
      remarks: "",
      status: "",
      assigne: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const [employee, setEmployee] = useState([]);
  const [open, setOpen] = useState(false); 
  const [employeeApi, { data, isSuccess }] = useEmployeeMutation();
  const [createTaskApi] = useCreateTaskMutation();

  const getEmployes = async () => {
    const res = await employeeApi({page : 1 });
    console.log(res , "EMP")
  };

  useEffect(() => {
    getEmployes();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setEmployee(data?.results);
    }
  }, [isSuccess]);

  async function onSubmit(data: any) {
    // console.log(data)
    if (!ball?.payment_id) {
      toast("Warning", {
        description:
          "Please select the payment ball in which you want to create the task.",
      });
    } else {
      const res = await createTaskApi({
        data: { ...data, payment_ball: ball?.payment_id ,  due_date: format(new Date(data.due_date), 'yyyy-MM-dd'), },
      });
      console.log(res , "REESS")
      if (res?.data) {
        setIsDialogOpen(false);
        toast("Success", {
          description: "Task created successfully!",
        });
      }
      getTasks(ball?.payment_id);
    }
  }

  return (
    <Dialog  open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill out the form below to create tasks and assign.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 border p-5 rounded-lg shadow-lg">
              <div className="text-gray-500 text-xs">
                <div>
                  Job Id:{" "}
                  <span className="text-gray-700 text-sm">{details?.job_id}</span>
                </div>
                <div>
                  Job Number:{" "}
                  <span className="text-gray-700 text-sm">
                    {details?.job_number}
                  </span>
                </div>
                <div>
                  Deadline:{" "}
                  <span className="text-gray-700 text-sm">
                    {formatDate(details?.delivery_timelines)}
                  </span>
                </div>
              </div>
              <FormField
                control={control}
                name="task_brief"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="task_brief">Task brief</Label>
                    <Input
                      id="task_brief"
                      type="text"
                      className="w-full"
                      {...field}
                    />
                    <FormMessage>{errors.task_brief?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
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
                    <FormMessage>{errors.weightage?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
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
                            field.onChange(date); // Update form value
                            setOpen(false); // Close calendar
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{errors.due_date?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="assigne"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="employee">Employee</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="assigne" aria-label="Select Employee">
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employee.map((data: any, index) => (
                          <SelectItem key={index} value={data.url}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.assigne?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="Status" aria-label="Select Status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="InProgress">InProgress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{errors.status?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="remarks">Remark</Label>
                    <Textarea
                      id="remarks"
                      className="min-h-32"
                      {...field}
                    />
                    <FormMessage>{errors.remarks?.message}</FormMessage>
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
              <Button aria-label="Create task" size="sm" type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTask;