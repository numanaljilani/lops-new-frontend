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

  const LPOSchema = z.object({
    amount: z.number().min(0, "Amount must be positive"),
    status: z.string().default("Pending"),
    verification_status: z.string().default("unverified"),
    VAT: z.number().min(0),
    charity: z.number().min(0),
    total_amount: z.number().min(0),
    project_status: z.string().default("Pending"),
    notes: z.string().default(""),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LPOSchema),
  });

  // Watch amount field for changes
  const amount = useWatch({ control, name: "amount" });

  // Reset form when item changes or dialog opens/closes
  useEffect(() => {
    if (isDialogOpen && item) {
      reset({
        amount: item?.amount ? Number(item.amount) : 0,
        VAT: item?.vat_amount ? Number(item.vat_amount) : 0,
        charity: item?.charity_amount ? Number(item.charity_amount) : 0,
        total_amount: item?.net_amount ? Number(item.net_amount) : 0,
        verification_status: item?.verification_status || "unverified",
        notes: item?.notes || "",
        project_status: item?.status || "Pending",
      });
    }
  }, [isDialogOpen, item, reset]);

  // Calculate VAT (5%) and charity (2.5%) whenever amount changes
  useEffect(() => {
    if (isDialogOpen) {
      const amountValue = Number(amount) || 0;
      const vatValue = amountValue * 0.05;
      const charityValue = amountValue * 0.025;
      const totalAmount = amountValue + vatValue - charityValue;

      setValue("VAT", vatValue);
      setValue("charity", charityValue);
      setValue("total_amount", totalAmount);
    }
  }, [amount, setValue, isDialogOpen]);

  async function onSubmit(data: any) {
    try {
      const response = await verifyPaymentStatus({
        data: {
          ...data,
          job_card: item?.job_card,
          project_percentage: 100,
        },
        id: item.payment_id,
      });

      if (response.error) {
        setWarningMessage("Failed to submit the form. Please try again.");
      } else {
        setSuccessMessage("Form submitted successfully!");
        setIsDialogOpen(false);
        reset(); // Reset form after successful submission
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
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) {
        reset(); // Reset form when dialog closes
      }
    }}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%] scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Verify</DialogTitle>
          <DialogDescription>Fill the form.</DialogDescription>
        </DialogHeader>

        {warningMessage && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p>{warningMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
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
                value={item?.job_number}
              />
            </div>
           
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount", { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    const value = Number(e.target.value);
                    setValue("amount", value);
                  }
                })}
              />
              {errors.amount && <ErrorMessage message={errors.amount.message} />}
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
              <Label htmlFor="charity">Charity (2.5%)</Label>
              <Input
                id="charity"
                type="number"
                disabled
                {...register("charity", { valueAsNumber: true })}
              />
              {errors.charity && <ErrorMessage message={errors.charity.message} />}
            </div>
            
            <div>
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                disabled
                {...register("total_amount", { valueAsNumber: true })}
              />
              {errors.total_amount && <ErrorMessage message={errors.total_amount.message} />}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Verification Status</Label>
              <Controller
                name="verification_status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="verification_status" aria-label="Select Type">
                      <SelectValue placeholder="Select Status" />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}