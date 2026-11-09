"use client";

import { ImageGallery } from "@/components/ImageGallery";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyFlag, reportStatusMap } from "@/types/types";
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  FileText,
  UserRound,
} from "lucide-react";
import Link from "next/link";

interface CompanyFlagDetailsProps {
  companyFlag: CompanyFlag;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CompanyFlagDetails = ({
  companyFlag,
  isOpen,
  setIsOpen,
}: CompanyFlagDetailsProps) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[min(92vw,980px)] !max-w-[980px] max-h-[88vh] overflow-y-auto border-0 bg-slate-50 p-0 shadow-2xl">
          <div className="border-b border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-primary px-6 pb-6 pt-7 text-white sm:px-8">
            <DialogHeader>
              <div className="mb-5 flex items-start justify-between gap-4 pr-6">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Company report
                  </div>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Flagged Company Details
                  </DialogTitle>
                </div>
                <Badge
                  variant={
                    reportStatusMap(
                      companyFlag.reportStatus,
                    ) as BadgeProps["variant"]
                  }
                  className="shrink-0 border-white/15 bg-white/10 text-white"
                >
                  {companyFlag.reportStatus}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-4 w-4 text-orange-300" />
                Reported on{" "}
                {new Date(companyFlag.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Flag reason
                </div>
                <p className="text-lg font-medium capitalize text-slate-900">
                  {companyFlag.reason}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <UserRound className="h-4 w-4 text-orange-500" />
                  Reported by
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-base font-semibold text-orange-600 hover:text-orange-700"
                  asChild
                >
                  <Link
                    href={`/profile/student/${companyFlag.studentId}`}
                    target="_blank"
                  >
                    {companyFlag.studentFirstName +
                      " " +
                      companyFlag.studentLastName}
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                <FileText className="h-4 w-4 text-orange-500" />
                Description
              </div>
              <p className="whitespace-pre-wrap leading-7 text-slate-700">
                {companyFlag.description || "No description provided."}
              </p>
            </div>

            {companyFlag.screenshots && companyFlag.screenshots.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <FileText className="h-4 w-4 text-orange-500" />
                    Evidence
                  </div>
                  <span className="text-xs text-slate-400">
                    {companyFlag.screenshots.length} attachment
                    {companyFlag.screenshots.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ImageGallery images={companyFlag.screenshots} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
