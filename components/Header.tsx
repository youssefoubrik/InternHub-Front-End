"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { Role } from "@/types/types";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Profile from "./Profile";
import SignUpDropDown from "./SignUpDropDown";
import { Badge } from "./ui/badge";

type HeaderLink = { label: string; href: string };

function Header() {
  const { isAuthenticated, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = currentUser?.role;

  const browseLink: HeaderLink = {
    label: "Browse",
    href: "/internships",
  };
  const links: HeaderLink[] =
    role === Role.ADMIN
      ? [
          { label: "Companies report", href: "/admin/manage-companies" },
          { label: "Students reports", href: "/admin/manage-students" },
          { label: "Flagged companies", href: "/admin/flagged-companies" },
          { label: "Flagged students", href: "/admin/flagged-students" },
        ]
      : role === Role.STUDENT
        ? [
            {
              label: "Applications",
              href: `/student/${currentUser?.id}/applications`,
            },
            { label: "About Us", href: "/about-us" },
            { label: "Contact", href: "/contact" },
          ]
        : role === Role.COMPANY
          ? [
              {
                label: "Applications",
                href: `/company/${currentUser?.id}/applications/filter`,
              },
              { label: "About Us", href: "/about-us" },
              { label: "Contact", href: "/contact" },
            ]
          : [
              { label: "About Us", href: "/about-us" },
              { label: "Contact", href: "/contact" },
            ];

  const navLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary";

  return (
    <header className="relative z-40 flex min-h-[76px] items-center justify-between gap-4 bg-background px-4 sm:px-8 lg:px-14">
      <Link
        href="/"
        className="shrink-0 flex flex-1 outline-none"
        aria-label="InternHub home"
      >
        <img src="/logo.svg" alt="InternHub" width={105} height={70} />
      </Link>

      <nav
        className="hidden items-center gap-1 flex flex-4 justify-center lg:flex"
        aria-label="Main navigation"
      >
        <Link href={browseLink.href} className={navLinkClass}>
          {browseLink.label}
        </Link>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={navLinkClass}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex flex-1 shrink-0 items-center gap-3 justify-end">
        {isAuthenticated && currentUser ? (
          <>
            <Badge variant="default">{currentUser.role}</Badge>
            <Profile user={currentUser} />
          </>
        ) : (
          <div className="hidden items-center gap-3 sm:flex">
            <Button asChild>
              <Link href="/signin">
                <LogIn /> Sign In
              </Link>
            </Button>
            <SignUpDropDown />
          </div>
        )}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 lg:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-gray-200 bg-background p-4 shadow-lg lg:hidden"
          aria-label="Mobile navigation"
        >
          <Link
            href={browseLink.href}
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse internships
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex flex-wrap items-center gap-3 px-3 pt-2 sm:hidden">
              <Button asChild>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <LogIn /> Sign In
                </Link>
              </Button>
              <SignUpDropDown />
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
