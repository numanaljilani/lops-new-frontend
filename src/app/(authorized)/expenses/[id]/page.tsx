"use client";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useExpensescategoriesMutation,
  useGetExpenseByIdMutation,
  useUpdateExpenseMutation,
} from "@/redux/query/expensesApi";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const expensesSchema = z.object({

  category_display: z.string().min(1, "Category is required"),
  expense_type: z.string().min(1, "Expense type is required"),
  net_amount: z.number().positive("Net amount must be positive"),
  vat_percentage: z.number().default(5),
  vat_amount: z.number().min(0, "VAT amount cannot be negative"),
  amount: z.number().positive("Total amount must be positive"),
  payment_mode: z.enum(["Cash", "Bank Transfer", "Cheque"], {
    errorMap: () => ({ message: "Invalid payment mode" }),
  }),
  payment_date: z.string().optional(),
  paid_amount: z.number().min(0).default(0),
  balance_amount: z.number().min(0).default(0),
  due_date: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["Pending", "Partially Paid", "Paid"]).default("Pending"),
  remarks: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expensesSchema>;

function ExpenseDetails() {
  const path = usePathname();
  const { id } = useParams();
  const [updateView, setUpdateView] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState<any>();
  const [categories, setCategories] = useState([]);

  const [expensesDetailsApi, { data, isSuccess, error, isError }] =
    useGetExpenseByIdMutation();
  const [
    updateExpensesApi,
    {
      data: patchData,
      isSuccess: patchIsSuccess,
      error: patchError,
      isError: patchIsError,
    },
  ] = useUpdateExpenseMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      vat_percentage: 5,
      status: "Pending",
      paid_amount: 0,
      balance_amount: 0,
    },
  });

  const net_amount = watch("net_amount");
  const vat_percentage = watch("vat_percentage");

  useEffect(() => {
    if (net_amount && vat_percentage) {
      const vat_amount = (net_amount * vat_percentage) / 100;
      const total_amount = net_amount + vat_amount;
      setValue("vat_amount", parseFloat(vat_amount.toFixed(2)));
      setValue("amount", parseFloat(total_amount.toFixed(2)));
      setValue("balance_amount", parseFloat(total_amount.toFixed(2)));
    }
  }, [net_amount, vat_percentage, setValue]);

  const getExpensesDetails = async () => {
    try {
      const res = await expensesDetailsApi({ id });
      if ("data" in res) {
        setExpenseDetails(res.data);
      }
    } catch (err) {
      toast.error("Error", { description: "Failed to fetch expense details." });
    }
  };

  const updateExpense = async (formData: ExpenseFormValues) => {
    try {
      const res = await updateExpensesApi({
        id,
        data: {
          ...formData,
          projectId : expenseDetails?.projectId?._id,
          net_amount: parseFloat(formData.net_amount.toString()),
          amount: parseFloat(formData.amount.toString()),
          paid_amount: parseFloat(formData.paid_amount.toString()),
          balance_amount: parseFloat(formData.balance_amount.toString()),
          vat_amount: parseFloat(formData.vat_amount.toString()),
          payment_date: formData.payment_date || undefined,
          due_date: formData.due_date || undefined,
        },
      });
      if ("error" in res) {
        throw new Error("Failed to update expense");
      }
      toast.success("Updated", {
        description: "Expense information has been updated.",
      });
      setUpdateView(false);
    } catch (err) {
      toast.error("Error", { description: "Failed to update expense." });
    }
  };

  const [expensesCategories, { data: expRes }] =
    useExpensescategoriesMutation();

  const getExpCategories = async () => {
    try {
      const res = await expensesCategories({});
      if (res.data) {
        setCategories(res.data.results);
      }
    } catch (err) {
      toast.error("Error", { description: "Failed to fetch categories." });
    }
  };

  useEffect(() => {
    getExpensesDetails();
    getExpCategories();
  }, []);

  useEffect(() => {
    if (patchIsSuccess) {
      getExpensesDetails();
    }
  }, [patchIsSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      reset({
        ...data,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        payment_date: data.payment_date
          ? new Date(data.payment_date).toISOString().split("T")[0]
          : "",
        due_date: data.due_date
          ? new Date(data.due_date).toISOString().split("T")[0]
          : "",
      });
      setExpenseDetails(data);
    }
  }, [isSuccess, data, reset]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {updateView ? (
          <main className="w-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Update Expense
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpdateView(false)}
                  >
                    Discard
                  </Button>
                  <Button size="sm" onClick={handleSubmit(updateExpense)}>
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-200 text-red-700 hover:bg-red-300"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="w-full gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="w-full auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Expense Details</CardTitle>
                      <CardDescription>
                        Update the expense details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(updateExpense)}>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label htmlFor="projectId">Project ID</Label>
                            <Label htmlFor="projectId">
                              {expenseDetails?.projectId?.projectId}
                            </Label>

{/*                          
                            {errors.projectId && (
                              <p className="text-red-500 text-sm">
                                {errors.projectId.message}
                              </p>
                            )} */}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="category_display">Category</Label>
                            <Controller
                              name="category_display"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger id="category_display">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Material">
                                      Material
                                    </SelectItem>
                                    <SelectItem value="Labor">Labor</SelectItem>
                                    <SelectItem value="Equipment">
                                      Equipment
                                    </SelectItem>
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
                            {errors.category_display && (
                              <p className="text-red-500 text-sm">
                                {errors.category_display.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="expense_type">Expense Type</Label>
                            <Controller
                              name="expense_type"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger id="expense_type">
                                    <SelectValue placeholder="Select Expense Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Material">
                                      Material
                                    </SelectItem>
                                    <SelectItem value="Labor">Labor</SelectItem>
                                    <SelectItem value="Equipment">
                                      Equipment
                                    </SelectItem>
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
                            {errors.expense_type && (
                              <p className="text-red-500 text-sm">
                                {errors.expense_type.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="net_amount">Net Amount</Label>
                            <Input
                              id="net_amount"
                              type="number"
                              step="0.01"
                              {...register("net_amount", {
                                valueAsNumber: true,
                              })}
                            />
                            {errors.net_amount && (
                              <p className="text-red-500 text-sm">
                                {errors.net_amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="vat_percentage">
                              VAT Percentage
                            </Label>
                            <Input
                              id="vat_percentage"
                              type="number"
                              value="5"
                              readOnly
                              {...register("vat_percentage", {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="vat_amount">VAT Amount</Label>
                            <Input
                              id="vat_amount"
                              type="number"
                              step="0.01"
                              readOnly
                              {...register("vat_amount", {
                                valueAsNumber: true,
                              })}
                            />
                            {errors.vat_amount && (
                              <p className="text-red-500 text-sm">
                                {errors.vat_amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="amount">Total Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              readOnly
                              {...register("amount", { valueAsNumber: true })}
                            />
                            {errors.amount && (
                              <p className="text-red-500 text-sm">
                                {errors.amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="payment_mode">Payment Mode</Label>
                            <Controller
                              name="payment_mode"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger id="payment_mode">
                                    <SelectValue placeholder="Select Payment Mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Bank Transfer">
                                      Bank Transfer
                                    </SelectItem>
                                    <SelectItem value="Cheque">
                                      Cheque
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.payment_mode && (
                              <p className="text-red-500 text-sm">
                                {errors.payment_mode.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="payment_date">Payment Date</Label>
                            <Input
                              id="payment_date"
                              type="date"
                              {...register("payment_date")}
                            />
                            {errors.payment_date && (
                              <p className="text-red-500 text-sm">
                                {errors.payment_date.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="paid_amount">Paid Amount</Label>
                            <Input
                              id="paid_amount"
                              type="number"
                              step="0.01"
                              {...register("paid_amount", {
                                valueAsNumber: true,
                              })}
                            />
                            {errors.paid_amount && (
                              <p className="text-red-500 text-sm">
                                {errors.paid_amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="balance_amount">
                              Balance Amount
                            </Label>
                            <Input
                              id="balance_amount"
                              type="number"
                              step="0.01"
                              readOnly
                              {...register("balance_amount", {
                                valueAsNumber: true,
                              })}
                            />
                            {errors.balance_amount && (
                              <p className="text-red-500 text-sm">
                                {errors.balance_amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                              id="due_date"
                              type="date"
                              {...register("due_date")}
                            />
                            {errors.due_date && (
                              <p className="text-red-500 text-sm">
                                {errors.due_date.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="date">Expense Date</Label>
                            <Input
                              id="date"
                              type="date"
                              {...register("date")}
                            />
                            {errors.date && (
                              <p className="text-red-500 text-sm">
                                {errors.date.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="status">Status</Label>
                            <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger id="status">
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="Partially Paid">
                                      Partially Paid
                                    </SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.status && (
                              <p className="text-red-500 text-sm">
                                {errors.status.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea id="remarks" {...register("remarks")} />
                            {errors.remarks && (
                              <p className="text-red-500 text-sm">
                                {errors.remarks.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUpdateView(false)}
                >
                  Discard
                </Button>
                <Button size="sm" onClick={handleSubmit(updateExpense)}>
                  Save
                </Button>
              </div>
            </div>
          </main>
        ) : (
          <main className="grid flex-1 items-start w-full gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] w-full flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Expense
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <div className="flex justify-between gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setUpdateView(true)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-200 text-red-700 hover:bg-red-300 flex-1"
                      onClick={() => setIsDialogOpen(true)}
                      variant="secondary"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              <div className="gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 w-full">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Expense Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 grid-cols-2">
                        <div className="grid gap-3">
                          <Label htmlFor="projectId">Project ID</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.projectId?._id || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category_display">Category</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.category_display || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="expense_type">Expense Type</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.expense_type || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="net_amount">Net Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.net_amount || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="vat_percentage">VAT Percentage</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.vat_percentage || "5"}%
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="vat_amount">VAT Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.vat_amount || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="amount">Total Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.amount || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="payment_mode">Payment Mode</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.payment_mode || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="payment_date">Payment Date</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.payment_date
                              ? new Date(
                                  expenseDetails?.payment_date
                                ).toLocaleDateString()
                              : "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="paid_amount">Paid Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.paid_amount || "0"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="balance_amount">Balance Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.balance_amount || "0"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="due_date">Due Date</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.due_date
                              ? new Date(
                                  expenseDetails.due_date
                                ).toLocaleDateString()
                              : "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="date">Expense Date</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.date
                              ? new Date(
                                  expenseDetails?.date
                                ).toLocaleDateString()
                              : "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <h4 className="font-semibold text-lg">
                            {expenseDetails?.status || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="remarks">Remarks</Label>
                          <h4 className="font-semibold text-base">
                            {expenseDetails?.remarks || "-"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        )}
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={expenseDetails}
        />
      </div>
    </div>
  );
}

export default ExpenseDetails;
