"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import {
  Certificat,
  CertificatRequest,
  Company,
  CompanyRequest,
  Experience,
  ExperienceRequest,
  Formation,
  FormationRequest,
  Project,
  ProjectRequest,
  Role,
  Student,
  StudentRequest,
} from "@/types/types";
import { RequestWithAuth } from "@/utils/auth";
import toast from "react-hot-toast";

interface UserContextType {
  company: Company;
  companies: Company[];
  student: Student;
  isUserProfile: boolean;
  checkIsUserProfile: (userProfileId: string | undefined) => void;
  setCompany: (company: Company) => void;
  setStudent: (student: Student) => void;
  getCompany: (id: string) => Promise<Company>;
  getStudent: (id: string) => Promise<Student>;
  getCompanies: () => Promise<void>;
  updateStudent: (student: Student) => Promise<boolean>;
  updateCompany: (company: Company) => Promise<boolean>;
  createExperience: (experience: Experience) => Promise<Experience>;
  updateExperience: (experience: Experience) => Promise<Experience>;
  deleteExperience: (experience: Experience) => Promise<void>;
  createFormation: (formation: Formation) => Promise<Formation>;
  updateFormation: (formation: Formation) => Promise<Formation>;
  deleteFormation: (formation: Formation) => Promise<void>;
  createProject: (project: Project) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  deleteProject: (project: Project) => Promise<void>;
  createCertificat: (certificat: Certificat) => Promise<Certificat>;
  updateCertificat: (certificat: Certificat) => Promise<Certificat>;
  deleteCertificat: (certificat: Certificat) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [isUserProfile, setIsUserProfile] = useState<boolean>(false);
  const [company, setCompany] = useState<Company>({ name: "" } as Company);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [student, setStudent] = useState<Student>({
    firstName: "",
    lastName: "",
  } as Student);

  const getCompany = async (id: string) => {
    if (!id) return null;
    const data = await RequestWithAuth(`companies/${id}`);
    if (!data) {
      console.error("Failed to fetch company");
      return null;
    }
    return data;
  };
  const getCompanies = async () => {
    try {
      const data = await RequestWithAuth("/companies");
      console.log("companies : ", data);
      setCompanies(data as Company[]);
    } catch (error) {
      console.error("Failed to fetch companies", error);
    }
  };
  const getStudent = async (id: string) => {
    if (!id) return null;
    try {
      const data = await RequestWithAuth(`students/${id}`);
      return data;
    } catch (error) {
      console.error("Failed to fetch student", error);
      return null;
    }
  };
  const updateStudent = async (student: Student): Promise<boolean> => {
    try {
      const studentRequest: StudentRequest = student as StudentRequest;
      const data = await RequestWithAuth(`students/${student.id}`, {
        method: "PUT",
        body: JSON.stringify(studentRequest),
      });
      if (!data) {
        toast.error("Failed to update student");
        return false;
      }

      setStudent(data as Student);
      toast.success("Student updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update student");
      return false;
    }
  };

  const updateCompany = async (company: Company): Promise<boolean> => {
    try {
      const companyRequest: CompanyRequest = company as CompanyRequest;
      console.log("company before update : ", companyRequest);
      const data = await RequestWithAuth(`companies/${company.id}`, {
        method: "PUT",
        body: JSON.stringify(companyRequest),
      });
      if (!data) {
        toast.error("Failed to update company");
        return false;
      }
      setCompany(data as Company);
      toast.success("Company updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update company", error);
      toast.error("Failed to update company");
      return false;
    }
  };

