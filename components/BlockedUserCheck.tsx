"use client";
import { useAuth } from "@/context/authContext";
import { YouAreBlocked } from "@/components/YouAreBlocked";

interface BlockedUserCheckProps {
  children: React.ReactNode;
}

export const BlockedUserCheck = ({ children }: BlockedUserCheckProps) => {
  const { currentUser } = useAuth();

  if (currentUser?.blocked) {
    return <YouAreBlocked />;
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height))]">
      {children}
    </div>
  );
};
