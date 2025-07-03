"use client";
import React, { useEffect, useCallback, useState } from "react";
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
  Select as UiSelect,
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
import ErrorMessage from "@/components/errors/ErrorMessage";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { LoaderCircle } from "lucide-react";

const ExpensesSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  category_display: z.string().min(1, "Category is required"),
  net_amount: z.number().positive("Net amount must be positive"),
  vat_percentage: z.number().default(5),
  vat_amount: z.number().min(0, "VAT amount cannot be negative"),
  amount: z.number().positive("Total amount must be positive"),
  payment_mode: z.enum(["Cash", "Bank Transfer", "Cheque"], {
    errorMap: () => ({ message: "Payment mode is required" }),
  }),
  payment_date: z.string().optional(),
  remarks: z.string().optional(),
});

function CreateExpenseFromPage({
  isDialogOpen,
  setIsDialogOpen,
  data: jobData,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  const [defaultProjects, setDefaultProjects] = useState<any[]>([]);
  const [createExpense, { data: res, isSuccess, error, isError, isLoading }] =
    useCreateExpenseMutation();
  const [expensesCategories, { data: expRes }] = useExpensescategoriesMutation();
  const [jobApi, { isLoading: isJobsApiLoading, error: jobsError }] = useJobsMutation();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ExpensesSchema),
    defaultValues: {
      projectId: jobData?._id || "",
      category_display: "",
      net_amount: 0,
      vat_percentage: 5,
      vat_amount: 0,
      amount: 0,
      payment_mode: undefined,
      payment_date: "",
      remarks: "",
    },
  });

  const net_amount = watch("net_amount");
  const vat_percentage = watch("vat_percentage");
  const projectId = watch("projectId");

  useEffect(() => {
    if (net_amount && vat_percentage) {
      const vat_amount = (net_amount * vat_percentage) / 100;
      const total_amount = net_amount + vat_amount;
      setValue("vat_amount", parseFloat(vat_amount.toFixed(2)));
      setValue("amount", parseFloat(total_amount.toFixed(2)));
    }
  }, [net_amount, vat_percentage, setValue]);

  const fetchDefaultProjects = async () => {
    try {
      const res = await jobApi({}).unwrap();
      console.log("Default Projects API Response:", res);
      if (res.data) {
        setDefaultProjects(res.data);
      } else {
        toast.warning("No default projects found.");
      }
    } catch (err) {
      console.error("Default Projects Fetch Error:", err);
      toast.error("Failed to fetch default projects. Please try again.");
    }
  };

  useEffect(() => {
    fetchDefaultProjects();
  }, []);

  const loadProjects = useCallback(
    debounce(async (inputValue: string, callback: (options: any[]) => void) => {
      try {
        const res = await jobApi({ search: inputValue }).unwrap();
        console.log("Search Projects API Response:", res);
        const options = res.data?.map((job: any) => ({
          value: job._id,
          label: `${job.projectId} - ${job.project_name || "No Name"}`,
        })) || [];
        callback(options);
      } catch (err) {
        console.error("Search Projects Fetch Error:", err);
        toast.error("Failed to fetch projects. Please try again.");
        callback([]);
      }
    }, 500),
    [jobApi]
  );

  useEffect(() => {
    if (isError) {
      const errorMessage =
        (error as any)?.data?.message ||
        "Failed to add expense due to server issue.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
    if (isSuccess) {
      toast.success("Success", {
        description: "Expense added successfully.",
      });
      setIsDialogOpen(false);
      reset();
    }
  }, [isError, isSuccess, error, setIsDialogOpen, reset]);

  async function onSubmit(data: any) {
    try {
      const response = await createExpense({
        data: {
          ...data,
          net_amount: parseFloat(data.net_amount),
          amount: parseFloat(data.amount),
          vat_amount: parseFloat(data.vat_amount),
          payment_date: data.payment_date || undefined,
        },
      }).unwrap();
      console.log("Create Expense Response:", response);
      toast.success("Success", {
        description: "Expense added successfully.",
      });
      setIsDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error("Create Expense Error:", err);
      const errorMessage =
        err?.data?.message || "Failed to add expense. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  }

  const defaultOptions = defaultProjects.map((job: any) => ({
    value: job._id,
    label: `${job.projectId} - ${job.project_name || "No Name"}`,
  }));

  console.log("Default Options:", defaultOptions);
  console.log("Selected projectId:", projectId);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          reset();
        }
      }}
    >
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
                  // @ts-ignore
                  <AsyncSelect
                    cacheOptions
                    defaultOptions={defaultOptions}
                    // @ts-ignore
                    loadOptions={loadProjects}
                    isLoading={isJobsApiLoading}
                    placeholder="Search for a project..."
                    noOptionsMessage={() => "No projects found"}
                    onChange={(option) => field.onChange(option ? option.value : "")}
                    value={
                      projectId
                        ? {
                            value: projectId,
                            label:
                              projectId === jobData?._id
                                ? `${jobData?.projectId} - ${jobData?.project_name || "No Name"}`
                                : defaultOptions.find((opt) => opt.value === projectId)?.label || projectId
                          }
                        : null
                    }
                    isClearable
                    isSearchable
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.projectId ? "red" : base.borderColor,
                        "&:hover": {
                          borderColor: errors.projectId ? "red" : base.borderColor,
                        },
                        borderRadius: "0.375rem",
                        padding: "0.25rem",
                        boxShadow: errors.projectId ? "0 0 0 1px red" : base.boxShadow,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                )}
              />
              {errors.projectId && (
                <ErrorMessage message={errors.projectId.message} />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="category_display">Category</Label>
              <Controller
                name="category_display"
                control={control}
                render={({ field }) => (
                  <UiSelect
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id="category_display">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Labor">Labor</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Subcontractor">Subcontractor</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </UiSelect>
                )}
              />
              {errors.category_display && (
                <ErrorMessage message={errors.category_display.message} />
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
                <ErrorMessage message={errors.net_amount.message} />
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
                <ErrorMessage message={errors.vat_amount.message} />
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
                <ErrorMessage message={errors.amount.message} />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="payment_mode">Payment Mode</Label>
              <Controller
                name="payment_mode"
                control={control}
                render={({ field }) => (
                  <UiSelect
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id="payment_mode">
                      <SelectValue placeholder="Select Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </UiSelect>
                )}
              />
              {errors.payment_mode && (
                <ErrorMessage message={errors.payment_mode.message} />
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
                <ErrorMessage message={errors.payment_date.message} />
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
                <ErrorMessage message={errors.remarks.message} />
              )}
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpenseFromPage;