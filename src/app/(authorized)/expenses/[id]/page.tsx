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
import { useComponiesMutation } from "@/redux/query/componiesApi";
import {
  useEmployeeDetailsMutation,
  usePatchEmployeeMutation,
} from "@/redux/query/employee";
import {
  useExpensescategoriesMutation,
  useGetExpenseByIdMutation,
} from "@/redux/query/expensesApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define Zod schema for form validation
const employeeSchema = z.object({
  date: z.string().min(1, "Date is required"),
  job_number: z.string().min(1, "Job number is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  vat_amount: z.string().min(1, "VAT amount is required"),
  expense_type: z.string().min(1, "Expense type is required"),
  description: z.string().min(1, "Description is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

function Employee() {
  const path = usePathname();
  const [updateView, setUpdateView] = useState(false);
  const [expneseDetails, setExpneseDetails] = useState<any>();
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
  ] = usePatchEmployeeMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      date: "",
      job_number: "",
      category: "",
      amount: "",
      vat_amount: "",
      expense_type: "",
      description: "",
    },
  });

  const getExpensesDetails = async () => {
    const res = await expensesDetailsApi({
      id: path?.split("/")?.reverse()[0],
    });
    console.log(res, "EXPENSES RESPONSE");
  };

  const updateEmployee = async (formData: EmployeeFormValues) => {
    const res = await updateExpensesApi({
      id: path?.split("/")?.reverse()[0],
      details: formData,
    });
    console.log(res, "updated");
    toast(`Updated`, {
      description: "Employee information has been updated.",
    });
    setUpdateView(false);
  };

  useEffect(() => {
    getExpensesDetails();
  }, []);

  useEffect(() => {
    if (patchIsSuccess) {
      getExpensesDetails();
      setUpdateView(false);
    }
  }, [patchIsSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      reset(data); // Reset form with fetched data
      setExpneseDetails(data);
    }
  }, [isSuccess, data, reset]);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {updateView ? (
          <main className="w-full flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Update Purchase
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUpdateView(false)}
                  >
                    Discard
                  </Button>
                  <Button size="sm" onClick={handleSubmit(updateEmployee)}>
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
                      <CardTitle>Purchase Details</CardTitle>
                      <CardDescription>
                        Enter the Purchase details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(updateEmployee)}>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <div>
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                // value={formData.password} onChange={handleInputChange}
                                {...register("date")}
                              />
                            </div>
                            {errors.date && (
                              <p className="text-red-500 text-sm">
                                {errors.date.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="job_number">Job Number</Label>
                            <Input
                              id="job_number"
                              type="text"
                              disabled
                              {...register("job_number")}
                              defaultValue={expneseDetails?.job_number}
                            />
                            {errors.job_number && (
                              <p className="text-red-500 text-sm">
                                {errors.job_number.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <div className="grid gap-3">
                              <Label htmlFor="category">Category</Label>

                              <Controller
                                name="category"
                                control={control}
                                defaultValue="Material"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    value={field.value}
                                  >
                                    <SelectTrigger
                                      id="category"
                                      aria-label="Select Type"
                                    >
                                      <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((data: any, index) => (
                                        <SelectItem
                                          key={index}
                                          value={data.name}
                                        >
                                          {data.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            {errors?.category && (
                              <p className="text-red-500 text-sm">
                                {errors?.category?.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              type="text"
                              {...register("amount")}
                              defaultValue={expneseDetails?.amount}
                            />
                            {errors.amount && (
                              <p className="text-red-500 text-sm">
                                {errors.amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="vat_amount">VAT Amount</Label>
                            <Input
                              id="vat_amount"
                              type="text"
                              {...register("vat_amount")}
                              defaultValue={expneseDetails?.vat_amount}
                            />
                            {errors.vat_amount && (
                              <p className="text-red-500 text-sm">
                                {errors.vat_amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="vat_amount">Total Amount</Label>
                            <Input
                              id="amount"
                              type="text"
                              {...register("amount")}
                              defaultValue={expneseDetails?.amount}
                            />
                            {errors.amount && (
                              <p className="text-red-500 text-sm">
                                {errors.amount.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="status">Expense Type </Label>

                            <Controller
                              name="expense_type"
                              control={control}
                              defaultValue="Material"
                              render={({ field }) => (
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(value)
                                  }
                                  value={field.value}
                                >
                                  <SelectTrigger
                                    id="expense_type"
                                    aria-label="Select Type"
                                  >
                                    <SelectValue placeholder="Select Status" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              {...register("description")}
                              defaultValue={expneseDetails?.description}
                            />
                            {errors.description && (
                              <p className="text-red-500 text-sm">
                                {errors.description.message}
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
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={handleSubmit(updateEmployee)}>
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
                  Purchase
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <div className="flex justify-between gap-2 ">
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
              <div className=" gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 ">
                <div className=" auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8  w-full">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Purchase Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="date">Date</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.date}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="job_number">Job Id</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.job_number}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="category_name">Category</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.category_name}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="amount">Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.amount}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="vat_amount">VAT Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.vat_amount || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="vat_amount">Total Amount</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.amount || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="expense_type">Expense Type</Label>
                          <h4 className="font-semibold text-lg">
                            {expneseDetails?.expense_type || "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <h4 className="font-semibold text-base">
                            {expneseDetails?.description || "-"}
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
          itemToDelete={expneseDetails}
        />
      </div>
    </div>
  );
}

export default Employee;
