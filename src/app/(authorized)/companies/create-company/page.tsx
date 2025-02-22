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
import { useCreateCompanyMutation } from "@/redux/query/componiesApi";
import { useCreateEmployeeMutation } from "@/redux/query/employee";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CreateEmployee() {
  const router = useRouter();
  const [companyDetails, setCompanyDetails] = useState<{
    name: string;
    about: string;
    location: string;
    type: string;
    status: string;
  }>({
    name: "",
    about: "",
    location: "",
    type: "",
    status: "",
  });

  const [createCompanyApi, { data, isSuccess, error, isError , isLoading}] =
    useCreateCompanyMutation();
  const saveEmployeeDetails = async () => {
    if (
      !companyDetails.about ||
      !companyDetails.location ||
      !companyDetails.name ||
      !companyDetails.status ||
      !companyDetails.type
    ) {
      toast(`All feilds required.`, {
        description: ``,
        icon: <CircleAlert color="#E9D502" />,
        style: {
          backgroundColor: "#fcebbb",
        },
      });
      return;
    }
    const res = await createCompanyApi({ ...companyDetails });
    // console.log(res, "response from the server");
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      toast(`Company has been created.`, {
        description: `${companyDetails?.name} has been created in ${companyDetails?.location} which provide ${companyDetails?.type}`,
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
      router.replace("/companies");
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      console.log(error, "response from the server");
      toast(`Something went wrong.`, {
        description: `${companyDetails?.name} not created.`,
        icon: <CircleAlert color="#E9D502" />,
        style: {
          backgroundColor: "#fcebbb",
        },
      });
  
    }
  }, [isError]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4  w-full">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Create Company
              </h1>

              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                {/* <Button variant="outline" size="sm">
                  Discard
                </Button> */}
                <Button size="sm" onClick={saveEmployeeDetails}>
                {isLoading && (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                  Save Company
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Compony Details</CardTitle>
                    <CardDescription>Enter the company details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          placeholder="LITES"
                          onChange={(e) => {
                            e.preventDefault();
                            setCompanyDetails({
                              ...companyDetails,
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="loction">Location</Label>
                        <Input
                          id="loction"
                          type="text"
                          className="w-full"
                          placeholder="Dubai , Sharjah"
                          onChange={(e) => {
                            e.preventDefault();
                            setCompanyDetails({
                              ...companyDetails,
                              location: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="subcategory">Service</Label>
                        <Select
                          onValueChange={(value) =>
                            setCompanyDetails({
                              ...companyDetails,
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

                      <div className="grid gap-3">
                        <Label htmlFor="about">About</Label>
                        <Textarea
                          id="about"
                          className="min-h-32"
                          onChange={(e) => {
                            e.preventDefault();
                            setCompanyDetails({
                              ...companyDetails,
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
                    <CardTitle>Company Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          onValueChange={(value) =>
                            setCompanyDetails({
                              ...companyDetails,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectItem value="draft">On Leave</SelectItem> */}
                            <SelectItem value={"Active"}>Active</SelectItem>
                            <SelectItem value={"Inactive"}>Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive Product</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Product
                    </Button>
                  </CardContent>
                </Card> */}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              {/* <Button variant="outline" size="sm">
                Discard
              </Button> */}
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
