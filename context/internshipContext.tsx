"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useUser } from "./userContext";
import {
  Application,
  ApplicationRequest,
  ApplicationStatus,
  Internship,
  InternshipRequest,
  SalaryType,
  WorkMode,
} from "@/types/types";
import axios from "@/lib/axios";
import {
  RequestWithAuth as fetchWithAuth,
  getValidToken,
  RequestWithAuth,
} from "@/utils/auth";
import { useRouter } from "next/navigation";

interface InternshipContextType {
  loading: boolean;
  internship: Internship;
  setInternship: (internship: Internship) => void;
  internships: Internship[];
  applications: Application[];
  // setApplications: (applications: Application[]) => void;
  getCompanyApplications: (companyId: string) => void;
  getStudentApplications: (studentId: string) => void;
  countInternshipApplications: (internshipId: string) => Promise<number>;
  countCompanyApplications: (companyId: string) => Promise<number>;
  countCompanyApplicationsWithStatus: (
    companyId: string,
    status: ApplicationStatus,
  ) => Promise<number>;
  createInternship: () => Promise<boolean>;
  getAllInternships: () => void;
  isApplied: (
    internshipId: string,
    studentId: string,
  ) => Promise<boolean | null>;
  searchInternships: (filters: any) => void;
  updateInternship: (internshipId: string) => void;
  getInternshipById: (id: string) => Promise<Internship | null>;
  getCompanyInternships: (id: string) => Promise<Internship[]>;
  likeInternship: (internshipId: string) => void;
  applyToInternship: (application: ApplicationRequest) => Promise<boolean>;
  acceptApplication: (
    applicationId: string,
    message: string,
    subject: string,
    attachments: File[],
  ) => Promise<boolean>;
  rejectApplication: (
    applicationId: string,
    message: string,
    subject: string,
    attachments: File[],
  ) => Promise<boolean>;
  handleSearchChange: (searchName: string, value: string) => void;
  resetInternshipForm: () => void;
  closeInternship: (internshipId: string) => Promise<Internship | null>;
  openInternship: (internshipId: string) => Promise<Internship | null>;
  deleteInternship: (internshipId: string) => Promise<void>;
}

export interface Location {
  country: string;
  city: string;
  address: string;
}

const createEmptyInternship = (): Internship =>
  ({
    id: "",
    title: "",
    location: "",
    likes: [],
    applicants: [],
    city: "",
    closed: false,
    createdAt: new Date(),
    description: "",
    duration: 0,
    motivationLetterRequired: false,
    negotiable: false,
    paid: false,
    tags: [],
    skills: [],
    salary: 0,
    salaryType: SalaryType.MONTH,
    workMode: WorkMode.REMOTE,
  }) as Internship;

const InternshipContext = createContext<InternshipContextType | null>(null);

