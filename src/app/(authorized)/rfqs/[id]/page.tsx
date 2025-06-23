"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, usePathname } from "next/navigation";
import { toast, Toaster } from "sonner";
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
  useDeleteRfqMutation,
  useRFQDetailsMutation,
  useUpdateRFQMutation,
} from "@/redux/query/rfqsApi";
import { useClientsMutation } from "@/redux/query/clientsApi"; // Import the clients API
import { formatDate } from "@/lib/dateFormat";
import { LoaderCircle } from "lucide-react";
import Alert from "@/components/dialogs/Alert";

// Zod schema for validation

function RFQDetails() {
  const path = usePathname();
  const { id } = useParams();
  const [updateView, setUpdateView] = useState(false); // State to toggle between read-only and edit modes
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [
    rfqDetaislApi,
    {
      data: rfqData,
      isSuccess: rfqIsSuccess,
      error: rfqError,
      isError: rfqIsError,
    },
  ] = useRFQDetailsMutation();
  const rfqSchema = z.object({
    rfq_id: z.optional(),
    client: z
      .string()
      .min(1, "Client ID is required and must be a positive number"),
    project_type: z.string().min(1, "Project type is required"),
    scope_of_work: z.string().min(1, "Scope of work is required"),

    quotation_amount: z.string().min(1, "Quotation amount is required"), // Use string for currency formatting
    remarks: z.string().min(1, "Remarks are required"),
    status: z.enum(["Pending", "Ongoing", "Completed"], {
      message: "Status must be one of 'Pending', 'Ongoing', or 'Completed'",
    }),
  });
  type RFQFormData = z.infer<typeof rfqSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      client: rfqData?.client_id?.toString(), // Ensure client_id is a string
      project_type: rfqData?.project_type,
      scope_of_work: rfqData?.scope_of_work,

      quotation_amount: rfqData?.quotation_amount,
      remarks: rfqData?.remarks,
      status: rfqData?.status || "Pending", // Default to "Pending" if status is not available
    },
  });

  console.log(rfqData, "rfqData");

  const [
    patchRFQApi,
    {
      data: patchData,
      isSuccess: patchIsSuccess,
      error: patchError,
      isError: patchIsError,
    },
  ] = useUpdateRFQMutation();

  // Fetch clients list
  const [
    clientsApi,
    {
      data: clientsData,
      isSuccess: clientsIsSuccess,
      error: clientsError,
      isError: clientsIsError,
    },
  ] = useClientsMutation();
  const [clients, setClients] = useState<any[]>([]);

  const getClients = async () => {
    const res = await clientsApi({});
    console.log(res, "response");
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    if (clientsIsSuccess && clientsData) {
      setClients(clientsData.data); // Assuming the API returns an array of clients in `results`
    }
  }, [clientsIsSuccess, clientsData]);

  const getRFQDetails = async () => {
    await rfqDetaislApi({ rfq_id: id });
  };

  useEffect(() => {
    if (!updateView) {
      getRFQDetails();
    }
  }, [updateView]);

  useEffect(() => {
    if (rfqIsSuccess && rfqData) {
      reset({
        ...rfqData,
        client: rfqData.client?._id?.toString(), // Ensure client_id is a string
      }); // Reset form with fetched RFQ data
    }
  }, [rfqIsSuccess, rfqData, reset]);

  const onSubmit = async (formData: RFQFormData) => {
    try {
      console.log(id, { ...formData });
      const res = await patchRFQApi({
        id: id,
        data: { ...formData },
      });
      console.log(res, "RESPONSE");
    } catch (error) {
      toast.error("Failed to update RFQ");
    }
  };

  useEffect(() => {
    if (patchIsSuccess) {
      toast.success("RFQ updated successfully");
      setUpdateView(false); // Switch back to read-only mode after successful update
    }
  }, [patchIsSuccess]);

  const [deleteRFQApi] = useDeleteRfqMutation();
  const deleteRFQ = async () => {
    const res = await deleteRFQApi({
      id,
      token: "",
    });
  };

  if (errors?.client) {
    toast.error("Please select the client");
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4  w-full">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                RFQ
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
            </div>
            <div className="grid gap-4  w-full  lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 w-full  lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>RFQ Details</CardTitle>
                    <CardDescription>Enter the RFQ details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {updateView ? (
                      // Edit Mode: Show editable form
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid gap-6"
                      >
                        <div className="grid gap-3">
                          <Label htmlFor="client">Client</Label>
                          <Controller
                            name="client"
                            control={control}
                            defaultValue={rfqData?.client?.client_id?.toString()} // Ensure default value is set
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      rfqData?.client_name
                                        ? rfqData?.client_name
                                        : "Select client"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {clients?.map((client) => (
                                    <SelectItem
                                      key={client?._id}
                                      value={String(client?._id)}
                                    >
                                      {client?.client_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.client && (
                            <p className="text-red-500">
                              {errors.client.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="project_type">Project Type</Label>
                          <Controller
                            name="project_type"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.project_type && (
                            <p className="text-red-500">
                              {errors.project_type.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="scope_of_work">Scope of Work</Label>
                          <Controller
                            name="scope_of_work"
                            control={control}
                            render={({ field }) => <Textarea {...field} />}
                          />
                          {errors.scope_of_work && (
                            <p className="text-red-500">
                              {errors.scope_of_work.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="quotation_amount">
                            Quotation Amount
                          </Label>
                          <Controller
                            name="quotation_amount"
                            defaultValue={rfqData?.quotation_amount}
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.quotation_amount && (
                            <p className="text-red-500">
                              {errors.quotation_amount.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="remarks">Remarks</Label>
                          <Controller
                            name="remarks"
                            control={control}
                            render={({ field }) => <Textarea {...field} />}
                          />
                          {errors.remarks && (
                            <p className="text-red-500">
                              {errors.remarks.message}
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
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Ongoing">
                                    Ongoing
                                  </SelectItem>
                                  <SelectItem value="Completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.status && (
                            <p className="text-red-500">
                              {errors.status.message}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                              <LoaderCircle
                                className="-ms-1 me-2 animate-spin"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            )}
                            Save Changes
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setUpdateView(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      // Read-Only Mode: Show non-editable fields
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="rfq_id">RFQ ID</Label>
                          <p>{rfqData?.rfqId}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="client_name">Client Name</Label>
                          <p>{rfqData?.client?.client_name}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="rfq_date">RFQ Date</Label>
                          <p>{formatDate(rfqData?.createdAt)}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="project_type">Project Type</Label>
                          <p>{rfqData?.project_type}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="scope_of_work">Scope of Work</Label>
                          <p>{rfqData?.scope_of_work}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="quotation_number">
                            Quotation Number
                          </Label>
                          <p>{rfqData?.quotationNo}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="quotation_amount">
                            Quotation Amount
                          </Label>
                          <p>{rfqData?.quotation_amount}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="remarks">Remarks</Label>
                          <p>{rfqData?.remarks}</p>
                        </div>

                        <div className="grid gap-3">
                          <Label htmlFor="status">Status</Label>
                          <p>{rfqData?.status}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {!updateView && (
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        You can update and delete the RFQ.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>

        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={rfqData?.id}
        />

        <Toaster />
      </div>
    </div>
  );
}

export default RFQDetails;
