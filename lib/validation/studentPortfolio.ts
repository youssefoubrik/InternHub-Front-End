import { Student } from "@/types/types";

export type StudentPortfolioField =
  | "firstName"
  | "lastName"
  | "email"
  | "profileTitle"
  | "tel"
  | "links.github"
  | "links.linkedin"
  | "links.website";

export type StudentPortfolioErrors = Partial<
  Record<StudentPortfolioField, string>
>;

const namePattern = /^[A-Za-z\s]{2,50}$/;
const moroccanPhonePattern = /^0[567]\d{8}$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeStudentPortfolio(student: Student): Student {
  const phone = student.tel?.trim().replace(/[\s.-]/g, "") || undefined;

  return {
    ...student,
    firstName: student.firstName.trim(),
    lastName: student.lastName.trim(),
    email: student.email.trim(),
    profileTitle: student.profileTitle?.trim() || "",
    tel: phone,
    links: {
      ...student.links,
      github: student.links?.github?.trim() || undefined,
      linkedin: student.links?.linkedin?.trim() || undefined,
      website: student.links?.website?.trim() || undefined,
    },
  };
}

export function validateStudentPortfolio(student: Student): StudentPortfolioErrors {
  const errors: StudentPortfolioErrors = {};

  if (!student.firstName) {
    errors.firstName = "First name is required.";
  } else if (!namePattern.test(student.firstName)) {
    errors.firstName = "Use 2–50 letters and spaces only.";
  }

  if (!student.lastName) {
    errors.lastName = "Last name is required.";
  } else if (!namePattern.test(student.lastName)) {
    errors.lastName = "Use 2–50 letters and spaces only.";
  }

  if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.email = "Enter a valid email address.";
  }

  if ((student.profileTitle?.length ?? 0) > 30) {
    errors.profileTitle = "Profile title must be 30 characters or fewer.";
  }

  if (student.tel && !moroccanPhonePattern.test(student.tel)) {
    errors.tel = "Enter a Moroccan number such as 0612345678.";
  }

  const github = student.links?.github;
  if (github && (!isValidUrl(github) || !github.startsWith("https://github.com/"))) {
    errors["links.github"] = "Use a valid https://github.com/ URL.";
  }

  const linkedin = student.links?.linkedin;
  if (
    linkedin &&
    (!isValidUrl(linkedin) || !linkedin.startsWith("https://www.linkedin.com/"))
  ) {
    errors["links.linkedin"] = "Use a valid https://www.linkedin.com/ URL.";
  }

  const website = student.links?.website;
  if (website && !isValidUrl(website)) {
    errors["links.website"] = "Enter a valid website URL starting with http:// or https://.";
  }

  return errors;
}
