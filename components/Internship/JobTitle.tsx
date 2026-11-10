"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import RadioButton from "../RadioButton";
import { useInternship } from "@/context/internshipContext";
import { WorkMode } from "@/types/types";
import { InternshipPostErrors } from "@/lib/validation/internshipPost";

function JobTitle({
  errors,
  onFieldChange,
}: {
  errors: InternshipPostErrors;
  onFieldChange: (field: "title" | "workMode") => void;
}) {
  const { internship, setInternship } = useInternship();

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Post Title</h3>
          <Label
            htmlFor="InternshipTitle"
            className="text-sm text-muted-foreground mt-2"
          >
            An internship title defines the role and responsibilities of an
            intern in an organization.
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            id="InternshipTitle"
            value={internship?.title}
            onChange={(e) => {
              setInternship({ ...internship, title: e.target.value });
              onFieldChange("title");
            }}
            className="w-full mt-2 focus:border-primary focus:ring-0"
            placeholder="Enter Post Title"
          />
          {errors.title && (
            <p className="md:col-start-2 text-sm text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Internship Type</h3>
          <Label
            htmlFor="internshipType"
            className="text-sm text-muted-foreground mt-2"
          >
            Select the type of internship.
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioButton
            value={internship?.workMode}
            items={["Remote", "On site", "Hybrid"]}
            itemsValue={[WorkMode.REMOTE, WorkMode.ON_SITE, WorkMode.HYBRID]}
            onValueChange={(value) => {
              setInternship({ ...internship, workMode: value });
              onFieldChange("workMode");
            }}
            classNameGroup="flex flex-row"
            classNameItemContainer="bg-white border-border border rounded-md cursor-pointer"
            classNameLabel="cursor-pointer font-medium w-full h-full p-6"
            classNameItem="hidden"
            classNameItemContainerWhenChecked="border border-primary text-primary"
          />
          {errors.workMode && (
            <p className="text-sm text-red-600" role="alert">
              {errors.workMode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobTitle;
