import React from "react";
import {
  useDeleteEmployeeMutation,
  useEmployeeMutation,
} from "@/redux/query/employee";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dateFormat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateTtasksMutation } from "@/redux/query/paymentApi";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { CopyPlus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCreateSubcontractorMutation } from "@/redux/query/subcontractor";

function CreateSubcontractor({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}) {
  const subcontractorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    contact: z.string().min(1, "Contact is required"),
    specialization: z.enum(["Electrical", "HVAC", "Civil", "Others"]),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    company_name: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"),
    currency: z.string().min(1, "Currency is required"),
    trade_license: z.string().min(1, "Trade license is required"),
    tax_number: z.string().min(1, "Tax number is required"),
    status: z.boolean(),
    hourly_rate: z.string().min(1, "Hourly rate is required"),
  });

  const form = useForm<z.infer<typeof subcontractorSchema>>({
    resolver: zodResolver(subcontractorSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      specialization: "Others",
      description: "",
      location: "",
      company_name: "",
      address: "",
      currency: "",
      trade_license: "",
      tax_number: "",
      status: false,
      hourly_rate: "",
    },
  });

  const [createSubcontractorApi, {}] = useCreateSubcontractorMutation();

  async function onSubmit(values: z.infer<typeof subcontractorSchema>) {
    try {
      const res = await createSubcontractorApi({
        data: {
          ...values,
        },
      });
      console.log(res, "res");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <AlertDialog
      open={isDialogOpen}
      onOpenChange={() => setIsDialogOpen(false)}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>

      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Create Subcontractor</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 border p-5 rounded-lg shadow-lg">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="HVAC">HVAC</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate</FormLabel>
                    <FormControl>
                      <Input placeholder="Hourly Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="Currency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trade_license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade License</FormLabel>
                    <FormControl>
                      <Input placeholder="Trade License" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Tax Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="py-6">
              <Button
                size="lg"
                type="submit"
                className="py-4"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateSubcontractor;
