"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { User } from "@/types/types";
import { BriefcaseBusiness, LogOut, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Role } from "@/types/types";

interface ProfileProps {
  user: User;
}
export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { logout } = useAuth();
  const { profilePicture } = user;
  return (
    <DropdownMenu>
      <div className="flex items-center gap-4">
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Image
            src={profilePicture || "/user.png"}
            alt="avatar"
            width={36}
            height={36}
            className="rounded-lg"
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56 z-[1000]" align="end">
        {!user?.blocked && user.role === Role.STUDENT && (
          <DropdownMenuItem asChild>
            <Link href={`/student/${user.id}/applications`}>
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              <span>Applications</span>
            </Link>
          </DropdownMenuItem>
        )}
        {!user?.blocked && user.role === Role.COMPANY && (
          <DropdownMenuItem asChild>
            <Link href={`/company/${user.id}/applications/filter`}>
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              <span>Applications</span>
            </Link>
          </DropdownMenuItem>
        )}
        {!user?.blocked && (
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.role.toLowerCase()}/${user.id}`}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
