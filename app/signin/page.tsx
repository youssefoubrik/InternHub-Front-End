"use client";
import { SignInForm } from "@/components/SignInForm";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex w-full items-center justify-center h-full">
      <div className="w-full max-w-md py-8">
        <img
          className="mx-auto"
          src="/logo.svg"
          alt="logo"
          width={105}
          height={105}
        />
        <SignInForm />
      </div>
    </div>
  );
}
