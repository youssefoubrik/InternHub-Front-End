"use client";
import React, { useEffect, useState } from "react";
import { formatDates } from "@/utils/fotmatDates";
import { Trash, Calendar, Flag, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Internship } from "@/types/types";
import formatMoney from "@/utils/formatMoney";
import { cleanAndTruncateHTML } from "@/utils/Formating";
import { Button } from "../ui/button";
import EditModal from "../Profile/EditModal";
import { useInternship } from "@/context/internshipContext";
import { useDeprecatedAnimatedState } from "framer-motion";
import { useUser } from "@/context/userContext";
import { useAuth } from "@/context/authContext";

interface InternshipProps {
  internship: Internship;
  canManage?: boolean;
}

function Myinternship({ internship, canManage = false }: InternshipProps) {
  const router = useRouter();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenCloseDialog, setIsOpenCloseDialog] = useState(false);
  const [isOpenOpenDialog, setIsOpenOpenDialog] = useState(false);
  const {
    countInternshipApplications,
    closeInternship: closeApp,
    openInternship: openApp,
    deleteInternship: deleteApp,
  } = useInternship();
  const [countApplicants, setCountApplications] = useState<number>(0);
  const { company, setCompany } = useUser();
  const { currentUser } = useAuth();
  const isOwner =
    canManage &&
    currentUser?.role === "COMPANY" &&
    currentUser.id === internship.company?.id;

  useEffect(() => {
    if (!isOwner) return;
    const fetchCount = async () => {
      const count = await countInternshipApplications(internship.id);
      setCountApplications(count);
    };
    fetchCount();
  }, [internship.id, countInternshipApplications, isOwner]);

  const deleteInternship = () => {
    setIsOpenDeleteDialog(false);
    deleteApp(internship?.id);
    setCompany({
      ...company,
      internships: company.internships?.filter(
        (internship) => internship.id !== internship.id,
      ),
    });
  };

  const closeInternship = async () => {
    const updatedInternship = await closeApp(internship.id);
    if (!updatedInternship) return;

    setCompany({
      ...company,
      internships: company.internships?.map((companyInternship) => {
        if (companyInternship.id === updatedInternship.id) {
          return {
            ...companyInternship,
            closed: true,
          };
        }
        return companyInternship;
      }),
    });
    setIsOpenCloseDialog(false);
  };

  const openInternship = async () => {
    const updatedInternship = await openApp(internship.id);
    if (!updatedInternship) return;

    setCompany({
      ...company,
      internships: company.internships?.map((companyInternship) => {
        if (companyInternship.id === updatedInternship.id) {
          return {
            ...companyInternship,
            closed: false,
          };
        }
        return companyInternship;
      }),
    });
    setIsOpenOpenDialog(false);
  };

  return (
    <div className="p-8 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => router.push(`/internships/${internship.id}`)}
        >
          <CardTitle className="text-xl font-bold truncate mb-2">
            {internship.title}
          </CardTitle>
        </div>

        {isOwner && (
          <div className="flex w-full flex-wrap justify-end gap-2 lg:w-auto lg:shrink-0">
            {!internship.closed ? (
              <div
                className="flex items-center whitespace-nowrap rounded-md font-medium hover:bg-accent px-3 cursor-pointer gap-1 text-sm text-blue-400"
                onClick={() => setIsOpenCloseDialog(true)}
              >
                Close Application
              </div>
            ) : (
              <div
                className="flex items-center whitespace-nowrap rounded-md font-medium px-3 gap-1 text-sm text-gray-400 hover:bg-accent cursor-pointer"
                onClick={() => setIsOpenOpenDialog(true)}
              >
                Closed
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-500"
              onClick={() => setIsOpenDeleteDialog(true)}
            >
              <Trash size={14} />
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground truncate">
        {cleanAndTruncateHTML(internship.description)}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-blue-50">
          {internship.workMode}
        </Badge>
        {internship.paid && (
          <Badge variant="outline" className="bg-green-50">
            {formatMoney(internship.salary || 0)} /{" "}
            {internship.salaryType.toLowerCase()}
            {internship.negotiable && " (Negotiable)"}
          </Badge>
        )}
      </div>

      <div className="space-x-2">
        {internship.tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="bg-orange-50">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground mt-2">
        <span className="flex items-center gap-1 mb-3">
          <Calendar size={14} />
          Posted {formatDates(internship.createdAt)}
        </span>

        {isOwner && (
          <button
            type="button"
            className="hover:text-primary cursor-pointer flex justify-end w-full"
            onClick={() => {
              const encodedTitle = encodeURIComponent(internship.title || "");
              router.push(
                `/company/${internship.company?.id}/applications/filter?internshipTitle=${encodedTitle}`,
              );
            }}
          >
            {countApplicants} applicant(s)
          </button>
        )}
      </div>

      {isOwner && isOpenDeleteDialog && (
        <EditModal
          isOpenModal={isOpenDeleteDialog}
          setIsOpenModal={setIsOpenDeleteDialog}
          className="bg-white p-0 max-w-md flex flex-col text-black"
          title="Confirm to delete this application"
          titleClassName="text-xl px-4 pt-4 font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
          onCancel={() => setIsOpenDeleteDialog(false)}
          confirmButton="Delete internship"
          confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={deleteInternship}
          footerClassName="flex justify-end p-4 border-t border-gray-300 w-full"
          body={
            <div className="flex flex-col gap-6">
              <div className="bg-gray-100 p-4 -mt-2 border border-gray-300">
                <div className="flex gap-3 items-start">
                  <div className="bg-orange-600 p-2 rounded-md">
                    <Trash className="text-white h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">This action cannot be undone</p>
                    <p className="text-sm text-gray-500">
                      The internship will be permanently deleted and cannot be
                      recovered
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium px-4">
                Are you sure you want to delete the internship "
                {internship.title}"?
              </p>
            </div>
          }
        />
      )}

      {isOwner && isOpenCloseDialog && (
        <EditModal
          isOpenModal={isOpenCloseDialog}
          setIsOpenModal={setIsOpenCloseDialog}
          className="bg-white p-0 max-w-md flex flex-col text-black"
          title="Confirm to close this application"
          titleClassName="text-xl px-4 pt-4 font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
          onCancel={() => setIsOpenCloseDialog(false)}
          confirmButton="Close internship"
          confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={closeInternship}
          footerClassName="flex justify-end p-4 border-t border-gray-300 w-full"
          body={
            <div className="flex flex-col gap-6">
              <div className="bg-gray-100 p-4 -mt-2 border border-gray-300">
                <div className="flex gap-3 items-start">
                  <div className="bg-orange-600 p-2 rounded-md">
                    <AlertTriangle className="text-white h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">
                      The internship will be closed and no further applications
                      will be accepted. You can reopen the internship at a later
                      time if needed.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium px-4">
                Are you sure you want to close the internship "
                {internship.title}"?
              </p>
            </div>
          }
        />
      )}

      {isOwner && isOpenOpenDialog && (
        <EditModal
          isOpenModal={isOpenOpenDialog}
          setIsOpenModal={setIsOpenOpenDialog}
          className="bg-white p-0 max-w-md flex flex-col text-black"
          title="Confirm to reopen this application"
          titleClassName="text-xl px-4 pt-4 font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
          onCancel={() => setIsOpenOpenDialog(false)}
          confirmButton="Reopen internship"
          confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={openInternship}
          footerClassName="flex justify-end p-4 border-t border-gray-300 w-full"
          body={
            <div className="flex flex-col gap-6">
              <div className="bg-gray-100 p-4 -mt-2 border border-gray-300">
                <div className="flex gap-3 items-start">
                  <div className="bg-orange-600 p-2 rounded-md">
                    <AlertTriangle className="text-white h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">
                      The internship will be reopened and applications will be
                      accepted. You can close the internship at a later time if
                      needed.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium px-4">
                Are you sure you want to reopen the internship "
                {internship.title}"?
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}

export default Myinternship;
