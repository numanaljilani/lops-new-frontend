"use client";
import React from "react";
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
import { useCreateJobMutation } from "@/redux/query/jobApi";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { toast } from "sonner";
import { format } from "date-fns";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger } from "../ui/popover";

const LPOSchema = z.object({
  final_amount: z
    .string()
    .min(1, "Final amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Final amount must be a valid number"),
  project_name: z.string().min(1, "Project name is required"),
  delivery_timelines: z.date(),
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
    .min(1, "At least one payment term is required")
    .transform((arr: any) => {
      return arr.reduce((acc: any, term: any, index: any) => {
        acc[index + 1] = term;
        return acc;
      }, {} as Record<string, { description: string; milestone: string; percentage: number }>);
    }),
  scope_of_work: z.string().min(1, "Scope of work is required"),
  lpo_number: z.string().optional(),
  status: z.enum(["Pending", "Ongoing", "Completed"]).default("Pending"),
});

type LPOFormData = z.infer<typeof LPOSchema>;

export default function CreateProject({
  isDialogOpen,
  setIsDialogOpen,
  data: rfq_info,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  const [createJobApi, { data: res, isSuccess, isError, error, isLoading }] =
    useCreateJobMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LPOFormData>({
    resolver: zodResolver(LPOSchema),
    defaultValues: {
      final_amount: "",
      project_name: "",
      delivery_timelines: new Date(),

      payment_terms: [{ description: "", milestone: "", percentage: 0 }],
      scope_of_work: "",
      lpo_number: "",
      status: "Pending",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms",
  });

  async function onSubmit(data: LPOFormData) {
    console.log("rfq_info:", JSON.stringify(rfq_info, null, 2));
    console.log("form_data:", JSON.stringify(data, null, 2));
    try {
      const response = await createJobApi({
        data: {
          ...data,
          rfq: rfq_info._id,
        },
      }).unwrap();
      console.log(
        "response from the server:",
        JSON.stringify(response, null, 2)
      );
      toast.success("Job created successfully!");
      setIsDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error("Job Creation Error:", JSON.stringify(err, null, 2));
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to create job. Please try again.";
      toast.error(errorMessage);
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) reset();
      }}
    >
      <DialogContent className="bg-white shadow-lg rounded-xl border-none w-full max-w-[90vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            Create Job
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to create a job.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid gap-2">
            <span className="text-sm text-gray-600">Name</span>
            <h5 className="text-base font-semibold text-gray-800">
              {rfq_info?.client?.client_name || "N/A"}
            </h5>
            <span className="text-sm text-gray-600">RFQ ID</span>
            <h5 className="text-base font-semibold text-gray-800">
              {rfq_info?.rfqId || "N/A"}
            </h5>
            <span className="text-sm text-gray-600">Quotation Amount</span>
            <h5 className="text-base font-semibold text-gray-800">
              {rfq_info?.quotation_amount
                ? `${rfq_info.quotation_amount} AED`
                : "N/A"}
            </h5>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-2">
            <Label
              htmlFor="project_name"
              className="text-sm font-medium text-gray-700"
            >
              Project Name
            </Label>
            <Controller
              name="project_name"
              control={control}
              render={({ field }) => (
                <Input
                  id="project_name"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.project_name && (
              <ErrorMessage message={errors.project_name.message} />
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="lpo_number"
              className="text-sm font-medium text-gray-700"
            >
              LPO Number
            </Label>
            <Controller
              name="lpo_number"
              control={control}
              render={({ field }) => (
                <Input
                  id="lpo_number"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.lpo_number && (
              <ErrorMessage message={errors.lpo_number.message} />
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="final_amount"
              className="text-sm font-medium text-gray-700"
            >
              Final Amount
            </Label>
            <Controller
              name="final_amount"
              control={control}
              render={({ field }) => (
                <Input
                  id="final_amount"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.final_amount && (
              <ErrorMessage message={errors.final_amount.message} />
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="delivery_timelines"
              className="text-sm font-medium text-gray-700"
            >
              Delivery Timelines
            </Label>
            <Controller
              name="delivery_timelines"
              control={control}
              render={({ field }) => (
                <Popover >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={"w-full justify-start text-left font-normal"}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(new Date(field.value), "dd/MM/yyyy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 rounded-lg shadow-lg border bg-white ">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.delivery_timelines && (
              <ErrorMessage message={errors.delivery_timelines.message} />
            )}
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="status"
                    className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
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
            {errors.status && <ErrorMessage message={errors.status.message} />}
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-700">
              Payment Terms
            </Label>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid sm:grid-cols-2 gap-2 p-3 rounded-lg bg-gray-50"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={`payment_terms.${index}.description`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Controller
                    name={`payment_terms.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`payment_terms.${index}.description`}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        {...field}
                      />
                    )}
                  />
                  {errors.payment_terms?.[index]?.description && (
                    <ErrorMessage
                      message={errors.payment_terms[index].description.message}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`payment_terms.${index}.milestone`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Milestone
                  </Label>
                  <Controller
                    name={`payment_terms.${index}.milestone`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id={`payment_terms.${index}.milestone`}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Milestone"
                        {...field}
                      />
                    )}
                  />
                  {errors.payment_terms?.[index]?.milestone && (
                    <ErrorMessage
                      message={errors.payment_terms[index].milestone.message}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`payment_terms.${index}.percentage`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Percentage
                  </Label>
                  <Controller
                    name={`payment_terms.${index}.percentage`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id={`payment_terms.${index}.percentage`}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Percentage"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                  {errors.payment_terms?.[index]?.percentage && (
                    <ErrorMessage
                      message={errors.payment_terms[index].percentage.message}
                    />
                  )}
                </div>
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {errors.payment_terms && !Array.isArray(errors.payment_terms) && (
              <ErrorMessage message={errors.payment_terms.message} />
            )}
            <Button
              type="button"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
              onClick={() =>
                append({ description: "", milestone: "", percentage: 0 })
              }
            >
              Add Payment Term
            </Button>
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="scope_of_work"
              className="text-sm font-medium text-gray-700"
            >
              Scope of Work
            </Label>
            <Controller
              name="scope_of_work"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="scope_of_work"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  {...field}
                />
              )}
            />
            {errors.scope_of_work && (
              <ErrorMessage message={errors.scope_of_work.message} />
            )}
          </div>
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
            >
              {isSubmitting || isLoading ? (
                <>
                  <LoaderCircle
                    className="animate-spin -ml-1 mr-2"
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
