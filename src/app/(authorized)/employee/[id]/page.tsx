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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

function Employee() {
  const path = usePathname();

  const [updateView, setUpdateView] = useState(false);

  //   console.log(path.split("/").reverse()[0], "Path name");
  const [employeeDetails, setEmployeeDetails] = useState<{
    name: string;
    email: string;
    contact: string;
    description: string;
    location: string;
    company: string;
    position: string;
    salary: number;
    hourly_rate: number;
    Currency: string;
    status: boolean;
  }>({
    name: "",
    email: "",
    contact: "",
    description: "",
    location: "",
    company: "",
    position: "",
    salary: 0,
    hourly_rate: 0,
    Currency: "",
    status: false,
  });

  const [employeeApi, { data, isSuccess, error, isError }] =
    useEmployeeDetailsMutation();
  const [
    patchEmployeApi,
    {
      data: patchData,
      isSuccess: patchIsSuccess,
      error: patchError,
      isError: patchIsError,
    },
  ] = usePatchEmployeeMutation();
  const getEmployeeDetails = async () => {
    console.log(employeeDetails);
    const res = await employeeApi({ id: path?.split("/")?.reverse()[0] });
    console.log(res, "response from the server");
  };

  const updateEmployee = async () => {
    setUpdateView(false);
    const res = await patchEmployeApi({
      id: path?.split("/")?.reverse()[0],
      details: employeeDetails,
    });
    console.log(res, "updated");
    toast(
      `Updated`,

      {
        description: "Employee information has been updated.",
      }
    );
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);
  useEffect(() => {
    if (patchIsSuccess) {
      getEmployeeDetails();
      setUpdateView(false);
    }
  }, [patchIsSuccess]);
  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
      // router.replace("/employee");
      setEmployeeDetails(data);
    }
  }, [isSuccess]);

  const [companies, setCompanies] = useState<any>([]);
  const [
    companiesApi,
    {
      data: comapniesData,
      isSuccess: companiesIsSuccess,
      error: companiesError,
      isError: companiesIsError,
    },
  ] = useComponiesMutation();

  const getCompanies = async () => {
    const res = await companiesApi({});
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (companiesIsSuccess) {
      console.log(comapniesData, "response from server");
      if (comapniesData) {
        setCompanies(comapniesData.results);
      }
    }
  }, [companiesIsSuccess]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        {updateView ? (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Update Employee
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                  <Button size="sm" onClick={updateEmployee}>
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
                      <CardTitle>Employee Details</CardTitle>
                      <CardDescription>
                        Enter the employee details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            type="text"
                            className="w-full"
                            placeholder="Hamdan Al Maktoom"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                name: e.target.value,
                              });
                            }}
                            defaultValue={employeeDetails?.name}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            className="w-full"
                            placeholder="example@gmail.com"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                email: e.target.value,
                              });
                            }}
                            defaultValue={employeeDetails?.email}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Location</Label>
                          <Input
                            id="location"
                            type="text"
                            className="w-full"
                            placeholder="Dubai , Abu dhabi , Sharjah"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                location: e.target.value,
                              });
                            }}
                            defaultValue={employeeDetails?.location}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Contact</Label>
                          <Input
                            id="contact"
                            type="number"
                            className="w-full"
                            placeholder="+971 999999999"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                contact: e.target.value,
                              });
                            }}
                            defaultValue={employeeDetails?.contact}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            defaultValue={employeeDetails?.description}
                            className="min-h-32"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                description: e.target.value,
                              });
                            }}
                          />
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
                          <Select
                            onValueChange={(value) =>
                              setEmployeeDetails({
                                ...employeeDetails,
                                company: value,
                              })
                            }
                          >
                            <SelectTrigger
                              id="category"
                              aria-label="Select Compony"
                            >
                              <SelectValue placeholder="Select Compony" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.map(
                                (
                                  data: { name: string; url: string },
                                  index: number
                                ) => (
                                  <SelectItem key={index} value={data?.url}>
                                    {data?.name}
                                  </SelectItem>
                                )
                              )}
                              {/* <SelectItem value="http://127.0.0.1:8000/api/v1/employees/4/">
                            LECS
                          </SelectItem> */}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Designation</Label>
                          <Select
                            value={employeeDetails.position}
                            onValueChange={(value) =>
                              setEmployeeDetails({
                                ...employeeDetails,
                                position: value,
                              })
                            }
                          >
                            <SelectTrigger
                              id="subcategory"
                              aria-label="Select Designation"
                            >
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sales Member">
                                Sales Member
                              </SelectItem>
                              <SelectItem value="Team Leads">
                                Team Leads
                              </SelectItem>
                              <SelectItem value="Team Members">
                                Team Members
                              </SelectItem>
                              <SelectItem value="Sub-Contractors">
                                Sub-Contractors
                              </SelectItem>
                              <SelectItem value="Accountant Members">
                                Accountant Members
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Salary">Salary (AED)</Label>
                          <Input
                            id="Salary"
                            type="number"
                            className="w-full"
                            placeholder="5000 AED"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                salary: Number(e.target.value),
                              });
                            }}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Currency</Label>
                          <Select
                            onValueChange={(value) =>
                              setEmployeeDetails({
                                ...employeeDetails,
                                Currency: value,
                              })
                            }
                          >
                            <SelectTrigger
                              id="subcategory"
                              aria-label="Select Currency"
                            >
                              <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AED">AED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Hourly">Hourly Rate (AED)</Label>
                          <Input
                            id="Hourly"
                            type="number"
                            className="w-full"
                            placeholder="20 AED"
                            onChange={(e) => {
                              e.preventDefault();
                              setEmployeeDetails({
                                ...employeeDetails,
                                hourly_rate: Number(e.target.value),
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
                      <CardDescription>
                        Update the status of the client he/she active or
                        inactive.
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Select
                            onValueChange={(value) =>
                              setEmployeeDetails({
                                ...employeeDetails,
                                status: value === "true",
                              })
                            }
                          >
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
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
                <Button size="sm">Save</Button>
              </div>
            </div>
          </main>
        ) : (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Employee
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Employee Details</CardTitle>
                      <CardDescription>
                        Enter the employee details and thier performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Name</Label>

                          <h4 className="font-semibold text-lg">
                            {employeeDetails.name}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Email</Label>

                          <h4 className="font-semibold text-lg">
                            {employeeDetails.email}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Location</Label>

                          <h4 className="font-semibold text-lg">
                            {employeeDetails.location}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="contact">Contact</Label>

                          <h4 className="font-semibold text-lg">
                            {employeeDetails.contact
                              ? employeeDetails.contact
                              : "-"}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Description</Label>

                          <h4 className="font-semibold text-base">
                            {employeeDetails.description
                              ? employeeDetails.description
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
                              companies?.filter(
                                (data: any) =>
                                  data.url == employeeDetails.company
                              )[0]?.name
                            }
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Designation</Label>
                          <h4 className="font-semibold text-lg">
                            {employeeDetails.position}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Salary">Salary (AED)</Label>
                          <h4 className="font-semibold text-lg">
                            {employeeDetails.salary}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Currency</Label>
                          <h4 className="font-semibold text-lg">{"AED"}</h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Hourly">Hourly Rate (AED)</Label>

                          <h4>{employeeDetails.hourly_rate}</h4>
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
                          {/* <Label htmlFor="status">Status</Label> */}
                          <h4 className="font-semibold text-lg">
                            {employeeDetails.status ? "Active" : "Inactive"}
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
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={employeeDetails}
        />
      </div>
    </div>
  );
}

export default Employee;
