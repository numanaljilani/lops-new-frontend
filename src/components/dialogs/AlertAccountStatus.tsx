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
  const LPOSchema = z.object({
    amount: z.string().default(item?.amount),
    status: z.string().default("Pending"),
    verification_status: z.string().default(item?.verification_status),

    project_status: z.string().default(item?.verification_status),
    project_percentage: z.string().default(item?.project_percentage),
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
    console.log(data, "DATA");
    const response = await verifyPaymentStatus({
      data: {
        ...data,
        job_card: item?.job_card,
      },
      id: item.payment_id,
    });

    // console.log(response, "response from the server");
    setIsDialogOpen(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Verify</DialogTitle>
          <DialogDescription>fill the form.</DialogDescription>
        </DialogHeader>

        {/* <form className=" px-3 "> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div>
              <Label htmlFor="job_card">Job Id</Label>
              <Input
                id="job_card"
                type="text"
                disabled
                // value={formData.password} onChange={handleInputChange}
                value={item?.job_card}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                defaultValue={item?.amount}
                // value={formData.password} onChange={handleInputChange}
                {...register("amount")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>

              <Controller
                name="project_status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="project_status" aria-label="Select Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="InProgress">InProgress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                      <SelectItem value={"verified"}>{"verified"}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="project_percentage">Project Percentage</Label>
              <Input
                id="project_percentage"
                type="text"
                defaultValue={item?.project_percentage}
                {...register("project_percentage")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                className="min-h-32"
                {...register("notes")}
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

            <Button type="submit" onClick={onSubmit}>
              Create
            </Button>
          </DialogFooter>
        </form>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}
