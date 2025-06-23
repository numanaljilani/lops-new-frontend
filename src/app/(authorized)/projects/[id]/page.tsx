"use client";
import Bubble from "@/components/Bubbles/Bubble";
import ExpensesCard from "@/components/cards/ExpensesCard";
import MyTaskCard from "@/components/cards/MyTaskCard";
import PaymentCard from "@/components/cards/PaymentCard";
import ProjectCard from "@/components/cards/ProjectCard";
import TaskCard from "@/components/cards/TaskCard";
import TimeSheetCard from "@/components/cards/TimeSheetCard";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import ApproveProjectDilog from "@/components/dialogs/ApproveProjectDilog";
import CreateExpense from "@/components/dialogs/CreateExpenses";
import CreatePaymentBall from "@/components/dialogs/CreatePaymentBall";
import CreateQuotation from "@/components/dialogs/CreateQuotation";
import CreateTask from "@/components/dialogs/CreateTask";
import DeleteItem from "@/components/dialogs/DeleteItem";
import ExpensesDetailsDilog from "@/components/dialogs/ExpensesDetailsDilog";
import More from "@/components/dialogs/More";
import UpdateProject from "@/components/dialogs/UpdateProject";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { date, formatDate, isDateGreaterThanToday } from "@/lib/dateFormat";
import { usePaymentBallsListMutation } from "@/redux/query/accountsApi";
import { useProjectEmployeeMutation } from "@/redux/query/employee";

