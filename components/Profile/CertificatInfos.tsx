"use client";
import React, { useRef, useState } from "react";
import { FolderOpenDot, FileText, Info, Upload } from "lucide-react";
import InputField from "../InputField";
import { Certificat } from "@/types/types";
import CustomTooltip from "./CustomTooltip";
import YearPicker from "./YearPicker";
import toast from "react-hot-toast";

interface CertificatInfosProps {
  editedCertificat: Certificat;
  updateEditedCertificat: (certificat: Certificat) => void;
  isNewCertificat?: boolean;
  setFile: (file: File | null) => void;
}

const CertificatInfos: React.FC<CertificatInfosProps> = ({
  editedCertificat,
  updateEditedCertificat,
  setFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
          updateEditedCertificat({
            ...editedCertificat,
            thumbnail: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed h-72 flex flex-col items-center justify-center border-gray-300 rounded-lg bg-background p-2 hover:border-primary cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith("image/")) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                setPreviewImage(e.target.result as string);
                updateEditedCertificat({
                  ...editedCertificat,
                  thumbnail: file.name,
                });
              }
            };
            reader.readAsDataURL(file);
          } else {
            toast.error("Please upload an image file");
          }
        }}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewImage || editedCertificat.thumbnail ? (
          <img
            src={previewImage || editedCertificat.thumbnail}
            alt="Certificate thumbnail"
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag and drop your certificate image here, or click to select
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="group flex items-center gap-2 w-full">
          <FolderOpenDot className="text-black group-focus-within:text-primary transition-colors" />
          <InputField
            type="text"
            placeholder="Give a name to your certificate"
            value={editedCertificat.title}
            className="w-full focus:outline-none focus:ring-1 focus:ring-primary rounded-md focus:text-black text-gray-500 placeholder:text-gray-500"
            onChange={(e) =>
              updateEditedCertificat({
                ...editedCertificat,
                title: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="group flex items-center gap-2 w-full">
          <FileText className="text-black group-focus-within:text-primary transition-colors" />
          <YearPicker
            value={editedCertificat.date}
            onValueChange={(value) =>
              updateEditedCertificat({ ...editedCertificat, date: value })
            }
          />

          <CustomTooltip
            trigger={<Info className="w-4 h-4 text-gray-400 cursor-help" />}
            content={
              <div className="space-y-2">
                <p className="font-medium">Certificate Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Upload a valid image of your certificate</li>
                  <li>Supported formats: JPG, PNG, GIF</li>
                </ul>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CertificatInfos;
