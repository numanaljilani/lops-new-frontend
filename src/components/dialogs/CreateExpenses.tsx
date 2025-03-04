"use client";
import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '';

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
import { useClientsMutation } from "@/redux/query/clientsApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/errors/ErrorMessage";
import { useCreateJobMutation } from "@/redux/query/jobApi";
import {
  useCreateExpenseMutation,
  useExpensescategoriesMutation,
} from "@/redux/query/expensesApi";
import { log } from "console";

function CreateExpense({
  isDialogOpen,
  setIsDialogOpen,

  data: jobData,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;

  data: any;
}) {
  console.log(jobData, "INFO");
  const [categories, setCategories] = useState([]);
  const LPOSchema = z.object({
    amount: z.string(),
    date: z.string(),
    // job_card: z.string(),
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
    console.log(res.data, "CATE");
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
    console.log(data, "EXPENSES");
    const response = await createExpense({
      data: {
        ...data,
        job_card: jobData.job_id,
      },
    });

    console.log(response, "response from the server");
    setIsDialogOpen(false);
  }

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
            {/* <div>
              <Label htmlFor="job_card">Job Number</Label>
              <Input
                id="job_card"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("job_card")}
              />
            </div> */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                {...register("amount")}
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
                      {categories.map((data: any, index) => (
                        <SelectItem key={index} value={data.id}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
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

export default CreateExpense;