  const createExperience = async (experience: Experience) => {
    try {
      const data = await RequestWithAuth(`/experiences`, {
        method: "POST",
        body: JSON.stringify({
          ...experience,
          company: experience.company,
          studentId: student.id,
        } as ExperienceRequest),
      });
      if (!data) toast.error("Failed to create experience");
      else toast.success("Experience created successfully");
      return data;
    } catch (error) {
      console.error("Failed to create experience", error);
      return null;
    }
  };
  const updateExperience = async (experience: Experience) => {
    try {
      const res = await RequestWithAuth(`/experiences/${experience.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...experience,
          company: experience.company,
          studentId: student.id,
        } as ExperienceRequest),
      });
      if (!res) toast.error("Failed to update experience");
      else toast.success("Experience updated successfully");
      return res;
    } catch (error) {
      console.error("Failed to update experience", error);
    }
  };
  const deleteExperience = async (experience: Experience) => {
    try {
      await RequestWithAuth(`/experiences/${experience.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete experience", error);
    }
  };
  const createFormation = async (formation: Formation) => {
    try {
      const data = await RequestWithAuth(`/formations`, {
        method: "POST",
        body: JSON.stringify({
          ...formation,
          companyId: formation.company,
          studentId: student.id,
        } as FormationRequest),
      });
      if (!data) toast.error("Failed to create formation");
      else toast.success("Formation created successfully");
      return data;
    } catch (error) {
      console.error("Failed to create formation", error);
    }
  };
  const updateFormation = async (formation: Formation) => {
    try {
      const res = await RequestWithAuth(`/formations/${formation.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formation,
          companyId: formation.company,
          studentId: student.id,
        } as FormationRequest),
      });
      if (!res) toast.error("Failed to update formation");
      else toast.success("Formation updated successfully");
      return res;
    } catch (error) {
      console.error("Failed to update formation", error);
    }
  };
  const deleteFormation = async (formation: Formation) => {
    try {
      await RequestWithAuth(`/formations/${formation.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };
  const createProject = async (project: Project) => {
    try {
      return await RequestWithAuth(`/projects`, {
        method: "POST",
        body: JSON.stringify({
          ...project,
          studentId: student.id,
        } as ProjectRequest),
      });
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };
  const updateProject = async (project: Project) => {
    try {
      return await RequestWithAuth(`/projects/${project.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...project,
          studentId: student.id,
        } as ProjectRequest),
      });
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };
  const deleteProject = async (project: Project) => {
    try {
      await RequestWithAuth(`/projects/${project.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };
  const createCertificat = async (certificat: Certificat) => {
    try {
      return await RequestWithAuth(`/certificates`, {
        method: "POST",
        body: JSON.stringify({
          ...certificat,
          studentId: student.id,
        } as CertificatRequest),
      });
    } catch (error) {
      console.error("Failed to create certificat", error);
    }
  };
  const updateCertificat = async (certificat: Certificat) => {
    try {
      return await RequestWithAuth(`/certificates/${certificat.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...certificat,
          studentId: student.id,
        } as CertificatRequest),
      });
    } catch (error) {
      console.error("Failed to update certificat", error);
    }
  };
  const deleteCertificat = async (certificat: Certificat) => {
    try {
      await RequestWithAuth(`/certificates/${certificat.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete certificat", error);
    }
  };

  const checkIsUserProfile = (userProfileId: string | undefined): void => {
    currentUser
      ? setIsUserProfile(userProfileId === currentUser?.id)
      : setIsUserProfile(false);
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (isAuthenticated && currentUser) {
  //       if (currentUser.role === Role.COMPANY) {
  //         const companyData = await getCompany(currentUser.id);
  //         setCompany(companyData);
  //       } else if (currentUser.role === Role.STUDENT) {
  //         await getStudent(currentUser.id);
  //       }
  //     }
  //   };
  //   fetchUserData();
  // }, [isAuthenticated, currentUser]);

  return (
    <UserContext.Provider
      value={{
        isUserProfile,
        checkIsUserProfile,
        company,
        setCompany,
        getCompany,
        companies,
        getCompanies,
        student,
        setStudent,
        getStudent,
        updateStudent,
        updateCompany,
        createExperience,
        updateExperience,
        deleteExperience,
        createFormation,
        updateFormation,
        deleteFormation,
        createProject,
        updateProject,
        deleteProject,
        createCertificat,
        updateCertificat,
        deleteCertificat,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context)
    throw new Error(
      "useUserContext must be used within an UserContextProvider"
    );
  return context;
};
