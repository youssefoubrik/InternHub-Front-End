"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SignUpForm } from "./components/signup-form";
import { VerificationForm } from "./components/verification-form";
import { CompanySignUpFormData } from "./types";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<CompanySignUpFormData | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Handle successful signup - transition to verification mode
  const onSignupSuccess = (
    email: string,
    data: CompanySignUpFormData,
    cooldownTime: number,
  ) => {
    setUserData(data);
    setUserEmail(email);
    setVerificationMode(true);
    setCountdown(cooldownTime);
  };

  const onVerificationSuccess = () => {
    router.push("/signin");
  };

  return (
    <div className="flex w-full items-center justify-center h-full">
      <div className="w-full max-w-2xl py-8">
        <img
          className="mx-auto mb-4"
          src="/logo.svg"
          alt="logo"
          width={105}
          height={105}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {verificationMode ? "Verify Your Email" : "Sign Up"}
            </CardTitle>
            <CardDescription>
              {verificationMode
                ? `Enter the 6-digit verification code sent to ${userEmail}`
                : "Complete the form to create your employer account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!verificationMode ? (
              <SignUpForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onSuccess={onSignupSuccess}
              />
            ) : (
              <VerificationForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                email={userEmail}
                userData={userData}
                countdown={countdown}
                setCountdown={setCountdown}
                onSuccess={onVerificationSuccess}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
