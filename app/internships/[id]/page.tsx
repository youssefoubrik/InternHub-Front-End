"use client";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/fotmatDates";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";
import { useAuth } from "@/context/authContext";
import InternshipCard from "@/components/InternshipItem/InternshipCard";
import { useInternship } from "@/context/internshipContext";
import { useUser } from "@/context/userContext";
import {
  Application,
  ApplicationRequest,
  ApplicationStatus,
  Internship,
  Role,
  SalaryType,
} from "@/types/types";
import EditModal from "@/components/Profile/EditModal";
import ApplicationProcess from "@/components/internships/ApplicationProcess";
import InternshipItem from "@/components/InternshipItem/InternshipItem";
import { uploadFile } from "@/lib/storageApi";
import { Info } from "lucide-react";

export default function page() {
  const {
    internship,
    setInternship,
    internships,
    getInternshipById,
    countInternshipApplications,
    applyToInternship,
    isApplied: isAppliedInternship,
  } = useInternship();
  const { student, getStudent, setStudent } = useUser();
  const { currentUser } = useAuth();
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [isApplied, setIsApplied] = useState(false);
  const [applicationCheckComplete, setApplicationCheckComplete] =
    useState(false);
  const [applicationCheckFailed, setApplicationCheckFailed] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [cv, setCV] = useState<File | null>(null);
  const [motivationLetter, setMotivationLetter] = useState<File | null>(null);
  const [countApplicants, setCountApplications] = useState<number>(0);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchCurrentInternship = async () => {
      if (!id) return;
      const response = await getInternshipById(id as string);
      if (response) {
        setInternship(response);
      } else {
        router.push("/internships");
      }
    };
    fetchCurrentInternship();
  }, [id]);

  useEffect(() => {
    const fetchCount = async () => {
      if (!id) return;
      const count = await countInternshipApplications(id as string);
      setCountApplications(count);
    };
    fetchCount();
  }, [id]);

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await getStudent(currentUser?.id as string);
      if (response) setStudent(response);
    };
    fetchStudent();
  }, [currentUser]);

  useEffect(() => {
    let isCurrent = true;
    setIsApplied(false);
    setApplicationCheckComplete(false);
    setApplicationCheckFailed(false);
    const fetchIsApplied = async () => {
      if (!id || !student?.id || currentUser?.role !== Role.STUDENT) {
        if (isCurrent && currentUser?.role !== Role.STUDENT)
          setApplicationCheckComplete(true);
        return;
      }
      const applied = await isAppliedInternship(id as string, student.id);
      if (!isCurrent) return;
      if (applied === null) {
        setApplicationCheckFailed(true);
        toast.error(
          "Could not check your application status. Please refresh and try again.",
        );
      } else {
        setIsApplied(applied);
      }
      setApplicationCheckComplete(true);
    };
    fetchIsApplied();
    return () => {
      isCurrent = false;
    };
  }, [id, student?.id, currentUser?.role]);

  const otherJobs = internships.filter(
    (internship: Internship) => internship.id !== id,
  );

  const uploadCV = async (file: File) => {
    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }

      const publicUrl = await uploadFile(file);

      return publicUrl;
    } catch (error: any) {
      if (error.message === "No internet connection") {
        toast.error(
          "No internet connection. Please check your connection and try again.",
        );
      } else if (error.message?.includes("Network Error")) {
        toast.error(
          "Network error occurred. Please check your connection and try again.",
        );
      } else if (error.message?.includes("timeout")) {
        toast.error(
          "Request timed out. Please check your connection and try again.",
        );
      } else {
        toast.error("Failed to upload CV: " + error.message);
      }
      return null;
    }
  };

  const uploadMotivationLetter = async (file: File) => {
    try {
      const publicUrl = await uploadFile(file);
      return publicUrl;
    } catch (error) {
      toast.error("Failed to upload motivation letter:" + error);
      return null;
    }
  };

  const handleConfirm = async () => {
    if (isApplying) return;
    if (!applicationCheckComplete || applicationCheckFailed || isApplied)
      return;
    const appliedAlready = await isAppliedInternship(id as string, student.id);
    if (appliedAlready === null) {
      toast.error(
        "Could not verify your application status. Please try again.",
      );
      return;
    }
    if (appliedAlready) {
      setIsApplied(true);
      setShowApplication(false);
      toast.error("You have already applied to this internship");
      return;
    }
    if (!cv) {
      toast.error("Please upload a CV");
      return;
    }
    if (!motivationLetter && internship?.motivationLetterRequired) {
      toast.error("Please upload a motivation letter");
      return;
    }
    setIsApplying(true);
    try {
      const cvUrl = await uploadCV(cv);
      if (!cvUrl) return;

      const motivationLetterUrl = motivationLetter
        ? await uploadMotivationLetter(motivationLetter)
        : null;
      if (motivationLetter && !motivationLetterUrl) return;

      const applied = await applyToInternship({
        internshipId: internship?.id as string,
        status: ApplicationStatus.PENDING,
        motivationLetter: motivationLetterUrl || "",
        cv: cvUrl,
      });
      if (applied) {
        setIsApplied(true);
        setShowApplication(false);
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <main>
      <div className="py-8 mb-8 px-14 w-full rounded-md flex md:flex-row flex-col gap-4">
        <div className="flex flex-col md:w-[70%] w-full bg-white p-6 rounded-md">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative overflow-hidden rounded-md flex items-center justify-center bg-gray-200">
                  <Image
                    src={internship?.company?.profilePicture || "/user.png"}
                    alt={internship?.company?.name || "User"}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                </div>

                <div>
                  {internship?.company?.id ? (
                    <button
                      type="button"
                      className="font-bold text-xl cursor-pointer hover:underline text-left"
                      onClick={() =>
                        router.push(
                          `/profile/company/${internship?.company?.id}`,
                        )
                      }
                      aria-label={`View ${internship.company.name || "company"} profile`}
                    >
                      {internship?.company?.name || "Not set"}
                    </button>
                  ) : (
                    <p className="font-bold text-xl">
                      {internship?.company?.name || "Not set"}
                    </p>
                  )}
                  <p className="text-lg">Recruiter</p>
                </div>
              </div>
              {/* <button
                className={`text-2xl  ${
                  isLiked ? "text-primary" : "text-gray-400"
                }`}
                onClick={() => {
                  handleLike(internship.id);
                }}
              >
                {isLiked ? bookmark : bookmarkEmpty}
              </button> */}
            </div>
            {/* <Separator/> */}

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">{internship?.title}</h1>
              <p className="text-gray-500">{internship?.city}</p>
            </div>

            <div className="mt-2 flex gap-4 justify-between items-stretch">
              <p className="flex-1 p-4 text-center flex flex-col items-center justify-center gap-1 bg-green-500/20 rounded-xl">
                <span className="text-lg">Salary</span>

                <span>
                  {!internship.paid ? (
                    <span className="font-bold text-nowrap">Unpaid</span>
                  ) : (
                    <>
                      <span className="font-bold text-nowrap">
                        {formatMoney(internship?.salary ?? 0)} MAD
                      </span>
                      <span className="font-medium text-gray-500 text-base">
                        /
                        {internship?.salaryType
                          ? `${
                              internship?.salaryType === SalaryType.YEAR
                                ? "per year"
                                : internship?.salaryType === SalaryType.MONTH
                                  ? "per month"
                                  : "per hour"
                            }`
                          : ""}
                      </span>
                    </>
                  )}
                </span>
              </p>

              <p className="flex-1 p-4 text-center flex flex-col items-center justify-center gap-1 bg-purple-500/20 rounded-xl">
                <span className="text-lg">Posted</span>
                <span className="font-bold">
                  {formatDates(internship?.createdAt)}
                </span>{" "}
                {/* to check */}
              </p>

              <p className="flex-1 p-4 flex flex-col items-center justify-center gap-1 bg-blue-500/20 rounded-xl">
                <span className="text-lg">Applicants</span>
                <span className="font-bold ">{countApplicants}</span>
              </p>

              <p className="flex-1 p-4 flex flex-col items-center justify-center gap-1 bg-yellow-500/20 rounded-xl">
                <span className="text-lg">Work Mode</span>
                <span className="font-bold">{internship?.workMode}</span>
              </p>
            </div>
            {/* <Separator/> */}
          </div>

          <div
            className="wysiwyg mt-8 whitespace-wrap"
            dangerouslySetInnerHTML={{
              __html: internship?.description || "",
            }}
          />
        </div>

        <div className="md:w-[30%] w-full flex flex-col gap-4">
          {currentUser?.role === Role.STUDENT && (
            <button
              disabled={
                !applicationCheckComplete ||
                applicationCheckFailed ||
                isApplied ||
                isApplying
              }
              className={`text-white rounded-xl py-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                isApplied
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-primary hover:bg-primary-hover"
              }`}
              onClick={() => {
                // if (isAuthenticated) {
                if (applicationCheckComplete && !isApplied) {
                  // applyToInternship(internship.id);
                  setShowApplication(true);
                  // setIsApplied(true);
                } else {
                  toast.error("You have already applied to this internship");
                }
                // } else {
                //   router.push("http://localhost:3000/api/login"); {/* to check */ }
                // }
              }}
            >
              {isApplied
                ? "Applied"
                : applicationCheckFailed
                  ? "Try again later"
                  : applicationCheckComplete
                    ? "Apply Now"
                    : "Checking application…"}
            </button>
          )}
          <div className="flex flex-col gap-2 rounded-xl border-b-2 border-primary">
            <InternshipItem internship={internship} />

            {otherJobs.slice(0, 3).map((internship) => (
              <InternshipCard internship={internship} key={internship?.id} />
            ))}
          </div>

          <div className="p-6 flex flex-col gap-2 bg-white shadow-md border-b-2 border-primary rounded-xl">
            <h3 className="text-lg font-semibold">Tags</h3>
            <p>Other relevant tags for the internship position.</p>

            <div className="flex flex-wrap gap-4">
              {internship?.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-red-500/20 text-red-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 flex flex-col gap-2 bg-white shadow-md border-b-2 border-primary rounded-xl">
            <h3 className="text-lg font-semibold">Skills</h3>
            <p>Required skills for this internship position.</p>

            <div className="flex flex-wrap gap-4">
              {internship?.skills?.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-indigo-500/20 text-[#7263f3]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showApplication && (
        <EditModal
          isOpenModal={showApplication}
          setIsOpenModal={setShowApplication}
          className="bg-white max-w-2xl flex flex-col"
          description={
            <div className="text-gray-600">
              <div className="text-lg font-bold mb-2">
                Application Requirements
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">CV:</span> Required - Please
                  upload your most recent CV in PDF format
                </li>
                <li>
                  <span className="font-semibold">Motivation Letter:</span>{" "}
                  {internship?.motivationLetterRequired
                    ? "Required"
                    : "Optional"}{" "}
                  - You can submit a motivation letter to strengthen your
                  application
                </li>
                <li>
                  Once submitted, applications cannot be updated but can be
                  deleted if needed
                </li>
              </ul>
            </div>
          }
          descriptionClassName="bg-yellow-100 p-4 rounded-xl text-base"
          title="Apply to this internship"
          titleClassName="text-2xl font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
          onCancel={() => setShowApplication(false)}
          confirmButton="Make your application"
          confirmButtonDisabled={isApplying}
          confirmButtonClassName="bg-primary text-white hover:bg-primary-hover"
          onConfirm={handleConfirm}
          body={
            <ApplicationProcess
              setCV={setCV}
              setMotivationLetter={setMotivationLetter}
              internship={internship}
            />
          }
        />
      )}
    </main>
  );
}
