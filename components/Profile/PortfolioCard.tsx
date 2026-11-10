"use client";
import React, { useRef, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import {
  Mail,
  MapPinHouse,
  Pencil,
  Phone,
  RotateCcw,
  University,
  UserPen,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Overlay from "../Overlay";
import AnimatedSocialButton from "./AnimatedSocialButton";
import { useUser } from "@/context/userContext";
import { uploadFile, deleteFile } from "@/lib/storageApi";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import PortfolioInfos from "./PortfolioInfos";
import { useStudentProfileDraftStore } from "@/stores/studentProfileDraftStore";
import {
  normalizeStudentPortfolio,
  StudentPortfolioErrors,
  validateStudentPortfolio,
} from "@/lib/validation/studentPortfolio";
import { Student } from "@/types/types";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

const PortfolioCard = () => {
  const { student, updateStudent, isUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<StudentPortfolioErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setDraft = useStudentProfileDraftStore((state) => state.setDraft);
  const resetDraft = useStudentProfileDraftStore((state) => state.resetDraft);
  const editorId = "student-portfolio";
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);

  const openProfileEditor = () => {
    if (!acquireEditor(editorId)) return;
    const draft: Student = {
      ...student,
      location: student.location
        ? { ...student.location }
        : {
            address: "",
            city: "",
            country: "",
          },
      links: { ...student.links },
    };
    setDraft(draft);
    setValidationErrors({});
    setIsEditing(true);
  };

  const cancelProfileEditor = () => {
    resetDraft();
    setValidationErrors({});
    setIsEditing(false);
    releaseEditor(editorId);
  };

  const saveProfile = async () => {
    if (isSaving) return;

    const draft = useStudentProfileDraftStore.getState().draft;
    if (!draft) return;

    const normalizedDraft = normalizeStudentPortfolio(draft);
    const errors = validateStudentPortfolio(normalizedDraft);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await updateStudent(normalizedDraft);
      if (!saved) return;

      resetDraft();
      setValidationErrors({});
      setIsEditing(false);
      releaseEditor(editorId);
    } catch {
      toast.error("Failed to update student");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!isUserProfile) return;

    const file = event.target.files?.[0];
    if (file) {
      if (student.profilePicture) await deleteFile(student.profilePicture);

      try {
        const publicUrl = await uploadFile(file);
        console.log("Profile picture uploaded successfully:", publicUrl);
        // Update student? with the new profile picture URL
        updateStudent({
          ...student,
          profilePicture: publicUrl,
        });
      } catch (error) {
        toast.error("Failed to upload profile picture:" + error);
        // Handle error (show toast, alert, etc.)
      }
    }
  };

  const handleAvatarClick = () => {
    if (!isUserProfile) return;
    fileInputRef.current?.click();
  };

  const handleResetImage = async (e: React.MouseEvent) => {
    if (!isUserProfile) return;
    e.stopPropagation();

    console.log("public url:", student?.profilePicture);
    if (student?.profilePicture) {
      try {
        // Extract filename from URL
        await deleteFile(student.profilePicture);
        // Update student?
        updateStudent({
          ...student,
          profilePicture: "",
        });
      } catch (error) {
        toast.error("Failed to delete profile picture:" + error);
        // Handle error (show toast, alert, etc.)
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-2 w-full">
      <div className="flex flex-col items-center gap-2 bg-gray-50 border-primary-hover shadow-sm py-4 px-5 rounded-lg lg:w-[30%] w-full">
        <div className="flex flex-row-reverse justify-around items-center">
          <div className="flex lg:flex-col flex-row-reverse items-center gap-4 justify-between lg:justify-center">
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
                  className="w-56 h-56 text-5xl bg-gray-400 relative overflow-hidden group"
                  avatarImage={student?.profilePicture ?? ""}
                  avatarFallback={
                    student?.firstName.charAt(0).toUpperCase() +
                    student?.lastName.charAt(0).toUpperCase()
                  }
                  overlay={
                    isUserProfile ? (
                      <Overlay children={<UserPen className="w-20 h-20" />} />
                    ) : undefined
                  }
                />
              </div>
              {isUserProfile && student?.profilePicture && (
                <div
                  onClick={handleResetImage}
                  className="absolute -bottom-2 right-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                {student?.firstName + " " + student?.lastName}
              </h1>
              <h3 className="font-mono">{student?.profileTitle}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 relative border-primary-hover py-7 px-10 shadow-sm rounded-lg lg:w-[70%] w-full">
        {isUserProfile && (
          <Pencil
            className="absolute top-4 right-4 text-primary h-7 w-7 hover:text-primary-hover cursor-pointer"
            onClick={openProfileEditor}
          />
        )}
        <div className="flex flex-col gap-5 justify-between h-full text-lg">
          <div className="flex flex-col gap-3">
            <div className="flex justify-start items-center gap-3">
              <University className="mb-2" />
              <p>{student?.school || "N/A"}</p>
            </div>
            <div className="flex justify-start items-center gap-3">
              <Mail />
              <p>{student?.email}</p>
            </div>
            <div className="flex justify-start items-center gap-3">
              <Phone />
              <p>{student?.tel ?? "N/A"}</p>
            </div>
            <div className="flex justify-start items-center gap-3">
              <MapPinHouse />
              <p>
                {[
                  student?.location?.address,
                  student?.location?.city,
                  student?.location?.country,
                ]
                  .map((value) => value?.trim())
                  .filter((value): value is string => Boolean(value))
                  .join(", ") || "N/A"}
              </p>
            </div>
          </div>
          <Separator className="h-[1px] bg-primary-hover mt-4" />
          <div className="flex w-full justify-between items-center">
            <AnimatedSocialButton
              href={student?.links?.github ?? ""}
              platform="github"
              disabled={!student?.links?.github && true}
            />
            <AnimatedSocialButton
              href={student?.links?.linkedin ?? ""}
              platform="linkedin"
              disabled={!student?.links?.linkedin && true}
            />
            <AnimatedSocialButton
              href={student?.links?.website ?? ""}
              platform="portfolio"
              disabled={!student?.links?.website && true}
            />
          </div>
        </div>
      </div>

      {isEditing && (
        <EditModal
          isOpenModal={isEditing}
          setIsOpenModal={(open) => {
            if (open) openProfileEditor();
            else cancelProfileEditor();
          }}
          className="bg-white max-w-xl min-h-[60vh] flex flex-col"
          title="Modify Your Infos"
          titleClassName="text-2xl font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
          onCancel={cancelProfileEditor}
          confirmButton="Edit"
          confirmButtonClassName="bg-primary w-20 text-white hover:bg-primary-hover"
          confirmButtonDisabled={isSaving}
          onConfirm={saveProfile}
          body={
            <PortfolioInfos
              errors={validationErrors}
              onFieldChange={(field) =>
                setValidationErrors((current) => {
                  const next = { ...current };
                  delete next[field];
                  return next;
                })
              }
            />
          }
        />
      )}
    </div>
  );
};

export default PortfolioCard;
