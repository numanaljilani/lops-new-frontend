"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { calculateHours } from "@/lib/calculateHours";
import { date } from "@/lib/dateFormat";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useCreateTimeSheetMutation } from "@/redux/query/timesheet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";

function Skeleton({ className } : any) {
  return <div className={`animate-pulse bg-muted rounded-md ${className}`} />;
}

// Define the schema using zod
const timeSheetSchema = z.object({
  projectId: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  remark: z.string().optional(),
  hours_logged: z.string().optional(),
  total_amount: z.number().optional(),
});

type TimeSheetFormValues = z.infer<typeof timeSheetSchema>;

export default function CreateEmployee() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TimeSheetFormValues>({
    resolver: zodResolver(timeSheetSchema),
    defaultValues: {
      projectId: "",
      startTime: "",
      endTime: "",
      remark: "",
      hours_logged: "0",
      total_amount: 0,
    },
  });

  const [createTimeSheetApi, { data, isSuccess, isLoading: isCreating, isError, error }] =
    useCreateTimeSheetMutation();
  const [jobApi, { data: jobCardData, isSuccess: isJobCardSuccess, isLoading: isJobApiLoading }] =
    useJobsMutation();

  // Convert time to MongoDB ISO format (e.g., "09:00" -> "2025-06-23T09:00:00.000Z")
  const convertToMongoDate = (time: string) => {
    if (!time) return "";
    const today = new Date();
    const [hours, minutes] = time.split(":");
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return today.toISOString();
  };

  const onSubmit = async (data: TimeSheetFormValues) => {
    try {
      const res = await createTimeSheetApi({
        data: {
          ...data,
          startTime: convertToMongoDate(data.startTime),
          endTime: convertToMongoDate(data.endTime),
          hours_logged: Number(data.hours_logged)?.toFixed(2) || "6.00",
          remarks: data.remark,
          total_amount: Number(data.total_amount) || 0,
        },
      });
      console.log(res, "response from the server");
    } catch (err) {
      console.error("Error creating timesheet:", err);
      toast.error("Failed to create timesheet", {
        description: "Please try again later.",
      });
    }
  };

  const getJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await jobApi({});
      console.log(res , "RES")
      if (res?.data?.data) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast("You have added your logs.", {
        description: `${watch("startTime")} - ${watch("endTime")}`,
      });
      router.replace("/timesheet");
    }
  }, [isSuccess, router, watch]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
        <main className="grid border w-full flex-1 items-start gap-4 max-w-7xl mx-auto">
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h1 className="text-xl font-semibold tracking-tight">
                Add Time and Logs
              </h1>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  disabled={isCreating}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreating}
                >
                  {isCreating ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{date(Date.now())}</CardTitle>
                <CardDescription>Enter the timesheet details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-3">
                      <Label htmlFor="projectId">Job ID</Label>
                      {isLoadingJobs ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <Controller
                          name="projectId"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value ?? ""}
                            >
                              <SelectTrigger id="projectId">
                                <SelectValue placeholder="Select Job" />
                              </SelectTrigger>
                              <SelectContent>
                                {jobs?.length > 0 ? (
                                  jobs.map((data: any, index) => (
                                    <SelectItem
                                      key={index}
                                      value={data._id}
                                    >
                                      {data.projectId}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="-" disabled>
                                    No jobs available
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}
                      {errors.projectId && (
                        <span className="text-red-500 text-sm">
                          {errors.projectId.message}
                        </span>
                      )}
                    </div>
                    <div/>
                    <div className="grid gap-3">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="startTime"
                            type="time"
                            placeholder="Start Time"
                          />
                        )}
                      />
                      {errors.startTime && (
                        <span className="text-red-500 text-sm">
                          {errors.startTime.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="endTime">End Time</Label>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="endTime"
                            type="time"
                            placeholder="End Time"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setValue(
                                "hours_logged",
                                calculateHours(watch("startTime"), e.target.value)
                              );
                            }}
                          />
                        )}
                      />
                      {errors.endTime && (
                        <span className="text-red-500 text-sm">
                          {errors.endTime.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="hours_logged">Hours Logged</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {calculateHours(watch("startTime"), watch("endTime"))} Hours
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:col-span-2">
                      <Label htmlFor="remark">Remarks</Label>
                      <Controller
                        name="remark"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            id="remark"
                            className="min-h-32"
                            placeholder="Write a remark..."
                          />
                        )}
                      />
                      {errors.remark && (
                        <span className="text-red-500 text-sm">
                          {errors.remark.message}
                        </span>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="flex gap-2 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.back()}
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}