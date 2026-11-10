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
import { SignUpFormData } from "./types";
import { VerificationForm } from "./components/verification-form";

export default function StudentSignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<SignUpFormData | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Handle successful signup - transition to verification mode
  const onSignupSuccess = (
    email: string,
    data: SignUpFormData,
    cooldownTime: number,
  ) => {
    setUserData(data);
    setUserEmail(email);
    setVerificationMode(true);
    setCountdown(cooldownTime);
  };

  const onVerificationSuccess = () => {
    router.replace("/signin");
  };

  return (
    <div className="flex items-center justify-center min-h-full-except-header py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {verificationMode ? "Verify Your Email" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {verificationMode
              ? `Enter the 6-digit verification code sent to ${userEmail}`
              : "Complete the form to create your student account"}
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
  );
}
