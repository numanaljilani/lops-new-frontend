"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateExpenseMutation,
  useExpensescategoriesMutation,
} from "@/redux/query/expensesApi";
import { useJobsMutation } from "@/redux/query/jobApi";
import { toast } from "sonner";

function CreateExpenseFromPage({
  isDialogOpen,
  setIsDialogOpen,

  data: jobData,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;

  data: any;
}) {
  const [categories, setCategories] = useState([]);
  const LPOSchema = z.object({
    amount: z.string(),
    net_amount: z.string(),
    date: z.string(),
    supplier: z.string().default("1"),
    job_card: z.string(),
    category: z.string(),
    expense_type: z.string(),
    description: z.string(),
    status: z.string().default("Pending"),
  });

  const [createExpense, { data: res, isSuccess, error, isError }] =
    useCreateExpenseMutation();
  const [expensesCategories, { data: expRes }] =
    useExpensescategoriesMutation();

  const getExpCategories = async () => {
    const res = await expensesCategories({});
    if (res.data) {
      setCategories(res.data.results);
    }
  };
  useEffect(() => {
    getExpCategories();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LPOSchema) });

  async function onSubmit(data: any) {
    const response = await createExpense({
      data: {
        ...data,
        supplier: 1,
      },
    });
    console.log(response?.error, "SSSS");
   
      toast("Warning", {
        description:
          "Due to server issue purches or expenses is in added in the project.",
      });
    

    // console.log(response, "response from the server");
    setIsDialogOpen(false);
  }

  const [jobs, setJobs] = useState([]);
  const [jobApi, { data, isSuccess: isJobCardSuccess }] = useJobsMutation();

  const getJobs = async () => {
    const res = await jobApi({});
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (isError) {
      toast("Warning", {
        description:
          "Due to server issue purches or expenses is in added in the project.",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isJobCardSuccess) {
      console.log(data, "response from server");
      if (data) {
        setJobs(data.results);
      }
    }
  }, [isJobCardSuccess]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Add expenses</DialogTitle>
          <DialogDescription>
            fill the form to add the expenses in related project.
          </DialogDescription>
        </DialogHeader>

        {/* <form className=" px-3 "> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border p-5 rounded-lg shadow-lg">
            <div className="grid gap-3">
              <Label htmlFor="status">Job Id </Label>
              <Controller
                name="job_card"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      console.log(value, "Selected Job ID");
                      field.onChange(value); // keep as string or Number(value) if you want number
                    }}
                    value={field.value ?? ""} // ensure value binding
                  >
                    <SelectTrigger id="job_card" aria-label="Select Type">
                      <SelectValue placeholder="Select Job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.length > 0 ? (
                        jobs.map((data: any, index) => (
                          <SelectItem key={index} value={String(data?.job_id)}>
                            {" "}
                            {/* Convert to string */}
                            {data?.job_number}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No jobs available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="amount">Supplier</Label>
              <Input
                id="supplier"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("supplier")}
              />
            </div>
            <div>
              <Label htmlFor="amount">Net value without Tax</Label>
              <Input
                id="net_amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("net_amount")}
              />
            </div>

            <div>
              <Label htmlFor="amount">VAT</Label>
              <Input
                id="amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("amount")}
              />
            </div>
            <div>
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("amount")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Expense Type </Label>
              <Controller
                name="expense_type"
                control={control}
                defaultValue="Material"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="expense_type" aria-label="Select Type">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Labor">Labor</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Transportation">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Subcontractor">
                        Subcontractor
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="delivery_timelines">Date</Label>
              <Input
                id="date"
                type="date"
                // value={formData.password} onChange={handleInputChange}
                {...register("date")}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Category</Label>

              <Controller
                name="category"
                control={control}
                defaultValue="Material"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="category" aria-label="Select Type">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((data: any, index) => {
                        // console.log(data )
                        return (
                          <SelectItem key={index} value={data.name}>
                            {" "}
                            {data.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="Status"
                control={control}
                defaultValue="Pending"
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger id="Status" aria-label="Select Status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Url (documents link)</Label>
              <Textarea
                id="description"
                className="min-h-32"
                {...register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="payment_terms">Remark</Label>
              <Textarea
                id="payment_terms"
                className="min-h-32"
                {...register("remarks")}
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              variant={"secondary"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              // onClick={()=> onSubmit(getValues)}
            >
              Create
            </Button>
          </DialogFooter>
        </form>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpenseFromPage;
