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
import { Controller, useForm } from "react-hook-form";
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
    amount: z.string().default(item?.amount),
    status: z.string().default("Pending"),
    verification_status: z.string().default(item?.verification_status),
    VAT: z.string().default(`${(Number(item?.amount)) * (5/ 100)}`),
    project_status: z.string().default(item?.status || "Pending"),
    project_percentage: z.string().default(item?.project_percentage),
    invoice_number: z.string().default(item?.invoice_number),
    notes: z.string(),
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LPOSchema) });

  const [verifyPaymentStatus, { data, isSuccess, error, isError, isLoading }] =
    useVerifyPaymentStatusMutation();

  async function onSubmit(data: any) {
    try {
      const response = await verifyPaymentStatus({
        data: {
          ...data,
          job_card: item?.job_card,
        },
        id: item.payment_id,
      });

      if (response.error) {
        setWarningMessage("Failed to submit the form. Please try again.");
      } else {
        setSuccessMessage("Form submitted successfully! use client");
        setIsDialogOpen(false);
      }
    } catch (err) {
      setWarningMessage("An error occurred. Please try again.");
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Form submitted successfully! use client");
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
          <DialogDescription>fill the form.</DialogDescription>
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
                value={item?.job_card}
              />
            </div>
            <div>
              <Label htmlFor="invoice_number">Invoice</Label>
              <Input
                id="invoice_number"
                type="text"
                defaultValue={item?.invoice_number || "-"}
                {...register("invoice_number")}
              />
              {errors.invoice_number && (
                <ErrorMessage message={errors.invoice_number.message} />
              )}
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                defaultValue={item?.amount}
                {...register("amount")}
              />
              {errors.amount && (
                <ErrorMessage message={errors.amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="VAT">VAT</Label>
              <Input
                id="VAT"
                type="number"
                defaultValue={(Number(item?.amount)) * (5/ 100)}
                {...register("VAT")}
              />
              {errors.VAT && (
                <ErrorMessage message={errors.VAT.message} />
              )}
            </div>
        
            <div className="grid gap-3">
              <Label htmlFor="status">Varification Status</Label>
              <Controller
                name="verification_status"
                control={control}
                defaultValue={item?.verification_status}
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
                        {"unverified"}
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
            <div>
              <Label htmlFor="project_percentage">Project Percentage</Label>
              <Input
                id="project_percentage"
                type="text"
                defaultValue={item?.project_percentage}
                {...register("project_percentage")}
              />
              {errors.project_percentage && (
                <ErrorMessage message={errors.project_percentage.message} />
              )}
            </div>
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