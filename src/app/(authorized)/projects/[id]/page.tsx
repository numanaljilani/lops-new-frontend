"use client";
import Bubble from "@/components/Bubbles/Bubble";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import ApproveProjectDilog from "@/components/dialogs/ApproveProjectDilog";
import CreateExpense from "@/components/dialogs/CreateExpenses";
import CreatePaymentBall from "@/components/dialogs/CreatePaymentBall";
import CreateQuotation from "@/components/dialogs/CreateQuotation";
import CreateTask from "@/components/dialogs/CreateTask";
import More from "@/components/dialogs/More";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { date, formatDate } from "@/lib/dateFormat";
import { useComponiesMutation } from "@/redux/query/componiesApi";
import { usePatchEmployeeMutation } from "@/redux/query/employee";
import { useJobDetailsMutation } from "@/redux/query/jobApi";
import {
  usePaymentsMutation,
  useTasksMutation,
} from "@/redux/query/paymentApi";
import { useRFQDetailsMutation } from "@/redux/query/rfqsApi";
import {
  Activity,
  Blocks,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Wave from "react-wavify";
import { toast, Toaster } from "sonner";

function ProjectDetails() {
  const path = usePathname();

  const [tab, setTab] = useState("Progress");
  const [updateView, setUpdateView] = useState(false);
  const [approve, setApprove] = useState(false);
  const [paymentBalls, setPaymentBalls] = useState<any>();
  const [paymentBallsDetails, setPaymentBallsDetails] = useState<any>();
  const [taskDetails, setTaskDetails] = useState<any>(undefined);
  const [payemetBallTask, setPaymentBallTask] = useState<any>([]);
  const [isCreateExpensesDialogOpen, setIsCreateExpensesDialogOpen] =
    useState(false);

  //   console.log(path.split("/").reverse()[0], "Path name");
  const [job, setJob] = useState<{
    job_id: string;
    rfq_date: string;
    project_type: string;
    scope_of_work: string;
    remarks: string;
    companyf: string;
    delivery_timelines: string;
    salary: number;
    hourly: number;
    Currency: string;
    status: string;
  }>({
    job_id: "",
    rfq_date: "",
    project_type: "",
    scope_of_work: "",
    remarks: "",
    companyf: "",
    delivery_timelines: "",
    salary: 0,
    hourly: 0,
    Currency: "",
    status: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [paymentBallId, setPaymentBallId] = useState<number | undefined>();
  const [jobDetailsApi, { data, isSuccess, error, isError }] =
    useJobDetailsMutation();
  const [
    taskApi,
    {
      data: taskData,
      isSuccess: taskIsSuccess,
      error: taskError,
      isError: taskIsError,
    },
  ] = useTasksMutation();
  const [
    paymentApi,
    {
      data: payementData,
      isSuccess: paymentIsSuccess,
      error: paymentError,
      isError: paymentIsError,
    },
  ] = usePaymentsMutation();

  const getJobDetails = async () => {
    console.log(job);
    const res = await jobDetailsApi({ id: path?.split("/")?.reverse()[0] });
    console.log(res, "response from the server");
  };

  const getPaymentBals = async () => {
    const res = await paymentApi({ id: path?.split("/")?.reverse()[0] });
  };

  let sum = paymentBalls?.reduce(
    (accumulator: any, current: any) =>
      accumulator + Number(current.project_percentage),
    0
  );

  const getTasks = async (id: number) => {
    const res = await taskApi({ id });

    console.log(res, id, "Response >>>>");
    setPaymentBallTask([...res.data.results]);
  };

  useEffect(() => {
    if (paymentIsSuccess) {
      setPaymentBalls(payementData?.results);
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    getJobDetails();
    getPaymentBals();
  }, []);
  useEffect(() => {
    if (!isPaymentDialogOpen) {
      getPaymentBals();
    }
  }, [isPaymentDialogOpen]);

  useEffect(() => {
    if (isSuccess) {
      // console.log(data, "response from the server");

      setJob(data);
    }
  }, [isSuccess]);

  // const [
  //   patchEmployeApi,
  //   {
  //     data: patchData,
  //     isSuccess: patchIsSuccess,
  //     error: patchError,
  //     isError: patchIsError,
  //   },
  // ] = usePatchEmployeeMutation();
  // const [companies, setCompanies] = useState<any>([]);
  // const [
  //   companiesApi,
  //   {
  //     data: comapniesData,
  //     isSuccess: companiesIsSuccess,
  //     error: companiesError,
  //     isError: companiesIsError,
  //   },
  // ] = useComponiesMutation();

  // const getCompanies = async () => {
  //   const res = await companiesApi({});
  // };

  // useEffect(() => {
  //   getCompanies();
  // }, []);

  // useEffect(() => {
  //   if (companiesIsSuccess) {
  //     console.log(comapniesData, "response from server");
  //     if (comapniesData) {
  //       setCompanies(comapniesData);
  //     }
  //   }
  // }, [companiesIsSuccess]);

  const pamentBallDetailsFunction = async (payload: any) => {
    setPaymentBallsDetails(payload);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="">
            {/* <Button
              className="text-sm gap-3 ml-5 tracking-wide float-right"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <ClipboardCheck />
              Payment Ball
            </Button> */}
            <Button
              className="text-sm gap-3 tracking-wide float-right mx-4"
              onClick={() => setApprove(true)}
            >
              <ClipboardCheck />
              Approve
            </Button>
            <Button
              className="text-sm gap-3 tracking-wide float-right"
              onClick={() => setIsTaskDialogOpen(true)}
            >
              <ClipboardCheck />
              Task
            </Button>
            <Button
              variant={"secondary"}
              className="text-sm gap-3 tracking-wide float-right mr-4"
              onClick={() => setIsCreateExpensesDialogOpen(true)}
            >
              <Blocks />
              Add Expenses
            </Button>
          </div>
          <div className="grid bg-pur gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5  p-4 bg-white rounded-lg shadow-md">
            <Bubble
              color={"#60a5fa"}
              title={"Progress"}
              value={"20%"}
              setTab={setTab}
              btn={true}
            />
            <Bubble
              color={
                sum > 0 && sum < 20
                  ? "#c7c4bf"
                  : sum < 20 && sum < 40
                  ? "#7CB9E8"
                  : sum > 40 && sum < 60
                  ? "#7F00FF"
                  : sum > 60 && sum < 80
                  ? "#FF69B4"
                  : "#32de84"
              }
              title={"Payment"}
              value={`${sum || 0}%`}
              setTab={setTab}
              btn={true}
            />
            <Bubble
              color={"#f87171"}
              title={"Hours"}
              value={"20 Hr"}
              setTab={setTab}
              btn={true}
            />
            <Bubble
              color={"#c084fc"}
              title={"Expenses"}
              value={"34%"}
              setTab={setTab}
              btn={true}
            />
            <Bubble
              color={"#60a5fa"}
              title={"Etc"}
              value={"34%"}
              setTab={setTab}
              btn={true}
            />
          </div>
          <div className="mx-auto w-full flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Project
              </h1>

              <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
            </div>
            <div className="gap-4  lg:gap-8">
              <div className=" w-full auto-rows-max items-start gap-4  lg:gap-8">
                {tab == "Progress" ? (
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                      <CardDescription>
                        {/* Enter the employee details and thier performance */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid gap-3">
                            <Label htmlFor="name">Job Id</Label>

                            <h4 className="font-semibold text-lg">
                              {job.job_id}
                            </h4>
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="name">Status</Label>

                            <h4 className="font-semibold text-lg">
                              {job.status}
                            </h4>
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Delivry Timeline</Label>

                          <h4 className="font-semibold text-lg">
                            {date(job?.delivery_timelines)}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Scop of Work</Label>

                          <h4 className="font-semibold text-lg">
                            {job.scope_of_work}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Remark</Label>

                          <h4 className="font-semibold text-lg">
                            {job.remarks}
                          </h4>
                        </div>

                        {
                          <div className="grid gap-3">
                            <Label htmlFor="name">Payment Terms </Label>

                            {paymentBalls?.payment_terms?.map(
                              (data: any, index: any) => (
                                <h4
                                  className="font-semibold text-lg"
                                  key={index}
                                >
                                  {data?.milestone} - {data.percentage}% -{" "}
                                  {data.description}
                                </h4>
                              )
                            )}
                          </div>
                        }
                      </div>
                    </CardContent>
                  </Card>
                ) : tab == "Payment" ? (
                  <>
                    <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
                      <CardHeader className="flex-">
                        <CardTitle>Payments</CardTitle>
                        <CardDescription>
                          <Button
                            className="text-sm gap-3 ml-5 tracking-wide float-right"
                            onClick={() => {
                              setIsPaymentDialogOpen(true);
                            }}
                          >
                            <ClipboardCheck />
                            Payment Ball
                          </Button>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex  items-center">
                        <div className="flex gap-5">
                          {/* {paymentBalls?.map((data, index) => ( */}

                          {paymentBalls?.map((ballData: any, index: number) => {
                            // console.log(ballData , "BALL DATA")
                            return (
                              <div
                                key={index}
                                className={`border cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                                onClick={() => {
                                  getTasks(ballData?.payment_id);
                                  setPaymentBallsDetails(ballData);
                                }}
                              >
                                <Wave
                                  // fill="#60a5fa"
                                  fill={"#4ade80"}
                                  paused={true}
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: 0,
                                  }}
                                  options={{
                                    height: 50,

                                    amplitude: 2,
                                    // speed: 0.15,
                                    // points: 3,
                                  }}
                                ></Wave>

                                <Card
                                  x-chunk="dashboard-01-chunk-0"
                                  className="rounded-full size-64 flex justify-center items-center "
                                >
                                  <div className="z-30">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                      <CardTitle className="text-md text-center font-medium">
                                        {ballData?.project_status}
                                      </CardTitle>

                                      {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold text-center">
                                        {ballData?.project_percentage}
                                      </div>
                                      <div className="text-xs font-light text-gray-600 text-center">
                                        {ballData?.notes}
                                      </div>
                                    </CardContent>
                                  </div>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                    {
                      <Card
                        x-chunk="dashboard-07-chunk-0"
                        className="min-h-64 mt-5"
                      >
                        <CardHeader>
                          <CardTitle>
                            Task in this payment ball
                            <Button
                              className="text-sm gap-3 tracking-wide float-right"
                              onClick={() => setIsTaskDialogOpen(true)}
                            >
                              <ClipboardCheck />
                              Task
                            </Button>
                          </CardTitle>
                          <CardDescription>
                            {/* Enter the employee details and thier performance */}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex  items-center ">
                          {payemetBallTask.map((data: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`border cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                                onClick={() => {
                                  // getTasks(paymentBalls.job_card);
                                  setTaskDetails(data);
                                  setMore(true);
                                }}
                              >
                                <Wave
                                  // fill="#60a5fa"
                                  fill={"#4ade80"}
                                  paused={true}
                                  style={{
                                    display: "flex",
                                    position: "absolute",
                                    bottom: 0,
                                  }}
                                  options={{
                                    height: 50,

                                    amplitude: 2,
                                    // speed: 0.15,
                                    // points: 3,
                                  }}
                                ></Wave>

                                <Card
                                  x-chunk="dashboard-01-chunk-0"
                                  className="rounded-full size-64 flex justify-center items-center "
                                >
                                  <div className="z-30">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                      <CardTitle className="text-md text-center font-medium">
                                        {data?.assignee_name}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-xl font-bold text-center">
                                        {data?.weightage}%
                                      </div>
                                      <div className="text-sm font-medium text-center">
                                        {data?.status}
                                      </div>
                                      <div className="text-xs font-light text-gray-600 text-center">
                                        {data?.remarks?.length < 30
                                          ? data?.remarks
                                          : `${data?.remarks?.substring(
                                              0,
                                              40
                                            )} ...`}
                                      </div>
                                    </CardContent>
                                  </div>
                                </Card>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    }

                  </>
                ) : tab == "Expenses" ? (
                  <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
                    <CardHeader>
                      <CardTitle>Expenses</CardTitle>
                      <CardDescription>
                        {/* Enter the employee details and thier performance */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex  items-center">
                   
                    </CardContent>
                  </Card>
                ) : (
                  <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
                    <CardHeader>
                      <CardTitle>Working Empolyees</CardTitle>
                      <CardDescription>
                        {/* Enter the employee details and thier performance */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex  items-center">
                      <div className="flex gap-5">
                       
                       
                       
                        
                       
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={job}
        />
        <CreateTask
          isDialogOpen={isTaskDialogOpen}
          setIsDialogOpen={setIsTaskDialogOpen}
          details={job}
          ball={paymentBallsDetails}
        />
        <CreatePaymentBall
          isDialogOpen={isPaymentDialogOpen}
          setIsDialogOpen={setIsPaymentDialogOpen}
          details={job}
        />

        <CreateExpense
          setIsDialogOpen={setIsCreateExpensesDialogOpen}
          isDialogOpen={isCreateExpensesDialogOpen}
          data={{}}
        />
        <ApproveProjectDilog
                setIsDialogOpen={setApprove}
                isDialogOpen={approve}
        />
        <More
        setIsDialogOpen={setMore}
        isDialogOpen={more}
        data={taskDetails}
        />
      </div>
    </div>
  );
}

export default ProjectDetails;
