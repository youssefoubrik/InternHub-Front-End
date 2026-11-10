"use client";
import React, { useEffect } from "react";
import { useInternship } from "@/context/internshipContext";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CompanyApplications from "@/components/Applications/CompanyApplications";
import { useAuth } from "@/context/authContext";
import { useUser } from "@/context/userContext";

const CompanyApplicationsPageContent = () => {
  const { getCompanyApplications } = useInternship();
  const { setCompany, getCompany } = useUser();
  const params = useParams();
  const id = params.id.toString();
  const searchParams = useSearchParams();

  const internshipTitle = searchParams.get("internshipTitle");

  console.log("internshipTitle", internshipTitle);
  console.log("id", id);

  useEffect(() => {
    getCompanyApplications(id);
  }, [id]);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      const company = await getCompany(id);
      if (!company) return;
      setCompany(company);
    };
    fetchCompany();
  }, [id]);

  return <CompanyApplications internshipTitle={internshipTitle || undefined} />;
};

const Page = () => (
  <Suspense fallback={<div className="p-8 text-center">Loading applications...</div>}>
    <CompanyApplicationsPageContent />
  </Suspense>
);

export default Page;
