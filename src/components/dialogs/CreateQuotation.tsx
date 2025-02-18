import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useCreateRFQMutation } from "@/redux/query/rfqsApi";

function CreateQuotation({
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
  return (
    <Dialog
      open={isDialogOpen}
      //  onOpenChange={() => setIsDialogOpen(false)}
    >
      <DialogContent className="overflow-x-scroll no-scrollbar max-h-[90%]  scroll-smooth w-[1200px]">
        <DialogHeader>
          <DialogTitle>Create New RFQ</DialogTitle>
          <DialogDescription>
            Fill out the form below to Generate a new RFQ .
          </DialogDescription>
        </DialogHeader>

        <form className=" px-3 ">
          <div className="space-y-4">
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
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="text"
                // value={formData.password} onChange={handleInputChange}
                onChange={(e: any) => {
                  e.preventDefault();
                  setRfq({ ...rfq, status: e.target.value });
                }}
                required
              />
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuotation;
