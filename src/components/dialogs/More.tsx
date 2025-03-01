import React from "react";
import {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
} from "@/redux/query/employee";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dateFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateTtasksMutation } from "@/redux/query/paymentApi";

function More({
  isDialogOpen,
  setIsDialogOpen,
  data : cardData,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  const completeStatusSchema = z.object({
    status: z.string().default("Pending"),
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(completeStatusSchema) });

  const [updateTaskStatus, { data: taskResponse, isSuccess, error, isError }] =
    useUpdateTtasksMutation();
    // console.log(data, "ONSUBMIT");
  async function onSubmit(data: any) {
    const res = await updateTaskStatus({
      data: { ...data , due_date : cardData?.due_date , task_brief : cardData?.task_brief,
        weightage : cardData?.weightage , 
        payment_ball : cardData?.payment_ball

      },
      id: cardData?.task_id,
    });
    console.log(res, "res");
    setIsDialogOpen(false);
  }

  console.log(errors);
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>

      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        {" "}
        {/* Add scrollable styles here */}
        <AlertDialogHeader>
          <AlertDialogTitle>Task Details</AlertDialogTitle>
        </AlertDialogHeader>
        {/* Scrollable Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="text-lg font-semibold tracking-wide gap-4">
              <div>
                <span className="font-thin">Task Id</span> : {cardData?.task_id}
              </div>
              <div>
                <span className="font-thin">Completion</span> :{" "}
                {cardData?.weightage}%
              </div>
              <div>
                <span className="font-thin">Due Date</span> : {cardData?.due_date}
              </div>
              <div>
                <span className="font-thin">Status</span> : {cardData?.status}
              </div>
              <div>
                <span className="font-thin">Task Brief</span> :{" "}
                {cardData?.task_brief}
              </div>
            </div>

            <div>
              <span className="font-semibold">Remark : </span>
              <AlertDialogDescription>{cardData?.remarks}</AlertDialogDescription>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Change Status</Label>
              <Controller
                name="status"
                control={control}
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
                      <SelectItem value="InProgress">InProgress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <AlertDialogFooter className="py-6">
            
            <Button size="lg" type="submit" className="py-4">
              Mark
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default More;