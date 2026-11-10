"use client";

import { StatCard } from "@/components/Cards/StatCard";
import { BlockCompanyDialog } from "@/components/Dialogs/BlockCompanyDialog";
import { ResolveCompanyFlagDialog } from "@/components/Dialogs/ResolveCompanyFlag";
import { UnblockCompanyDialog } from "@/components/Dialogs/UnblockCompanyDialog";
import { WarnCompanyDialog } from "@/components/Dialogs/WarnCompanyDialog";
import { SortableHeader } from "@/components/SortableHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCompanies } from "@/context/CompaniesContext";
import axios from "@/lib/axios";
import { Company, CompanyFlag, reportStatusMap } from "@/types/types";
import { getValidToken } from "@/utils/auth";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Bell,
  Flag,
  InfoIcon,
  Lock,
  MoreHorizontal,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompanyFlagDetails } from "../CompanyFlagDetails";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isBlockCompanyDialogOpen, setIsBlockCompanyDialogOpen] =
    useState(false);
  const [isUnblockCompanyDialogOpen, setIsUnblockCompanyDialogOpen] =
    useState(false);
  const [isWarnCompanyDialogOpen, setIsWarnCompanyDialogOpen] = useState(false);
  const [isResolveFlagDialogOpen, setIsResolveFlagDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [flags, setFlags] = useState<CompanyFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<CompanyFlag | null>(null);
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [warningsCount, setWarningsCount] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [company, setCompany] = useState<Company | null>(null);

  const {
    fetchCompanyFlagsHistory,
    resolveFlag,
    warnCompany,
    blockCompany,
    unblockCompany,
    fetchUnresolvedFlagsCount,
    fetchResolvedFlagsCount,
    fetchWarningsCount,
  } = useCompanies();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = getValidToken();
        if (!token) return;

        const [
          companyDetails,
          historyOfCompanyFlags,
          unresolvedFlags,
          resolvedFlags,
          warnings,
        ] = await Promise.all([
          axios
            .get(`/companies/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.data),
          fetchCompanyFlagsHistory(id),
          fetchUnresolvedFlagsCount(id),
          fetchResolvedFlagsCount(id),
          fetchWarningsCount(id),
        ]);

        setCompany(companyDetails);
        setFlags(historyOfCompanyFlags);
        setUnresolvedCount(unresolvedFlags);
        setResolvedCount(resolvedFlags);
        setWarningsCount(warnings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleResolveFlag = async (flagId: string) => {
    const success = await resolveFlag(flagId);
    if (success) {
      setFlags((currentFlags) =>
        currentFlags.map((flag) =>
          flag.id === flagId ? { ...flag, reportStatus: "RESOLVED" } : flag,
        ),
      );
      setIsResolveFlagDialogOpen(false);
      setUnresolvedCount((prev) => prev - 1);
      setResolvedCount((prev) => prev + 1);
    }
  };

  const handleWarnCompany = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    if (!selectedFlag) return;

    const success = await warnCompany(
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
      setIsWarnCompanyDialogOpen(false);
      setUnresolvedCount((prev) => prev - 1);
      setWarningsCount((prev) => prev + 1);
    }
  };

  const handleBlockCompany = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    const success = await blockCompany(id, message, subject, attachments);
    if (success) {
      setCompany((prev) =>
        prev ? { ...prev, blocked: true, blockedAt: new Date() } : null,
      );
    }

    setIsBlockCompanyDialogOpen(false);
  };

  const handleUnblockCompany = async (
    message: string,
    subject: string,
    attachments: File[],
  ) => {
    const success = await unblockCompany(id, message, subject, attachments);
    if (success) {
      setCompany((prev) =>
        prev ? { ...prev, blocked: false, blockedAt: null } : null,
      );
    }
    setIsUnblockCompanyDialogOpen(false);
  };

  const columns: ColumnDef<CompanyFlag>[] = [
    {
      accessorKey: "studentFirstName",
      header: ({ column }) => <SortableHeader column={column} label="Reported by" />,
      cell: ({ row }) => row.original.reporterCompanyId ? (
        <Button variant="link" size="sm" className="text-sm p-0" asChild>
          <Link href={`/profile/company/${row.original.reporterCompanyId}`} target="_blank">
            {row.original.reporterCompanyName}
          </Link>
        </Button>
      ) : (
        <Button variant="link" size="sm" className="text-sm p-0" asChild>
          <Link href={`/profile/student/${row.original.studentId}`} target="_blank">
            {row.original.studentFirstName} {row.original.studentLastName}
          </Link>
        </Button>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "reason",
      header: ({ column }) => <SortableHeader column={column} label="Reason" />,
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
    },
    {
      accessorKey: "reportStatus",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => (
        <Badge variant={reportStatusMap(row.original.reportStatus)}>
          {row.original.reportStatus}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-primary data-[state=open]:bg-gray-100 data-[state=open]:text-primary transition-colors rounded-full"
                disabled={company?.blocked}
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
              {!company?.blocked && (
                <>
                  {row.original.reportStatus !== "WARNED" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFlag(row.original);
                        setIsWarnCompanyDialogOpen(true);
                      }}
                    >
                      <Bell className="h-4 w-4" />
                      Warn Company
                    </DropdownMenuItem>
                  )}
                  {row.original.reportStatus === "UNRESOLVED" && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedFlag(row.original);
                        setIsResolveFlagDialogOpen(true);
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
        );
      },
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
              <h1 className="text-2xl font-bold">Company Flags History</h1>
              {company?.blocked && (
                <div className="mt-2">
                  <Badge
                    variant="destructive"
                    className="text-sm cursor-default"
                  >
                    Blocked{" "}
                    {company.blockedAt &&
                      ` on ${new Date(company.blockedAt).toLocaleDateString()}`}
                  </Badge>
                </div>
              )}
            </div>
            {company?.blocked ? (
              <Button
                variant="default"
                onClick={() => setIsUnblockCompanyDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unblock Company
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsBlockCompanyDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Block Company
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

          <BlockCompanyDialog
            isOpen={isBlockCompanyDialogOpen}
            setIsOpen={setIsBlockCompanyDialogOpen}
            companyToBlock={{
              id,
              name: company?.name || "",
            }}
            onConfirm={handleBlockCompany}
          />

          <UnblockCompanyDialog
            isOpen={isUnblockCompanyDialogOpen}
            setIsOpen={setIsUnblockCompanyDialogOpen}
            companyToUnblock={{
              id,
              name: company?.name || "",
            }}
            onConfirm={handleUnblockCompany}
          />

          {selectedFlag && !company?.blocked && (
            <>
              <WarnCompanyDialog
                isOpen={isWarnCompanyDialogOpen}
                onOpenChange={setIsWarnCompanyDialogOpen}
                onConfirm={handleWarnCompany}
                companyFlag={selectedFlag}
              />

              <ResolveCompanyFlagDialog
                isOpen={isResolveFlagDialogOpen}
                setIsOpen={setIsResolveFlagDialogOpen}
                companyFlag={selectedFlag}
                onResolveFlag={handleResolveFlag}
              />

              <CompanyFlagDetails
                isOpen={isDetailsOpen}
                setIsOpen={setIsDetailsOpen}
                companyFlag={selectedFlag}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
