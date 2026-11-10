import {
    Application,
    getColorsByApplicationStatus,
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
    Eye,
    MoreHorizontal,
    SquareArrowOutUpRight,
  } from "lucide-react";
  import { Button } from "../ui/button";
  import { Badge } from "../ui/badge";
  import { useRouter } from "next/navigation";
  import { SortableHeader } from "../SortableHeader";
  import { sortDateColumn } from "@/utils/dates/sortDateColumn";
  
  export const StudentApplicationsColumns: ColumnDef<Application>[] = [
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
                    View Your CV
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
                      View Your Motivation Letter
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
  
