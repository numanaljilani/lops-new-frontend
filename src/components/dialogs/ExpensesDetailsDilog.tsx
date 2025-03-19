import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

function ExpensesDetailsDilog({
  isDialogOpen,
  setIsDialogOpen,
  data,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  data: any;
}) {
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={(open) => setIsDialogOpen(open)}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>

      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        {" "}
        {/* Add scrollable styles here */}
        <AlertDialogHeader>
          <AlertDialogTitle>Expense Details</AlertDialogTitle>
        </AlertDialogHeader>
        {/* Scrollable Content */}
        <div className="space-y-4">
          <div className="text-lg font-semibold tracking-wide gap-4">
            <div>
              <span className="font-thin">Date</span> : {data?.date}
            </div>
            <div>
              <span className="font-thin">Job Id</span> : {data?.job_number}
            </div>
            <div>
              <span className="font-thin">LPO Id</span> : {data?.lpo_number}
            </div>
            <div>
              <span className="font-thin">Net Amount</span> : {data?.net_amount}
            </div>
            <div>
              <span className="font-thin">VAT</span> : {data?.vat_amount}
            </div>
            <div>
              <span className="font-thin">Total Amount</span> : {data?.amount}
            </div>
            <div>
              <span className="font-thin">Category</span> : {data?.category_display}
            </div>
            <div>
              <span className="font-thin">Description</span> : {data?.description}
            </div>
          </div>
        </div>
        <AlertDialogFooter className="py-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ExpensesDetailsDilog;