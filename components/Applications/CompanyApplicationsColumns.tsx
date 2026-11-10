import {
  Application,
  ApplicationStatus,
  getColorsByApplicationStatus,
  Internship,
} from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  CheckCheck,
  Eye,
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  SquareCheckBig,
  User,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SortableHeader } from "../SortableHeader";
import { sortDateColumn } from "@/utils/dates/sortDateColumn";
import { AcceptApplicationDialog } from "./AcceptApplicationDialog";
import { useInternship } from "@/context/internshipContext";
import { RejectApplicationDialog } from "./RejectApplicationDialog";

export const CompanyApplicationsColumns: ColumnDef<Application>[] = [
  {
    header: "Full Name",
    cell: ({ row }) =>
      row.original.studentResponse.firstName +
      " " +
      row.original.studentResponse.lastName,
  },
  {
    accessorFn: (row) => row.studentResponse.email,
    id: "email",
    header: "Email",
    cell: ({ row }) => row.original.studentResponse.email,
    filterFn: "includesString",
  },
  {
    id: "internshipTitle",
    accessorFn: (row) => row.internshipResponse.title,
    header: "Internship",
    cell: ({ row }) => row.original.internshipResponse.title,
    filterFn: "includesString",
  },
  {
    accessorKey: "applicationDate",
    header: ({ column }) => (
      <SortableHeader column={column} label="Application Date" />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.applicationDate;
      const date = new Date(rawDate);
      return (
        <div>
          {date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
    sortingFn: sortDateColumn,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={getColorsByApplicationStatus(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    id: "actions",
    cell: ({ row }: { row: { original: Application } }) => {
      const router = useRouter();
      const [acceptDialog, setAcceptDialog] = useState<boolean>(false);
      const [rejectDialog, setRejectDialog] = useState<boolean>(false);
      const {acceptApplication , rejectApplication} = useInternship();

      const handleAcceptApplication = async (
        message: string,
        subject: string,
        attachments: File[]
      ) => {
        const success = await acceptApplication(row.original.id , message, subject, attachments);
        if (success) setAcceptDialog(false);
      };

      const handleRejectApplication = async (
        message: string,
        subject: string,
        attachments: File[]
      ) => {
        const success = await rejectApplication(row.original.id , message, subject, attachments);
        if (success) setRejectDialog(false);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 ">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/profile/student/${row.original.studentResponse.id}`
                  )
                }
              >
                <User strokeWidth={3} className="mr-2 h-4 w-4" />
                Go to Applicant Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/internships/${row.original.internshipResponse.id}`
                  )
                }
              >
                <SquareArrowOutUpRight
                  strokeWidth={3}
                  className="mr-2 h-4 w-4"
                />
                Go to Internship Page
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={row.original.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <Eye strokeWidth={3} className="mr-2 h-4 w-4" />
                  View CV
                </a>
              </DropdownMenuItem>
              {row.original.motivationLetter && (
                <DropdownMenuItem asChild>
                  <a
                    href={row.original.motivationLetter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Eye strokeWidth={3} className="mr-2 h-4 w-4" />
                    View Motivation Letter
                  </a>
                </DropdownMenuItem>
              )}
              {row.original.status === ApplicationStatus.PENDING && <DropdownMenuItem onClick={() => setAcceptDialog(true)}>
                <CheckCheck
                  strokeWidth={3}
                  className="mr-2 h-4 w-4 hover-text-green-500"
                />
                Accept
              </DropdownMenuItem>}
              {(row.original.status === ApplicationStatus.PENDING || row.original.status === ApplicationStatus.ACCEPTED) && <DropdownMenuItem onClick={() => setRejectDialog(true)}>
                <X strokeWidth={3} className="mr-2 h-4" />
                Reject
              </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>

          {
            row.original.status === ApplicationStatus.PENDING && (
            <AcceptApplicationDialog
              isOpen={acceptDialog}
              setIsOpen={setAcceptDialog}
              onConfirm={handleAcceptApplication}
              studentAccepted={row.original.studentResponse}
              internshipConcerned={row.original.internshipResponse}
            />
          )}
          {
            (row.original.status === ApplicationStatus.PENDING || row.original.status === ApplicationStatus.ACCEPTED) && (
            <RejectApplicationDialog
              isOpen={rejectDialog}
              setIsOpen={setRejectDialog}
              onConfirm={handleRejectApplication}
              studentRejected={row.original.studentResponse}
              internshipConcerned={row.original.internshipResponse}
            />
            )
          }
        </>
      );
    },
  },
];