export const InternshipContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [internship, setInternship] = useState<Internship>(
    createEmptyInternship,
  );
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // get the user context
  const router = useRouter();

  const createInternship = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/internships`, {
        method: "POST",
        body: JSON.stringify(internship as InternshipRequest),
      });
      if (response) {
        toast.success("Internship created successfully");
        router.push("/internships");
        return true;
      } else {
        toast.error("Failed to create internship");
        return false;
      }
    } catch (error) {
      console.error("Error creating internship", error);
      toast.error("Ooops! Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllInternships = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`/internships`);
      setInternships(data);
    } catch (error) {
      console.log("Error getting internships", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyInternships = async (companyId: string) => {
    if (!companyId) return [];
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/internships/company/${companyId}`);
      return res || [];
    } catch (error) {
      console.error("Error getting user internships", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const isApplied = async (internshipId: string, studentId: string) => {
    if (!internshipId || !studentId) return null;
    try {
      const response = await fetchWithAuth(
        `/applications/internship/${internshipId}/student/${studentId}`,
      );
      return response;
    } catch (error) {
      console.error(
        "Error checking if student is applied to internship",
        error,
      );
      return null;
    }
  };

  const updateInternship = async (internshipId: string) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/internships/${internshipId}`, {
        method: "PUT",
        body: JSON.stringify(internship),
      });
      setInternship(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Error updating internship", error);
    } finally {
      setLoading(false);
    }
  };

  const searchInternships = async (
    filters: any,
    size?: number,
    page?: number,
  ) => {
    console.log(filters);
    setLoading(true);
    try {
      // Build query string
      const query = new URLSearchParams();

      // Add title and city filters
      if (filters.title) query.append("title", filters.title);
      if (filters.location) query.append("city", filters.location);

      // Add work mode filters
      const workModes: string[] = [];
      if (filters.remote) workModes.push("REMOTE");
      if (filters.onSite) workModes.push("ON_SITE");
      if (filters.hybrid) workModes.push("HYBRID");
      if (workModes.length > 0) query.append("workModes", workModes.join(","));

      // Add internship type filters
      const types: string[] = [];
      if (filters.pfa) types.push("PFA");
      if (filters.pfe) types.push("PFE");
      if (filters.initiation) types.push("INITIATION");
      if (types.length > 0) query.append("types", types.join(","));

      // Add paid filter
      if (filters.paid !== null) query.append("paid", filters.paid.toString());

      // Add pagination
      query.append("page", page?.toString() || "0");
      query.append("size", size ? size.toString() : "40");

      console.log(query.toString());

      // Send the request
      const res = await fetchWithAuth(`internships/search?${query.toString()}`);

      console.log(res.content);

      // Set internships to the response data
      setInternships(res.content);
      setLoading(false);
    } catch (error) {
      console.log("Error searching internships", error);
    } finally {
      setLoading(false);
    }
  };

  // get internship by id
  const getInternshipById = async (id: string): Promise<Internship | null> => {
    if (!id) return null;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/internships/${id}`);
      console.log("response : ", res);
      setLoading(false);
      return res;
    } catch (error) {
      console.log("Error getting internship", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // like an internship
  const likeInternship = async (internshipId: string) => {
    // console.log("internship liked", internshipId);
    // try {
    //   const res = await fetchWithAuth(`/internships/like/${internshipId}`);
    //   console.log("internship liked successfully", res);
    //   toast.success("internship liked successfully");
    //   getInternships();
    // } catch (error) {
    //   console.log("Error liking the internship", error);
    // }
  };

  // apply to a internship
  const applyToInternship = async (
    application: ApplicationRequest,
  ): Promise<boolean> => {
    try {
      const response = await fetchWithAuth(`/applications`, {
        method: "POST",
        body: JSON.stringify({
          ...application,
        }),
      });
      if (!response) {
        toast.error("Failed to apply to internship");
        return false;
      }
      toast.success("Applied to internship successfully");
      return true;
    } catch (error) {
      toast.error("Error applying to internship");
      return false;
    }
  };

  const acceptApplication = async (
    applicationId: string,
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    setLoading(true);
    const token = getValidToken();
    if (!token) {
      toast.error("Failed to accept application", { id: "accept-application" });
      setLoading(false);
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("subject", subject);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await axios.post(`/applications/${applicationId}/accept`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setApplications((current) => current.map((application) =>
        application.id === applicationId ? { ...application, status: ApplicationStatus.ACCEPTED } : application,
      ));

      toast.success("Application accepted successfully");
      return true;
    } catch (error) {
      console.error("Failed to accept application:", error);
      toast.error("Failed to accept application");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (
    applicationId: string,
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    setLoading(true);
    const token = getValidToken();
    if (!token) {
      toast.error("Failed to reject application", { id: "reject-application" });
      setLoading(false);
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("subject", subject);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await axios.post(`/applications/${applicationId}/reject`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setApplications((current) => current.map((application) =>
        application.id === applicationId ? { ...application, status: ApplicationStatus.REJECTED } : application,
      ));

      toast.success("Application rejected successfully");
      return true;
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error("Failed to reject application");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // reset Internship Form for post-internship page
  const resetInternshipForm = useCallback(() => {
    setInternship(createEmptyInternship());
  }, []);

  //
  const handleSearchChange = (searchName: string, value: string) => {
    //   setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  const getCompanyApplications = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/applications/company/${companyId}`,
      );
      setApplications(response);
    } catch (error) {
      console.error("Error getting applications", error);
      toast.error("Ooops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStudentApplications = async (studentId: string) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/applications/student/${studentId}`,
      );
      setApplications(response);
    } catch (error) {
      console.error("Error getting applications", error);
      toast.error("Ooops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const countInternshipApplications = async (internshipId: string) => {
    if (!internshipId) return 0;
    try {
      setLoading(true);
      if (!internshipId) return 0;
      const response = await fetchWithAuth(
        `/applications/count/internship/${internshipId}`,
      );
      return response;
    } catch (error) {
      console.error("Error getting applications", error);
      toast.error("Ooops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const countCompanyApplications = async (companyId: string) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/applications/company/${companyId}/count`,
      );
      return response;
    } catch (error) {
      console.error("Error getting applications", error);
      toast.error("Ooops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const countCompanyApplicationsWithStatus = async (
    companyId: string,
    status: ApplicationStatus,
  ) => {
    console.log(
      `url is : /applications/${companyId}/count/status?status=${status}`,
    );
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/applications/${companyId}/count/status?status=${status}`,
      );
      return response;
    } catch (error) {
      console.error(`Error getting ${status} applications`, error);
      toast.error("Ooops! Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const closeInternship = async (internshipId: string) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/internships/${internshipId}/close`, {
        method: "PUT",
      });

      if (res) {
        toast.success(`Internship closed successfully`);
        return res;
      } else {
        toast.error("Failed to close internship");
        return null;
      }
    } catch (error) {
      console.error("Error closing internship", error);
      toast.error("Failed to close internship");
    } finally {
      setLoading(false);
    }
  };

  const openInternship = async (internshipId: string) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/internships/${internshipId}/open`, {
        method: "PUT",
      });

      if (res) {
        toast.success(`Internship opened successfully`);
        return res;
      } else {
        toast.error("Failed to open internship");
        return null;
      }
    } catch (error) {
      console.error("Error opening internship", error);
      toast.error("Failed to open internship");
    } finally {
      setLoading(false);
    }
  };

  const deleteInternship = async (internshipId: string) => {
    setLoading(true);
    try {
      await fetchWithAuth(`/internships/${internshipId}`, {
        method: "DELETE",
      });
      toast.success(`Internship deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete internship");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInternships();
  }, []);

  // useEffect(() => {
  //   if (userProfile?.id) {
  //     getUserInternships(userProfile.id);
  //     getUserProfile(userProfile.id);
  //   }
  // }, [userProfile?.id]);

  return (
    <InternshipContext.Provider
      value={{
        loading,
        internship,
        setInternship,
        internships,
        applications,
        getCompanyApplications,
        getStudentApplications,
        countInternshipApplications,
        countCompanyApplications,
        countCompanyApplicationsWithStatus,
        createInternship,
        getAllInternships,
        isApplied,
        searchInternships,
        updateInternship,
        getInternshipById,
        getCompanyInternships,
        likeInternship,
        applyToInternship,
        acceptApplication,
        rejectApplication,
        handleSearchChange,
        resetInternshipForm,
        closeInternship,
        openInternship,
        deleteInternship,
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternship = (): InternshipContextType => {
  const context = useContext(InternshipContext);
  if (!context)
    throw new Error(
      "useInternship must be used within an InternshipContextProvider",
    );
  return context;
};
