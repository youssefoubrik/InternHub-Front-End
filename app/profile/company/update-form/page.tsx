"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import CompanyInfosForm from "@/components/Profile/company/update-form/CompanyInfosForm";
import Button from "@/components/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { deleteFile, uploadFile } from "@/lib/storageApi";
import toast from "react-hot-toast";
import CompanyUpdateSummary from "@/components/Profile/company/update-form/CompanyUpdateSummary";
import { useAuth } from "@/context/authContext";
import { useCompanyProfileDraftStore } from "@/stores/companyProfileDraftStore";
import {
  CompanyProfileErrors,
  CompanyProfileField,
  normalizeCompanyProfile,
  validateCompanyProfile,
} from "@/lib/validation/companyProfile";

const CompanyLocation = dynamic(
  () => import("@/components/Profile/company/update-form/CompanyLocation").then((module) => module.CompanyLocation),
  { ssr: false, loading: () => <div className="mt-5 h-[700px] w-full rounded-lg bg-gray-100" /> },
);

const UpdateCompanyProfile = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { company, updateCompany } = useUser();
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<CompanyProfileErrors>({});
  const draft = useCompanyProfileDraftStore((state) => state.draft);
  const setDraft = useCompanyProfileDraftStore((state) => state.setDraft);
  const resetDraft = useCompanyProfileDraftStore((state) => state.resetDraft);

  useEffect(() => {
    if (!company?.id) {
      router.push(`/profile/company/${currentUser?.id}`);
      return;
    }
    if (!draft || draft.id !== company.id) {
      setDraft({ ...company, location: { ...company.location }, links: { ...company.links } });
    }
  }, [company, currentUser, draft, router, setDraft]);

  const clearFieldError = (field: CompanyProfileField) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateStep = (currentStep: number) => {
    if (!draft) return false;
    const normalized = normalizeCompanyProfile(draft);
    const allErrors = validateCompanyProfile(normalized);
    const stepFields: CompanyProfileField[] = currentStep === 1
      ? ["name", "email", "tel", "ice", "description", "links.linkedin", "links.twitter", "links.website"]
      : ["location"];
    const stepErrors = Object.fromEntries(
      stepFields.filter((field) => allErrors[field]).map((field) => [field, allErrors[field]])
    ) as CompanyProfileErrors;
    setErrors((current) => {
      const next = { ...current };
      stepFields.forEach((field) => delete next[field]);
      return { ...next, ...stepErrors };
    });
    if (Object.keys(stepErrors).length) {
      toast.error("Please fix the highlighted fields before continuing.");
      return false;
    }
    return true;
  };

  const updateCompanyProfile = async () => {
    if (!draft || isSaving) return;
    const normalized = normalizeCompanyProfile(draft);
    const nextErrors = validateCompanyProfile(normalized);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSaving(true);
    let uploadedUrl: string | undefined;
    try {
      let publicUrl = normalized.profilePicture;
      if (logo) {
        publicUrl = await uploadFile(logo);
        uploadedUrl = publicUrl;
      }
      const saved = await updateCompany({ ...normalized, profilePicture: publicUrl });
      if (!saved) {
        if (uploadedUrl) await deleteFile(uploadedUrl).catch(() => undefined);
        return;
      }

      if (logo && company.profilePicture) {
        try {
          await deleteFile(company.profilePicture);
        } catch (error) {
          console.error("Company was updated, but the old logo could not be deleted", error);
        }
      }
      resetDraft();
      router.push(`/profile/company/${company.id}`);
    } catch (error) {
      toast.error("Failed to update company: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    if (!validateStep(step)) return;
    if (step < 3) {
      setStep(step + 1);
    }
    if (step === 3) {
      await updateCompanyProfile();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Update Company Information
            </h2>
            <CompanyInfosForm logo={logo} setLogo={setLogo} errors={errors} onFieldChange={clearFieldError} />
            <div className="w-full flex justify-end">
              <Button
                label="Next"
                onClick={() => void nextStep()}
                className="mt-4 px-4 py-2 rounded"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold">Update Company Location</h2>
            <CompanyLocation />
            {errors.location && <p className="mt-2 text-sm text-red-600" role="alert">{errors.location}</p>}
            <div className="mt-4 flex justify-between">
              <Button
                label="Previous"
                onClick={prevStep}
                outline={true}
                className="px-4 py-2 rounded"
              />
              <Button
                label="Next"
                onClick={() => void nextStep()}
                className="px-4 py-2 rounded"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold">Summary</h2>
            {/* Display a summary of the updates */}
            <CompanyUpdateSummary logo={logo} />
            <div className="mt-4 flex justify-between">
              <Button
                label="Previous"
                onClick={prevStep}
                outline={true}
                className="px-4 py-2 rounded"
              />
              <Button
                label="Update"
                onClick={() => void nextStep()}
                disabled={isSaving}
                className="px-4 py-2 rounded"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 mx-14 mb-8 bg-white rounded shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer hover:text-primary"
          onClick={() => router.push(`/profile/company/${company.id}`)}
        >
          <ArrowLeft size={20} />
          <span>Back to profile</span>
        </div>
        <div className="flex-1 mb-4">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-primary rounded"
              style={{ width: `${step * 33}%` }}
            ></div>
          </div>
        </div>
      </div>
      {renderStepContent()}
    </div>
  );
};

export default UpdateCompanyProfile;
