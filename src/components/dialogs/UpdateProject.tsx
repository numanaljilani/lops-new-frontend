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
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useClientsMutation } from "@/redux/query/clientsApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { useCreateJobMutation } from "@/redux/query/jobApi";
import { LoaderCircle } from "lucide-react";

function UpdateProject({
  isDialogOpen,
  setIsDialogOpen,
  data: job,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  // console.log(job, "Job Data");

  // Zod schema
  const LPOSchema = z.object({
    final_amount: z.string(),
    delivery_timelines: z.string(),
    payment_terms: z.array(
      z.object({
        description: z.string(),
        milestone: z.string(),
        percentage: z.number(),
      })
    ),
    scope_of_work: z.string(),
    lpo: z.string().default("1"),
    job_number: z.string(),
    lpo_number: z.string(),
    status: z.string().default("Pending"),
  });
  const [createJobApi, { data: res, isSuccess, error, isError, isLoading }] =
    useCreateJobMutation();

// Transform payment_terms_display object into an array for useFieldArray
const defaultPaymentTerms = job?.payment_terms_display
  ? Object.entries(job.payment_terms_display).map(([key, value]: any) => ({
      id: key, // Use the key as the ID
      ...value,
    }))
  : [];

  // console.log(defaultPaymentTerms, "Transformed Payment Terms");
  

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LPOSchema),
    defaultValues: {
      ...job,
      payment_terms: defaultPaymentTerms, // Initialize with existing payment terms
    },
  });

  console.log(errors )
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms", // Name of the field array
  });

  // console.log(fields, "Fields from useFieldArray");

  // Reset the form when the job data changes
  useEffect(() => {
    if (job) {
      reset({
        ...job,
        payment_terms: defaultPaymentTerms, 
      });
    }
  }, [job, reset]);

  async function onSubmit(data: any) {
    // Transform payment_terms array into an object
    const paymentTermsObject = data.payment_terms.reduce((acc: any, term: any, index: any) => {
      acc[index + 1] = term; // Use index + 1 as the key
      return acc;
    }, {});
  
    // Submit the data to the API
    const response = await createJobApi({
      data: {
        ...data,
        rfq: job.rfq_id,
        payment_terms: paymentTermsObject, // Send the transformed object
      },
    });
  
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to create job.
          </DialogDescription>
        </DialogHeader>
        <div className="border p-5 rounded-lg bg-white shadow-lg">
          <span className="text-sm text-gray-600">Name</span>
          <h5 className="font-semibold text-lg">
            {job?.client_name ? job?.client_name : job?.name}
          </h5>
          <span className="text-sm text-gray-600">RFQ Id</span>
          <h5 className="font-semibold text-lg">{job?.rfq_id}</h5>
          <span className="text-sm text-gray-600">Quotation Amount</span>
          <h5 className="font-semibold text-lg">{job?.quotation_amount} AED</h5>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="job_number">Job Number</Label>
              <Input id="job_number" type="text" {...register("job_number")} />
            </div>
            <div>
              <Label htmlFor="lpo_number">LPO Number</Label>
              <Input
                id="lpo_number"
                type="text"
                defaultValue={job?.lpo_number}
                {...register("lpo_number")}
              />
            </div>
            <div>
              <Label htmlFor="final_amount">Final Amount</Label>
              <Input
                id="final_amount"
                type="text"
                {...register("final_amount")}
              />
            </div>
            <div>
              <Label htmlFor="delivery_timelines">Delivery Timelines</Label>
              <Input
                id="delivery_timelines"
                type="date"
                defaultValue={job?.delivery_timelines}
                {...register("delivery_timelines")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                defaultValue={job?.status}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
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
            </div>

            <div className="grid gap-3">
              <Label htmlFor="payment_terms">Payment Terms</Label>
              {fields?.map((field: any, index) => (
                <div key={field.id} className="space-y-2 border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div />
                    <Button
                      type="button"
                      variant={"destructive"}
                      size={"sm"}
                      className="rounded-full"
                      onClick={() => remove(index)}
                    >
                      X
                    </Button>
                  </div>
                  <Input
                    {...register(`payment_terms.${index}.description`)}
                    placeholder="Description"
                    defaultValue={field?.description} // Set default value
                  />
                  <Input
                    {...register(`payment_terms.${index}.milestone`)}
                    placeholder="Milestone"
                    defaultValue={field?.milestone} // Set default value
                  />
                  <Input
                    type="number"
                    {...register(`payment_terms.${index}.percentage`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Percentage"
                    defaultValue={field?.percentage} // Set default value
                  />
                </div>
              ))}
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
                defaultValue={job?.scope_of_work}
                {...register("scope_of_work")}
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              variant={"secondary"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              {isLoading && (
                <LoaderCircle
                  className="-ms-1 me-2 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProject;
