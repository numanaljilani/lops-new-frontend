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
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { CopyPlus, Trash2 } from "lucide-react";
import { useUpdateTaskMutation } from "@/redux/query/taskApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { hasCommon } from "@/utils/checkAccess";
import { adminAndTeamLeadCanAccess } from "@/utils/accessArrays";

function More({
  isDialogOpen,
  setIsDialogOpen,
  data: cardData,
  getTasks,
  setIsTaskDeleteDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
  getTasks: any;
  setIsTaskDeleteDialogOpen: any;
}) {
  const completeStatusSchema = z.object({
    status: z.string().default("Pending"),
    weightage: z.string().min(1, "Weightage is required"),
    remark: z.string().optional(),
    completion_percentage: z.string().min(1, "Completion percentage is required"),
  });
 const access = useSelector((state: any) => state?.user?.user.access);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } :any = useForm({
    resolver: zodResolver(completeStatusSchema),
    defaultValues: {
      status: cardData?.status || "Pending",
      weightage: cardData?.weightage?.toString() || "0",
      remark: cardData?.remarks || "",
      completion_percentage: cardData?.completion_percentage?.toString() || "0",
    },
  });

  const [updateTaskStatus] = useUpdateTaskMutation();
  const [updateWeightage, setUpdateWeightage] = useState(true);

  useEffect(() => {
    if (cardData) {
      reset({
        status: cardData?.status || "Pending",
        weightage: cardData?.weightage?.toString() || "0",
        remark: cardData?.remarks || "",
        completion_percentage: cardData?.completion_percentage?.toString() || "0",
      });
    }
  }, [cardData, reset]);

  console.log(cardData)
  async function onSubmit(data: any) {
    try {
      const payload = {
        data: {
          ...data,
          due_date: cardData?.due_date,
          task_brief: cardData?.task_brief,
          weightage: parseInt(data.weightage),
          completion_percentage: parseInt(data.completion_percentage),
          paymentId: cardData?.paymentId?._id,
          projectId : cardData?.paymentId?.projectId
        },
        id: cardData?._id,
      };

      const res = await updateTaskStatus(payload).unwrap();
      toast.success("Task updated successfully");
      getTasks(cardData?.paymentId);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Update task error:", error);
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>

      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Task Details</AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="text-lg font-semibold tracking-wide gap-4">
              <div>
                <span className="font-thin">Task Id</span> : {cardData?.task_id}
              </div>
              <div>
                <span className="font-thin">Weightage</span> :{" "}
                {cardData?.weightage}%
              </div>
              <div>
                <span className="font-thin">Completion</span> :{" "}
                {cardData?.completion_percentage}%
              </div>
              <div>
                <span className="font-thin">Due Date</span> :{" "}
                {formatDate(cardData?.due_date)}
              </div>
              <div>
                <span className="font-thin">Status</span> : {cardData?.status}
              </div>
              <div>
                <span className="font-thin">Task Brief</span> :{" "}
                {cardData?.task_brief}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="weightage">Task weightage</Label>
                <div className="flex flex-row gap-x-3">
                  <Input
                    id="weightage"
                    type="number"
                    min="0"
                    max="100"
                    disabled={updateWeightage}
                    {...register("weightage")}
                  />
                {hasCommon(access , adminAndTeamLeadCanAccess) &&  <Button
                    type="button"
                    onClick={() => setUpdateWeightage(!updateWeightage)}
                  >
                    <CopyPlus size={18} />
                  </Button>}
                </div>
                {errors.weightage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weightage.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="completion_percentage">
                  Completion Percentage
                </Label>
                <Input
                  id="completion_percentage"
                  type="number"
                  min="0"
                  max="100"
                  {...register("completion_percentage")}
                />
                {errors.completion_percentage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.completion_percentage.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="remark">Remark</Label>
                <Textarea
                  id="remark"
                  className="min-h-32"
                  {...register("remark")}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Change Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id="status" aria-label="Select Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <AlertDialogFooter className="py-6">
            <Button
              size="lg"
              type="submit"
              className="py-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Save Changes"}
            </Button>
          {hasCommon(access , adminAndTeamLeadCanAccess) &&  <Button
              size="lg"
              type="button"
              className="py-4 gap-x-3"
              variant="destructive"
              onClick={() => setIsTaskDeleteDialogOpen(true)}
            >
              <Trash2 size={18} />
              Delete
            </Button>}
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default More;