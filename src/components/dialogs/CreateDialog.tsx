"use client";
import React, { useEffect, useCallback, useState } from "react";
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
import {
  Select as UiSelect,
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
import { toast } from "sonner";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";

const RFqSchema = z.object({
  client: z.string().min(1, "Client is required"),
  project_type: z.string().min(1, "Project type is required"),
  scope_of_work: z.string().min(1, "Scope of work is required"),
  quotation_amount: z
    .string()
    .min(1, "Quotation amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Quotation amount must be a valid number"),
  status: z.enum(["Pending", "Ongoing", "Completed"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
  remarks: z.string().optional(),
});

type RFQFormData = z.infer<typeof RFqSchema>;

export default function CreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  handleSubmit: externalHandleSubmit,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleSubmit: (value: RFQFormData) => Promise<any>;
}) {
  const [defaultClients, setDefaultClients] = useState<any[]>([]);
  const [clientsApi, { data, isSuccess, error, isError, isLoading: isClientsApiLoading }] = useClientsMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<RFQFormData>({
    resolver: zodResolver(RFqSchema),
    defaultValues: {
      client: "",
      project_type: "",
      scope_of_work: "",
      quotation_amount: "",
      status: "Pending",
      remarks: "",
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

  useEffect(() => {
    if (isDialogOpen) {
      fetchDefaultClients();
    }
  }, [isDialogOpen]);

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

  const onSubmit = async (data: RFQFormData) => {
    try {
      console.log("Submit Data:", data);
      await externalHandleSubmit(data);
      toast.success("RFQ created successfully!");
      setIsDialogOpen(false);
      reset();
    } catch (err: any) {
      console.error("Create RFQ Error:", JSON.stringify(err, null, 2));
      toast.error("Failed to create RFQ: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  const defaultOptions = defaultClients.map((client: any) => ({
    value: client._id,
    label: client.client_name || "No Name",
  }));

  console.log("Default Options:", defaultOptions);
  console.log("Selected client:", client);

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) reset();
    }}>
      <DialogContent className="bg-white shadow-lg rounded-xl border-none w-full max-w-[90vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            Create New RFQ
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill out the form below to generate a new RFQ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
                  value={client ? defaultOptions.find((opt) => opt.value === client) || { value: client, label: client } : null}
                  isClearable
                  isSearchable
                  className="w-full"
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
                      width: "100%",
                    }),
                  }}
                />
              )}
            />
            {errors.client && <ErrorMessage message={errors.client.message} />}
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
                  id="project_type"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.project_type && <ErrorMessage message={errors.project_type.message} />}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="scope_of_work" className="text-sm font-medium text-gray-700">
              Scope of Work
            </Label>
            <Controller
              name="scope_of_work"
              control={control}
              render={({ field }) => (
                <Input
                  id="scope_of_work"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.scope_of_work && <ErrorMessage message={errors.scope_of_work.message} />}
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
                  id="quotation_amount"
                  type="text"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  {...field}
                />
              )}
            />
            {errors.quotation_amount && <ErrorMessage message={errors.quotation_amount.message} />}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <UiSelect onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="status" className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </UiSelect>
              )}
            />
            {errors.status && <ErrorMessage message={errors.status.message} />}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
              Remark
            </Label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="remarks"
                  className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  {...field}
                />
              )}
            />
            {errors.remarks && <ErrorMessage message={errors.remarks.message} />}
          </div>
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all duration-200"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}