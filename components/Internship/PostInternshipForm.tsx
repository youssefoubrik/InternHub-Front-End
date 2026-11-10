"use client";
import React from "react";
import Button from "../Button";
import JobDetails from "./JobDetails";
import JobSkills from "./JobSkills ";
import JobTitle from "./JobTitle";
import { useInternship } from "@/context/internshipContext";
import Summary from "./Summary";
import toast from "react-hot-toast";
import {
  InternshipPostErrors,
  InternshipPostField,
  validateInternshipPost,
} from "@/lib/validation/internshipPost";

function PostInternshipForm() {
  const { createInternship, resetInternshipForm, internship } = useInternship();

  const sections = ["About", "Post Details", "Skills", "Summary"];
  const [visitedSections, setVisitedSections] = React.useState<Set<string>>(
    new Set([sections[0]])
  );
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]);
  const [errors, setErrors] = React.useState<InternshipPostErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const clearFieldError = (field: InternshipPostField) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateSection = (section: string) => {
    const allErrors = validateInternshipPost(internship);
    const fields: InternshipPostField[] = section === "About"
      ? ["title", "workMode"]
      : section === "Post Details"
        ? ["description", "city", "duration", "salary", "salaryType"]
        : ["skills", "tags"];
    const sectionErrors = Object.fromEntries(
      fields.filter((field) => allErrors[field]).map((field) => [field, allErrors[field]])
    ) as InternshipPostErrors;

    setErrors((current) => {
      const next = { ...current };
      fields.forEach((field) => delete next[field]);
      return { ...next, ...sectionErrors };
    });
    if (Object.keys(sectionErrors).length) {
      toast.error("Please fix the highlighted fields before continuing.", { id: "error" });
      return false;
    }
    return true;
  };

  const handleSectionChange = (section: string, Type: string) => {
    setVisitedSections((prev) => {
      const updatedSet = new Set(prev);
      Type === "add" ? updatedSet.add(section) : updatedSet.delete(section);
      return updatedSet;
    });
  };

  const handleNextSection = () => {
    if (activeSection !== "Summary" && !validateSection(activeSection)) return;

    const currentIndex = sections.indexOf(activeSection);
    setActiveSection(sections[currentIndex + 1]);
    handleSectionChange(sections[currentIndex + 1], "add");
  };

  const renderStages = () => {
    switch (activeSection) {
      case "About":
        return <JobTitle errors={errors} onFieldChange={clearFieldError} />;
      case "Post Details":
        return <JobDetails errors={errors} onFieldChange={clearFieldError} />;
      case "Skills":
        return <JobSkills errors={errors} onFieldChange={clearFieldError} />;
      case "Summary":
        return <Summary />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeSection !== "Summary" || isSubmitting) return;

    const nextErrors = validateInternshipPost(internship);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalidSection = nextErrors.title || nextErrors.workMode
        ? "About"
        : nextErrors.description || nextErrors.city || nextErrors.duration || nextErrors.salary || nextErrors.salaryType
          ? "Post Details"
          : "Skills";
      setActiveSection(firstInvalidSection);
      setVisitedSections((previous) => new Set([...previous, firstInvalidSection]));
      toast.error("Please fix the highlighted fields before posting.", { id: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createInternship();
      if (created) resetInternshipForm();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="self-start w-full flex flex-row items-center bg-white rounded-full h-10 shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`w-full flex items-center justify-center ${
              visitedSections.size > index + 1 ? "bg-primary" : "bg-transparent"
            }`}
          >
            <div
              className={`py-3 relative gap-2 w-full text-center font-medium rounded-r-full border-r-2
                  ${
                    visitedSections.has(section)
                      ? "text-white bg-primary"
                      : "text-black"
                  }
                  `}
            >
              {section}
              {/* {currentSection === section && (
                <span className="w-1 h-full absolute left-0 top-0 bg-[#7263F3] rounded-full"></span>
              )} */}
            </div>
          </div>
        ))}
      </div>

      <form
        action=""
        className="p-6 flex-1 bg-white rounded-lg w-full"
        onSubmit={(event) => void handleSubmit(event)}
      >
        {renderStages()}

        <div className="gap-4 mt-4 w-full flex justify-between">
          <Button
            label="Previous"
              type="button"
            onClick={() => {
              const currentIndex = sections.indexOf(activeSection);
              setActiveSection(sections[currentIndex - 1]);
              handleSectionChange(sections[currentIndex], "del");
            }}
            outline={true}
            disabled={activeSection === "About"}
            className="px-6 py-2 text-black rounded-md"
          />
          {activeSection !== "Summary" && (
            <Button
              label="Next"
              type="button"
              onClick={handleNextSection}
              className="px-6 py-2 text-white rounded-md"
            />
          )}

          {activeSection === "Summary" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="self-end px-6 py-2 bg-[#7263F3] text-white rounded-md"
            >
              Post Job
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PostInternshipForm;
