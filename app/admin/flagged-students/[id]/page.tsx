"use client";
import { StatCard } from "@/components/Cards/StatCard";
import { BlockStudentDialog } from "@/components/Dialogs/BlockStudentDialog";
import { UnblockStudentDialog } from "@/components/Dialogs/UnblockStudentDialog";
import { WarnStudentDialog } from "@/components/Dialogs/WarnStudentDialog";
import { ReloveFlagDialog } from "@/components/Dialogs/ResolveFlag";
import { StudentFlagDetails } from "../StudentFlagDetails";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudents } from "@/context/StudentsContext";
import {
  Bell,
  Flag,
  InfoIcon,
  MoreHorizontal,
  ShieldX,
  Lock,
  Unlock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StudentFlag, Student, reportStatusMap } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { SortableHeader } from "@/components/SortableHeader";
import { sortDateColumn } from "@/utils/dates/sortDateColumn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isBlockStudentDialogOpen, setIsBlockStudentDialogOpen] =
    useState(false);
  const [isUnblockStudentDialogOpen, setIsUnblockStudentDialogOpen] =
    useState(false);
  const [isWarnStudentDialogOpen, setIsWarnStudentDialogOpen] = useState(false);
  const [isIgnoreFlagDialogOpen, setIsIgnoreFlagDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [flags, setFlags] = useState<StudentFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<StudentFlag | null>(null);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [student, setStudent] = useState<Student | null>(null);

  const {
    fetchStudentFlagsHistory,
    resolveFlag,
    warnStudent,
    blockStudent,
    unblockStudent,
    fetchUnresolvedFlagsCount,
    fetchResolvedFlagsCount,
    fetchWarningsCount,
    fetchStudent,
  } = useStudents();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          studentDetails,
          historyOfStudentFlags,
          unresolvedFlags,
          resolvedFlags,
          warnings,
        ] = await Promise.all([
          fetchStudent(id),
          fetchStudentFlagsHistory(id),
          fetchUnresolvedFlagsCount(id),
          fetchResolvedFlagsCount(id),
          fetchWarningsCount(id),
        ]);

        setStudent(studentDetails);
        setFlags(historyOfStudentFlags);
        setUnresolvedCount(unresolvedFlags);
        setResolvedCount(resolvedFlags);
        setWarningsCount(warnings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleIgnoreFlag = async (flagId: string) => {
    const success = await resolveFlag(flagId);
    if (success) {
      setFlags((currentFlags) =>
        currentFlags.map((flag) =>
          flag.id === flagId ? { ...flag, reportStatus: "RESOLVED" } : flag,
        ),
      );
      setIsIgnoreFlagDialogOpen(false);
      setUnresolvedCount((prev) => prev - 1);
      setResolvedCount((prev) => prev + 1);
    }
  };

  const handleWarnStudent = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    if (!selectedFlag) return;

    const success = await warnStudent(
      selectedFlag.id,
      message,
      subject,
      attachments,
    );
    if (success) {
      setFlags((currentFlags) =>
        currentFlags.map((flag) =>
          flag.id === selectedFlag.id
            ? { ...flag, reportStatus: "WARNED" }
            : flag,
        ),
      );
      setIsWarnStudentDialogOpen(false);
      setUnresolvedCount((prev) => prev - 1);
      setWarningsCount((prev) => prev + 1);
    }
  };

  const handleBlockStudent = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    const success = await blockStudent(id, message, subject, attachments);
    if (success) {
      router.push("/admin/flagged-students");
    }
    setIsBlockStudentDialogOpen(false);
  };

  const handleUnblockStudent = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    const success = await unblockStudent(id, message, subject, attachments);
    if (success) {
      setStudent((prev) =>
        prev ? { ...prev, blocked: false, blockedAt: null } : null,
      );
    }
    setIsUnblockStudentDialogOpen(false);
  };

  const columns: ColumnDef<StudentFlag>[] = [
    {
      accessorKey: "companyName",
      header: ({ column }) => (
        <SortableHeader column={column} label="Company" />
      ),
      cell: ({ row }) => (
        <Button variant="link" size="sm" className="text-sm p-0" asChild>
          <Link
            href={`/profile/company/${row.original.companyId}`}
            target="_blank"
          >
            {row.original.companyName}
          </Link>
        </Button>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "reason",
      header: ({ column }) => <SortableHeader column={column} label="Reason" />,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader column={column} label="Flag Date" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <div>{date.toLocaleDateString("en-GB")}</div>;
      },
      sortingFn: sortDateColumn,
    },
    {
      accessorKey: "reportStatus",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => (
        <Badge variant={reportStatusMap(row.original.reportStatus)}>
          {row.original.reportStatus}
        </Badge>
      ),
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-primary data-[state=open]:bg-gray-100 data-[state=open]:text-primary transition-colors rounded-full"
                disabled={student?.blocked}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="flex items-center gap-2">
                Manage Flags
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedFlag(row.original);
                  setIsDetailsOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <InfoIcon className="h-4 w-4" />
                Show Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!student?.blocked && (
                <>
                  {row.original.reportStatus !== "WARNED" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFlag(row.original);
                        setIsWarnStudentDialogOpen(true);
                      }}
                    >
                      <Bell className="h-4 w-4" />
                      Warn Student
                    </DropdownMenuItem>
                  )}
                  {row.original.reportStatus === "UNRESOLVED" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFlag(row.original);
                        setIsIgnoreFlagDialogOpen(true);
                      }}
                    >
                      <Flag className="h-4 w-4" />
                      Resolve Flag
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];

  const table = useReactTable({
    data: flags,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="container mx-auto py-10">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Student Flags History</h1>
              {student?.blocked && (
                <div className="mt-2">
                  <Badge
                    variant="destructive"
                    className="text-sm cursor-default"
                  >
                    Blocked{" "}
                    {student.blockedAt &&
                      ` on ${new Date(student.blockedAt).toLocaleDateString()}`}
                  </Badge>
                </div>
              )}
            </div>
            {student?.blocked ? (
              <Button
                variant="default"
                onClick={() => setIsUnblockStudentDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unblock Student
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsBlockStudentDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Block Student
              </Button>
            )}
          </div>

          <div className="bg-primary-dark/75 p-5 rounded-lg mb-6">
            <div className="stats grid grid-cols-3 gap-4">
              <StatCard
                count={unresolvedCount}
                label="Unresolved Flags"
                icon="/admin/pending.png"
              />
              <StatCard
                count={warningsCount}
                label="Warnings Sent"
                icon="/admin/warning.png"
              />
              <StatCard
                count={resolvedCount}
                label="Resolved Flags"
                icon="/admin/resolved.png"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter by reason..."
                value={
                  (table.getColumn("reason")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("reason")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="bg-primary-dark/80 text-white"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="bg-white/85">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={`border-b transition ${
                          index % 2 === 0 && "bg-gray-50"
                        } hover:bg-gray-100`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No flags found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>

          <BlockStudentDialog
            isOpen={isBlockStudentDialogOpen}
            setIsOpen={setIsBlockStudentDialogOpen}
            studentToBlock={{
              id,
              firstName: student?.firstName || "",
              lastName: student?.lastName || "",
            }}
            onConfirm={handleBlockStudent}
          />

          <UnblockStudentDialog
            isOpen={isUnblockStudentDialogOpen}
            setIsOpen={setIsUnblockStudentDialogOpen}
            studentToUnblock={{
              id,
              firstName: student?.firstName || "",
              lastName: student?.lastName || "",
            }}
            onConfirm={handleUnblockStudent}
          />

          {selectedFlag && !student?.blocked && (
            <>
              <WarnStudentDialog
                isOpen={isWarnStudentDialogOpen}
                onOpenChange={setIsWarnStudentDialogOpen}
                onConfirm={handleWarnStudent}
                studentFlag={selectedFlag}
              />

              <ReloveFlagDialog
                isOpen={isIgnoreFlagDialogOpen}
                setIsOpen={setIsIgnoreFlagDialogOpen}
                studentFlag={selectedFlag}
                onResolveFlag={handleIgnoreFlag}
              />

              <StudentFlagDetails
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                studentFlag={selectedFlag}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
