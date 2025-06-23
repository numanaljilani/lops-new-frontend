import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardCheck } from "lucide-react";
import { Label } from "../ui/label";
import Wave from "react-wavify";
import { useSelector } from "react-redux";
import { hasCommon } from "@/utils/checkAccess";
import { adminAndTeamLeadCanAccess } from "@/utils/accessArrays";
import { useMyTasksMutation, useTaskDetailsMutation } from "@/redux/query/taskApi";

function MyTaskCard({ projectId ,payemetBallTask, setTaskDetails, setMore }: any) {
  const [
    taskApi,
    {
      data: taskData,
      isSuccess: taskIsSuccess,
      error: taskError,
      isError: taskIsError,
    },
  ] = useMyTasksMutation();

  
  const getMyTasks = async () => {
    const res = await taskApi({projectId });
    console.log(res , "My Tasks")
  };
  useEffect(() => {
    getMyTasks();
  }, []);

 
  return (
    <Card x-chunk="dashboard-07-chunk-0" className="min-h-64 mt-5">
      <CardHeader>
        <CardTitle>My tasks</CardTitle>
        <CardDescription>
          {/* Enter the employee details and thier performance */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex  items-center gap-x-5">
        {taskData?.data?.map((data: any, index: number) => {
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
                  flex: 1,
                  height: `${data?.completion_percentage}%`,
                }}
                options={{
                  height: -20,

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
                      {data?.completion_percentage}%
                    </div>
                    <div className="text-sm font-medium text-center">
                      {data?.status}
                    </div>
                    <div className="text-xs font-light text-gray-600 text-center">
                      {data?.remarks?.length < 30
                        ? data?.remarks
                        : `${data?.remarks?.substring(0, 40)} ...`}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default MyTaskCard;
