"use client";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditModal from "./EditModal";
import { Textarea } from "../ui/textarea";
import { useUser } from "@/context/userContext";
import { useAuth } from "@/context/authContext";
import { Role } from "@/types/types";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

const InfosCard = () => {
  const { student, updateStudent, isUserProfile } = useUser();
  const { currentUser } = useAuth();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const editorId = "student-infos";
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);
  const closeEditor = () => {
    setIsOpenModal(false);
    releaseEditor(editorId);
  };
  useEffect(() => {
    setDescription(student?.profileDescription || "");
  }, [student?.profileDescription]);
  return (
    <div className="bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-800 font-medium">Infos</h2>
        {isUserProfile && (
          <div>
            <Pencil
              className="text-primary h-7 w-7 hover:text-primary-hover cursor-pointer"
              onClick={() => {
                if (acquireEditor(editorId)) setIsOpenModal(true);
              }}
            />
          </div>
        )}
      </div>
      <p
        className={`text-gray-600 px-3 mt-5 mb-3 whitespace-break-spaces ${
          student?.profileDescription ? "" : "text-center"
        }`}
      >
        {student?.profileDescription || "---"}
      </p>
      {isOpenModal && (
        <EditModal
          isOpenModal={isOpenModal}
          setIsOpenModal={(open) => open ? setIsOpenModal(true) : closeEditor()}
          className="bg-white max-w-xl min-h-[60vh] flex flex-col justify-between"
          title="Edit Infos"
          titleClassName="text-2xl"
          body={
            <Textarea
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Your Infos Here..."
              className="caret-primary bg-background text-base flex-grow h-full"
            />
          }
          cancelButton="Cancel"
          onCancel={() => {
            setDescription(student?.profileDescription || "");
            closeEditor();
          }}
          cancelButtonClassName="border-primary border-[1px] text-primary bg-transparent"
          confirmButton="Save"
          onConfirm={() => {
            updateStudent({
              ...student,
              profileDescription: description,
            });
            closeEditor();
          }}
        />
      )}
    </div>
  );
};

export default InfosCard;
