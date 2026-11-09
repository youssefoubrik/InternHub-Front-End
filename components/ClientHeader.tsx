"use client";

import Link from "next/link";
import Profile from "@/components/Profile";
import SignUpDropDown from "@/components/SignUpDropDown";
import { useAuth } from "@/context/authContext";

function ClientHeader() {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <header className="px-14 bg-[#f0f5fa] flex justify-between items-center">
      <Link href={"/"} className="outline-none">
        <img src="/logo.svg" alt="logo" width={105} height={105} />
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated && currentUser ? (
          <Profile user={currentUser} />
        ) : (
          <div className="flex items-center gap-6">
            <SignUpDropDown />
          </div>
        )}
      </div>
    </header>
  );
}

export default ClientHeader;
