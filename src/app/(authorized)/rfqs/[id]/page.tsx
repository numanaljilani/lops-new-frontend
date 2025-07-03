"use client";
import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, usePathname } from "next/navigation";
import { toast, Toaster } from "sonner";
import Alert from "@/components/dialogs/Alert";
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
import { useClientsMutation } from "@/redux/query/clientsApi";
import { formatDate } from "@/lib/dateFormat";
import { LoaderCircle } from "lucide-react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";

const rfqSchema = z.object({
  rfq_id: z.string().optional(),
  client: z.string().min(1, "Client is required"),
  project_type: z.string().min(1, "Project type is required"),
  scope_of_work: z.string().min(1, "Scope of work is required"),
  quotation_amount: z
    .string()
    .min(1, "Quotation amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Quotation amount must be a valid number"),
  remarks: z.string().min(1, "Remarks are required"),
  status: z.enum(["Pending", "Ongoing", "Completed"], {
    message: "Status must be one of 'Pending', 'Ongoing', or 'Completed'",
  }),
});

type RFQFormData = z.infer<typeof rfqSchema>;

function RFQDetails() {
  const path = usePathname();
  const { id } = useParams();
  const [updateView, setUpdateView] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [
    rfqDetailsApi,
    {
      data: rfqData,
      isSuccess: rfqIsSuccess,
      error: rfqError,
      isError: rfqIsError,
    },
  ] : any = useRFQDetailsMutation();

  const [
    patchRFQApi,
    {
      data: patchData,
      isSuccess: patchIsSuccess,
      error: patchError,
      isError: patchIsError,
    },
  ] = useUpdateRFQMutation();

  const [
    clientsApi,
    {
      data: clientsData,
      isSuccess: clientsIsSuccess,
      error: clientsError,
      isError: clientsIsError,
      isLoading: isClientsApiLoading,
    },
  ] = useClientsMutation();
  const [defaultClients, setDefaultClients] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      client: "",
      project_type: "",
      scope_of_work: "",
      quotation_amount: "",
      remarks: "",
      status: "Pending",
    },
  });

  const client = watch("client");

  const fetchDefaultClients = async () => {
    try {
      const res = await clientsApi({}).unwrap();
      console.log("Default Clients API Response:", JSON.stringify(res, null, 2));
      const clients = res.data || [];
      if (clients.length > 0) {
        setDefaultClients(clients);
      } else {
        toast.warning("No default clients found.");
        setDefaultClients([]);
      }
    } catch (err: any) {
      console.error("Default Clients Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch default clients: " + (err?.data?.message || err.message || "Unknown error"));
      setDefaultClients([]);
    }
  };

  const loadClients = useCallback(
    debounce(async (inputValue: string, callback: (options: any[]) => void) => {
      try {
        console.log("Search Input:", inputValue);
        const res = await clientsApi({ search: inputValue }).unwrap();
        console.log("Search Clients API Response:", JSON.stringify(res, null, 2));
        const clients = res.data || [];
        const options = clients.map((client: any) => ({
          value: client._id,
          label: client.client_name || "No Name",
        }));
        console.log("Search Options:", options);
        callback(options);
        console.log("Callback Executed with Options:", options);
      } catch (err: any) {
        console.error("Search Clients Fetch Error:", JSON.stringify(err, null, 2));
        toast.error("Failed to fetch clients: " + (err?.data?.message || err.message || "Unknown error"));
        const options = defaultClients
          .filter((client: any) =>
            client.client_name?.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((client: any) => ({
            value: client._id,
            label: client.client_name || "No Name",
          }));
        console.log("Fallback Search Options:", options);
        callback(options);
        console.log("Callback Executed with Fallback Options:", options);
      }
    }, 500),
    [clientsApi, defaultClients]
  );

  useEffect(() => {
    fetchDefaultClients();
  }, []);

  const getRFQDetails = async () => {
    try {
      await rfqDetailsApi({ rfq_id: id });
    } catch (err: any) {
      console.error("RFQ Details Fetch Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to fetch RFQ details: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  useEffect(() => {
    if (!updateView) {
      getRFQDetails();
    }
  }, [updateView, id]);

  useEffect(() => {
    if (rfqIsSuccess && rfqData) {
      reset({
        rfq_id: rfqData.rfqId,
        client: rfqData.client?._id?.toString() || "",
        project_type: rfqData.project_type || "",
        scope_of_work: rfqData.scope_of_work || "",
        quotation_amount: rfqData.quotation_amount || "",
        remarks: rfqData.remarks || "",
        status: rfqData.status || "Pending",
      });
    }
    if (rfqIsError) {
      toast.error("Failed to load RFQ details: " + (rfqError?.data?.message || rfqError?.message || "Unknown error"));
    }
  }, [rfqIsSuccess, rfqIsError, rfqData, rfqError, reset]);

  const onSubmit = async (formData: RFQFormData) => {
    try {
      console.log("Submit Data:", formData);
      await patchRFQApi({
        id,
        data: { ...formData },
      }).unwrap();
      toast.success("RFQ updated successfully");
      setUpdateView(false);
    } catch (err: any) {
      console.error("Update RFQ Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to update RFQ: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  const [deleteRFQApi] = useDeleteRfqMutation();
  const deleteRFQ = async () => {
    try {
      await deleteRFQApi({ id, token: "" }).unwrap();
      toast.success("RFQ deleted successfully");
      setIsDialogOpen(false);
      // Optionally redirect or refresh
    } catch (err: any) {
      console.error("Delete RFQ Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to delete RFQ: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  const defaultOptions = defaultClients.map((client: any) => ({
    value: client._id,
    label: client.client_name || "No Name",
  }));

  // console.log("Default Options:", defaultOptions);
  // console.log("Selected client:", client);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col gap-6 p-6 sm:p-4 lg:p-6">
        <main className="grid flex-1 items-start gap-6 mx-auto max-w-7xl w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">RFQ Details</h1>
            <div className="flex gap-3">
              {!updateView && (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 transition-all duration-200"
                    onClick={() => setUpdateView(true)}
                  >
                    Edit RFQ
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 transition-all duration-200"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete RFQ
                  </Button>
                </>
              )}
            </div>
          </div>

          <Card className="shadow-lg border-none rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-blue-50 border-b border-gray-200">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                {updateView ? "Edit RFQ" : "View RFQ"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {updateView ? "Update the RFQ details below." : "Details of the selected RFQ."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {updateView ? (
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="client" className="text-sm font-medium text-gray-700">
                      Client
                    </Label>
                    <Controller
                      name="client"
                      control={control}
                      render={({ field }) => (
                        <AsyncSelect
                          cacheOptions
                          defaultOptions={defaultOptions}
                          loadOptions={(inputValue, callback) => {
                            console.log("loadOptions Triggered with Input:", inputValue);
                            loadClients(inputValue, callback);
                          }}
                          isLoading={isClientsApiLoading}
                          placeholder="Search for a client..."
                          noOptionsMessage={() => "No clients found"}
                          onChange={(option) => {
                            console.log("Selected Option:", option);
                            field.onChange(option ? option.value : "");
                          }}
                          value={
                            client
                              ? defaultOptions.find((opt) => opt.value === client) || {
                                  value: client,
                                  label: client,
                                }
                              : null
                          }
                          isClearable
                          isSearchable
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: errors.client ? "red" : base.borderColor,
                              "&:hover": {
                                borderColor: errors.client ? "red" : base.borderColor,
                              },
                              borderRadius: "0.5rem",
                              padding: "0.25rem",
                              boxShadow: errors.client ? "0 0 0 1px red" : base.boxShadow,
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      )}
                    />
                    {errors.client && (
                      <p className="text-red-500 text-sm">{errors.client.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="project_type" className="text-sm font-medium text-gray-700">
                      Project Type
                    </Label>
                    <Controller
                      name="project_type"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    {errors.project_type && (
                      <p className="text-red-500 text-sm">{errors.project_type.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="scope_of_work" className="text-sm font-medium text-gray-700">
                      Scope of Work
                    </Label>
                    <Controller
                      name="scope_of_work"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                      )}
                    />
                    {errors.scope_of_work && (
                      <p className="text-red-500 text-sm">{errors.scope_of_work.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quotation_amount" className="text-sm font-medium text-gray-700">
                      Quotation Amount
                    </Label>
                    <Controller
                      name="quotation_amount"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    {errors.quotation_amount && (
                      <p className="text-red-500 text-sm">{errors.quotation_amount.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                      Remarks
                    </Label>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                      )}
                    />
                    {errors.remarks && (
                      <p className="text-red-500 text-sm">{errors.remarks.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm">{errors.status.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 transition-all duration-200"
                    >
                      {isSubmitting && (
                        <LoaderCircle
                          className="animate-spin -ml-1 mr-2"
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
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg px-6 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">RFQ ID</Label>
                    <p className="text-gray-900">{rfqData?.rfqId || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Client Name</Label>
                    <p className="text-gray-900">{rfqData?.client?.client_name || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">RFQ Date</Label>
                    <p className="text-gray-900">{rfqData?.createdAt ? formatDate(rfqData.createdAt) : "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Project Type</Label>
                    <p className="text-gray-900">{rfqData?.project_type || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Scope of Work</Label>
                    <p className="text-gray-900">{rfqData?.scope_of_work || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Quotation Number</Label>
                    <p className="text-gray-900">{rfqData?.quotationNo || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Quotation Amount</Label>
                    <p className="text-gray-900">{rfqData?.quotation_amount || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                    <p className="text-gray-900">{rfqData?.remarks || "N/A"}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <p className="text-gray-900">{rfqData?.status || "N/A"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* {!updateView && (
            <Card className="shadow-lg border-none rounded-xl bg-white overflow-hidden">
              <CardHeader className="bg-blue-50 border-b border-gray-200">
                <CardTitle className="text-2xl font-semibold text-gray-800">Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage the RFQ with the options below.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 transition-all duration-200 flex-1"
                    onClick={() => setUpdateView(true)}
                  >
                    Update RFQ
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 transition-all duration-200 flex-1"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Delete RFQ
                  </Button>
                </div>
              </CardContent>
            </Card>
          )} */}
        </main>

        <Alert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={deleteRFQ}
          name={rfqData?.rfqId || "this RFQ"}
        />
      </div>
    </div>
  );
}

export default RFQDetails;