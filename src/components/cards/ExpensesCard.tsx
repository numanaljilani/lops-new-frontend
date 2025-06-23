import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardCheck, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import Wave from "react-wavify";
import { isDateGreaterThanToday } from "@/lib/dateFormat";

function ExpensesCard({
  expenses,
  setExpenseDetails,
  setIsExpensesDialogOpen,
}: any) {
  return (
    <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription className="flex  gap-5 flex-wrap">
          {expenses?.map((data: any, index: number) => {
            // console.log(data, "EXP");
            return (
              <div
                // onDoubleClick={()=>{
                //   setExpenseDetails(data)
                //   setIsExpensesDialogOpen(true)
                // }}
                key={index}
                className={`border cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                onClick={() => {
                  // getTasks(paymentBalls.job_card);
                  setExpenseDetails(data);
                  setIsExpensesDialogOpen(true);
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
                      <CardTitle className="text-md text-center font-medium">
                        {data?.assignee_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold text-center">
                        {data?.amount} AED
                      </div>
                      <div className="text-sm font-medium text-center">
                        {data?.category_name}
                      </div>
                      <div className="text-xs font-light text-gray-600 text-center">
                        {data?.expense_type?.length < 30
                          ? data?.expense_type
                          : `${data?.expense_type?.substring(0, 40)} ...`}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            );
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex  items-center"></CardContent>
    </Card>
  );
}

export default ExpensesCard;
