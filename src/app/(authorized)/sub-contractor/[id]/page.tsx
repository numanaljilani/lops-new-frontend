// app/contractors/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useSubcontractorByIdMutation } from '@/redux/query/subcontractor';

// Define the contractor type
type Contractor = {
  id: number;
  name: string;
  email: string;
  contact: string;
  specialization: string;
  description: string;
  location: string;
  company_name: string;
  address: string | null;
  hourly_rate: string;
  currency: string;
  trade_license: string;
  tax_number: string;
  status: boolean;
  created_at: string;
  total_hours: string;
  total_amount: string;
};

// Validation schema
const contractorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(1, "Contact is required"),
  specialization: z.string().min(1, "Specialization is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  company_name: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
  hourly_rate: z.string().min(1, "Hourly rate is required"),
  currency: z.string().min(1, "Currency is required"),
  trade_license: z.string().min(1, "Trade license is required"),
  tax_number: z.string().min(1, "Tax number is required"),
  status: z.boolean(),
});

export default function ContractorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof contractorSchema>>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      specialization: '',
      description: '',
      location: '',
      company_name: '',
      address: '',
      hourly_rate: '',
      currency: '',
      trade_license: '',
      tax_number: '',
      status: false,
    },
  });

  const [subcontractorDetailsApi , {}] = useSubcontractorByIdMutation()

  // Fetch contractor data
  useEffect(() => {
    const fetchContractor = async () => {
      try {
        setLoading(true);
        const response = await  subcontractorDetailsApi({id})
        console.log(response , "response")
  
        setContractor(response.data);
        
        // Reset form with fetched data
        form.reset({
          ...response.data,
          status: response.data.status || false,
        });
      } catch (error) {
        console.error('Error fetching contractor:', error);
        toast.error('Failed to load contractor data');
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [id, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof contractorSchema>) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/contractors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update contractor');
      }

      const updatedData = await response.json();
      setContractor(updatedData);
      setIsDialogOpen(false);
      toast.success('Contractor updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating contractor:', error);
      toast.error('Failed to update contractor');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Contractor not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{contractor?.name}</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Update Information</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-gray-600">Company Name</Label>
              <p className="text-gray-800">{contractor?.company_name}</p>
            </div>
            <div>
              <Label className="text-gray-600">Email</Label>
              <p className="text-gray-800">{contractor?.email}</p>
            </div>
            <div>
              <Label className="text-gray-600">Contact</Label>
              <p className="text-gray-800">{contractor?.contact}</p>
            </div>
            <div>
              <Label className="text-gray-600">Specialization</Label>
              <p className="text-gray-800">{contractor?.specialization}</p>
            </div>
            <div>
              <Label className="text-gray-600">Location</Label>
              <p className="text-gray-800">{contractor?.location}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-600">Hourly Rate</Label>
              <p className="text-gray-800">
                {contractor?.currency} {contractor?.hourly_rate}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Trade License</Label>
              <p className="text-gray-800">{contractor?.trade_license}</p>
            </div>
            <div>
              <Label className="text-gray-600">Tax Number</Label>
              <p className="text-gray-800">{contractor?.tax_number}</p>
            </div>
            <div>
              <Label className="text-gray-600">Status</Label>
              <p className="text-gray-800">
                {contractor.status ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">Total Hours Worked</Label>
              <p className="text-gray-800">{contractor?.total_hours} hours</p>
            </div>
            <div>
              <Label className="text-gray-600">Total Amount Earned</Label>
              <p className="text-gray-800">
                {contractor.currency} {contractor?.total_amount}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-gray-600">Description</Label>
          <p className="text-gray-800 mt-2">{contractor?.description}</p>
        </div>

        {contractor.address && (
          <div className="mt-6">
            <Label className="text-gray-600">Address</Label>
            <p className="text-gray-800 mt-2">{contractor?.address}</p>
          </div>
        )}
      </div>

      {/* Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Contractor Information</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Name</Label>
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
                      <Label>Email</Label>
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
                      <Label>Contact</Label>
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
                      <Label>Specialization</Label>
                      <FormControl>
                        <Input placeholder="Specialization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Company Name</Label>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
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
                      <Label>Location</Label>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
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
                      <Label>Hourly Rate</Label>
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
                      <Label>Currency</Label>
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
                      <Label>Trade License</Label>
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
                      <Label>Tax Number</Label>
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
                      <Label>Status</Label>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="min-h-[100px]"
                        {...field}
                      />
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
                    <Label>Address</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Address"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Contractor'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}