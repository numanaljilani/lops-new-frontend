"use client";
import AlertDialogAlert from "@/components/dialogs/AlertDialog";
import CreateQuotation from "@/components/dialogs/CreateQuotation";
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
  usePatchEmployeeMutation,
} from "@/redux/query/employee";
import { useRFQDetailsMutation } from "@/redux/query/rfqsApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

function RFQDetails() {
  const path = usePathname();

  const [updateView, setUpdateView] = useState(false);
  const [quotation, setQuotationAlert] = useState(false);

  //   console.log(path.split("/").reverse()[0], "Path name");
  const [rfq, setrfq] = useState<{
    rfq_id: string;
    rfq_date: string;
    project_type: string;
    scope_of_work: string;
    remarks: string;
    companyf: string;
    position: string;
    salary: number;
    hourly: number;
    Currency: string;
    status: string;
  }>({
    rfq_id: "",
    rfq_date: "",
    project_type: "",
    scope_of_work: "",
    remarks: "",
    companyf: "",
    position: "",
    salary: 0,
    hourly: 0,
    Currency: "",
    status: "",
  });

  const [rfqDetaislApi, { data, isSuccess, error, isError }] =
  useRFQDetailsMutation();
  const [
    patchEmployeApi,
    {
      data: patchData,
      isSuccess: patchIsSuccess,
      error: patchError,
      isError: patchIsError,
    },
  ] = usePatchEmployeeMutation();
  console.log(path?.split("/")?.reverse()[0] , ">>>>>>")
  const getRFQDetails = async () => {
    console.log(rfq);
    const res = await rfqDetaislApi({ rfq_id: path?.split("/")?.reverse()[0] });
    console.log(res, "response from the server");
  };


  useEffect(() => {
    getRFQDetails();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from the server");
  
      setrfq(data);
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
        setCompanies(comapniesData);
      }
    }
  }, [companiesIsSuccess]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  RFQ
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>RFQ Details</CardTitle>
                      <CardDescription>
                        {/* Enter the employee details and thier performance */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="name">RFQ Id</Label>
                          
                          <h4 className="font-semibold text-lg">
                            {rfq.rfq_id}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Project Type</Label>
                          
                          <h4 className="font-semibold text-lg">
                            {rfq.project_type}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Scop of Work</Label>
                          
                          <h4 className="font-semibold text-lg">
                            {rfq.scope_of_work}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="name">Remark</Label>
                          
                          <h4 className="font-semibold text-lg">
                            {rfq.remarks}
                          </h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* <Card x-chunk="dashboard-07-chunk-1">
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
                                  data.url == rfq.companyf
                              )[0]?.name
                            }
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Designation</Label>
                          <h4 className="font-semibold text-lg">
                            {rfq.position}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Salary">Salary (AED)</Label>
                          
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="subcategory">Currency</Label>
                          <h4 className="font-semibold text-lg">{"AED"}</h4>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="Hourly">Hourly Rate (AED)</Label>

                     
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                 

                  <Card x-chunk="dashboard-07-chunk-5">
                    <CardHeader>
                      <CardTitle>LPO</CardTitle>
                      <CardDescription>
                        Create the LPO for this RFQ.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setUpdateView(true)}
                        >
                          Make LPO
                        </Button>
                        
                      </div>
                    </CardContent>
                  </Card>

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
                          onClick={() => setQuotationAlert(true)}
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
        
        <AlertDialogAlert
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          itemToDelete={rfq}
        />
   
      </div>
    </div>
  );
}

export default RFQDetails;
