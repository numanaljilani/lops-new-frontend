"use client";
import React, { useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dateFormat";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useUpdatePaymentBallMutation } from "@/redux/query/paymentApi";

const PaymentBallSchema = z.object({
  projectPercentage: z.string().min(1, "Percentage is required"),
  project_status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  payment_terms: z.any(),
});

function UpdatePaymentBall({
  isDialogOpen,
  setIsDialogOpen,
//   details,
  paymentBallsDetails,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
//   details: any;
  paymentBallsDetails: any;
}) {
  const { id } = useParams();
  const [updatePaymentBallApi, { data, isSuccess, error, isError, isLoading }]: any = useUpdatePaymentBallMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(PaymentBallSchema),
    defaultValues: {
      projectPercentage: paymentBallsDetails?.projectPercentage || "",
      project_status: paymentBallsDetails?.project_status || "Pending",
      notes: paymentBallsDetails?.notes || "",
      amount: paymentBallsDetails?.amount || "",
      payment_terms: paymentBallsDetails?.payment_terms || "",
    },
  });

  // Debounced submit function
  const [debouncedSubmit] = useDebounce(async (data: any) => {
    try {
      const res = await updatePaymentBallApi({
        id: paymentBallsDetails?._id,
        data: { ...data },
      });
      console.log(res , "RESPONSE UPDATE")
      if (res.data) {
        toast.success("Payment Ball Updated", {
          description: "The payment ball has been successfully updated!",
          style: {
            background: "#10B981",
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
        description: error?.data?.message || "Failed to update the payment ball.",
        style: {
          background: "#EF4444",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, 500);

  useEffect(() => {
    if (isError) {
      toast.error("Error", {
        description: error?.data?.message || "Failed to update the payment ball.",
        style: {
          background: "#EF4444",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  }, [isError, error]);

  useEffect(() => {
    reset({
      projectPercentage: paymentBallsDetails?.projectPercentage || "",
      project_status: paymentBallsDetails?.project_status || "Pending",
      notes: paymentBallsDetails?.notes || "",
      amount: paymentBallsDetails?.amount || "",
      payment_terms: paymentBallsDetails?.payment_terms || "",
    });
  }, [paymentBallsDetails, reset]);

  const onSubmit = (data: any) => {
    debouncedSubmit(data);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent
        className={cn(
          "rounded-xl border border-gray-200 bg-white shadow-lg",
          "w-[90%] max-w-[600px] max-h-[80vh] p-6",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-90 data-[state=closed]:fade-out-0"
        )}
      >
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Update Payment Ball
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Update the details of the selected payment ball.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(80vh-150px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            <div className="space-y-4 bg-white rounded-lg">
              {/* <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Job ID:</span>{" "}
                  <span className="text-gray-800">{details?.projectId}</span>
                </div>
                <div>
                  <span className="font-medium">Deadline:</span>{" "}
                  <span className="text-gray-800">{formatDate(details?.delivery_timelines)}</span>
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700 font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  className="rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="$0.00"
                  type="text"
                  {...register("amount")}
                />
                {errors.amount && <ErrorMessage message={errors.amount.message} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectPercentage" className="text-gray-700 font-medium">
                  Project Percentage
                </Label>
                <div className="relative">
                  <Input
                    id="projectPercentage"
                    className="rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white pr-10"
                    placeholder="0"
                    type="text"
                    {...register("projectPercentage")}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
                {errors.projectPercentage && <ErrorMessage message={errors.projectPercentage.message} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  className="rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white min-h-[80px]"
                  placeholder="Add any additional notes..."
                  {...register("notes")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_status" className="text-gray-700 font-medium">
                  Status
                </Label>
                <Controller
                  name="project_status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger
                        className="rounded-md border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white"
                        id="project_status"
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                        <SelectItem value="Pending" className="hover:bg-blue-50">Pending</SelectItem>
                        <SelectItem value="In Progress" className="hover:bg-blue-50">In Progress</SelectItem>
                        <SelectItem value="Completed" className="hover:bg-blue-50">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.project_status && <ErrorMessage message={errors.project_status.message} />}
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-3 py-1.5"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-1.5 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdatePaymentBall;