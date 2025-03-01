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
import { useComponiesMutation } from "@/redux/query/componiesApi";
import { useCreateEmployeeMutation } from "@/redux/query/employee";
import { useCreateTimeSheetMutation } from "@/redux/query/timesheet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateEmployee() {
  const router = useRouter();
  const [timeSheet, setTimeSheet] = useState<{
    date: any;
    startTime: any;
    endTime: any;
    remark: string;
    hours_logged: any;
    hourly_rate: any;
    total_amount: any;
    // hour
  }>({
    date: date(Date.now()),
    startTime: 0,
    endTime: 0,
    remark: "",
    hours_logged: "",
    hourly_rate: 0,
    total_amount: 0,
  });

  const [createTimeSheetApi, { data, isSuccess, error, isError }] =
    useCreateTimeSheetMutation();
  const saveEmployeeDetails = async () => {
    if (!timeSheet.date) {
      toast(`Date cant be empty.`);
      return;
    }
    if (!timeSheet.startTime) {
      toast(`startTime cant be empty.`);
      return;
    }
    if (!timeSheet.endTime) {
      toast(`location cant be empty.`);
      return;
    }
    if (!timeSheet.hours_logged) {
      toast(`hours_logged cant be empty.`);
      return;
    }

    console.log(timeSheet);
    const res = await createTimeSheetApi({
      data: {
        hours_logged: Number(timeSheet.hours_logged) | 6,
        hourly_rate: Number(timeSheet.hourly_rate) | 10,
        date_logged: formatDateForApi(),
        remarks: timeSheet.remark,
        total_amount: Number(timeSheet.total_amount),
      },
    });
    console.log(res, "response from the server");
  };
  console.log(timeSheet.endTime, timeSheet.startTime);
  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      toast(`You have added your logs.`, {
        description: `${timeSheet?.date} ,${timeSheet?.endTime} in ${timeSheet?.startTime}`,
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
      router.replace("/timesheet");
    }
  }, [isSuccess]);

  const [companies, setCompanies] = useState([]);
  const [
    companiesApi,
    {
      data: comapniesData,
      isSuccess: companiesIsSuccess,
      error: companiesError,
      isError: companiesIsError,
    },
  ] = useComponiesMutation();

  const getCompanies = async () => {
    const res = await companiesApi({});
    // console.log(res, "response");
  };

  // useEffect(() => {
  //   getCompanies();
  // }, []);

  useEffect(() => {
    if (companiesIsSuccess) {
      console.log(comapniesData, "response from server");
      if (comapniesData) {
        setCompanies(comapniesData.result);
      }
    }
  }, [companiesIsSuccess]);
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
                <Button size="sm" onClick={saveEmployeeDetails}>
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
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Start Time</Label>
                        <Input
                          id="name"
                          type="time"
                          className="w-full"
                          placeholder="Hamdan Al Maktoom"
                          onChange={(e) => {
                            e.preventDefault();
                            setTimeSheet({
                              ...timeSheet,
                              startTime: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">End Time </Label>
                        <Input
                          id="end"
                          type="time"
                          className="w-full"
                          onChange={(e) => {
                            e.preventDefault();
                            setTimeSheet({
                              ...timeSheet,
                              endTime: e.target.value,
                              hours_logged: calculateHours(
                                timeSheet.startTime,
                                timeSheet.endTime
                              ),
                            });
                          }}
                        />
                      </div>

                      
                      <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Houres Logged</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">
                          {calculateHours(
                            timeSheet.startTime,
                            timeSheet.endTime
                          )}{" "}
                          Hours
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Remark</Label>
                        <Textarea
                          id="description"
                         className="min-h-32"
                         placeholder="Write a remark......"
                          onChange={(e) => {
                            e.preventDefault();
                            setTimeSheet({
                              ...timeSheet,
                              remark: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
