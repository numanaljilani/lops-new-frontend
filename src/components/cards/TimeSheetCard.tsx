import React from "react";
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
import { useRouter } from "next/navigation";

function TimeSheetCard({timesheet , }: any) {
    const router = useRouter();
  return (
    <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
      <CardHeader>
        <CardTitle>Working Empolyees</CardTitle>
        <CardDescription>
          {/* Enter the employee details and thier performance */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex  items-center gap-5  flex-wrap">
        {timesheet?.map((data: any, index: number) => {
          // console.log(data, "data ....");
          return (
            <div
              key={index}
              className={`border cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
              onClick={() => {
                router.push(`/timesheet/${data._id}`);
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
                  height: "100%",
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
                    <CardTitle className="text-sm text-center font-light">
                      {data?.userId?.userId?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-center">
                      {data?.hours_logged} hr
                    </div>
                    <div className="text-sm font-medium text-center">
                      {data?.date_logged}
                    </div>
                    <div className="text-xs font-light text-gray-600 text-center">
                      {data?.total_amount?.toFixed(2)} AED
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

export default TimeSheetCard;
