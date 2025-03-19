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
import { date, formatDate, formatDateForApi } from "@/lib/dateFormat";
import { useJobsMutation } from "@/redux/query/jobApi";
import { useCreateTimeSheetMutation } from "@/redux/query/timesheet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Define the schema using zod
const timeSheetSchema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  remark: z.string().optional(),
  job_card: z.string(),
  hours_logged: z.string().min(1, "Hours logged is required"),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
  total_amount: z.string().min(1, "Total amount is required"),
});

type TimeSheetFormValues = z.infer<typeof timeSheetSchema>;

export default function CreateEmployee() {
  const router = useRouter();
  const [jobs, setJobs] = useState([{job_id : "!!!!" ,job_number : "___"}]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TimeSheetFormValues>({
    resolver: zodResolver(timeSheetSchema),
    defaultValues: {
      date: date(Date.now()),
      startTime: "",
      endTime: "",
      remark: "",
      hours_logged: "",
      hourly_rate: "0",
      total_amount: "0",
    },
  });

  const [createTimeSheetApi, { data, isSuccess, error, isError }] =
    useCreateTimeSheetMutation();

  const onSubmit = async (data: TimeSheetFormValues) => {
    const res = await createTimeSheetApi({
      data: {
        job_card : data.job_card || 1,
        hours_logged: Number(data.hours_logged)?.toFixed(2) || 6,
        hourly_rate: Number(data.hourly_rate) || 10,
        date_logged: formatDateForApi(),
        remarks: data.remark,
        total_amount: Number(data.total_amount),
        team_member : 1,
      },
    });
    console.log(res, "response from the server");
  };

  useEffect(() => {
    if (isSuccess) {
      toast(`You have added your logs.`, {
        description: `${watch("date")} ,${watch("endTime")} in ${watch(
          "startTime"
        )}`,
      });
      router.replace("/timesheet");
    }
  }, [isSuccess]);

  const [companies, setCompanies] = useState([]);

  const [jobApi, { data: jobCardData, isSuccess: isJobCardSuccess }] =
    useJobsMutation();
  const getJobs = async () => {
    const res = await jobApi({});
    if (res.data) {
      setJobs(res?.data?.results);
    }
    
  };

  useEffect(() => {
    getJobs();
  }, []);

 

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className=" flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Add Time and Logs
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </div>
            </div>
            <div className="w-full gap-4 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>{date(Date.now())}</CardTitle>
                    <CardDescription>Enter the Details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="job_card">Job Id</Label>
                          <Controller
                            name="job_card"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value ?? ""}
                              >
                                <SelectTrigger
                                  id="job_card"
                                  aria-label="Select Type"
                                >
                                  <SelectValue placeholder="Select Job" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobs.length > 0 ? (
                                    jobs.map((data: any, index) => (
                                      <SelectItem
                                        key={index}
                                        value={data?.job_id}
                                      >
                                        {data?.job_number}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="" disabled>
                                      No jobs available
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
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
                                className="w-full"
                                placeholder="Start Time"
                              />
                            )}
                          />
                          {errors.startTime && (
                            <span className="text-red-500">
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
                                className="w-full"
                                placeholder="End Time"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  setValue(
                                    "hours_logged",
                                    calculateHours(
                                      watch("startTime"),
                                      e.target.value
                                    )
                                  );
                                }}
                              />
                            )}
                          />
                          {errors.endTime && (
                            <span className="text-red-500">
                              {errors.endTime.message}
                            </span>
                          )}
                        </div>
                        <Card x-chunk="dashboard-07-chunk-3">
                          <CardHeader>
                            <CardTitle>Hours Logged</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-6">
                              <div className="grid gap-3">
                                <Label htmlFor="hours_logged">
                                  {calculateHours(
                                    watch("startTime"),
                                    watch("endTime")
                                  )}{" "}
                                  Hours
                                </Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <div className="grid gap-3">
                          <Label htmlFor="remark">Remark</Label>
                          <Controller
                            name="remark"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                id="remark"
                                className="min-h-32"
                                placeholder="Write a remark......"
                              />
                            )}
                          />
                          {errors.remark && (
                            <span className="text-red-500">
                              {errors.remark.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleSubmit(onSubmit)}>
                Save Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
