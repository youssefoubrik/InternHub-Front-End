"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useInternship } from "@/context/internshipContext";
import { Label } from "../ui/label";
import RadioButton from "../RadioButton";
import { SalaryType } from "@/types/types";
import {
  InternshipPostErrors,
  InternshipPostField,
} from "@/lib/validation/internshipPost";

const TextEditor = dynamic(() => import("../TextEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[400px] rounded-md bg-white" />,
});

function JobDetails({
  errors,
  onFieldChange,
}: {
  errors: InternshipPostErrors;
  onFieldChange: (field: InternshipPostField) => void;
}) {
  const { internship, setInternship } = useInternship();

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">Internship Description</h3>
          <Label htmlFor="internshipDescription" className="text-gray-500 mt-2">
            Provide a detailed description of the internship.
          </Label>
        </div>
        <div className="flex-1">
          <TextEditor
            value={internship.description}
            onChange={(value) => {
              setInternship({ ...internship, description: value });
              onFieldChange("description");
            }}
            style={{ minHeight: "400px", backgroundColor: "white" }}
            modules={{ toolbar: true }}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">City</h3>
          <Label htmlFor="city" className="text-gray-500 mt-2">
            Enter the city where the internship will take place.
          </Label>
        </div>
        <div className="flex-1">
          <Input
            type="text"
            id="city"
            name="city"
            value={internship.city}
            onChange={(e) => {
              setInternship({ ...internship, city: e.target.value });
              onFieldChange("city");
            }}
            className="flex-1 w-full mt-2"
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.city}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">Internship Duration</h3>
          <Label htmlFor="duration" className="text-gray-500 mt-2">
            Enter the duration of the internship post.
          </Label>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              id="duration"
              name="duration"
              value={internship.duration}
              onChange={(e) => {
                setInternship({
                  ...internship,
                  duration: Number.parseInt(e.target.value),
                });
                onFieldChange("duration");
              }}
              className="flex-1 w-full mt-2"
              placeholder="Enter internship duration"
            />
            <span>Months</span>
          </div>
          {errors.duration && (
            <p className="text-sm text-red-600" role="alert">
              {errors.duration}
            </p>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="relative grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-black font-bold">Salary</h3>
          <Label htmlFor="salary" className="text-gray-500 mt-2">
            Enter the salary range for the internship.
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-center gap-2">
            <Input
              type="number"
              id="salary"
              placeholder="Enter Salary"
              value={internship.salary ?? ""}
              onChange={(e) => {
                setInternship({
                  ...internship,
                  salary: Number.parseFloat(e.target.value),
                });
                onFieldChange("salary");
              }}
              className="w-2/3"
              disabled={!internship.paid ? true : false}
            />
            <div className="w-1/3">
              <Select
                onValueChange={(value: string) => {
                  setInternship({
                    ...internship,
                    salaryType: value as SalaryType,
                  });
                  onFieldChange("salaryType");
                }}
                disabled={!internship.paid ? true : false}
                defaultValue={SalaryType.MONTH}
              >
                <SelectTrigger className="bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="w-[120px] mt-2">
                  <SelectItem value={SalaryType.YEAR}>Yearly</SelectItem>
                  <SelectItem value={SalaryType.MONTH}>Month</SelectItem>
                  <SelectItem value={SalaryType.HOUR}>Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(errors.salary || errors.salaryType) && (
            <p className="text-sm text-red-600" role="alert">
              {errors.salary || errors.salaryType}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <RadioButton
              value={internship.negotiable}
              onValueChange={(value) =>
                setInternship({ ...internship, negotiable: value })
              }
              items={["Negotiable", "Fixed"]}
              itemsValue={[true, false]}
              classNameGroup="w-2/3 border-border border py-2 px-2 rounded-md"
              disabled={!internship.paid ? true : false}
            />
            <div className="flex items-center justify-start flex-row-reverse gap-2 w-1/3">
              <Switch
                id="paid"
                checked={internship.paid}
                onCheckedChange={(value) => {
                  setInternship({ ...internship, paid: value });
                  onFieldChange("salary");
                  onFieldChange("salaryType");
                }}
              />
              <Label htmlFor="paid">Paid</Label>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">Motivation Letter</h3>
          <Label htmlFor="motivationRequired" className="text-gray-500 mt-2">
            Specify if a motivation letter is required for this internship.
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioButton
            value={internship?.motivationLetterRequired}
            items={["Mandatory", "Optional"]}
            itemsValue={[true, false]}
            onValueChange={(value) => {
              setInternship({
                ...internship,
                motivationLetterRequired: value,
              });
            }}
            classNameGroup="flex flex-row justify-between"
            classNameItemContainer="bg-white border-border border space-x-0 h-full rounded-md cursor-pointer"
            classNameLabel="cursor-pointer font-medium w-full h-full p-6"
            classNameItem="hidden"
            classNameItemContainerWhenChecked="border border-primary text-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
