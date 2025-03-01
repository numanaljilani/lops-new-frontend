"use client";
import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '';

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
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useClientsMutation } from "@/redux/query/clientsApi";

function CreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  rfq,
  setRfq,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  rfq: any;
  setRfq: any;
  handleSubmit: (value: any) => void;
}) {
  const [clients, setClients] = useState([]);
  const [clientsApi, { data, isSuccess, error, isError }] =
    useClientsMutation();

  const getClients = async () => {
    const res = await clientsApi({});
    console.log(res, "response");
  };

  useEffect(() => {
    getClients();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "response from server");
      if (data) {
        setClients(data.results);
      }
    }
  }, [isSuccess]);
  return (
    <Dialog
      open={isDialogOpen}
       onOpenChange={() => setIsDialogOpen(false)}
    >
      <DialogContent className=" overflow-x-scroll no-scrollbar border border-black rounded-lg w-[90%] max-h-[90%]  scroll-smooth lg:w-[1200px] md:w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create New RFQ</DialogTitle>
          <DialogDescription>
            Fill out the form below to Generate a new RFQ .
          </DialogDescription>
        </DialogHeader>

        {/* <form className=" px-3 "> */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="subcategory">Client</Label>
              {/* <Input
                id="ptype"
                name="ptype"
                type="text"
                placeholder="Search client"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, project_type: e.target.value });
                }}
                required
              /> */}
              <Select
              onValueChange={(value) =>
                setRfq({
                  ...rfq,
                  client: value,
                })
              }
              >
                <SelectTrigger id="Service" aria-label="Select Service">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any, index) => (
                    <SelectItem key={index} value={client.client_name}>
                      {client.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ptype">Project type</Label>
              <Input
                id="ptype"
                name="ptype"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, project_type: e.target.value });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="scop">Scope of work</Label>
              <Input
                id="scop"
                name="scop"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, scope_of_work: e.target.value });
                }}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Quotation Number</Label>
              <Input
                id="quotation"
                name="quotation"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, quotation_number: e.target.value });
                }}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Quotation Amount</Label>
              <Input
                id="quotation_amount"
                name="quotation_amount"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, quotation_amount: e.target.value });
                }}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              
              <Select
              onValueChange={(value) =>
                setRfq({
                  ...rfq,
                  status: value,
                })
              }
              >
                <SelectTrigger id="Status" aria-label="Select Status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
               
                    <SelectItem value="Pending">
                     Pending
                    </SelectItem>
                    <SelectItem value="Ongoing">
                     Ongoing
                    </SelectItem>
                    <SelectItem value="Completed">
                     Completed
                    </SelectItem>
                 
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="about">Remark</Label>
              <Textarea
                id="about"
                className="min-h-32"
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, remarks: e.target.value });
                }}
              />
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button
              variant={"secondary"}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
