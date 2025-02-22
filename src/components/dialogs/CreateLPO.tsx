"use client";
import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '';

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
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
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
    delivery_timelines: z.string(),
    payment_terms: z.string(),
    scope_of_work: z.string(),
    lpo: z.string().default("1"),
    job_number: z.string(),
    status: z.string().default("Pending"),
  });

  const [createJobApi, { data: res, isSuccess, error, isError, isLoading }] =
    useCreateJobMutation();

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LPOSchema) });

  async function onSubmit(data: any) {
    const response = await createJobApi({
      data: {
        ...data,
        rfq: rfq_info.rfq_id,
        payment_terms: {
          "1": {
            milestone: "Phase 1",
            percentage: 40.0,
            description: "Initial development",
          },
        },
      },
    });

    console.log(response, "response from the server");
    setIsDialogOpen(false);
  }

  console.log(errors, ">>>>");
  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to create job .
          </DialogDescription>
        </DialogHeader>
        <div className="border p-5 rounded-lg bg-white shadow-lg">
          <span className="text-sm text-gray-600">Name</span>
          <h5 className="font-semibold text-lg">
            {rfq_info.client_name ? rfq_info.client_name : rfq_info.name}
          </h5>
          <span className="text-sm text-gray-600">RFQ Id</span>
          <h5 className="font-semibold text-lg">{rfq_info.rfq_id}</h5>
          <span className="text-sm text-gray-600">Qoutation Amount</span>
          <h5 className="font-semibold text-lg">
            {rfq_info.quotation_amount} AED
          </h5>
        </div>

        {/* <form className=" px-3 "> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="job_number">Job Number</Label>
              <Input
                id="job_number"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("job_number")}
              />
            </div>
            <div>
              <Label htmlFor="final_amount">Final Amount</Label>
              <Input
                id="final_amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("final_amount")}
              />
            </div>
            <div>
              <Label htmlFor="delivery_timelines">Delivery Timelines</Label>
              <Input
                id="delivery_timelines"
                type="date"
                // value={formData.password} onChange={handleInputChange}
                {...register("delivery_timelines")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>

              <Controller
                name="Status"
                control={control}
                defaultValue="Pending"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="Status" aria-label="Select Status">
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
              <Textarea
                id="payment_terms"
                className="min-h-32"
                {...register("payment_terms")}
              />
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

            <Button
              type="submit"
              // onClick={()=> onSubmit(getValues)}
            >
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
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}

export default CreateLPO;
