"use client";
import { useUser } from "@/context/userContext";
import { deleteFile, uploadFile } from "@/lib/storageApi";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import ProfileAvatar from "../ProfileAvatar";
import {
  Building2,
  Globe,
  Linkedin,
  Mail,
  RotateCcw,
  Smartphone,
  Twitter,
  UserPen,
} from "lucide-react";
import Overlay from "@/components/Overlay";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

const CompanyProfile = () => {
  const { company, updateCompany, isUserProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!isUserProfile) return;

    const file = event.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await uploadFile(file);
        const saved = await updateCompany({
          ...company,
          profilePicture: publicUrl,
        });
        if (!saved) return;
        if (company.profilePicture) {
          try {
            await deleteFile(company.profilePicture);
          } catch (error) {
            toast.error(
              "Company logo updated, but the old logo could not be deleted" +
                error,
            );
          }
        }
      } catch (error) {
        toast.error("Failed to upload profile picture:" + error);
        // Handle error (show toast, alert, etc.)
      }
    }
  };

  const handleResetImage = async (e: React.MouseEvent) => {
    if (!isUserProfile) return;
    e.stopPropagation();
    if (company.profilePicture) {
      try {
        const saved = await updateCompany({ ...company, profilePicture: "" });
        if (!saved) return;
        try {
          await deleteFile(company.profilePicture);
        } catch (error) {
          toast.error(
            "Company logo was removed, but the old image could not be deleted" +
              error,
          );
        }
      } catch (error) {
        toast.error("Failed to delete profile picture:" + error);
        // Handle error (show toast, alert, etc.)
      }
    } else {
      // setCompany({
      //   ...company?,
      //   profilePicture: "",
      // });
    }
  };

  const handleAvatarClick = () => {
    // if (!isUserProfile) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 md:w-[65%] w-full space-y-7">
      <div className="flex flex-col md:flex-row gap-5 items-center w-full">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
          <div className="relative group">
            <div onClick={handleAvatarClick} className="cursor-pointer">
              <ProfileAvatar
                className="w-28 h-28 text-5xl relative bg-gray-800 overflow-hidden group"
                avatarImage={company?.profilePicture ?? ""}
                avatarFallback={
                  <Building2 className="w-20 h-20 text-gray-800" />
                }
                overlay={
                  !isUserProfile ? (
                    <Overlay children={<UserPen className="w-16 h-16" />} />
                  ) : undefined
                }
              />
            </div>
            {!isUserProfile && company?.profilePicture && (
              <div
                onClick={handleResetImage}
                className="absolute -bottom-2 right-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full flex items-center">
            <h1 className="text-2xl font-medium text-nowrap">
              {company?.name || "Not set"}
            </h1>
          </div>
          <p className="text-base font-light">Company</p>
        </div>
        {isUserProfile && (
          <div className="w-full flex justify-end">
            <Link
              className="w-fit mt-2 py-2 px-6 rounded-md border flex items-center gap-3 transition-all duration-200 ease-in-out outline-none border-primary hover:opacity-75 text-primary"
              href="/profile/company/update-form"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm text-lg">
          <h3 className="font-medium mb-2">Contact Information</h3>
          <div className="space-y-1">
            <p className="text-base text-gray-600 flex gap-2 items-center">
              <Smartphone className="w-5 h-5 shrink-0" />:{" "}
              {company?.tel || "Not set"}
            </p>
            <p className="text-base text-gray-600 flex gap-2 items-center">
              <Mail className="w-5 h-5 shrink-0" />:
              <a
                href={`${company?.email ? `mailto:${company?.email}` : "#"}`}
                className="text-blue-500 hover:text-blue-600 truncate"
              >
                {company?.email || "Not set"}
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm text-lg">
          <h3 className="font-medium mb-2">Company Details</h3>
          <p className="text-base text-gray-600">
            ICE: {company?.ice ?? "Not set"}
          </p>
        </div>

        <div className="bg-white p-4 space-y-1 rounded-lg shadow-sm text-lg">
          <h3 className="font-medium mb-2">Social Links</h3>
          <p className="text-base text-gray-600 flex gap-2 items-center">
            <Linkedin className="w-5 h-5" />
            <a
              href={company?.links?.linkedin ?? "#"}
              target={company?.links?.linkedin && "_blank"}
              className="text-blue-500 hover:text-blue-600 truncate"
            >
              {company?.links?.linkedin ? "LinkedIn Profile" : "Not set"}
            </a>
          </p>
          <p className="text-base text-gray-600 flex gap-2 items-center">
            <Twitter className="w-5 h-5" />
            <a
              href={company?.links?.twitter ?? "#"}
              target={company?.links?.linkedin && "_blank"}
              className="text-blue-500 hover:text-blue-600 truncate"
            >
              {company?.links?.twitter ? "Twitter Profile" : "Not set"}
            </a>
          </p>
          <p className="text-base text-gray-600 flex gap-2 items-center">
            <Globe className="w-5 h-5" />
            <a
              href={company?.links?.website ?? "#"}
              target={company?.links?.linkedin && "_blank"}
              className="text-blue-500 hover:text-blue-600 truncate"
            >
              {company?.links?.website ? "Visit Our Website" : "Not set"}
            </a>
          </p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm text-lg">
        <h3 className="font-medium mb-2">Description</h3>
        <div
          className={`${
            company?.description ? "" : "text-center"
          } prose prose-sm max-w-none`}
          dangerouslySetInnerHTML={{
            __html: company?.description ?? "---",
          }}
        />
      </div>
    </div>
  );
};

export default CompanyProfile;
