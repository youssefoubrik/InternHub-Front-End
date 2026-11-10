import { Internship } from "@/types/types";

export type InternshipPostField =
  | "title"
  | "workMode"
  | "description"
  | "city"
  | "duration"
  | "salary"
  | "salaryType"
  | "skills"
  | "tags";
export type InternshipPostErrors = Partial<Record<InternshipPostField, string>>;

export function validateInternshipPost(internship: Internship): InternshipPostErrors {
  const errors: InternshipPostErrors = {};
  if (!internship.title?.trim()) errors.title = "Internship title is required.";
  if (!internship.workMode) errors.workMode = "Select a work mode.";

  const description = internship.description?.trim() || "";
  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 120) {
    errors.description = "Description must contain at least 120 characters.";
  }

  if (!internship.city?.trim()) errors.city = "City is required.";
  if (!Number.isInteger(internship.duration) || internship.duration <= 0) {
    errors.duration = "Duration must be a positive whole number of months.";
  }

  if (internship.paid) {
    if (internship.salary == null || !Number.isFinite(internship.salary) || internship.salary < 500) {
      errors.salary = "Paid internships require a salary of at least 500.";
    }
    if (!internship.salaryType) errors.salaryType = "Select a salary period.";
  }

  if (!internship.skills?.some((skill) => skill.trim())) {
    errors.skills = "Add at least one skill.";
  }
  if (!internship.tags?.length) errors.tags = "Select at least one internship type.";
  return errors;
}
