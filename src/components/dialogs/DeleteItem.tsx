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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function DeleteItem({
  isDialogOpen,
  setIsDialogOpen,
  text,
  deleteItem,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  text: string;
  deleteItem: () => Promise<any>;
}) {
  const handleDelete = async () => {
    try {
      await deleteItem();
      toast.success("Item Deleted", {
        description: "The item has been successfully deleted.",
        style: {
          background: "#10B981",
          color: "white",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Error", {
        description: error?.message || "Failed to delete the item.",
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
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogContent className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-lg",
        "max-w-sm w-full p-5 transition-all duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-90 data-[state=closed]:fade-out-0"
      )}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Delete Item
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-sm">
            {text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel
            className={cn(
              "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
              "rounded-md px-3 py-1.5 text-sm transition-colors duration-150"
            )}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(
              "bg-red-500 text-white hover:bg-red-600",
              "rounded-md px-3 py-1.5 text-sm transition-colors duration-150",
              "focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            )}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteItem;