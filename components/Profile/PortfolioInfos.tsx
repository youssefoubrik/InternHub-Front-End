import InputField from "@/components/InputField";
import { StudentPortfolioErrors, StudentPortfolioField } from "@/lib/validation/studentPortfolio";
import { useStudentProfileDraftStore } from "@/stores/studentProfileDraftStore";
import { Location } from "@/types/types";

interface PortfolioInfosProps {
  errors: StudentPortfolioErrors;
  onFieldChange: (field: StudentPortfolioField) => void;
}

const PortfolioInfos = ({ errors, onFieldChange }: PortfolioInfosProps) => {
  const draft = useStudentProfileDraftStore((state) => state.draft);
  const updateDraft = useStudentProfileDraftStore((state) => state.updateDraft);

  if (!draft) return null;

  const updateField = <K extends keyof typeof draft>(
    field: K,
    value: (typeof draft)[K]
  ) => {
    updateDraft((current) => ({ ...current, [field]: value }));
    onFieldChange(field as StudentPortfolioField);
  };

  const updateLocation = (field: keyof Location, value: string) => {
    updateDraft((current) => ({
      ...current,
      location: {
        address: "",
        city: "",
        country: "",
        ...current.location,
        [field]: value,
      },
    }));
  };

  const updateLink = (
    field: "github" | "linkedin" | "website",
    value: string
  ) => {
    updateDraft((current) => ({
      ...current,
      links: { ...current.links, [field]: value },
    }));
    onFieldChange(`links.${field}`);
  };

  const fieldClass = (field: StudentPortfolioField) =>
    `w-full ${errors[field] ? "border-red-500 focus:ring-red-500" : ""}`;

  const errorMessage = (field: StudentPortfolioField) =>
    errors[field] ? (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="portfolio-firstName" className="mb-1 block text-sm font-medium text-gray-700">
            First Name
          </label>
          <InputField
            id="portfolio-firstName"
            className={fieldClass("firstName")}
            value={draft.firstName}
            type="text"
            required
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          {errorMessage("firstName")}
        </div>
        <div>
          <label htmlFor="portfolio-lastName" className="mb-1 block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <InputField
            id="portfolio-lastName"
            className={fieldClass("lastName")}
            value={draft.lastName}
            type="text"
            required
            onChange={(event) => updateField("lastName", event.target.value)}
          />
          {errorMessage("lastName")}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <p className={`rounded-md border bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 ${errors.email ? "border-red-500" : "border-gray-200"}`}>
          {draft.email}
        </p>
        {errorMessage("email")}
      </div>

      <div>
        <label htmlFor="portfolio-profileTitle" className="mb-1 block text-sm font-medium text-gray-700">
          Profile Title
        </label>
        <InputField
          id="portfolio-profileTitle"
          className={fieldClass("profileTitle")}
          value={draft.profileTitle || ""}
          type="text"
          onChange={(event) => updateField("profileTitle", event.target.value)}
        />
        {errorMessage("profileTitle")}
      </div>

      <div>
        <label htmlFor="portfolio-school" className="mb-1 block text-sm font-medium text-gray-700">
          School
        </label>
        <InputField
          id="portfolio-school"
          className="w-full"
          value={draft.school || ""}
          type="text"
          onChange={(event) => updateField("school", event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="portfolio-tel" className="mb-1 block text-sm font-medium text-gray-700">
          Phone
        </label>
        <InputField
          id="portfolio-tel"
          className={fieldClass("tel")}
          value={draft.tel || ""}
          type="tel"
          placeholder="0612345678"
          onChange={(event) => updateField("tel", event.target.value)}
        />
        {errorMessage("tel")}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(["address", "city", "country"] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`portfolio-${field}`} className="mb-1 block text-sm font-medium capitalize text-gray-700">
              {field}
            </label>
            <InputField
              id={`portfolio-${field}`}
              className="w-full"
              value={draft.location?.[field] || ""}
              type="text"
              onChange={(event) => updateLocation(field, event.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="portfolio-github" className="mb-1 block text-sm font-medium text-gray-700">
            GitHub
          </label>
          <InputField
            id="portfolio-github"
            className={fieldClass("links.github")}
            value={draft.links?.github || ""}
            type="url"
            placeholder="https://github.com/username"
            onChange={(event) => updateLink("github", event.target.value)}
          />
          {errorMessage("links.github")}
        </div>
        <div>
          <label htmlFor="portfolio-linkedin" className="mb-1 block text-sm font-medium text-gray-700">
            LinkedIn
          </label>
          <InputField
            id="portfolio-linkedin"
            className={fieldClass("links.linkedin")}
            value={draft.links?.linkedin || ""}
            type="url"
            placeholder="https://www.linkedin.com/in/username"
            onChange={(event) => updateLink("linkedin", event.target.value)}
          />
          {errorMessage("links.linkedin")}
        </div>
        <div>
          <label htmlFor="portfolio-website" className="mb-1 block text-sm font-medium text-gray-700">
            Portfolio or Website
          </label>
          <InputField
            id="portfolio-website"
            className={fieldClass("links.website")}
            value={draft.links?.website || ""}
            type="url"
            placeholder="https://example.com"
            onChange={(event) => updateLink("website", event.target.value)}
          />
          {errorMessage("links.website")}
        </div>
      </div>
    </div>
  );
};

export default PortfolioInfos;
