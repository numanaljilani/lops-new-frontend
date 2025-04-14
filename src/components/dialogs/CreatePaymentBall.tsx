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

import { cn } from "@/lib/utils";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateField,
  DateInput,
  DatePicker,
  DateSegment,
  Group,
  Heading,
  Popover,
} from "react-aria-components";
import { useEmployeeMutation } from "@/redux/query/employee";
import { formatDate } from "@/lib/dateFormat";
import { useCreateBallMutation } from "@/redux/query/paymentApi";
import { useParams } from "next/navigation";
import { log } from "console";

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

  const PaymentBallSchema = z.object({
    project_percentage: z.string().default("0"),
    project_status: z.string(),
    notes: z.string(),
    // invoice_number: z.string(),
    amount: z.string(),
    payment_terms: z.any(),
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(PaymentBallSchema) });


  const now = today(getLocalTimeZone());
  const [createPaymentBallApi, { data, isSuccess, error, isError }] =
    useCreateBallMutation();
  async function onSubmit(data: any) {
    const res = await createPaymentBallApi({
      data: { ...data, job_card: id, color_status: "gray" },
    });
    console.log(res, "CREATE PAYMENT BAALL");
    setIsDialogOpen(false);
  }



  useEffect(() => {
    if (isSuccess) {
      // console.log(data, "response from server");
      if (data) {
      }
    }
  }, [isSuccess]);
  // job_card - id
  //   job_card - id
  // project_percentage
  // project_status
  // invoice_number
  // amount
  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create Payment Ball</DialogTitle>
          <DialogDescription>
            Fill out the form below to create payment balls.
          </DialogDescription>
        </DialogHeader>

        {/* <form className=" px-3 "> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div className="text-gray-500 text-xs">
              <div>
                Job Id :{" "}
                <span className="text-gray-700 text-sm">{details?.job_id}</span>
              </div>
              <div>
                Job Number :{" "}
                <span className="text-gray-700 text-sm">
                  {details?.job_number}
                </span>
              </div>
              <div>
                Deadline :{" "}
                <span className="text-gray-700 text-sm">
                  {" "}
                  {formatDate(details?.delivery_timelines)}
                </span>
              </div>
              {/* <div>
                Ball :{" "}
                <span className="text-gray-700 text-sm">
                  {" "}
                  {}
                </span>
              </div> */}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>

              <div className="space-y-2">
                <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                  <Input
                    id="input-16"
                    className="-me-px rounded-e-none rounded-lg ps-6 shadow-none"
                    placeholder="000"
                    type="text"
                    {...register("amount")}
                  />
                </div>
              </div>
            </div>
            {/* <div>
              <Label htmlFor="final_amount">Payment Percentage</Label>

              <div className="space-y-2">
                <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                  <Input
                    id="input-16"
                    className="-me-px rounded-e-none ps-6 shadow-none"
                    placeholder="0.00"
                    type="text"
                    {...register("project_percentage")}
                    max={100}
                  />
                  <span className="-z-10 inline-flex items-center rounded-e-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div>
              <Label htmlFor="invoice_number">Invoice Number</Label>

              <div className="space-y-2">
                <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                  <Input
                    id="input-16"
                    className="-me-px rounded-e-none ps-6 shadow-none"
                    placeholder="1234001"
                    type="text"
                    {...register("invoice_number")}
                  />
                </div>
              </div>
            </div> */}
            <div>
              <Label htmlFor="invoice_number">Note</Label>

              <div className="space-y-2">
                <div className="relative flex rounded-lg shadow-sm shadow-black/5">
                  <Input
                    id="input-16"
                    className="-me-px rounded-e-none ps-6 shadow-none"
                    // placeholder="1234001"
                    type="text"
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="project_status">Status</Label>

              <Controller
                name="project_status"
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
                      <SelectItem value="InProgress">InProgress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePaymentBall;
