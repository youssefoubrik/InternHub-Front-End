"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Clock,
  Router,
  UserPlus,
  XCircle,
} from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import Link from "next/link";

interface CompanyProfileStatsProps {
  applicants: number;
  pendingApplicants: number;
  acceptedApplicants: number;
  rejectedApplicants: number;
}

const CompanyProfileStats = ({
  applicants,
  pendingApplicants,
  acceptedApplicants,
  rejectedApplicants,
}: CompanyProfileStatsProps) => {
  const router = useRouter();
  const { company } = useUser();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2 bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 w-full md:w-[75%] md:mx-auto">
      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <UserPlus className="w-6 h-6 text-blue-500" />
          <div className="relative">
            <h3 className="text-lg font-medium">Total Applicants</h3>
          </div>
        </div>
        <div className="text-3xl overflow-hidden font-bold text-blue-500">
          {applicants}
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Clock className="w-6 h-6 text-yellow-500" />
          <div className="relative">
            <h3 className="text-lg font-medium">Pending Applications</h3>
          </div>
        </div>
        <div className="text-3xl overflow-hidden font-bold text-yellow-500">
          {pendingApplicants}
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div className="relative">
            <h3 className="text-lg font-medium">Accepted Applicants</h3>
          </div>
        </div>
        <div className="text-3xl overflow-hidden font-bold text-green-500">
          {acceptedApplicants}
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <div className="relative">
            <h3 className="text-lg font-medium">Rejected Applications</h3>
          </div>
        </div>
        <div className="text-3xl overflow-hidden font-bold text-red-500">
          {rejectedApplicants}
        </div>
      </div>
      <div className="col-span-full flex items-center justify-center mt-4">
        <Link
          href={`/company/${company.id}/applications/filter`}
          className="text-primary hover:bg-primary hover:text-white group bg-transparent border border-primary rounded-md py-2 px-4 flex items-center gap-2 transition-all duration-200 ease-in-out"
        >
          <span>Manage Applications</span>
          <ArrowRightIcon className="w-6 h-6 text-primary group-hover:text-white" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyProfileStats;
