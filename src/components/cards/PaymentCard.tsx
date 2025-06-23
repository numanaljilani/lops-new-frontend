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
import { hasCommon } from "@/utils/checkAccess";
import { adminAndSalesCanAccess } from "@/utils/accessArrays";
import { useSelector } from "react-redux";

function PaymentCard({
  setIsPaymentDeleteDialogOpen,
  setIsPaymentDialogOpen,
  paymentBalls,
  paymentBallsDetails,
  getTasks,
  setPaymentBallsDetails,
}: any) {
  const access = useSelector((state: any) => state?.user?.user.access);
  return (
    <Card x-chunk="dashboard-07-chunk-0" className="min-h-64">
      <CardHeader className="flex-">
        <CardTitle>Payments</CardTitle>
        {hasCommon(access, adminAndSalesCanAccess) && (
          <CardDescription>
            {paymentBallsDetails && (
              <Button
                className="text-sm gap-3 ml-5 tracking-wide float-right border border-red-30 hover:border-red-600 hover:bg-red-100 hover:text-red-600"
                variant={"outline"}
                onClick={() => {
                  setIsPaymentDeleteDialogOpen(true);
                }}
              >
                <Trash2 size={18} />
                Delete
              </Button>
            )}
            <Button
              className="text-sm gap-3 ml-5 tracking-wide float-right"
              onClick={() => {
                setIsPaymentDialogOpen(true);
              }}
            >
              <ClipboardCheck size={18} />
              Create Payment Ball
            </Button>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex  items-center">
        <div className="flex gap-5">
          {/* {paymentBalls?.map((data, index) => ( */}

          {paymentBalls?.map((ballData: any, index: number) => {
            // console.log(isDateGreaterThanToday(ballData?.delivery_timelines), " 11111>>>>>>>>");

            return (
              <div
                key={index}
                className={`border-2 ${
                  paymentBallsDetails?._id === ballData?._id
                    ? "border-blue-600"
                    : ""
                } cursor-pointer size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                onClick={() => {
                  getTasks(ballData?._id);
                  setPaymentBallsDetails(ballData);
                  // console.log("Selected Ball Data:", ballData);
                }}
              >
                <Wave
                  fill={
                    isDateGreaterThanToday(ballData?.delivery_timelines)
                      ? "#D2122E"
                      : "#4ade80"
                  }
                  paused={true}
                  style={{
                    display: "flex",
                    position: "absolute",
                    bottom: 0,
                    height: `${ballData?.completionPercentage || 0}%`,
                  }}
                  options={{
                    height: -20,
                    amplitude: 2,
                  }}
                ></Wave>
                <Card
                  x-chunk="dashboard-01-chunk-0"
                  className="rounded-full size-64 flex justify-center items-center"
                >
                  <div className="z-30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md text-center font-medium">
                        {ballData?.project_status}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-center">
                        {ballData?.completionPercentage}%
                      </div>
                      <div className="text-sm font-bold text-center">
                        {ballData?.projectPercentage}%
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
  );
}

export default PaymentCard;
