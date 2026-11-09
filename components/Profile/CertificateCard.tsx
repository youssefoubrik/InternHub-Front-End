"use client";
import React, { useEffect, useRef, useState } from "react";
import PlusButton from "../PlusButton";
import CertificatContent from "./CertificatContent";
import { Certificat } from "@/types/types";
import EditModal from "./EditModal";
import CertificatInfos from "./CertificatInfos";
import toast from "react-hot-toast";
import { useUser } from "@/context/userContext";
import { uploadFile } from "@/lib/storageApi";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

const CertificateCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const { student, createCertificat, updateCertificat, isUserProfile } =
    useUser();
  const [certificats, setCertificats] = useState<Certificat[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isCreatingRef = useRef(false);
  const [newCertificat, setNewCertificat] = useState<Certificat>(
    {} as Certificat,
  );
  const editorId = "certificate-new";
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);

  const handleCancel = () => {
    setNewCertificat({
      id: "",
      title: "",
      thumbnail: "",
      date: "",
    });
    setFile(null);
    setIsOpenModal(false);
    releaseEditor(editorId);
  };

  const handleConfirm = async () => {
    if (!isUserProfile || isCreatingRef.current) return;
    if (!newCertificat.title) {
      toast.error("Please enter a certificat title");
      return;
    }

    if (!newCertificat.thumbnail || !file) {
      toast.error("Please upload your certificat image");
      return;
    }

    if (!newCertificat.date) {
      toast.error("Please enter a year when you obtain your certificat");
      return;
    }

    // A ref locks synchronously so multiple clicks before React rerenders
    // cannot start multiple uploads/creation requests.
    isCreatingRef.current = true;
    setIsCreating(true);
    try {
      const publicUrl = await uploadFile(file);
      const result = await createCertificat({
        ...newCertificat,
        thumbnail: publicUrl,
      });
      if (!result) {
        toast.error("Failed to create certificate");
        return;
      }
      toast.success("Certificate created successfully");
      setCertificats((prev) => [...prev, result]);
      setIsOpenModal(false);
      releaseEditor(editorId);
      setNewCertificat({ id: "", title: "", thumbnail: "", date: "" });
      setFile(null);
    } catch (error) {
      toast.error("Failed to create certificate : " + error);
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (student?.certificates) {
      setCertificats(student?.certificates);
    }
  }, [student?.certificates]);

  return (
    <div className="bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 w-full space-y-7">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-800 font-medium">Certificates</h2>
      </div>
      <div className="px-4 gap-6 grid grid-cols-4">
        {certificats.map((certificat) => (
          <CertificatContent
            key={certificat?.id}
            certificat={certificat}
            certificats={certificats}
            setCertificats={setCertificats}
          />
        ))}
        {certificats.length === 0 && !isUserProfile && (
          <div className="col-span-4 text-center">
            <p className="text-lg text-gray-600">No certificates found.</p>
          </div>
        )}
        {isUserProfile && (
          <div
            className="w-1/2 h-full"
            onClick={() => {
              if (acquireEditor(editorId)) setIsOpenModal(true);
            }}
          >
            <PlusButton className="w-full h-full" />
          </div>
        )}
      </div>

      {isUserProfile && (
        <EditModal
          isOpenModal={isOpenModal}
          setIsOpenModal={(open) => {
            if (!open) releaseEditor(editorId);
            setIsOpenModal(open);
          }}
          className="bg-white max-w-xl min-h-[60vh] flex flex-col"
          title="Add New Certificate"
          titleClassName="text-2xl font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
          onCancel={handleCancel}
          confirmButton="Add"
          confirmButtonDisabled={isCreating}
          confirmButtonClassName="bg-primary w-20 text-white hover:bg-primary-hover"
          onConfirm={handleConfirm}
          body={
            <CertificatInfos
              editedCertificat={newCertificat}
              updateEditedCertificat={setNewCertificat}
              isNewCertificat={true}
              setFile={setFile}
            />
          }
        />
      )}
    </div>
  );
};

export default CertificateCard;
