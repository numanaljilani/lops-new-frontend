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
  useCompanyDetailsMutation,
  useCreateCompanyMutation,
  usePatchCompanyMutation,
} from "@/redux/query/componiesApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UpdateCompay() {
  const router = useRouter();
  const path = usePathname();
  //   console.log(path.split("/").reverse()[0] , "Path")
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateView, setUpdateView] = useState(false);
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

  const [companyDetailsApi, { data, isSuccess, error, isError }] =
    useCompanyDetailsMutation();
    const [patchCompanyApi] = usePatchCompanyMutation()

  const getCompanyDetails = async () => {
    console.log(companyDetails);
    const res = await companyDetailsApi({
      id: path.split("/").reverse()[0],
      token: "",
    });
    console.log(res, "response from the server");
  };



  useEffect(() => {
    getCompanyDetails();
  }, []);

  const saveCompanyDetails = async () => {
    console.log(companyDetails);
    setUpdateView(false)
    const res = await patchCompanyApi({
      id: path.split("/").reverse()[0],
      details : companyDetails,
      token: "",
    });
    console.log(res, "response from the server");
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      setCompanyDetails(data);
      //   toast(`Company has been Updated.`, {
      // description: `${companyDetails?.name} has been created in ${companyDetails?.location} which provide ${companyDetails?.type}`,
      // action: {
      //   label: "Undo",
      //   onClick: () => console.log("Undo"),
      // },
      //   });
      //   router.replace("/companies")
    }
  }, [isSuccess]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
       { updateView ? (<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Create Company
              </h1>

              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={saveCompanyDetails}>
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
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
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
                          defaultValue={companyDetails.name}
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
                          defaultValue={companyDetails.location}
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
                          value={companyDetails.type}
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
                          defaultValue={companyDetails.about}
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
                    <CardTitle>Employee Status</CardTitle>
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

                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>
                      You can update and delete the Company.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        //   onClick={() => setUpdateView(true)}
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
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
          <AlertDialogAlert
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            itemToDelete={companyDetails}
            deleteCompany={true}
          />
        </main>) : (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Company
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Company Details</CardTitle>
                      <CardDescription>
                        Enter the Company details and thier performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>
                         
                          <h4 className="font-semibold text-lg">
                            {companyDetails.name}
                          </h4>
                        </div>
                       
                        <div className="grid gap-3">
                          <Label htmlFor="name">Location</Label>
                          
                          <h4 className="font-semibold text-lg">
                            {companyDetails.location}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Service</Label>
                         
                          <h4 className="font-semibold text-lg">
                            {companyDetails.type
                              ? companyDetails.type
                              : "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>

                          <h4 className="font-semibold text-base">
                            {companyDetails.about
                              ? companyDetails.about
                              : "-"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-1">
                    <CardHeader>
                      <CardTitle>Compony Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="grid gap-3">
                          <Label htmlFor="category">Compony</Label>
                          <h4 className="font-semibold text-lg text-wrap">
                            {
                              ""
                            }
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Number Of Employee</Label>
                          <h4 className="font-semibold text-lg">
                            {"20"}
                          </h4>
                        </div>
                 
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Currency</Label>
                          <h4 className="font-semibold text-lg">{"AED"}</h4>
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
                          <h4 className="font-semibold text-lg">
                            {companyDetails.status ? "Active" : "Inactive"}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                      <CardDescription>
                        You can update and delete the employee.
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
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
