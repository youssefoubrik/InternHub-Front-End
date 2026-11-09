"use client";
import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import CheckboxButton from "../CheckboxButton";
import Button from "../Button";
import { useInternship } from "@/context/internshipContext";
import { InternshipType } from "@/types/types";
import { useFilters } from "@/context/FiltersContext";
import { InternshipPostErrors } from "@/lib/validation/internshipPost";

function JobSkills({
  errors,
  onFieldChange,
}: {
  errors: InternshipPostErrors;
  onFieldChange: (field: "skills" | "tags") => void;
}) {
  const { internship, setInternship } = useInternship();
  const { filters, handleFilterChange } = useFilters();

  const skillInputRef = useRef<HTMLInputElement>(null);

  console.log("internship", internship);

  const handleAddSkill = () => {
    if (!skillInputRef.current) return;

    const skillValue = skillInputRef.current.value.trim();
    if (skillValue && !internship?.skills?.includes(skillValue)) {
      setInternship({
        ...internship,
        skills: [...internship?.skills, skillValue],
      });
      onFieldChange("skills");
      skillInputRef.current.value = "";
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setInternship({
      ...internship,
      skills: internship?.skills?.filter(
        (skill: string) => skill !== skillToRemove,
      ),
    });
  };

  const handleAddTag = (value: InternshipType) => {
    if (!internship?.tags?.includes(value)) {
      setInternship({ ...internship, tags: [...internship?.tags, value] });
    } else {
      setInternship({
        ...internship,
        tags: internship?.tags?.filter((tag: InternshipType) => tag !== value),
      });
    }
  };

  const handleCheckedFunction = (key: InternshipType, value: boolean) => {
    handleAddTag(key);
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Label
            htmlFor="skills"
            className="text-sm text-muted-foreground mt-2"
          >
            Add relevant skills for this internship post.
          </Label>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              ref={skillInputRef}
              type="text"
              id="skills"
              className="flex-1"
              placeholder="Enter a skill"
            />

            <Button label="Add Skill" type="button" onClick={handleAddSkill} />
          </div>
          {errors.skills && (
            <p className="text-sm text-red-600" role="alert">
              {errors.skills}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {internship?.skills.map((skill: string, index: number) => (
              <div
                key={index}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center space-x-1"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-primary-foreground hover:text-red-500 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Type</h3>
          <Label htmlFor="tags" className="text-sm text-muted-foreground mt-2">
            Add relevant tags for the internship position.
          </Label>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <CheckboxButton
            items={[
              InternshipType.PFA,
              InternshipType.PFE,
              InternshipType.INITIATION,
            ]}
            itemsValue={[
              internship?.tags.includes(InternshipType.PFA),
              internship?.tags.includes(InternshipType.PFE),
              internship?.tags.includes(InternshipType.INITIATION),
            ]}
            onCheckedFunction={(key, value) => {
              handleCheckedFunction(key, value);
              onFieldChange("tags");
            }}
            classNameGroup="flex flex-row justify-between space-y-0 w-full"
            classNameItemContainer="bg-white border-border border space-x-0 rounded-md cursor-pointer"
            classNameLabel="cursor-pointer font-medium w-full h-full p-6"
            classNameItem="hidden"
            classNameItemContainerWhenChecked="border border-primary text-primary"
          />
          {errors.tags && (
            <p className="text-sm text-red-600" role="alert">
              {errors.tags}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSkills;
