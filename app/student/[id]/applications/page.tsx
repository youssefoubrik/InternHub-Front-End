"use client";
import React, { useEffect } from "react";
import { useInternship } from "@/context/internshipContext";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CompanyApplications from "@/components/Applications/CompanyApplications";
import { useUser } from "@/context/userContext";
import StudentApplications from "@/components/Applications/StudentApplications";

const StudentApplicationsPageContent = () => {
  const { getStudentApplications } = useInternship();
  const { setStudent, getStudent } = useUser();
  const params = useParams();
  const id = params.id.toString();
  const searchParams = useSearchParams();

  const internshipTitle = searchParams.get("internshipTitle");

  useEffect(() => {
    getStudentApplications(id);
  }, [id]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      const student = await getStudent(id);
      if (!student) return;
      setStudent(student);
    };
    fetchStudent();
  }, [id]);

  return <StudentApplications internshipTitle={internshipTitle || undefined} />;
};

const Page = () => (
  <Suspense fallback={<div className="p-8 text-center">Loading applications...</div>}>
    <StudentApplicationsPageContent />
  </Suspense>
);

export default Page;
