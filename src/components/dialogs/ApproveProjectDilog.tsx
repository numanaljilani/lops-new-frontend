import React from "react";
import {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
} from "@/redux/query/employee";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dateFormat";
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
import { useRouter } from "next/navigation";
import { useDeleteCompanyMutation } from "@/redux/query/componiesApi";

//   {isDialogOpen : boolean , setIsDialogOpen : (value: boolean) => void , itemToDelete :any ,delete :  (value: string) => void }
function ApproveProjectDilog({
  isDialogOpen,
  setIsDialogOpen,

}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;

}) {

  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Project Approval</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to aprove this project? `}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>setIsDialogOpen(false)}>
            Approve
          </AlertDialogAction>
          <AlertDialogAction className="bg-red-600"  onClick={()=>setIsDialogOpen(false)}>
            Reject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ApproveProjectDilog;
