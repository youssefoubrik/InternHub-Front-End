"use client";
import React, { useEffect, useState } from "react";
import { formatDates } from "@/utils/fotmatDates";
import {
  Pencil,
  Trash,
  Building2,
  MapPin,
  Calendar,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Internship, Role, SalaryType } from "@/types/types";
import formatMoney from "@/utils/formatMoney";
import { cleanAndTruncateHTML } from "@/utils/Formating";
import { Button } from "../ui/button";
import EditModal from "../Profile/EditModal";
import { useUser } from "@/context/userContext";
import { useInternship } from "@/context/internshipContext";
import { useAuth } from "@/context/authContext";

interface InternshipProps {
  internship: Internship;
}

function InternshipItem({ internship }: InternshipProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { countInternshipApplications } = useInternship();
  const [countApplicants, setCountApplications] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await countInternshipApplications(internship.id);
      setCountApplications(count);
    };
    fetchCount();
  }, [internship.id, countInternshipApplications]);

  const handleConfirm = () => {
    // Handle confirmation logic here
    setIsOpen(false);
  };

  // const { isAuthenticated } = useAuth();

  return (
    <div className="p-8 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-14 h-14 bg-gray-200 rounded-md shrink-0 flex items-center justify-center mr-2">
          <Image
            src={internship.company?.profilePicture || "/user.png"}
            alt={internship.company?.name || "User"}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
        <div
          className="flex flex-col cursor-pointer shrink-1 truncate"
          onClick={() => {
            router.push(`/internships/${internship.id}`);
          }}
        >
          <CardTitle className="text-xl font-bold truncate flex-wrap hover:underline">
            {internship?.title}
          </CardTitle>
          {internship?.company?.name ?? "Not set"}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {cleanAndTruncateHTML(internship?.description || "")}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-blue-50">
          {internship.workMode}
        </Badge>
        {internship.paid && (
          <Badge variant="outline" className="bg-green-50">
            {formatMoney(internship.salary || 0)} /{" "}
            {internship?.salaryType.toLowerCase()}
            {internship?.negotiable && " (Negotiable)"}
          </Badge>
        )}
      </div>

      <div className="space-x-2">
        {internship?.tags?.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-orange-50">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col justify-between text-sm text-muted-foreground mt-2">
        <span className="flex items-center gap-1 mb-3">
          <Calendar size={15} />
          Posted {formatDates(internship.createdAt)}
        </span>

        <span className="flex justify-end w-full">
          {countApplicants} applicant(s)
        </span>
      </div>

      {isOpen && (
        <EditModal
          isOpenModal={isOpen}
          setIsOpenModal={setIsOpen}
          className="bg-white max-w-xl flex flex-col"
          title="End Internship"
          titleClassName="text-2xl font-medium"
          description="Are you sure you want to end this internship? This action cannot be undone."
          descriptionClassName="text-sm text-muted-foreground mb-4"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
          onCancel={() => setIsOpen(false)}
          confirmButton="End"
          confirmButtonClassName="bg-primary w-20 text-white hover:bg-primary-hover"
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default InternshipItem;
