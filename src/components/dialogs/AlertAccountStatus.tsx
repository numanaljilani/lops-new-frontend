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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { useVerifyPaymentStatusMutation } from "@/redux/query/accountsApi";

export default function AlertAccountStatus({
  isDialogOpen,
  setIsDialogOpen,
  item,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  item: any;
}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const LPOSchema = z.object({
    amount: z.number().default(item?.amount || 0),
    status: z.string().default("Pending"),
    verification_status: z.string().default(item?.verification_status || "unverified"),
    VAT: z.number().default(0),
    charity: z.number().default(0), // Default charity amount
    total_amount: z.number().default(0),
    project_status: z.string().default(item?.status || "Pending"),
    // project_percentage: z.string().default(item?.project_percentage || "0"),
    // invoice_number: z.string().default(item?.invoice_number || "-"),
    notes: z.string().default(""),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LPOSchema),
    defaultValues: {
      amount: item?.amount ? String(item.amount) : "0",
      VAT: item?.amount ? (Number(item.amount) * 0.05).toFixed(2) : "0.00",
      charity: "0",
      total_amount: item?.amount
        ? (Number(item.amount) + Number(item.amount) * 0.05).toFixed(2)
        : "0.00",
      // invoice_number: item?.invoice_number || "-",
      verification_status: item?.verification_status || "unverified",
      project_percentage: item?.project_percentage || 100,
      notes: "",
      project_status: item?.status || "Pending",
    },
  });
  

  const [verifyPaymentStatus, { data, isSuccess, error, isError, isLoading }] =
    useVerifyPaymentStatusMutation();

  // Watch amount and charity fields for changes
  const amount = useWatch({ control, name: "amount" });
  const charity = useWatch({ control, name: "charity" });

  // Calculate VAT and total amount whenever amount or charity changes
  useEffect(() => {
    const amountValue = Number(amount) || 0;
    const charityValue = Number(charity) || 0;

    // Calculate VAT (5% of amount)
    const vatValue = amountValue * 0.05;
    setValue("VAT", vatValue.toFixed(2));

    // Calculate total amount (amount + VAT - charity)
    const totalAmountValue = amountValue + vatValue - charityValue;
    setValue("total_amount", totalAmountValue.toFixed(2));
  }, [amount, charity, setValue]);

  async function onSubmit(data: any) {
    try {
      const response = await verifyPaymentStatus({
        data: {
          ...data,
          job_card: item?.job_card,
          project_percentage : 100
        },
        id: item.payment_id,
      });
console.log(response , ">>>>")
      if (response.error) {
        setWarningMessage("Failed to submit the form. Please try again.");
      } else {
        setSuccessMessage("Form submitted successfully!");
        setIsDialogOpen(false);
      }
    } catch (err) {
      setWarningMessage("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Form submitted successfully!");
      setIsDialogOpen(false);
    }
    if (isError) {
      setWarningMessage("Failed to submit the form. Please try again.");
    }
  }, [isSuccess, isError, setIsDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Verify</DialogTitle>
          <DialogDescription>Fill the form.</DialogDescription>
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
              <Label htmlFor="job_card">Job Id</Label>
              <Input
                id="job_card"
                type="text"
                disabled
                value={item?.job_card}
              />
            </div>
            {/* <div>
              <Label htmlFor="invoice_number">Invoice</Label>
              <Input
                id="invoice_number"
                type="text"
                defaultValue={item?.invoice_number || "-"}
                {...register("invoice_number")}
              />
              {errors?.invoice_number && (
                <ErrorMessage message={errors?.invoice_number.message} />
              )}
            </div> */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                defaultValue={item?.amount || "0"}
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <ErrorMessage message={errors.amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="VAT">VAT (5%)</Label>
              <Input
                id="VAT"
                type="number"
                disabled
                {...register("VAT", { valueAsNumber: true })}
              />
              {errors.VAT && <ErrorMessage message={errors.VAT.message} />}
            </div>
            <div>
              <Label htmlFor="charity">Charity</Label>
              <Input
                id="charity"
                type="number"
                defaultValue="0"
                {...register("charity", { valueAsNumber: true })}
              />
              {errors.charity && (
                <ErrorMessage message={errors.charity.message} />
              )}
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                disabled
                {...register("total_amount", { valueAsNumber: true })}
              />
              {errors.total_amount && (
                <ErrorMessage message={errors.total_amount.message} />
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Verification Status</Label>
              <Controller
                name="verification_status"
                control={control}
                defaultValue={item?.verification_status || "unverified"}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger
                      id="verification_status"
                      aria-label="Select Type"
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"unverified"}>
                        {"Unverified"}
                      </SelectItem>
                      <SelectItem value={"invoiced"}>{"Invoiced"}</SelectItem>
                      <SelectItem value={"paid"}>{"Paid"}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.verification_status && (
                <ErrorMessage message={errors.verification_status.message} />
              )}
            </div>
            {/* <div>
              <Label htmlFor="project_percentage">Project Percentage</Label>
              <Input
                id="project_percentage"
                type="text"
                defaultValue={item?.project_percentage || "0"}
                {...register("project_percentage")}
              />
              {errors.project_percentage && (
                <ErrorMessage message={errors.project_percentage.message} />
              )}
            </div> */}
            <div className="grid gap-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="min-h-32"
                {...register("notes")}
              />
              {errors.notes && (
                <ErrorMessage message={errors.notes.message} />
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}