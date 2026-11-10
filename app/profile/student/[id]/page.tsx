"use client";
import InputField from "@/components/InputField";
import NotFound from "@/components/not-found";
import CertificateCard from "@/components/Profile/CertificateCard";
import EditModal from "@/components/Profile/EditModal";
import ExperienceCard from "@/components/Profile/ExperienceCard";
import FormationCard from "@/components/Profile/FormationCard";
import InfosCard from "@/components/Profile/InfosCard";
import PortfolioCard from "@/components/Profile/PortfolioCard";
import ProjectCard from "@/components/Profile/ProjectCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/context/userContext";
import { Role } from "@/types/types";
import { AlertTriangle, Flag, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { getValidToken } from "@/utils/auth";
import toast from "react-hot-toast";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";
import { BlockStudentDialog } from "@/components/Dialogs/BlockStudentDialog";

const page = () => {
  const params = useParams();
  const studentId = params.id.toString();
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const { currentUser, loading, setLoading } = useAuth();
  const [flagReason, setFlagReason] = useState("");
  const [flagDescription, setFlagDescription] = useState("");
  const [flagReasonError, setFlagReasonError] = useState("");
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [profileResolved, setProfileResolved] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const isAdmin = currentUser?.role === Role.ADMIN;
  const { checkIsUserProfile, getStudent, setStudent, student, isUserProfile } =
    useUser();

  useEffect(() => () => useProfileEditLockStore.getState().reset(), []);

  useEffect(() => {
    let active = true;
    const fetchStudent = async () => {
      setProfileResolved(false);
      setLoading(true);
      const response = await getStudent(studentId);
      if (!active) return;
      if (response) setStudent(response);
      checkIsUserProfile(studentId);
      setProfileResolved(true);
      setLoading(false);
    };
    fetchStudent();
    return () => {
      active = false;
    };
  }, [studentId, currentUser]);

  const handleFlagUser = () => {
    setFlagReasonError("");
    setIsFlagModalOpen(true);
  };

  const handleSubmitFlag = async () => {
    const reason = flagReason.trim();
    if (!reason) {
      setFlagReasonError("Please provide a reason for flagging this student.");
      toast.error("Please provide a reason for flagging this student.");
      return;
    }

    const token = getValidToken();
    if (!token) {
      toast.error("Authentication required to submit a flag.");
      return;
    }

    setIsSubmittingFlag(true);
    try {
      await axios.post(
        "/flagged-students",
        {
          targetId: studentId,
          reason,
          description: flagDescription.trim(),
          screenshots: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setIsFlagModalOpen(false);
      setFlagReason("");
      setFlagDescription("");
      setFlagReasonError("");
      toast.success(
        "Student has been flagged successfully. Our team will review your report.",
      );
    } catch (error) {
      console.error("Error flagging student:", error);
      toast.error("Failed to submit the student flag. Please try again.");
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const handleBlockStudent = async (message: string, subject: string, attachments: File[]) => {
    try {
      const token = getValidToken();
      if (!token) throw new Error("Authentication required");
      const formData = new FormData();
      formData.append("message", message);
      formData.append("subject", subject);
      attachments.forEach((file) => formData.append("attachments", file));
      await axios.post(`/students/${studentId}/block`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (student) setStudent({ ...student, blocked: true, blockedAt: new Date() });
      toast.success("Student blocked successfully");
      setIsBlockDialogOpen(false);
    } catch (error) {
      console.error("Failed to block student:", error);
      toast.error("Failed to block student");
    }
  };

  const scrollToFlag = () => {
    document
      .getElementById("flag-button")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return student && Object.keys(student).length > 0 ? (
    <div className="py-11 flex flex-col gap-5 px-14">
      {!loading && profileResolved && showAlert && !isAdmin && !isUserProfile && currentUser && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-yellow-700">
              If you consider this user as fake or suspicious, you can flag it
              by{" "}
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
      <PortfolioCard />
      <InfosCard />
      <ExperienceCard />
      <FormationCard />
      <ProjectCard />
      <CertificateCard />

      {!loading && profileResolved && isAdmin && student && (
        <div className="flex justify-center mt-8">
          <Button
            variant="destructive"
            className="w-full md:w-auto"
            disabled={student.blocked}
            onClick={() => setIsBlockDialogOpen(true)}
          >
            {student.blocked ? "Student blocked" : "Block student"}
          </Button>
        </div>
      )}
      {!loading && profileResolved && !isAdmin && !isUserProfile && (currentUser?.role === Role.COMPANY) && (
        <div className="flex justify-center mt-8">
          <Button
            id="flag-button"
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleFlagUser}
          >
            <Flag className="h-4 w-4" />
            Flag this user as suspicious
          </Button>
        </div>
      )}

      <EditModal
        isOpenModal={isFlagModalOpen}
        setIsOpenModal={setIsFlagModalOpen}
        className="bg-white flex flex-col text-black"
        title="Flag Student as Suspicious"
        titleClassName="text-xl font-medium"
        cancelButton="Cancel"
        cancelButtonClassName="bg-gray-200 text-black border-gray-300 hover:bg-gray-300"
        onCancel={() => {
          setIsFlagModalOpen(false);
          setFlagReasonError("");
        }}
        confirmButton="Submit Flag"
        confirmButtonClassName="bg-red-600 hover:bg-red-700 text-white"
        confirmButtonDisabled={isSubmittingFlag}
        onConfirm={handleSubmitFlag}
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
                    Explain why you believe this user as suspicious or fake
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="flag-reason">Reason</Label>
                <InputField
                  id="flag-reason"
                  type="text"
                  value={flagReason}
                  onChange={(e) => {
                    setFlagReason(e.target.value);
                    if (e.target.value.trim()) setFlagReasonError("");
                  }}
                  placeholder="Select reason..."
                  className="w-full bg-white"
                  required
                />
                {flagReasonError && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {flagReasonError}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="flag-description">Description</Label>
                <Textarea
                  id="flag-description"
                  value={flagDescription}
                  onChange={(e) => setFlagDescription(e.target.value)}
                  placeholder="Please provide specific details about why you are flagging this student..."
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
                    Please provide specific details that can help us investigate
                  </li>
                  <li>Our team will review your report within 48 hours</li>
                </ul>
              </div>
            </div>
          </div>
        }
      />
      {isAdmin && student && (
        <BlockStudentDialog
          isOpen={isBlockDialogOpen}
          setIsOpen={setIsBlockDialogOpen}
          studentToBlock={{ id: studentId, firstName: student.firstName, lastName: student.lastName }}
          onConfirm={handleBlockStudent}
        />
      )}
    </div>
  ) : (
    <NotFound
      title="User Not Found"
      text="The User you are looking for does not exist."
    />
  );
};

export default page;
