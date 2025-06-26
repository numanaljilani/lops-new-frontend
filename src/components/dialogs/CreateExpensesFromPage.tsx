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
import {
  useCreateExpenseMutation,
  useExpensescategoriesMutation,
} from "@/redux/query/expensesApi";
import { useJobsMutation } from "@/redux/query/jobApi";
import { toast } from "sonner";

function CreateExpenseFromPage({
  isDialogOpen,
  setIsDialogOpen,
  data: jobData,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);

  const ExpensesSchema = z.object({
    projectId: z.string().min(1, "Project is required"),
    category_display: z.string().min(1, "Category is required"),
    expense_type: z.string().min(1, "Expense type is required"),
    net_amount: z.number().positive("Net amount must be positive"),
    vat_percentage: z.number().default(5),
    vat_amount: z.number().min(0, "VAT amount cannot be negative"),
    amount: z.number().positive("Total amount must be positive"),
    payment_mode: z.enum(["Cash", "Bank Transfer", "Cheque"], {
      errorMap: () => ({ message: "Invalid payment mode" }),
    }),
    payment_date: z.string().optional(),
    paid_amount: z.number().min(0).default(0),
    balance_amount: z.number().min(0).default(0),
    due_date: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    status: z.enum(["Pending", "Partially Paid", "Paid"]).default("Pending"),
    remarks: z.string().optional(),
  });

  const [createExpense, { data: res, isSuccess, error, isError }] =
    useCreateExpenseMutation();
  const [expensesCategories, { data: expRes }] =
    useExpensescategoriesMutation();
  const [jobApi, { data, isSuccess: isJobCardSuccess }] = useJobsMutation();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  }: any = useForm({
    resolver: zodResolver(ExpensesSchema),
    defaultValues: {
      vat_percentage: 5,
      status: "Pending",
      paid_amount: 0,
      balance_amount: 0,
    },
  });

  const net_amount = watch("net_amount");
  const vat_percentage = watch("vat_percentage");

  useEffect(() => {
    if (net_amount && vat_percentage) {
      const vat_amount = (net_amount * vat_percentage) / 100;
      const total_amount = net_amount + vat_amount;
      setValue("vat_amount", parseFloat(vat_amount.toFixed(2)));
      setValue("amount", parseFloat(total_amount.toFixed(2)));
      setValue("balance_amount", parseFloat(total_amount.toFixed(2)));
    }
  }, [net_amount, vat_percentage, setValue]);



  const getJobs = async () => {
    const res = await jobApi({});
    if (res.data) {
      setJobs(res.data.data);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: "Failed to add expense due to server issue.",
      });
    }
    if (isSuccess) {
      toast.success("Success", {
        description: "Expense added successfully.",
      });
      setIsDialogOpen(false);
    }
  }, [isError, isSuccess, setIsDialogOpen]);

  async function onSubmit(data: any) {
    try {
      const response = await createExpense({
        data: {
          ...data,
          net_amount: parseFloat(data.net_amount),
          amount: parseFloat(data.amount),
          paid_amount: parseFloat(data.paid_amount),
          balance_amount: parseFloat(data.balance_amount),
          vat_amount: parseFloat(data.vat_amount),
          payment_date: data.payment_date || undefined,
          due_date: data.due_date || undefined,
        },
      });
      if ("error" in response) {
        throw new Error("Failed to create expense");
      }
    } catch (err) {
      toast.error("Error", {
        description: "Failed to add expense.",
      });
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Fill the form to add an expense to the related project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div className="grid gap-3">
              <Label htmlFor="projectId">Project</Label>
              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="projectId">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs?.length > 0 ? (
                        jobs?.map((job: any) => (
                          <SelectItem key={job._id} value={job._id}>
                            {job.projectId}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="-" disabled>
                          No projects available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.projectId && (
                <p className="text-red-500 text-sm">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="category_display">Category</Label>
              <Controller
                name="category_display"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category_display">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectContent>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="Subcontractor">
                          Subcontractor
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_display && (
                <p className="text-red-500 text-sm">
                  {errors.category_display.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="expense_type">Expense Type</Label>
              <Controller
                name="expense_type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="expense_type">
                      <SelectValue placeholder="Select Expense Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Labor">Labor</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Subcontractor">
                        Subcontractor
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.expense_type && (
                <p className="text-red-500 text-sm">
                  {errors.expense_type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="net_amount">Net Amount</Label>
              <Input
                id="net_amount"
                type="number"
                step="0.01"
                {...register("net_amount", { valueAsNumber: true })}
              />
              {errors.net_amount && (
                <p className="text-red-500 text-sm">
                  {errors.net_amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="vat_percentage">VAT Percentage</Label>
              <Input
                id="vat_percentage"
                type="number"
                value="5"
                readOnly
                {...register("vat_percentage", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="vat_amount">VAT Amount</Label>
              <Input
                id="vat_amount"
                type="number"
                step="0.01"
                readOnly
                {...register("vat_amount", { valueAsNumber: true })}
              />
              {errors.vat_amount && (
                <p className="text-red-500 text-sm">
                  {errors.vat_amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                readOnly
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="payment_mode">Payment Mode</Label>
              <Controller
                name="payment_mode"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="payment_mode">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.payment_mode && (
                <p className="text-red-500 text-sm">
                  {errors.payment_mode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                type="date"
                {...register("payment_date")}
              />
              {errors.payment_date && (
                <p className="text-red-500 text-sm">
                  {errors.payment_date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="paid_amount">Paid Amount</Label>
              <Input
                id="paid_amount"
                type="number"
                step="0.01"
                {...register("paid_amount", { valueAsNumber: true })}
              />
              {errors.paid_amount && (
                <p className="text-red-500 text-sm">
                  {errors.paid_amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="balance_amount">Balance Amount</Label>
              <Input
                id="balance_amount"
                type="number"
                step="0.01"
                readOnly
                {...register("balance_amount", { valueAsNumber: true })}
              />
              {errors.balance_amount && (
                <p className="text-red-500 text-sm">
                  {errors.balance_amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input id="due_date" type="date" {...register("due_date")} />
              {errors.due_date && (
                <p className="text-red-500 text-sm">
                  {errors.due_date.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="date">Expense Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partially Paid">
                        Partially Paid
                      </SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                className="min-h-32"
                {...register("remarks")}
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm">{errors.remarks.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpenseFromPage;
