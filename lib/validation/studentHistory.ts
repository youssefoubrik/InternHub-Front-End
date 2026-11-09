import { Experience, Formation } from "@/types/types";

export type HistoryField =
  | "company"
  | "domain"
  | "diploma"
  | "poste"
  | "startDate"
  | "endDate"
  | "description";
export type HistoryErrors = Partial<Record<HistoryField, string>>;

function parseHistoryDate(value: string): number | null {
  const match =
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{4})$/i.exec(value);
  if (!match) return null;
  const month = new Date(`${match[1]} 1, ${match[2]}`).getMonth();
  return Number(match[2]) * 12 + month;
}

function validateDates(
  startDate: string,
  endDate: string,
  errors: HistoryErrors,
) {
  const start = startDate.trim();
  const end = endDate.trim();
  const parsedStart = parseHistoryDate(start);
  const parsedEnd =
    end.toUpperCase() === "PRESENT" ? null : parseHistoryDate(end);

  if (!parsedStart) errors.startDate = "Choose a valid start date.";
  if (end.toUpperCase() !== "PRESENT" && !parsedEnd) {
    errors.endDate = "Choose a valid end date or select PRESENT.";
  }
  if (parsedStart && parsedEnd && parsedEnd < parsedStart) {
    errors.endDate = "End date must be the same as or later than start date.";
  }
}

export function validateFormation(formation: Formation): HistoryErrors {
  const errors: HistoryErrors = {};
  if (!formation.company?.trim()) errors.company = "School is required.";
  if (!formation.domain?.trim()) errors.domain = "Domain is required.";
  if (!formation.diploma?.trim()) errors.diploma = "Diploma is required.";
  validateDates(formation.startDate || "", formation.endDate || "", errors);
  return errors;
}

export function validateExperience(experience: Experience): HistoryErrors {
  const errors: HistoryErrors = {};
  if (!experience.poste?.trim()) errors.poste = "Job title is required.";
  if (!experience.company?.trim()) errors.company = "Company is required.";
  validateDates(experience.startDate || "", experience.endDate || "", errors);

  return errors;
}

export function normalizeFormation(formation: Formation): Formation {
  return {
    ...formation,
    company: formation.company?.trim() || "",
    domain: formation.domain?.trim() || "",
    diploma: formation.diploma?.trim() || "",
    startDate: formation.startDate?.trim() || "",
    endDate: formation.endDate?.trim() || "",
  };
}

export function normalizeExperience(experience: Experience): Experience {
  const description = experience.description?.trim() || "";
  return {
    ...experience,
    poste: experience.poste?.trim() || "",
    company: experience.company?.trim() || "",
    startDate: experience.startDate?.trim() || "",
    endDate: experience.endDate?.trim() || "",
    description: description.replace(/<p>\s*<br\s*\/?><\/p>/gi, "").trim(),
  };
}
