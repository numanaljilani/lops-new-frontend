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
import { Textarea } from "@/components/ui/textarea";
import { calculateHours } from "@/lib/calculateHours";
import { date } from "@/lib/dateFormat";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useCreateTimeSheetMutation } from "@/redux/query/timesheet";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, Toaster } from "sonner";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

const timeSheetSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  remark: z.string().optional(),
  hours_logged: z.string().optional(),
  total_amount: z.number().optional(),
});

type TimeSheetFormValues = z.infer<typeof timeSheetSchema>;

export default function CreateTimesheet() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
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

  const convertToMongoDate = (time: string) => {
    if (!time) return "";
    const today = new Date();
    const [hours, minutes] = time.split(":");
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return today.toISOString();
  };

  const fetchDefaultJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res :any = await jobApi({}).unwrap();
      console.log("Default Jobs API Response:", JSON.stringify(res, null, 2));
      const jobsData = res?.data || [];
      setJobs(jobsData);
      if (jobsData.length === 0) {
        toast.warning("No jobs found.");
      }
    } catch (err :any) {
      console.error("Default Jobs Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to load jobs: " + (err?.data?.message || err.message || "Unknown error"));
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadJobs = useCallback(
    debounce(async (inputValue: string, callback: (options: any[]) => void) => {
      try {
        console.log("Search Input:", inputValue);
        const res = await jobApi({ search: inputValue }).unwrap();
        console.log("Search Jobs API Response:", JSON.stringify(res, null, 2));
        const jobsData = res?.data || [];
        const options = jobsData.map((job: any) => ({
          value: job._id,
          label: job.projectId + " * " + job?.project_name || "No Project ID",
        }));
        console.log("Search Options:", options);
        callback(options);
        console.log("Callback Executed with Options:", options);
      } catch (err: any) {
        console.error("Search Jobs Fetch Error:", JSON.stringify(err, null, 2));
        toast.error("Failed to fetch jobs: " + (err?.data?.message || err.message || "Unknown error"));
        const options = jobs
          .filter((job: any) =>
            job.projectId?.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((job: any) => ({
            value: job._id,
            label: job.projectId || "No Project ID",
          }));
        console.log("Fallback Search Options:", options);
        callback(options);
        console.log("Callback Executed with Fallback Options:", options);
      }
    }, 500),
    [jobApi, jobs]
  );

  useEffect(() => {
    fetchDefaultJobs();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast("You have added your logs.", {
        description: `${watch("startTime")} - ${watch("endTime")}`,
      });
      router.replace("/timesheet");
    }
  }, [isSuccess, router, watch]);

  const onSubmit = async (data: TimeSheetFormValues) => {
    try {
      const hoursLogged = calculateHours(data.startTime, data.endTime);
      const response = await createTimeSheetApi({
        data: {
          ...data,
          startTime: convertToMongoDate(data.startTime),
          endTime: convertToMongoDate(data.endTime),
          hours_logged: Number(hoursLogged).toFixed(2),
          remarks: data.remark,
          total_amount: Number(data.total_amount) || 0,
        },
      }).unwrap();
      console.log("response from the server:", JSON.stringify(response, null, 2));
    } catch (err: any) {
      console.error("Error creating timesheet:", JSON.stringify(err, null, 2));
      toast.error("Failed to create timesheet", {
        description: err?.data?.message || err.message || "Please try again later.",
      });
    }
  };

  const defaultOptions = jobs.map((job: any) => ({
    value: job._id,
    label: job.projectId + "  |  " + (job?.project_name || '-'),
  }));

  console.log("Default Options:", defaultOptions);
  console.log("Selected projectId:", watch("projectId"));

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-y-auto">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8 w-full max-w-[90vw] sm:max-w-3xl md:max-w-4xl mx-auto">
        <main className="grid gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <h1 className="text-base font-semibold text-gray-800">
              Add Time and Logs
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                disabled={isCreating}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 transition-all duration-200"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit(onSubmit)}
                disabled={isCreating}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
              >
                {isCreating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <Card className="bg-white shadow-lg rounded-xl border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-800">
                {date(Date.now())}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Enter the timesheet details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="projectId" className="text-sm font-medium text-gray-700">
                    Project ID
                  </Label>
                  {isLoadingJobs ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={defaultOptions}
                          loadOptions={(inputValue, callback) => {
                            console.log("loadOptions Triggered with Input:", inputValue);
                            loadJobs(inputValue, callback);
                          }}
                          isLoading={isJobApiLoading}
                          placeholder="Search for a project..."
                          noOptionsMessage={() => "No projects found"}
                          onChange={(option) => {
                            console.log("Selected Option:", option);
                            field.onChange(option ? option.value : "");
                          }}
                          value={
                            field.value
                              ? defaultOptions.find((opt) => opt.value === field.value) || {
                                  value: field.value,
                                  label: field.value,
                                }
                              : null
                          }
                          isClearable
                          isSearchable
                          className="w-full"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: errors.projectId ? "red" : base.borderColor,
                              "&:hover": {
                                borderColor: errors.projectId ? "red" : base.borderColor,
                              },
                              borderRadius: "0.5rem",
                              padding: "0.25rem",
                              boxShadow: errors.projectId ? "0 0 0 1px red" : base.boxShadow,
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                              width: "100%",
                            }),
                          }}
                        />
                      )}
                    />
                  )}
                  {errors.projectId && (
                    <span className="text-red-500 text-sm">{errors.projectId.message}</span>
                  )}
                </div>
                <div />
                <div className="grid gap-2">
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                    Start Time
                  </Label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="startTime"
                        type="time"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Start Time"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("hours_logged", calculateHours(e.target.value, watch("endTime")));
                        }}
                      />
                    )}
                  />
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">{errors.startTime.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                    End Time
                  </Label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="endTime"
                        type="time"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="End Time"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("hours_logged", calculateHours(watch("startTime"), e.target.value));
                        }}
                      />
                    )}
                  />
                  {errors.endTime && (
                    <span className="text-red-500 text-sm">{errors.endTime.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours_logged" className="text-sm font-medium text-gray-700">
                    Hours Logged
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {calculateHours(watch("startTime"), watch("endTime"))} Hours
                    </span>
                  </div>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="remark" className="text-sm font-medium text-gray-700">
                    Remarks
                  </Label>
                  <Controller
                    name="remark"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="remark"
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        placeholder="Write a remark..."
                        {...field}
                      />
                    )}
                  />
                  {errors.remark && (
                    <span className="text-red-500 text-sm">{errors.remark.message}</span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}