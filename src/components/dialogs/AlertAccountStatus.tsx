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
import { Controller, useForm, useWatch } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { useVerifyPaymentStatusMutation } from "@/redux/query/accountsApi";
import { useRouter } from "next/navigation";

export default function AlertAccountStatus({
  isDialogOpen,
  setIsDialogOpen,
  item,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  item: any;
}) {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [verifyPaymentStatus, { isSuccess, isError, isLoading }] =
    useVerifyPaymentStatusMutation();

  const AccountsSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    amount: z.number().positive("Amount must be positive"),
    vat_percentage: z
      .number()
      .min(0, "VAT percentage cannot be negative")
      .default(5),
    vat_amount: z.number().min(0, "VAT amount cannot be negative"),
    charity_percentage: z
      .number()
      .min(0, "Charity percentage cannot be negative")
      .default(2.5),
    charity_amount: z.number().min(0, "Charity amount cannot be negative"),
    total_amount: z.number().positive("Total amount must be positive"),
    amount_after_charity: z
      .number()
      .min(0, "Amount after charity cannot be negative"),
    payment_mode: z.enum(["Cash", "Credit", "Cheque", "Bank Transfer"], {
      errorMap: () => ({ message: "Invalid payment mode" }),
    }),
    payment_date: z.string().optional(),
    paid_amount: z.number().min(0, "Paid amount cannot be negative").default(0),
    new_payment_amount: z
      .number()
      .min(0, "New payment amount cannot be negative")
      .default(0),
    balance_amount: z
      .number()
      .min(0, "Balance amount cannot be negative")
      .default(0),
    due_date: z.string().optional(),
    status: z.enum(["Pending", "Partially Paid", "Paid"]).default("Pending"),
    verification_status: z
      .enum(["unverified", "invoiced", "paid"])
      .default("unverified"),
    notes: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  }: any = useForm({
    resolver: zodResolver(AccountsSchema),
    defaultValues: {
      vat_percentage: 5,
      charity_percentage: 2.5,
      status: "Pending",
      verification_status: "unverified",
      paid_amount: 0,
      new_payment_amount: 0,
      balance_amount: 0,
    },
  });

  const amount = useWatch({ control, name: "amount" });
  const vat_percentage = useWatch({ control, name: "vat_percentage" });
  const charity_percentage = useWatch({ control, name: "charity_percentage" });
  const new_payment_amount = useWatch({ control, name: "new_payment_amount" });

  useEffect(() => {
    if (isDialogOpen && item) {
      reset({
        projectId: item?.projectId?._id || "",
        amount: item?.amount ? Number(item.amount) : 0,
        vat_percentage: item?.vat_percentage ? Number(item.vat_percentage) : 5,
        vat_amount: item?.vat_amount ? Number(item.vat_amount) : 0,
        charity_percentage: item?.charity_percentage
          ? Number(item.charity_percentage)
          : 2.5,
        charity_amount: item?.charity_amount ? Number(item.charity_amount) : 0,
        total_amount: item?.total_amount ? Number(item.total_amount) : 0,
        amount_after_charity: item?.amount_after_charity
          ? Number(item.amount_after_charity)
          : 0,
        payment_mode: item?.payment_mode || "Cash",
        payment_date: item?.payment_date
          ? new Date(item.payment_date).toISOString().split("T")[0]
          : "",
        paid_amount: item?.paid_amount ? Number(item.paid_amount) : 0,
        new_payment_amount: 0,
        balance_amount: item?.balance_amount ? Number(item.balance_amount) : 0,
        due_date: item?.due_date
          ? new Date(item.due_date).toISOString().split("T")[0]
          : "",
        status: item?.status || "Pending",
        verification_status: item?.verification_status || "unverified",
        notes: item?.notes || "",
      });
    }
  }, [isDialogOpen, item, reset]);

  useEffect(() => {
    if (isDialogOpen) {
      const amountValue = Number(amount) || 0;
      const vatPercentageValue = Number(vat_percentage) || 5;
      const charityPercentageValue = Number(charity_percentage) || 2.5;
      const newPaymentAmountValue = Number(new_payment_amount) || 0;

      const vatAmount = (amountValue * vatPercentageValue) / 100;
      const charityAmount = (amountValue * charityPercentageValue) / 100;
      const totalAmount = amountValue + vatAmount;
      const amountAfterCharity = amountValue - charityAmount;
      const updatedPaidAmount = (item?.paid_amount ? Number(item.paid_amount) : 0) + newPaymentAmountValue;
      const balanceAmount = totalAmount - updatedPaidAmount;

      setValue("vat_amount", parseFloat(vatAmount.toFixed(2)));
      setValue("charity_amount", parseFloat(charityAmount.toFixed(2)));
      setValue("total_amount", parseFloat(totalAmount.toFixed(2)));
      setValue("amount_after_charity", parseFloat(amountAfterCharity.toFixed(2)));
      setValue("paid_amount", parseFloat(updatedPaidAmount.toFixed(2)));
      setValue("balance_amount", parseFloat(Math.max(0, balanceAmount).toFixed(2)));
    }
  }, [amount, vat_percentage, charity_percentage, new_payment_amount, setValue, isDialogOpen, item]);

  async function onSubmit(data: any) {
    console.log(data, "DATA");
    try {
      const response = await verifyPaymentStatus({
        data: {
          ...data,
          projectId: item?.projectId?._id,
          amount: parseFloat(data.amount),
          vat_amount: parseFloat(data.vat_amount),
          charity_amount: parseFloat(data.charity_amount),
          total_amount: parseFloat(data.total_amount),
          amount_after_charity: parseFloat(data.amount_after_charity),
          paid_amount: parseFloat(data.paid_amount),
          balance_amount: parseFloat(data.balance_amount),
          payment_date: data.payment_date || undefined,
          due_date: data.due_date || undefined,
          // Exclude new_payment_amount from submission
        },
        id: item._id,
      });

      console.log(response, "response update status");

      if ("error" in response) {
        setWarningMessage("Failed to submit the form. Please try again.");
      } else {
        setSuccessMessage("Form submitted successfully!");
        setIsDialogOpen(false);
        reset();
        router.refresh();
      }
    } catch (err) {
      setWarningMessage("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Form submitted successfully!");
      setIsDialogOpen(false);
      router.refresh();
    }
    if (isError) {
      setWarningMessage("Failed to submit the form. Please try again.");
    }
  }, [isSuccess, isError, setIsDialogOpen, router]);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          reset();
          setSuccessMessage(null);
          setWarningMessage(null);
        }
      }}
    >
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Verify Payment Status</DialogTitle>
          <DialogDescription>
            Fill the form to verify payment status.
          </DialogDescription>
        </DialogHeader>

        {warningMessage && (
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
            role="alert"
          >
            <p>{warningMessage}</p>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            role="alert"
          >
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                type="text"
                disabled
                value={item?.projectId?.projectId}
                {...register("projectId")}
              />
              {errors.projectId && (
                <ErrorMessage message={errors.projectId.message} />
              )}
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <ErrorMessage message={errors.amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="vat_percentage">VAT Percentage (%)</Label>
              <Input
                id="vat_percentage"
                type="number"
                step="0.01"
                {...register("vat_percentage", { valueAsNumber: true })}
              />
              {errors.vat_percentage && (
                <ErrorMessage message={errors.vat_percentage.message} />
              )}
            </div>
            <div>
              <Label htmlFor="vat_amount">VAT Amount</Label>
              <Input
                id="vat_amount"
                type="number"
                step="0.01"
                disabled
                {...register("vat_amount", { valueAsNumber: true })}
              />
              {errors.vat_amount && (
                <ErrorMessage message={errors.vat_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="charity_percentage">Charity Percentage (%)</Label>
              <Input
                id="charity_percentage"
                type="number"
                step="0.01"
                {...register("charity_percentage", { valueAsNumber: true })}
              />
              {errors.charity_percentage && (
                <ErrorMessage message={errors.charity_percentage.message} />
              )}
            </div>
            <div>
              <Label htmlFor="charity_amount">Charity Amount</Label>
              <Input
                id="charity_amount"
                type="number"
                step="0.01"
                disabled
                {...register("charity_amount", { valueAsNumber: true })}
              />
              {errors.charity_amount && (
                <ErrorMessage message={errors.charity_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount (Amount + VAT)</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                disabled
                {...register("total_amount", { valueAsNumber: true })}
              />
              {errors.total_amount && (
                <ErrorMessage message={errors.total_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="amount_after_charity">
                Amount After Charity (Amount - Charity)
              </Label>
              <Input
                id="amount_after_charity"
                type="number"
                step="0.01"
                disabled
                {...register("amount_after_charity", { valueAsNumber: true })}
              />
              {errors.amount_after_charity && (
                <ErrorMessage message={errors.amount_after_charity.message} />
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
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
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
            <div>
              <Label htmlFor="paid_amount">Total Paid Amount</Label>
              <Input
                id="paid_amount"
                type="number"
                step="0.01"
                disabled
                {...register("paid_amount", { valueAsNumber: true })}
              />
              {errors.paid_amount && (
                <ErrorMessage message={errors.paid_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="new_payment_amount">New Payment Amount</Label>
              <Input
                id="new_payment_amount"
                type="number"
                step="0.01"
                {...register("new_payment_amount", { valueAsNumber: true })}
              />
              {errors.new_payment_amount && (
                <ErrorMessage message={errors.new_payment_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="balance_amount">Balance Amount (Total - Paid)</Label>
              <Input
                id="balance_amount"
                type="number"
                step="0.01"
                disabled
                {...register("balance_amount", { valueAsNumber: true })}
              />
              {errors.balance_amount && (
                <ErrorMessage message={errors.balance_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                {...register("due_date")}
              />
              {errors.due_date && (
                <ErrorMessage message={errors.due_date.message} />
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Payment Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <ErrorMessage message={errors.status.message} />
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="verification_status">Verification Status</Label>
              <Controller
                name="verification_status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="verification_status">
                      <SelectValue placeholder="Select Verification Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unverified">Ready to invoice</SelectItem>
                      <SelectItem value="invoiced">Invoiced</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.verification_status && (
                <ErrorMessage message={errors.verification_status.message} />
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="min-h-32"
                {...register("notes")}
              />
              {errors.notes && <ErrorMessage message={errors.notes.message} />}
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setIsDialogOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}