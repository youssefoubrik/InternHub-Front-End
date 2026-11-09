"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .min(6, { message: "Verification code must be 6 characters" })
    .max(6, { message: "Verification code must be 6 characters" })
    .regex(/^[a-zA-Z0-9]{6}$/, {
      message: "Verification code must contain only alphanumeric characters",
    }),
});

type VerificationFormData = z.infer<typeof verificationCodeSchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? atob(encodedEmail) : "";

  const VERIFICATION_CODE_COOLDOWN = 180; // 3 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationCodeSchema),
  });

  // Check local storage for countdown on initial load
  useEffect(() => {
    const lastSentTimestamp = localStorage.getItem(
      `verification_sent_${email}`
    );
    if (lastSentTimestamp) {
      const timeElapsed = Math.floor(
        (Date.now() - parseInt(lastSentTimestamp)) / 1000
      );
      const remainingTime = VERIFICATION_CODE_COOLDOWN - timeElapsed;

      if (remainingTime > 0) {
        setCountdown(remainingTime);
      } else {
        localStorage.removeItem(`verification_sent_${email}`);
      }
    }
  }, [email]);

  // Handle countdown timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (countdown > 0) {
      timerId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [countdown]);

  const onSubmitCode = async (data: VerificationFormData) => {
    if (!email) {
      toast.error("Email address is missing");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/auth/confirm/students", {
        email: email,
        verificationCode: data.verificationCode,
      });

      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (e) {
      if (isAxiosError(e)) {
        const errorResponse = e.response?.data;
        toast.error(errorResponse?.message || "Verification failed");
      } else {
        console.error("Verification error:", e);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      toast.error(
        `Please wait ${countdown} seconds before requesting a new code`
      );
      return;
    }

    try {
      setIsResending(true);
      await api.post("auth/verify-email/students", { email });

      // Set cooldown in local storage
      localStorage.setItem(`verification_sent_${email}`, Date.now().toString());
      setCountdown(VERIFICATION_CODE_COOLDOWN);

      toast.success("A new verification code has been sent to your email");
    } catch (e) {
      if (isAxiosError(e)) {
        const errorResponse = e.response?.data;
        toast.error(
          errorResponse?.message || "Failed to resend verification code"
        );
      } else {
        console.error("Resend verification error:", e);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-full-except-header">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Invalid Request</CardTitle>
            <CardDescription>
              No email address provided. Please go back to the sign up page.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => router.push("/signup/student")}
              className="w-full"
            >
              Back to Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full-except-header">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitCode)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  placeholder="Enter 6-digit code"
                  {...register("verificationCode")}
                />
                {errors.verificationCode && (
                  <p className="text-red-500">
                    {errors.verificationCode.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center">Didn't receive the code?</div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendCode}
            disabled={isResending || countdown > 0}
          >
            {isResending
              ? "Sending..."
              : countdown > 0
              ? `Resend Code (${countdown}s)`
              : "Resend Code"}
          </Button>
          <Button
            variant="link"
            className="w-full"
            onClick={() => router.push("/signup/student")}
          >
            Back to Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
