import { Company } from "@/types/types";

export type CompanyProfileField =
  | "name"
  | "email"
  | "tel"
  | "ice"
  | "description"
  | "location"
  | "links.linkedin"
  | "links.twitter"
  | "links.website";
export type CompanyProfileErrors = Partial<Record<CompanyProfileField, string>>;

const phonePattern = /^0[567]\d{8}$/;
const icePattern = /^\d{15}$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeCompanyProfile(company: Company): Company {
  const optional = (value?: string) => value?.trim() || undefined;
  return {
    ...company,
    name: company.name?.trim() || "",
    email: company.email?.trim() || "",
    tel: optional(company.tel),
    ice: company.ice?.trim() || "",
    description: company.description?.trim() || "",
    links: {
      ...company.links,
      linkedin: optional(company.links?.linkedin),
      twitter: optional(company.links?.twitter),
      website: optional(company.links?.website),
    },
  };
}

export function validateCompanyProfile(company: Company): CompanyProfileErrors {
  const errors: CompanyProfileErrors = {};
  if (!company.name?.trim()) errors.name = "Company name is required.";
  if (!company.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
    errors.email = "Enter a valid email address.";
  }

  const phone = company.tel?.replace(/[\s.-]/g, "") || "";
  if (phone && !phonePattern.test(phone)) {
    errors.tel = "Enter a Moroccan number such as 0612345678.";
  }
  if (!company.ice?.trim()) {
    errors.ice = "ICE is required.";
  } else if (!icePattern.test(company.ice.trim())) {
    errors.ice = "ICE must contain exactly 15 digits.";
  }

  const descriptionLength = company.description?.length ?? 0;
  if (descriptionLength < 10) {
    errors.description = "Description must contain at least 10 characters.";
  } else if (descriptionLength > 500) {
    errors.description = "Description must contain 500 characters or fewer.";
  }

  const latitude = company.location?.latitude;
  const longitude = company.location?.longitude;
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    errors.location = "Choose a valid company location on the map.";
  }

  for (const field of ["linkedin", "twitter", "website"] as const) {
    const value = company.links?.[field]?.trim();
    if (value && !isHttpUrl(value)) {
      errors[`links.${field}`] = "Enter a valid URL starting with http:// or https://.";
    }
  }
  return errors;
}
