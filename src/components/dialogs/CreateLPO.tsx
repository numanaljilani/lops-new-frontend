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
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useCreateJobMutation } from "@/redux/query/jobApi";
import { LoaderCircle } from "lucide-react";

function CreateLPO({
  isDialogOpen,
  setIsDialogOpen,
  data: rfq_info,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  const LPOSchema = z.object({
    final_amount: z.string(),
    project_name: z.string(),
    delivery_timelines: z.string(),
    payment_terms: z
      .array(
        z.object({
          description: z.string(),
          milestone: z.string(),
          percentage: z.number(),
        })
      )
      .transform((arr) => {
        // Convert the array into an object
        return arr.reduce((acc, term, index) => {
          acc[index + 1] = term; // Use index + 1 as the key
          return acc;
        }, {} as Record<string, { description: string; milestone: string; percentage: number }>);
      }),
    scope_of_work: z.string(),
    // lpo: z.string().default("1"),
    lpo_number: z.string(),
    status: z.string().default("Pending"),
  });

  const [createJobApi, { data: res, isSuccess, error, isError, isLoading }] =
    useCreateJobMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LPOSchema) });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payment_terms", // Ensure this matches the field name in your schema
  });
console.log(rfq_info)
  async function onSubmit(data: any) {
    const response = await createJobApi({
      data: {
        ...data,

        rfq: rfq_info.rfq_id,
      },
    });

    console.log(response, "response from the server");
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
            { rfq_info?.client?.client_name}
          </h5>
          <span className="text-sm text-gray-600">RFQ Id</span>
          <h5 className="font-semibold text-lg">{rfq_info.rfqId}</h5>
          <span className="text-sm text-gray-600">Quotation Amount</span>
          <h5 className="font-semibold text-lg">
            {rfq_info.quotation_amount} AED
          </h5>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="project_name">Project Name</Label>
              <Input id="project_name" type="text" {...register("project_name")} />
            </div>
            <div>
              <Label htmlFor="lpo_number">LPO Number</Label>
              <Input id="lpo_number" type="text" {...register("lpo_number")} />
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
                {...register("delivery_timelines")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                defaultValue="Pending"
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
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Input
                    {...register(`payment_terms.${index}.description`)}
                    placeholder="Description"
                  />
                  <Input
                    {...register(`payment_terms.${index}.milestone`)}
                    placeholder="Milestone"
                  />
                  <Input
                    type="number"
                    {...register(`payment_terms.${index}.percentage`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Percentage"
                  />
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  append({ description: "", milestone: "", percentage: 0 })
                }
              >
                Add Payment Term
              </Button>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="scope_of_work">Scope of Work</Label>
              <Textarea
                id="scope_of_work"
                className="min-h-32"
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

export default CreateLPO;
