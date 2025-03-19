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
function AlertDialogAlert({
  isDialogOpen,
  setIsDialogOpen,
  itemToDelete,
  deleteCompany ,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  itemToDelete: any;
  deleteCompany? : boolean 
}) {
  const router = useRouter();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();
  const [deleteCompanyApi] = useDeleteCompanyMutation();

  const deleteEmployee = async (url: string) => {
    // Add your deletion logic here
    // console.log(`Deleting at ${url}`);
    if(deleteCompany){
      const res = await deleteCompanyApi({ id: url.split("/")[6] });
      // console.log(res, ">>>>");
      router.replace("/companies");

    }else{
      const res = await deleteEmployeeApi({ id: url.split("/")[6] });
      // console.log(res, ">>>>");
      router.replace("/employee");
    }

  };
  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete ${itemToDelete?.name}? This action
          cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteEmployee(itemToDelete?.url)}>
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDialogAlert;
