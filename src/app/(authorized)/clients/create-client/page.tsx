"use client";
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
import { useCreateClientMutation } from "@/redux/query/clientsApi";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateClient() {
  const router = useRouter();
  const [clientDetails, setClientDetails] = useState<{
    client_name: string;
    aob: string;
    contact_person: string;
    contact_number: string;
    contact_info: string;
    company_name: any;
    type: string;
    status: boolean;
    about: string;
  }>({
    client_name: "",
    contact_info: "",
    contact_person : "",
    contact_number : "",
    aob: "",
    company_name: 1,
    type: "",
    status: true,
    about: "",
  });

  const [createClientApi, { data, isSuccess, error, isError , isLoading }] =
    useCreateClientMutation();
  const saveClientDetails = async () => {
if( !clientDetails.client_name||
  !clientDetails.contact_info||
  !clientDetails.contact_person ||
  !clientDetails.contact_number ||
  !clientDetails.aob||
  !clientDetails.company_name || 
  !clientDetails.type||
  !clientDetails.about){
    toast(`All Fields are required.`, {
      icon: <CircleAlert color="#E9D502" />,
      style: {
        backgroundColor: "#fcebbb",
      },

    });
    return
}
    const res = await createClientApi({
      data: { ...clientDetails },
      token: "",
    });
    router.replace("/clients");
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      toast(`Company has been created.`, {
        description: `${clientDetails?.client_name} has been created .`,
      });
      router.replace("/clients");
    }
  }, [isSuccess]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4  w-full">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Create Clinet
              </h1>

              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                {/* <Button variant="outline" size="sm">
                  Discard
                </Button> */}
                <Button size="sm" onClick={saveClientDetails} >
                {isLoading && (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  Save
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                    <CardDescription>Enter the Clinet details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="Khan"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              client_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">AOB</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="-"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              aob: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Contact Person</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="-"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              contact_person: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Contact No.</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="Khan"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              contact_number: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="LITES"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,company_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="name">Contact email</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="LITES"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              contact_info: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="subcategory">Service</Label>
                        <Select
                          onValueChange={(value) =>
                            setClientDetails({
                              ...clientDetails,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger
                            id="Service"
                            aria-label="Select Service"
                          >
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consultancy Services">
                              Consultancy Services
                            </SelectItem>
                            <SelectItem value="General Contracting">
                              General Contracting
                            </SelectItem>
                            <SelectItem value="Electro-Mechanical Works">
                              Electro-Mechanical Works
                            </SelectItem>
                            <SelectItem value="Design & Drafting Services">
                              Design & Drafting Services
                            </SelectItem>
                            <SelectItem value="IT Solutions">
                              IT Solutions
                            </SelectItem>
                            <SelectItem value="Video Production Services">
                              Video Production Services
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* <div className="grid gap-3">
                        <Label htmlFor="name">Location</Label>
                        <Input
                          id="location"
                          type="text"
                          className="w-full"
                          placeholder="Dubai , Abu dhabi , Sharjah"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...companyDetails,
                              location: e.target.value,
                            });
                          }}
                        />
                      </div> */}
                      {/* <div className="grid gap-3">
                        <Label htmlFor="contact">Contact</Label>
                        <Input
                          id="contact"
                          type="number"
                          className="w-full"
                          placeholder="+971 999999999"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...companyDetails,
                              contact: e.target.value,
                            });
                          }}
                        />
                      </div> */}
                      <div className="grid gap-3">
                        <Label htmlFor="about">About</Label>
                        <Textarea
                          id="about"
                          className="min-h-32"
                          onChange={(e) => {
                            e.preventDefault();
                            setClientDetails({
                              ...clientDetails,
                              about: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

               
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Employee Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          onValueChange={(value) =>
                            setClientDetails({
                              ...clientDetails,
                              status: value === "true",
                            })
                          }
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectItem value="draft">On Leave</SelectItem> */}
                            <SelectItem value={"true"}>Active</SelectItem>
                            <SelectItem value={"false"}>Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
