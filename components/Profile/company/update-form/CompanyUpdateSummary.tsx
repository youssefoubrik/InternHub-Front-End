import React, { useState } from "react";
import {
  Check,
  MapPin,
  Building2,
  Phone,
  Globe,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
} from "lucide-react";
import ProfileAvatar from "../../ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { useCompanyProfileDraftStore } from "@/stores/companyProfileDraftStore";

const CompanyMaps = dynamic(
  () => import("../../company/CompanyMaps").then((module) => module.CompanyMaps),
  { ssr: false, loading: () => <div className="h-[260px] w-full rounded-lg bg-gray-100" /> },
);

const CompanyUpdateSummary = ({ logo }: { logo: File | null }) => {
  const company = useCompanyProfileDraftStore((state) => state.draft);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!company) return null;

  return (
    <div className="bg-white rounded-lg p-6 mt-4 space-y-6">
      <div className="flex flex-col items-center justify-center space-y-4 mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center">Review Your Changes</h2>
        <p className="text-gray-500 text-center max-w-md">
          Please review your company information before finalizing the update.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Company Info and Social Links */}
        <div className="space-y-6">
          {/* Company Basic Info */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Building2 className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Company Information</h3>
            </div>
            <div className="flex flex-col items-center mb-4">
              <ProfileAvatar
                className="w-24 h-24 text-4xl bg-gray-800 mb-4"
                avatarImage={
                  logo
                    ? URL.createObjectURL(logo as File)
                    : company?.profilePicture ?? ""
                }
                avatarFallback={
                  <span className="text-white">
                    {company.name?.charAt(0) || "C"}
                  </span>
                }
              />
              <h4 className="text-xl font-bold">{company.name}</h4>
              {company.ice && (
                <Badge variant="outline" className="mt-2 bg-gray-100">
                  ICE: {company.ice}
                </Badge>
              )}
              <Badge variant="outline" className="space-x-2 mt-2 bg-green-100">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{company?.tel || "No phone provided"}</span>
              </Badge>
            </div>
          </div>

          {/* Company Social Links */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Online Presence</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Website</span>
                </div>
                {company.links?.website ? (
                  <a
                    href={company.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {company.links.website}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">
                    No website provided
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-gray-500"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </div>
                {company.links?.linkedin ? (
                  <a
                    href={company.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {company.links.linkedin}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">
                    No LinkedIn profile provided
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-gray-500"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="text-sm font-medium">Twitter</span>
                </div>
                {company.links?.twitter ? (
                  <a
                    href={company.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate"
                  >
                    {company.links.twitter}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">
                    No Twitter profile provided
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Location */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <div className="flex items-center gap-2 mt-3 text-gray-600  rounded">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm">
                Latitude: {company?.location?.latitude?.toFixed(6)}, Longitude:{" "}
                {company?.location?.longitude?.toFixed(6)}
              </span>
            </div>
          </div>

          {company.location?.latitude && company.location?.longitude ? (
            <div className="flex flex-col flex-grow">
              <div className="flex-grow min-h-full">
                {/* Use the dynamic import to avoid SSR issues with Leaflet */}
                <CompanyMaps className="h-full w-full" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg">
              <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                No location information provided
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Company Description - Full Width */}
      {company.description && (
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm transition-all hover:shadow-md mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Company Description</h3>
            </div>
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary hover:text-primary-dark flex items-center gap-1 text-sm"
            >
              {showFullDescription ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div
            className={`prose prose-sm max-w-none ${
              !showFullDescription && "line-clamp-3"
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: company.description }} />
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Important Note</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Once you confirm these changes, your company profile will be
              immediately updated. Make sure all information is accurate and
              represents your company correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyUpdateSummary;
