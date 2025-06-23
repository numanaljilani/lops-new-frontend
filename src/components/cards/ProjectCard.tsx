import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardCheck } from "lucide-react";
import { Label } from "../ui/label";
import { hasCommon } from "@/utils/checkAccess";
import { useSelector } from "react-redux";
import { adminAndSalesCanAccess } from "@/utils/accessArrays";


function ProjectCard({job , setIsUpdateDialogOpen }:any) {
   const access = useSelector((state: any) => state?.user?.user.access);
  return (
    <Card x-chunk="dashboard-07-chunk-0">
      <CardHeader>
        <div className="flex  justify-between">
          <CardTitle>Project Details</CardTitle>
       {hasCommon(access , adminAndSalesCanAccess) &&   <Button
            className="text-sm gap-3 tracking-wide float-right mx-4"
            variant={"outline"}
            onClick={() => setIsUpdateDialogOpen(true)}
          >
            <ClipboardCheck />
            Update
          </Button>}
        </div>
        <CardDescription>
          {/* Enter the employee details and thier performance */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-3">
              <Label className="underline" htmlFor="name">
                Job Id
              </Label>

              <h4 className="font-semibold text-lg">{job?.projectId}</h4>
            </div>
            <div className="grid gap-3">
              <Label className="underline" htmlFor="name">
                LPO Id
              </Label>

              <h4 className="font-semibold text-lg">{job?.lpo_number}</h4>
            </div>
            <div className="grid gap-3">
              <Label className="underline" htmlFor="name">
                Status
              </Label>

              <h4 className="font-semibold text-lg">{job?.status}</h4>
            </div>
          </div>
          <div className="grid gap-3">
            <Label className="underline" htmlFor="name">
              Delivry Timeline
            </Label>

            <h4 className="font-semibold text-lg">{job?.delivery_timelines}</h4>
          </div>
          <div className="grid gap-3">
            <Label className="underline" htmlFor="name">
              Scop of Work
            </Label>

            <h4 className="font-semibold text-lg">{job?.scope_of_work}</h4>
          </div>
          {/* <div className="grid gap-3">
                             <Label htmlFor="name">Remark</Label>
   
                             <h4 className="font-semibold text-lg">
                               {job?.remarks}
                             </h4>
                           </div> */}

          {job?.payment_terms && (
            <div className="grid gap-3">
              <Label htmlFor="name" className="underline">
                Payment Terms{" "}
              </Label>
              <ul>
                {Object.entries(job?.payment_terms).map(([key, value]: any) => {
                  // console.log(key);
                  return (
                    <li key={key}>
                      <div>
                        <p>Description: {value.description}</p>
                        <p>Milestone: {value.milestone}</p>
                        <p>Percentage: {value.percentage}%</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
