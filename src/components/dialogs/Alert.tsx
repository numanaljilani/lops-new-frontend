"use client";
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
} from "@/components/ui/alert-dialog";

function Alert({
  isDialogOpen,
  setIsDialogOpen,
  handleDelete,
  name,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleDelete: () => void;
  name: string;
}) {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent className="bg-white shadow-lg rounded-xl border-none max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-gray-800">
            Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete {name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex gap-3">
          <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 transition-all duration-200 border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;