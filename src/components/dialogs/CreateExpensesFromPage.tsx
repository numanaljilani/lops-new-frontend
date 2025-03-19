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
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { number, z } from "zod";
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
  const LPOSchema = z.object({
    VAT: z.string(),
    total_amount: z.number(),
    net_amount: z.string(),
    date: z.string(),
    supplier_name: z.string().default("-"),
    job_card: z.string(),
    category_name: z.string().default("Materials"),
    expense_type: z.string(),
    description: z.string(),
    status: z.string().default("Pending"),
  });

  const [createExpense, { data: res, isSuccess, error, isError }] =
    useCreateExpenseMutation();
  const [expensesCategories, { data: expRes }] =
    useExpensescategoriesMutation();

  const getExpCategories = async () => {
    const res = await expensesCategories({});
    if (res.data) {
      setCategories(res.data.results);
    }
  };
  useEffect(() => {
    getExpCategories();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  }: any = useForm({ resolver: zodResolver(LPOSchema) });

  const netAmount = watch("net_amount");
  const vat = watch("VAT");

  useEffect(() => {
    if (netAmount && vat) {
      const totalAmount = parseFloat(netAmount) + parseFloat(vat);
      setValue("total_amount", totalAmount);
    }
  }, [netAmount, vat, setValue]);

  async function onSubmit(data: any) {
    const parsedData = {
      ...data,
      total_amount: parseFloat(data.total_amount), // Ensure total_amount is a number
    };

    const response = await createExpense({
      data: parsedData,
    });

    console.log(response, "RESPONSE .....");

    toast("Warning", {
      description:
        "Due to server issue, purchases or expenses are not added to the project.",
    });

    setIsDialogOpen(false);
  }

  const [jobs, setJobs] = useState([]);
  const [jobApi, { data, isSuccess: isJobCardSuccess }] = useJobsMutation();

  const getJobs = async () => {
    const res = await jobApi({});
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (isError) {
      toast("Warning", {
        description:
          "Due to server issue, purchases or expenses are not added to the project.",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isJobCardSuccess) {
      console.log(data, "response from server");
      if (data) {
        setJobs(data.results);
      }
    }
  }, [isJobCardSuccess]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Add expenses</DialogTitle>
          <DialogDescription>
            Fill the form to add the expenses in the related project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div className="grid gap-3">
              <Label htmlFor="status">Job Id </Label>
              <Controller
                name="job_card"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      console.log(value, "Selected Job ID");
                      field.onChange(value);
                    }}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger id="job_card" aria-label="Select Type">
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.length > 0 ? (
                        jobs.map((data: any, index) => (
                          <SelectItem key={index} value={String(data?.job_id)}>
                            {data?.job_number}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No jobs available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.job_card && (
                <p className="text-red-500 text-sm">{errors.job_card.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="amount">Supplier</Label>
              <Input id="supplier" type="text" {...register("supplier")} />
              {errors.supplier && (
                <p className="text-red-500 text-sm">{errors?.supplier?.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="amount">Net value without Tax</Label>
              <Input
                id="net_amount"
                type="text"
                {...register("net_amount", { required: true })}
              />
              {errors.net_amount && (
                <p className="text-red-500 text-sm">
                  {errors?.net_amount?.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">VAT</Label>
              <Input
                id="VAT"
                type="text"
                {...register("VAT", { required: true })}
              />
              {errors.VAT && (
                <p className="text-red-500 text-sm">{errors?.VAT?.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="text" // or type="number"
                {...register("total_amount", { required: true, valueAsNumber: true })}
                readOnly
              />
              {errors.total_amount && (
                <p className="text-red-500 text-sm">
                  {errors.total_amount.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Expense Type </Label>
              <Controller
                name="expense_type"
                control={control}
                defaultValue="Material"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="expense_type" aria-label="Select Type">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
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
              <Label htmlFor="delivery_timelines">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: true })}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Category</Label>

              <Controller
                name="category"
                control={control}
                defaultValue="Material"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="category" aria-label="Select Type">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((data: any, index) => {
                        return (
                          <SelectItem key={index} value={data.name}>
                            {data.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="Status"
                control={control}
                defaultValue="Pending"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="Status" aria-label="Select Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.Status && (
                <p className="text-red-500 text-sm">{errors.Status.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Url (documents link)</Label>
              <Textarea
                id="description"
                className="min-h-32"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="payment_terms">Remark</Label>
              <Textarea
                id="payment_terms"
                className="min-h-32"
                {...register("remarks", { required: true })}
              />
              {errors.remarks && (
                <p className="text-red-500 text-sm">{errors.remarks.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              variant={"secondary"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpenseFromPage;