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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useUpdateProjectMutation } from "@/redux/query/jobApi";
import { LoaderCircle } from "lucide-react";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { toast } from "sonner";

const LPOSchema = z.object({
  final_amount: z
    .string()
    .min(1, "Final amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Final amount must be a valid number"),
  delivery_timelines: z.string().min(1, "Delivery timeline is required"),
  payment_terms: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        milestone: z.string().min(1, "Milestone is required"),
        percentage: z
          .number()
          .min(0, "Percentage cannot be negative")
          .max(100, "Percentage cannot exceed 100"),
      })
    )
    .min(1, "At least one payment term is required"),
  scope_of_work: z.string().min(1, "Scope of work is required"),
  lpo_number: z.string().min(1, "LPO number is required"),
  status: z.enum(["Pending", "Ongoing", "Completed"]).default("Pending"),
});

function UpdateProject({
  isDialogOpen,
  setIsDialogOpen,
  data: job,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {


  const [
    updateProjectApi,
    { data: res, isSuccess, isError, error, isLoading },
  ] = useUpdateProjectMutation();

  // Transform payment_terms_display object into an array for useFieldArray
  const defaultPaymentTerms = job?.payment_terms_display
    ? Object.entries(job.payment_terms_display).map(
        ([key, value]: [string, any]) => ({
          description: value.description || "",
          milestone: value.milestone || "",
          percentage: Number(value.percentage) || 0,
        })
      )
    : [{ description: "", milestone: "", percentage: 0 }];



  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LPOSchema),
    defaultValues: {
      final_amount: job?.final_amount?.toString() || "",
      delivery_timelines: job?.delivery_timelines || "",
      payment_terms: defaultPaymentTerms,
      scope_of_work: job?.scope_of_work || "",
      lpo_number: job?.lpo_number || "",
      status: job?.status || "Pending",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms",
  });

  // Reset form when job data changes
  useEffect(() => {
    if (job) {
      const paymentTerms = job.payment_terms
        ? Object.entries(job.payment_terms).map(
            ([key, value]: [string, any]) => ({
              description: value.description || "",
              milestone: value.milestone || "",
              percentage: Number(value.percentage) || 0,
            })
          )
        : [{ description: "", milestone: "", percentage: 0 }];
      reset({
        final_amount: job?.final_amount?.toString() || "",
        delivery_timelines: job?.delivery_timelines || "",
        payment_terms: paymentTerms,
        scope_of_work: job?.scope_of_work || "",
        lpo_number: job?.lpo_number || "",
        status: job?.status || "Pending",
      });
      if (!paymentTerms.length) {
        toast.warning(
          "No payment terms found. Initialized with an empty term."
        );
      }
    }
  }, [job, reset]);

  async function onSubmit(data: any) {
    const paymentTermsObject = data.payment_terms.reduce(
      (acc: any, term: any, index: number) => {
        acc[index + 1] = term;
        return acc;
      },
      {}
    );

    try {
      const response = await updateProjectApi({
        data: {
          ...data,
          rfq: job.rfq_id,
          payment_terms: paymentTermsObject,
        },
        id: job?._id,
      }).unwrap();
   
      toast.success("Job updated successfully!");
      setIsDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error("Job Update Error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to update job. Please try again.";
      toast.error(errorMessage);
    }
  }

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
          <DialogTitle>Update Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to update the job.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="lpo_number">LPO Number</Label>
              <Input id="lpo_number" type="text" {...register("lpo_number")} />
              {errors.lpo_number && (
                <ErrorMessage message={errors.lpo_number.message} />
              )}
            </div>
            <div>
              <Label htmlFor="final_amount">Final Amount</Label>
              <Input
                id="final_amount"
                type="text"
                {...register("final_amount")}
              />
              {errors.final_amount && (
                <ErrorMessage message={errors.final_amount.message} />
              )}
            </div>
            <div>
              <Label htmlFor="delivery_timelines">Delivery Timelines</Label>
              <Input
                id="delivery_timelines"
                type="date"
                {...register("delivery_timelines")}
              />
              {errors.delivery_timelines && (
                <ErrorMessage message={errors.delivery_timelines.message} />
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" aria-label="Select Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <ErrorMessage message={errors.status.message} />
              )}
            </div>
            <div className="grid gap-3">
              <Label>Payment Terms</Label>
              {fields?.map((field, index) => {
              
                return (
                  <div
                    key={field.id}
                    className="space-y-2 border p-4 rounded-lg"
                  >
                    <div className="flex justify-between">
                      <Label>Payment Term {index + 1}</Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={() => remove(index)}
                      >
                        X
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`payment_terms.${index}.description`}>
                        Description
                      </Label>
                      <Input
                        id={`payment_terms.${index}.description`}
                        {...register(`payment_terms.${index}.description`)}
                        placeholder="Description"
                      />
                      {errors.payment_terms?.[index]?.description && (
                        <ErrorMessage
                          message={
                            errors.payment_terms[index].description.message
                          }
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`payment_terms.${index}.milestone`}>
                        Milestone
                      </Label>
                      <Input
                        id={`payment_terms.${index}.milestone`}
                        {...register(`payment_terms.${index}.milestone`)}
                        placeholder="Milestone"
                      />
                      {errors.payment_terms?.[index]?.milestone && (
                        <ErrorMessage
                          message={
                            errors.payment_terms[index].milestone.message
                          }
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`payment_terms.${index}.percentage`}>
                        Percentage
                      </Label>
                      <Input
                        type="number"
                        id={`payment_terms.${index}.percentage`}
                        {...register(`payment_terms.${index}.percentage`, {
                          valueAsNumber: true,
                        })}
                        placeholder="Percentage"
                      />
                      {errors.payment_terms?.[index]?.percentage && (
                        <ErrorMessage
                          message={
                            errors.payment_terms[index].percentage.message
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {errors.payment_terms && !Array.isArray(errors.payment_terms) && (
                <ErrorMessage message={errors.payment_terms.message} />
              )}
              <Button
                type="button"
                className="w-20"
                onClick={() =>
                  append({ description: "", milestone: "", percentage: 0 })
                }
              >
                +
              </Button>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="scope_of_work">Scope of Work</Label>
              <Textarea
                id="scope_of_work"
                className="min-h-32"
                {...register("scope_of_work")}
              />
              {errors.scope_of_work && (
                <ErrorMessage message={errors.scope_of_work.message} />
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
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProject;
