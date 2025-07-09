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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEmployeeMutation } from "@/redux/query/employee";
import { formatDate } from "@/lib/dateFormat";
import { useCreateBallMutation } from "@/redux/query/paymentApi";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const PaymentBallSchema = z.object({
  projectPercentage: z.string().min(1, "Percentage is required"),
  project_status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  payment_terms: z.any(),
});

function CreatePaymentBall({
  isDialogOpen,
  setIsDialogOpen,
  details,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  details: any;
}) {
  const { id } = useParams();
  const [createPaymentBallApi, { data, isSuccess, error, isError, isLoading }]: any = useCreateBallMutation();
  const now = today(getLocalTimeZone());

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(PaymentBallSchema) });

  // Debounced submit function to prevent multiple submissions
  const [debouncedSubmit] = useDebounce(async (data: any) => {
    try {
      const res = await createPaymentBallApi({
        data: { ...data, projectId: id, color_status: "gray" },
      });
      if (res.data) {
        toast.success("Payment Ball Created", {
          description: "The payment ball has been successfully created!",
          style: {
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "white",
            border: "none",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        });
        setIsDialogOpen(false);
        reset();
      }
    } catch (err) {
      toast.error("Error", {
        description: error?.data?.message || "Something went wrong.",
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, 500);

  const onSubmit = useCallback((data: any) => {
    debouncedSubmit(data);
  }, [debouncedSubmit]);

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: error?.data?.message || "Something went wrong.",
        style: {
          background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, [isError, error]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className="overflow-x-scroll no-scrollbar border border-gray-200 rounded-xl w-[90%] max-h-[90%] scroll-smooth lg:w-[600px] md:w-[600px] bg-gradient-to-br from-white to-gray-50 shadow-2xl">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">Create Payment Ball</DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill out the details to create a new payment ball
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Job ID:</span>{" "}
                <span className="text-gray-800">{details?.projectId}</span>
              </div>
              <div>
                <span className="font-medium">Deadline:</span>{" "}
                <span className="text-gray-800">{formatDate(details?.delivery_timelines)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700 font-medium">Amount</Label>
              <Input
                id="amount"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="$0.00"
                type="text"
                {...register("amount")}
              />
              {errors.amount && <ErrorMessage message={errors.amount.message} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectPercentage" className="text-gray-700 font-medium">Project Percentage</Label>
              <div className="relative">
                <Input
                  id="projectPercentage"
                  className="rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white pr-10"
                  placeholder="0"
                  type="text"
                  {...register("projectPercentage")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
              {errors.projectPercentage && <ErrorMessage message={errors.projectPercentage.message} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
              <Textarea
                id="notes"
                className="rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white min-h-[100px]"
                placeholder="Add any additional notes..."
                {...register("notes")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_status" className="text-gray-700 font-medium">Status</Label>
              <Controller
                name="project_status"
                control={control}
                defaultValue="Pending"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger
                      className="rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                      id="project_status"
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      <SelectItem value="Pending" className="hover:bg-indigo-50">Pending</SelectItem>
                      <SelectItem value="In Progress" className="hover:bg-indigo-50">In Progress</SelectItem>
                      <SelectItem value="Completed" className="hover:bg-indigo-50">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.project_status && <ErrorMessage message={errors.project_status.message} />}
            </div>
          </div>

          <DialogFooter className="pt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-100"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePaymentBall;