"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Button from "../Button";
import SearchableCombobox from "../SearchableCombobox";
import { useInternship } from "@/context/internshipContext";
import { useUser } from "@/context/userContext";
import { Internship } from "@/types/types";
import InternshipCommandSearch from "../InternshipCommandSearch";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultInternship?: string;
  internshipOptions?: Internship[];
  hiddenEmailInput?: boolean ;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultInternship,
  internshipOptions,
  hiddenEmailInput=false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [emailFilter, setEmailFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [internshipFilter, setInternshipFilter] = React.useState("");

  const { getCompanyInternships } = useInternship();
  const { company } = useUser();
  const [companyInternships, setCompanyInternships] = React.useState<
    Internship[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (internshipOptions) return;
    if (!company?.id) {
      setCompanyInternships([]);
      return;
    }
    const fetchInternshipsOptions = async () => {
      try {
        setLoading(true);
        const companyInternships = await getCompanyInternships(company.id);
        setCompanyInternships(companyInternships);
      } catch (error) {
        console.error("failed to fetch internships");
      } finally {
        setLoading(false);
      }
    };
    fetchInternshipsOptions();
  }, [company?.id, internshipOptions, getCompanyInternships]);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  React.useEffect(() => {
    const value = defaultInternship ?? "";
    setInternshipFilter(value);
    table.getColumn("internshipTitle")?.setFilterValue(value || undefined);
  }, [defaultInternship, table]);

  console.log("hidden email : ",hiddenEmailInput);

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        {!hiddenEmailInput && (
          <Input
            placeholder="Filter emails..."
            value={emailFilter}
            onChange={(event) => {
              const value = event.target.value;
            setEmailFilter(value);
            table.getColumn("email")?.setFilterValue(value);
          }}
          className="max-w-sm"
        />
        )}
        <InternshipCommandSearch
            options={internshipOptions ?? companyInternships}
          onSelect={(value) => {
            setInternshipFilter(value);
            table.getColumn("internshipTitle")?.setFilterValue(value || undefined);
              table.setPageIndex(0);
          }}
          defaultValue={internshipFilter}
        />

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value);
          }}
          defaultValue="all"
        >
          <SelectTrigger className="ml-4 w-[180px] bg-white border-gray-300 hover:border-primary focus:border-primary transition-colors">
            <div className="flex items-center gap-2">
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-300 shadow-md">
            <SelectItem
              value="all"
              className="flex items-center gap-2 py-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2 font-medium">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                All
              </div>
            </SelectItem>
            <SelectItem
              value="pending"
              className="flex items-center gap-2 py-2 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Pending
              </div>
            </SelectItem>
            <SelectItem
              value="accepted"
              className="flex items-center gap-2 py-2 hover:bg-green-50"
            >
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Accepted
              </div>
            </SelectItem>
            <SelectItem
              value="rejected"
              className="flex items-center gap-2 py-2 hover:bg-red-50"
            >
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Rejected
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          label="Clear All Filters"
          className="bg-white border border-primary !text-primary hover-bg-primary-hover"
          onClick={() => {
            // Clear all filters in the table
            table.resetColumnFilters();

            setEmailFilter("");
            setStatusFilter("all");
            setInternshipFilter("");

            table.getColumn("email")?.setFilterValue("");
            table.getColumn("status")?.setFilterValue(undefined);
            table.getColumn("internshipTitle")?.setFilterValue(undefined);
            table.setPageIndex(0);
          }}
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white/85">
            {table?.getRowModel().rows?.length ? (
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
                        cell.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 gap-2">
        <Button
          label="Previous"
          outline={true}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <span className="text-gray-700 font-normal">
          Page {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
        <Button
          label="Next"
          outline={true}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
    </div>
  );
}