import { useExpensesMutation } from "@/redux/query/expensesApi";
import { useJobDetailsMutation } from "@/redux/query/jobApi";
import {
  useDeletePaymentBallMutation,
  usePaymentsMutation,
  useDeleteTaskMutation,
} from "@/redux/query/paymentApi";
import { useRFQDetailsMutation } from "@/redux/query/rfqsApi";
import { useTasksMutation } from "@/redux/query/taskApi";
import { useTimesheetMutation } from "@/redux/query/timesheet";
import {
  adminAndAccountsAndSalesCanAccess,
  adminAndAccountsCanAccess,
  adminAndSalesAndTeamLeadCanAccess,
  adminAndTeamLeadAndTeamMemberAndSubcontractorCanAccess,
  adminAndTeamLeadCanAccess,
} from "@/utils/accessArrays";
import { hasCommon } from "@/utils/checkAccess";
import {
  Activity,
  Blocks,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Trash2,
  Users,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Wave from "react-wavify";

function ProjectDetails() {
  const path = usePathname();
  const { id } = useParams();

  const [tab, setTab] = useState("Progress");
  const [updateView, setUpdateView] = useState(false);
  const [approve, setApprove] = useState(false);
  const [isExpenseDialog, setIsExpensesDialogOpen] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState({});
  const [paymentBalls, setPaymentBalls] = useState<any>();
  const [paymentBallsDetails, setPaymentBallsDetails] = useState<any>();
  const [taskDetails, setTaskDetails] = useState<any>(undefined);
  const [payemetBallTask, setPaymentBallTask] = useState<any>([]);
  const [expenses, setExpenses] = useState([]);
  const [isCreateExpensesDialogOpen, setIsCreateExpensesDialogOpen] =
    useState(false);
  const [job, setJob] = useState<any>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDeleteDialogOpen, setIsPaymentDeleteDialogOpen] =
    useState(false);
  const [isTaskDeleteDialogOpen, setIsTaskDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [timesheet, setTimeSheet] = useState([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [paymentBallId, setPaymentBallId] = useState<number | undefined>();

  const access = useSelector((state: any) => state?.user?.user.access);

  const [jobDetailsApi, { data, isSuccess, error, isError }] =
    useJobDetailsMutation();
  const [
    projectEmployeeApi,
    { data: projectEmployeeData, isSuccess: isSccessProjectEmployee },
  ] = useProjectEmployeeMutation();
  const [
    taskApi,
    {
      data: taskData,
      isSuccess: taskIsSuccess,
      error: taskError,
      isError: taskIsError,
    },
  ] = useTasksMutation();

  const getProjectEmployee = async () => {
    const res = await projectEmployeeApi({ id });
    console.log(res, ">>>>>");
  };

  useEffect(() => {
    if (tab == "Hours") {
      getProjectEmployee()
    }
  }, [tab]);

  const [daleteTaskApi] = useDeleteTaskMutation();
  const [
    paymentApi,
    {
      data: payementData,
      isSuccess: paymentIsSuccess,
      error: paymentError,
      isError: paymentIsError,
    },
  ] = usePaymentsMutation();
  const [deletePaymentBallApi, {}] = useDeletePaymentBallMutation();

  const [
    timeSheetApi,
    {
      data: timeSheetData,
      isSuccess: isTimeSheetSuccess,
      error: timeSheetError,
      isError: isTimeSheetError,
    },
  ] = useTimesheetMutation();

  const getTimeSheetData = async () => {
    const res = await timeSheetApi({ job_car: id });
    // console.log(res, "Time Sheet data ");
  };

  useEffect(() => {
    if (isSuccess) {
      // console.log(data, "response from server");
      if (timeSheetData) {
        setTimeSheet(timeSheetData.results);
      }
    }
  }, [isSuccess]);
  useEffect(() => {
    if (paymentIsError) {
      // console.log(data, "response from server");
      if (timeSheetData) {
        console.log(paymentError, "paymentError");
      }
    }
  }, [paymentIsError]);
  const getJobDetails = async () => {
    const res = await jobDetailsApi({ id: id });
    console.log(res, ">>>>>>>>>>>>");
  };

  const getPaymentBalls = async () => {
    await paymentApi({ page: 1, id: id });
  };

  let sum = Number(job?.completion_percentage || 0);

  const getTasks = async (id: string) => {
    const res = await taskApi({ id });
    console.log(res, "....");

    if (res?.data) {
      setPaymentBallTask(res?.data?.data);
    }
  };

  useEffect(() => {
    getTimeSheetData();
  }, []);

  useEffect(() => {
    if (paymentIsSuccess) {
      // console.log(payementData, "payementData?.results");
      setPaymentBalls(payementData?.data);
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    getJobDetails();
    getPaymentBalls();
  }, []);
  useEffect(() => {
    if (!isPaymentDialogOpen || !isPaymentDeleteDialogOpen || !more) {
      getPaymentBalls();
    }
  }, [isPaymentDialogOpen, isPaymentDeleteDialogOpen, more]);

  useEffect(() => {
    if (isSuccess) {
      setJob(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isTaskDialogOpen) {
    }
  }, [isTaskDialogOpen]);

  const [
    expenseApi,
    {
      data: expensesData,
      isSuccess: isExpenseSuccess,
      error: expenseError,
      isError: isExpenseError,
    },
  ] = useExpensesMutation();

  const getExpenses = async () => {
    const res = await expenseApi({ job_card: id });
    // console.log(res, "EXPENSES BY PROJECT ID");
  };

  // useEffect(() => {
  //   if (!isCreateExpensesDialogOpen) {
  //     // getExpenses();
  //   }
  // }, [isCreateExpensesDialogOpen]);
  // useEffect(() => {
  //   // getExpenses();
  // }, []);
  // useEffect(() => {
  //   if (!isTaskDialogOpen) {
  //     if (taskDetails?.task_id) {
  //       // getTasks(taskDetails?.task_id);
  //     }
  //   }
  // }, [isTaskDialogOpen]);

  let totalAmount = 0;

  // useEffect(() => {
  //   if (isExpenseSuccess) {
  //     // console.log(expensesData, "expenses response from server");
  //     if (expensesData) {
  //       // setExpenses(expensesData.results);
  //     }
  //   }
  // }, [isExpenseSuccess]);

  // console.log(job?.payment_terms_display, ">>>>");

  const [paymentBallToDelete, setPaymentBallToDelete] = useState();

  const deletePaymentBall = async () => {
    // const res = await deletePaymentBallApi({
    //   id: paymentBallsDetails.payment_id,
    // });
    // console.log(res, "RESPONSE");
  };

  const deleteTask = async () => {
    // const res = await daleteTaskApi({ id: taskDetails?.task_id });
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
            {/* <Button
              className="text-sm gap-3 tracking-wide float-right mx-4"
              onClick={() => setApprove(true)}
            >
              <ClipboardCheck />
              Approve
            </Button> */}
            {/* <Button
              className="text-sm gap-3 tracking-wide float-right"
              onClick={() => setIsTaskDialogOpen(true)}
            >
              <ClipboardCheck />
              Task
            </Button> */}
            {/* <Button
              variant={"secondary"}
              className="text-sm gap-3 tracking-wide float-right mr-4"
              onClick={() => setIsCreateExpensesDialogOpen(true)}
            >
              <Blocks />
              Add Expenses
            </Button> */}
          </div>
          {hasCommon(access, adminAndSalesAndTeamLeadCanAccess) && (
            <div className="flex justify-between  gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5  p-4 bg-white rounded-lg shadow-md">
              {hasCommon(access, adminAndSalesAndTeamLeadCanAccess) && (
                <Bubble
                  color={
                    !isDateGreaterThanToday(job?.delivery_timelines)
                      ? "#D2122E"
                      : sum < 100
                      ? "#5D6166"
                      : "#662d91"
                  }
                  // color={
                  //   sum > 0 && sum < 20
                  //     ? "#c7c4bf"
                  //     : sum < 20 && sum < 40
                  //     ? "#7CB9E8"
                  //     : sum > 40 && sum < 60
                  //     ? "#7F00FF"
                  //     : sum > 60 && sum < 80
                  //     ? "#FF69B4"
                  //     : "#32de84"
                  // }
                  title={"Progress"}
                  value={`${sum || 0}%`}
                  setTab={setTab}
                  btn={true}
                  sum={sum}
                />
              )}
              {hasCommon(access, adminAndAccountsAndSalesCanAccess) && (
                <Bubble
                  color={sum < 100 ? "#5D6166" : "#662d91"}
                  title={"Payment"}
                  value={`${sum || 0}%`}
                  setTab={setTab}
                  btn={true}
                  sum={sum}
                />
              )}
              {hasCommon(access, adminAndTeamLeadCanAccess) && (
                <Bubble
                  color={"#f87171"}
                  title={"Hours"}
                  value={`${job?.totalHours?.toFixed(2)} Hr`}
                  setTab={setTab}
                  btn={true}
                />
              )}
              {hasCommon(access, adminAndAccountsCanAccess) && (
                <Bubble
                  color={"#c084fc"}
                  title={"Expenses"}
                  value={`${(job?.employee_cost + job?.total_expenses).toFixed(
                    3
                  )} AED`}
                  setTab={setTab}
                  btn={true}
                />
              )}
              {hasCommon(access, adminAndAccountsCanAccess) && (
                <Bubble
                  color={"#60a5fa"}
                  title={"Profit"}
                  value={`${Number(
                    Number(job?.final_amount) -
                      job?.employee_cost +
                      job?.total_expenses
                  )?.toFixed(2)} AED`}
                  // setTab={setTab}
                  // btn={true}
                />
              )}
            </div>
          )}
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
                  <ProjectCard
                    job={job}
                    setIsUpdateDialogOpen={setIsUpdateDialogOpen}
                  />
                ) : tab == "Payment" ? (
                  <>
                    {hasCommon(access, adminAndSalesAndTeamLeadCanAccess) && (
                      <PaymentCard
                        setIsPaymentDeleteDialogOpen={
                          setIsPaymentDeleteDialogOpen
                        }
                        setIsPaymentDialogOpen={setIsPaymentDialogOpen}
                        paymentBallsDetails={paymentBallsDetails}
                        paymentBalls={paymentBalls}
                        getTasks={getTasks}
                        setPaymentBallsDetails={setPaymentBallsDetails}
                      />
                    )}

                    {hasCommon(
                      access,
                      adminAndTeamLeadAndTeamMemberAndSubcontractorCanAccess
                    ) && (
                      <TaskCard
                        setIsTaskDialogOpen={setIsTaskDialogOpen}
                        payemetBallTask={payemetBallTask}
                        setTaskDetails={setTaskDetails}
                        setMore={setMore}
                      />
                    )}
                  </>
                ) : tab == "Expenses" ? (
                  <ExpensesCard
                    expenses={expenses}
                    setExpenseDetails={setExpenseDetails}
                    setIsExpensesDialogOpen={setIsExpensesDialogOpen}
                  />
                ) : (
                  <TimeSheetCard timesheet={timesheet} />
                )}

                {hasCommon(
                  access,
                  adminAndTeamLeadAndTeamMemberAndSubcontractorCanAccess
                ) && (
                  <MyTaskCard
                    setIsTaskDialogOpen={setIsTaskDialogOpen}
                    payemetBallTask={payemetBallTask}
                    setTaskDetails={setTaskDetails}
                    setMore={setMore}
                    projectId={id}
                  />
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
        <UpdateProject
          isDialogOpen={isUpdateDialogOpen}
          setIsDialogOpen={setIsUpdateDialogOpen}
          data={job}
        />
        <CreateTask
          isDialogOpen={isTaskDialogOpen}
          setIsDialogOpen={setIsTaskDialogOpen}
          details={job}
          ball={paymentBallsDetails}
          getTasks={getTasks}
        />
        <ExpensesDetailsDilog
          isDialogOpen={isExpenseDialog}
          setIsDialogOpen={setIsExpensesDialogOpen}
          data={expenseDetails}
        />
        <CreatePaymentBall
          isDialogOpen={isPaymentDialogOpen}
          setIsDialogOpen={setIsPaymentDialogOpen}
          details={job}
        />

        <CreateExpense
          setIsDialogOpen={setIsCreateExpensesDialogOpen}
          isDialogOpen={isCreateExpensesDialogOpen}
          data={data}
        />
        <ApproveProjectDilog
          setIsDialogOpen={setApprove}
          isDialogOpen={approve}
        />
        <More
          setIsDialogOpen={setMore}
          isDialogOpen={more}
          data={taskDetails}
          getTasks={getTasks}
          setIsTaskDeleteDialogOpen={setIsTaskDeleteDialogOpen}
        />

        <DeleteItem
          isDialogOpen={isPaymentDeleteDialogOpen}
          setIsDialogOpen={setIsPaymentDeleteDialogOpen}
          text={`Are you sure you want to delete payment ball with Id ${paymentBallsDetails?.payment_id}? This action
          cannot be undone. `}
          deleteItem={deletePaymentBall}
        />
        <DeleteItem
          isDialogOpen={isTaskDeleteDialogOpen}
          setIsDialogOpen={setIsTaskDeleteDialogOpen}
          text={`Are you sure you want to delete the task ? This action
          cannot be undone. `}
          deleteItem={deleteTask}
        />
      </div>
    </div>
  );
}

export default ProjectDetails;
