import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ProfileAvatar from "../../ProfileAvatar";
import InputField from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Globe, Linkedin, Twitter } from "lucide-react";
import { useCompanyProfileDraftStore } from "@/stores/companyProfileDraftStore";
import { CompanyProfileErrors, CompanyProfileField } from "@/lib/validation/companyProfile";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[150px] rounded-md bg-white" />,
});

interface CompanyInfosFormProps {
  logo: File | null;
  setLogo: (file: File | null) => void;
  errors: CompanyProfileErrors;
  onFieldChange: (field: CompanyProfileField) => void;
}

const CompanyInfosForm = ({ logo, setLogo, errors, onFieldChange }: CompanyInfosFormProps) => {
  const company = useCompanyProfileDraftStore((state) => state.draft);
  const updateDraft = useCompanyProfileDraftStore((state) => state.updateDraft);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (!logo) {
      setLogoPreview("");
      return;
    }
    const previewUrl = URL.createObjectURL(logo);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logo]);

  if (!company) return null;

  const updateField = (field: keyof typeof company, value: string) => {
    updateDraft((draft) => ({ ...draft, [field]: value }));
    onFieldChange(field as CompanyProfileField);
  };

  const updateLink = (field: "linkedin" | "twitter" | "website", value: string) => {
    updateDraft((draft) => ({ ...draft, links: { ...draft.links, [field]: value } }));
    onFieldChange(`links.${field}`);
  };

  const error = (field: CompanyProfileField) => errors[field] && (
    <p className="col-start-2 text-sm text-red-600" role="alert">{errors[field]}</p>
  );

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div onClick={handleAvatarClick} className="cursor-pointer">
          <ProfileAvatar
            className="w-28 h-28 text-5xl bg-gray-800 overflow-hidden"
            avatarImage={
              logoPreview || company?.profilePicture || ""
            }
            avatarFallback={<span className="text-white">Logo</span>}
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            setLogo(e.target.files?.[0] ?? null);
          }}
        />
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Label htmlFor="companyName" className="self-center">
          Company Name
        </Label>
        <InputField
          id="companyName"
          type="text"
          placeholder="Company Name"
          value={company.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("name")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Label htmlFor="phone" className="self-center">
          Phone Number
        </Label>
        <InputField
          id="phone"
          type="tel"
          placeholder="Phone Number"
          value={company?.tel}
          onChange={(e) => updateField("tel", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("tel")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Label htmlFor="ice" className="self-center">
          ICE
        </Label>
        <InputField
          id="ice"
          type="text"
          placeholder="ICE"
          value={company.ice}
          onChange={(e) => updateField("ice", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("ice")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Linkedin className="self-center" />
        <InputField
          type="text"
          placeholder="LinkedIn link"
          value={company.links?.linkedin}
          onChange={(e) => updateLink("linkedin", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("links.linkedin")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Twitter className="self-center" />
        <InputField
          type="text"
          placeholder="Twitter link"
          value={company.links?.twitter}
          onChange={(e) => updateLink("twitter", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("links.twitter")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Globe className="self-center" />
        <InputField
          type="text"
          placeholder="Website link"
          value={company.links?.website}
          onChange={(e) => updateLink("website", e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded"
        />
        {error("links.website")}
      </div>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <Label htmlFor="description">Description</Label>
        <TextEditor
          value={company.description}
          onChange={(value: string) => updateField("description", value)}
          style={{
            minHeight: "150px",
            backgroundColor: "#fff",
            focusBorderColor: "#FF3819",
          }}
          modules={{ toolbar: true }}
          className="w-full"
        />
        {error("description")}
      </div>
    </div>
  );
};

export default CompanyInfosForm;
