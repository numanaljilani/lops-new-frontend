"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardCheck, Trash2, Edit2 } from "lucide-react";
import { Label } from "../ui/label";
import Wave from "react-wavify";
import { isDateGreaterThanToday } from "@/lib/dateFormat";
import { hasCommon } from "@/utils/checkAccess";
import { adminAndSalesCanAccess } from "@/utils/accessArrays";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function PaymentCard({
  setIsPaymentDeleteDialogOpen,
  setIsPaymentDialogOpen,
  setIsPaymentUpdateDialogOpen,
  paymentBalls,
  paymentBallsDetails,
  getTasks,
  setPaymentBallsDetails,
}: any) {
  const access = useSelector((state: any) => state?.user?.user.access);

  const handleCreateClick = () => {
    setIsPaymentDialogOpen(true);
    toast.info("Opening Create Payment Ball", {
      description: "You can now create a new payment ball.",
      style: {
        background: "#3B82F6",
        color: "white",
        border: "none",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  const handleDeleteClick = () => {
    if (paymentBallsDetails) {
      setIsPaymentDeleteDialogOpen(true);
      toast.warning("Confirm Deletion", {
        description: "Please confirm to delete the selected payment ball.",
        style: {
          background: "#F59E0B",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    } else {
      toast.error("No Payment Ball Selected", {
        description: "Please select a payment ball to delete.",
        style: {
          background: "#EF4444",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

  const handleUpdateClick = () => {
    if (paymentBallsDetails) {
      setIsPaymentUpdateDialogOpen(true);
      toast.info("Opening Update Payment Ball", {
        description: "You can now edit the selected payment ball.",
        style: {
          background: "#3B82F6",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    } else {
      toast.error("No Payment Ball Selected", {
        description: "Please select a payment ball to update.",
        style: {
          background: "#EF4444",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

  return (
    <Card className="min-h-64 border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Payments
        </CardTitle>
        {hasCommon(access, adminAndSalesCanAccess) && (
          <CardDescription className="flex gap-2">
            <Button
              className={cn(
                "text-sm flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100",
                "rounded-md px-3 py-1.5 transition-colors duration-150"
              )}
              variant="outline"
              onClick={handleCreateClick}
            >
              <ClipboardCheck size={16} />
              Create
            </Button>
            <Button
              className={cn(
                "text-sm flex items-center gap-2 border border-blue-300 text-blue-700 hover:bg-blue-100",
                "rounded-md px-3 py-1.5 transition-colors duration-150",
                !paymentBallsDetails && "opacity-50 cursor-not-allowed"
              )}
              variant="outline"
              onClick={handleUpdateClick}
              disabled={!paymentBallsDetails}
            >
              <Edit2 size={16} />
              Update
            </Button>
            <Button
              className={cn(
                "text-sm flex items-center gap-2 border border-red-300 text-red-700 hover:bg-red-100",
                "rounded-md px-3 py-1.5 transition-colors duration-150",
                !paymentBallsDetails && "opacity-50 cursor-not-allowed"
              )}
              variant="outline"
              onClick={handleDeleteClick}
              disabled={!paymentBallsDetails}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4">
          {paymentBalls?.map((ballData: any, index: number) => (
            <div
              key={index}
              className={cn(
                "border-2 rounded-full size-32 relative overflow-hidden cursor-pointer",
                "hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg",
                paymentBallsDetails?._id === ballData?._id
                  ? "border-blue-500"
                  : "border-gray-300"
              )}
              onClick={() => {
                getTasks(ballData?._id);
                setPaymentBallsDetails(ballData);
              }}
            >
              <Wave
                fill={
                  isDateGreaterThanToday(ballData?.delivery_timelines)
                    ? "#EF4444"
                    : "#10B981"
                }
                paused={true}
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: `${ballData?.completionPercentage || 0}%`,
                }}
                options={{
                  height: -10,
                  amplitude: 3,
                }}
              />
              <div className="absolute inset-0 flex justify-center items-center z-10">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {ballData?.project_status}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {ballData?.completionPercentage}%
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    {ballData?.projectPercentage}%
                  </div>
                  <div className="text-xs text-gray-500 max-w-[80px] truncate">
                    {ballData?.notes || "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default PaymentCard;