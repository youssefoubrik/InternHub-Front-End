"use client";
import InputField from "@/components/InputField";
import Myinternship from "@/components/InternshipItem/MyInternship";
import NotFound from "@/components/not-found";
import { CompanyMaps } from "@/components/Profile/company/CompanyMaps";
import CompanyProfile from "@/components/Profile/company/CompanyProfile";
import CompanyProfileStats from "@/components/Profile/company/CompanyProfileStats";
import EditModal from "@/components/Profile/EditModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";
import { useInternship } from "@/context/internshipContext";
import { useUser } from "@/context/userContext";
import axios from "@/lib/axios";
import { getValidToken } from "@/utils/auth";
import { ApplicationStatus } from "@/types/types";
import { AlertTriangle, Flag, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";
import { Role } from "@/types/types";
import { BlockCompanyDialog } from "@/components/Dialogs/BlockCompanyDialog";

const page = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const param = useParams();
  const companyId = param.id.toString();
  const [flagReason, setFlagReason] = useState("");
  const [flagDescription, setFlagDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const isCompanyOwner =
    currentUser?.role === "COMPANY" && currentUser.id === companyId;
  const { checkIsUserProfile, isUserProfile, company, setCompany, getCompany } =
    useUser();
  const {
    getCompanyInternships,
    countCompanyApplications,
    countCompanyApplicationsWithStatus,
  } = useInternship();
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] =
    useState<number>(0);

  const [acceptedApplicationsCount, setAcceptedApplicationsCount] =
    useState<number>(0);
  const [rejectedApplicationsCount, setRejectedApplicationsCount] =
    useState<number>(0);

  const isAdmin = currentUser?.role === Role.ADMIN;

  useEffect(() => () => useProfileEditLockStore.getState().reset(), []);

  useEffect(() => {
    if (!isCompanyOwner) return;
    const fetchApplicationsCount = async () => {
      const count = await countCompanyApplications(companyId);
      setApplicationsCount(count);
    };
    fetchApplicationsCount();
  }, [companyId, isCompanyOwner]);

  useEffect(() => {
    if (!isCompanyOwner) return;
    const fetchPendingApplicationsCount = async () => {
      const count = await countCompanyApplicationsWithStatus(
        companyId,
        ApplicationStatus.PENDING,
      );
      setPendingApplicationsCount(count);
    };
    fetchPendingApplicationsCount();
  }, [companyId, isCompanyOwner]);

  useEffect(() => {
    if (!isCompanyOwner) return;
    const fetchAcceptedApplicationsCount = async () => {
      const count = await countCompanyApplicationsWithStatus(
        companyId,
        ApplicationStatus.ACCEPTED,
      );
      setAcceptedApplicationsCount(count);
    };
    fetchAcceptedApplicationsCount();
  }, [companyId, isCompanyOwner]);

  useEffect(() => {
    if (!isCompanyOwner) return;
    const fetchRejectedApplicationsCount = async () => {
      const count = await countCompanyApplicationsWithStatus(
        companyId,
        ApplicationStatus.REJECTED,
      );
      setRejectedApplicationsCount(count);
    };
    fetchRejectedApplicationsCount();
  }, [companyId, isCompanyOwner]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const companyData = await getCompany(companyId);
        const res = await getCompanyInternships(companyId);
        if (companyData && res) {
          setCompany({
            ...companyData,
            internships: res,
          });
        }
        checkIsUserProfile(companyId);
      } catch (error) {
        console.error("Company Not Found");
      } finally {
        setIsLoading(false);
      }
    };
    if (companyId && !loading) {
      initializeData();
    }
  }, [companyId, loading, currentUser]);

  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    company?.internships?.length
      ? company.internships.length / itemsPerPage
      : 1,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInternships = company?.internships?.slice(startIndex, endIndex);

  const handleFlagCompany = () => {
    setIsFlagModalOpen(true);
  };

  const submitFlagRequest = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        toast.error("Authentication required");
        return false;
      }

      if (!flagReason.trim()) {
        toast.error("Please provide a reason for flagging");
        return false;
      }

      const flagData = {
        targetId: companyId,
        reason: flagReason.trim(),
        description: flagDescription.trim(),
        screenshots: [], // Add screenshot handling if needed later
      };

      await axios.post("/flagged-companies", flagData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Company has been flagged successfully");
      setFlagReason("");
      setFlagDescription("");
      return true;
    } catch (error) {
      console.error("Error flagging company:", error);
      toast.error("Failed to flag company");
      return false;
    }
  };

  const handleBlockCompany = async (message: string, subject: string, attachments: File[]) => {
    try {
      const token = getValidToken();
      if (!token) throw new Error("Authentication required");
      const formData = new FormData();
      formData.append("message", message);
      formData.append("subject", subject);
      attachments.forEach((file) => formData.append("attachments", file));
      await axios.post(`/companies/${companyId}/block`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (company) setCompany({ ...company, blocked: true, blockedAt: new Date() });
      toast.success("Company blocked successfully");
      setIsBlockDialogOpen(false);
    } catch (error) {
      console.error("Failed to block company:", error);
      toast.error("Failed to block company");
    }
  };

  const scrollToFlag = () => {
    document
      .getElementById("flag-button")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return company && Object.keys(company).length > 0 ? (
    <div className=" px-14 py-11 flex flex-col gap-8">
      {!isLoading && showAlert && !isAdmin && !isUserProfile && currentUser && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-700">
              If you consider this company as fake or suspicious, you can flag
              it by{" "}
              <button
                onClick={scrollToFlag}
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                clicking here
              </button>{" "}
              to report it at the bottom of the profile.
            </p>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full md:flex-row">
        <CompanyProfile />
        <CompanyMaps className="w-full md:w-[35%] h-[400px] md:h-auto" />
      </div>
      {isUserProfile && isCompanyOwner && (
        <div>
          <h1 className="header !font-medium mt-7 mb-10">Dashboard</h1>
          <CompanyProfileStats
            applicants={applicationsCount}
            pendingApplicants={pendingApplicationsCount}
            acceptedApplicants={acceptedApplicationsCount}
            rejectedApplicants={rejectedApplicationsCount}
          />
        </div>
      )}
      <div className="flex items-center gap-3 mt-7">
        <h1 className="header !font-medium">Company Internships</h1>
        {isUserProfile && isCompanyOwner && (
          <Link
            href="/post-internship"
            className="text-primary hover:text-primary-hover hover:underline text-base flex items-center gap-1"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
            Post new internship
          </Link>
        )}
      </div>
      <p className="text-gray-500">
        Internships count : {company.internships?.length || 0}
      </p>
      {currentInternships && currentInternships.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentInternships.map((internship) => (
              <Myinternship
                key={internship.id}
                internship={internship}
                canManage={isCompanyOwner}
              />
            ))}
          </ul>

          <div className="flex items-center justify-end gap-4 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="mx-24 mt-7 flex items-center flex-col">
          <h3 className="text-lg font-normal text-gray-700">
            No internships found
          </h3>
        </div>
      )}

      {!isLoading && isAdmin && company && (
        <div className="flex justify-center mt-8">
          <Button
            variant="destructive"
            className="w-full md:w-auto"
            disabled={company.blocked}
            onClick={() => setIsBlockDialogOpen(true)}
          >
            {company.blocked ? "Company blocked" : "Block company"}
          </Button>
        </div>
      )}
      {!isLoading && !isAdmin && !isUserProfile && (currentUser?.role === Role.STUDENT || currentUser?.role === Role.COMPANY) && (
        <div className="flex justify-center mt-8">
          <Button
            id="flag-button"
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleFlagCompany}
          >
            <Flag className="h-4 w-4" />
            Flag this company as suspicious
          </Button>
        </div>
      )}

      {isFlagModalOpen && (
        <EditModal
          isOpenModal={isFlagModalOpen}
          setIsOpenModal={setIsFlagModalOpen}
          className="bg-white flex flex-col text-black z-[1000]"
          title="Flag Company as Suspicious"
          titleClassName="text-xl font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
          onCancel={() => setIsFlagModalOpen(false)}
          confirmButton="Submit Flag"
          confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={async () => {
            const success = await submitFlagRequest();
            if (success) {
              setIsFlagModalOpen(false);
              toast.success(
                "Thank you for your report. Our team will review it shortly.",
              );
            }
          }}
          body={
            <div className="flex flex-col gap-6 pr-2">
              <div className="bg-gray-100 p-4 -mx-6 -mt-2 border-b border-gray-200">
                <div className="flex gap-3 items-start">
                  <div className="bg-orange-600 p-2 rounded-md">
                    <AlertTriangle className="text-white h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Please provide details</p>
                    <p className="text-sm text-gray-500">
                      Explain why you believe this company as suspicious or fake
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="flag-reason">Reason</Label>
                  <InputField
                    type="text"
                    placeholder="Select reason..."
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    className="w-full bg-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="flag-description">Description</Label>
                  <Textarea
                    value={flagDescription}
                    onChange={(e) => setFlagDescription(e.target.value)}
                    placeholder="Please provide specific details about why you are flagging this company..."
                    className="w-full bg-white"
                  />
                </div>

                <div className="bg-yellow-50 p-3 rounded-md text-sm">
                  <p className="font-medium text-yellow-800 mb-1">
                    Important Information
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    <li>
                      Repeatedly flagging legitimate users may result in your
                      account being restricted
                    </li>
                    <li>
                      Please provide specific details that can help us
                      investigate
                    </li>
                    <li>Our team will review your report within 48 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          }
        />
      )}
      {isAdmin && company && (
        <BlockCompanyDialog
          isOpen={isBlockDialogOpen}
          setIsOpen={setIsBlockDialogOpen}
          companyToBlock={{ id: companyId, name: company.name }}
          onConfirm={handleBlockCompany}
        />
      )}
    </div>
  ) : (
    <NotFound
      title="Company Not Found"
      text="The company you are looking for does not exist."
    />
  );
};

export default page;
