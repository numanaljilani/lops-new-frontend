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
import { useAccountsDetailsMutation } from "@/redux/query/accountsApi";
import { formatDate } from "@/lib/dateFormat";

import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CardFooter } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDeleteCompanyMutation } from "@/redux/query/componiesApi";

import Alert from "@/components/dialogs/Alert";
import { usePaymentBallsListMutation } from "@/redux/query/accountsApi";
import AlertAccountStatus from "@/components/dialogs/AlertAccountStatus";
import Wave from "react-wavify";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
// Import Pagination components
import { PaginationComponent } from "@/components/PaginationComponent";

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

function AccountsDetails() {
  const path = usePathname();
  const [updateView, setUpdateView] = useState(false);
  const [accountsDetails, setAccountsDetails] = useState<any>();
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentBalls, setPaymentBalls] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Number of items per page

  const [accountsDetailsApi, { data, isSuccess, error, isError }] =
    useAccountsDetailsMutation();
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

  const getAccountsDetails = async (id: any) => {
    const res = await accountsDetailsApi({
      id,
    });
  };

  useEffect(() => {
    if (patchIsSuccess) {
      setUpdateView(false);
    }
  }, [patchIsSuccess]);

  const [
    paymentApi,
    {
      data: payementData,
      isSuccess: paymentIsSuccess,
      error: paymentError,
      isError: paymentIsError,
    },
  ] = usePaymentBallsListMutation();

  const getPaymentBalls = async () => {
    setLoading(true); // Set loading to true before fetching data
    await paymentApi({ page, id: path?.split("/")?.reverse()[0],percentage : 100 });
  };

  useEffect(() => {
    if (paymentIsSuccess) {
      console.log(payementData);
      setPaymentBalls(payementData.results);
      setLoading(false); // Set loading to false after data is fetched
    }
  }, [paymentIsSuccess]);

  useEffect(() => {
    if (!isDialogOpen) {
      getPaymentBalls();
    }
  }, [isDialogOpen, page]);

  useEffect(() => {
    if (isSuccess && data) {
      reset(data); // Reset form with fetched data
      setAccountsDetails(data);
    }
  }, [isSuccess, data, reset]);

  return (
    <div>
      <div className="flex w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  {/* Add any additional buttons or filters here */}
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Project Accounts</CardTitle>
                    <CardDescription>
                      Manage accounts and pay the bills of project{" "}
                      {accountsDetails?.job_number}.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-10 py-10">
                    {loading ? (
                      // Skeleton loading UI
                      Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          className="h-40 w-40 rounded-full"
                        />
                      ))
                    ) : paymentBalls?.length === 0 ? (
                      //No data message
                      <div className="w-full text-center py-10">
                        <p className="text-muted-foreground">
                          No data available.
                        </p>
                      </div>
                    ) : (
                      paymentBalls?.map((data: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => getAccountsDetails(data?.payment_id)}
                          className={`border-2 ${
                            data?.payment_id == accountsDetails?.payment_id
                              ? "border-blue-600"
                              : ""
                          } cursor-pointer size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`}
                        >
                          <Wave
                            fill={
                              data?.verification_status == "paid"
                                ? "#17B169"
                                : data?.verification_status == "invoiced"
                                ? "#DA498D"
                                : "#662d91"
                            }
                            paused={true}
                            style={{
                              display: "flex",
                              position: "absolute",
                              bottom: 0,
                              flex: 1,
                              height: `${100}%`,
                            }}
                            options={{
                              height: -20,
                              amplitude: 2,
                            }}
                          ></Wave>

                          <Card
                            x-chunk="dashboard-01-chunk-0"
                            className="rounded-full size-64 flex justify-center items-center"
                          >
                            <div className="z-30">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
                              <CardContent>
                                <div className="text-xl font-bold text-center text-white">
                                  {data?.amount} AED
                                </div>
                                <div className="text-sm tracking-wider font-light text-white text-center">
                                {data?.verification_status == 'unverified' ? "Raedy to invoice" : data?.verification_status}
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          <AlertAccountStatus
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            item={accountsDetails}
          />
        </div>
      </div>

      <div className="flex min-h-screen w-full flex-col bg-muted/40 ">
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
                    <Button
                      size="sm"
                      //   onClick={handleSubmit(updateEmployee)}
                    >
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
                        <form
                        //   onSubmit={handleSubmit(updateEmployee)}
                        >
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
                                defaultValue={accountsDetails?.job_number}
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
                                defaultValue={accountsDetails?.amount}
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
                                defaultValue={accountsDetails?.vat_amount}
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
                                defaultValue={accountsDetails?.amount}
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
                                      <SelectItem value="Labor">
                                        Labor
                                      </SelectItem>
                                      <SelectItem value="Equipment">
                                        Equipment
                                      </SelectItem>
                                      <SelectItem value="Transportation">
                                        Transportation
                                      </SelectItem>
                                      <SelectItem value="Subcontractor">
                                        Subcontractor
                                      </SelectItem>
                                      <SelectItem value="Other">
                                        Other
                                      </SelectItem>
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
                                defaultValue={accountsDetails?.description}
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
                  {/* <Button size="sm" onClick={handleSubmit(updateEmployee)}>
                  Save
                </Button> */}
                </div>
              </div>
            </main>
          ) : (
            accountsDetails && (
              <main className="grid flex-1 items-start w-full gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid  w-full flex-1 auto-rows-max gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                      Accounts Details
                    </h1>

                    <div className="hidden items-center gap-2 md:ml-auto md:flex">
                      <div className="flex justify-between gap-2 ">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setItem(accountsDetails);
                            setIsDialogOpen(true);
                          }}
                        >
                          Update Invoice
                        </Button>
                        {/* <Button
                      size="sm"
                      className="bg-red-200 text-red-700 hover:bg-red-300 flex-1"
                      onClick={() => setIsDialogOpen(true)}
                      variant="secondary"
                    >
                      Delete
                    </Button> */}
                      </div>
                    </div>
                  </div>
                  <div className=" gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 ">
                    <div className=" auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8  w-full">
                      <Card x-chunk="dashboard-07-chunk-0">
                        <CardHeader>
                          <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6 grid-cols-2">
                            <div className="grid gap-3">
                              <Label htmlFor="date">Invoice No. </Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.invoice_number}
                              </h4>
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="job_number">Job Id</Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.job_number}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="category_name">Status</Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.verification_status == 'unverified' ? "Raedy to invoice" : accountsDetails?.verification_status}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="amount">Completion</Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.project_status}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">Date</Label>
                              <h4 className="font-semibold text-lg">
                                {formatDate(accountsDetails?.verification_date)}
                              </h4>
                            </div>
                            <div className="grid gap-3"></div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">
                                Total Amount without Tax
                              </Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.amount || "-"}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">Total Amount</Label>
                              <h4 className="font-semibold text-lg">
                                {Number(Number(accountsDetails?.amount) + Number(accountsDetails?.vat_amount))|| "-"}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">
                                Charity pertage
                              </Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.charity_percentage + "%" ||
                                  "-"}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">Charity Amount</Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.charity_amount || "-"}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">
                                VAT pertage
                              </Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.vat_percentage + "%" || "-"}
                              </h4>
                            </div>
                            <div className="grid gap-3">
                              <Label htmlFor="vat_amount">VAT Amount</Label>
                              <h4 className="font-semibold text-lg">
                                {accountsDetails?.vat_amount || "-"}
                              </h4>
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="description">Description</Label>
                              <h4 className="font-semibold text-base">
                                {accountsDetails?.notes || "-"}
                              </h4>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </main>
            )
          )}
          {/* <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={accountsDetails}
        /> */}
        </div>
      </div>
    </div>
  );
}

export default AccountsDetails;
