"use client";
import { useAuth } from "@/context/authContext";
import { Role } from "@/types/types";
import { Router } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  return (
    <section className="px-14 bg-background min-h-[calc(100vh-var(--header-height))] flex flex-col md:flex-row items-center justify-between overflow-hidden py-10">
      {/* Content */}
      <div className="px-6 md:px-12 lg:px-20 flex items-center justify-between w-full">
        <div className="relative z-10 text-center md:text-left text-black md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl text-primary md:text-5xl font-bold mb-6 md:mb-10 max-w-[700px] mx-auto md:mx-0">
            {currentUser?.role === Role.STUDENT
              ? "Find Your Dream Internship"
              : currentUser?.role === Role.COMPANY
              ? "Find Your Perfect Candidate"
              : currentUser?.role === Role.ADMIN
              ? "Platform Administration"
              : "Find Your Dream Internship or Perfect Candidate"}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-[600px] mx-auto md:mx-0">
            {currentUser?.role === Role.ADMIN
              ? "Manage users, internships, and platform content with advanced administrative tools"
              : "Connect with thousands of employers and internship seekers on our platform"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={() => router.push("/internships")}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Browse Internships
            </button>
            <Link 
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105" 
              href={`/${
                currentUser?.role === Role.STUDENT
                  ? "profile/student/" + currentUser.id
                  : currentUser?.role === Role.ADMIN
                  ? "admin"
                  : !currentUser
                  ? "signup/company"
                  : "post-internship"
              }`}
            >
              {currentUser?.role === Role.STUDENT
                ? "See your profile"
                : currentUser?.role === Role.ADMIN
                ? "Admin Dashboard"
                : "Post an Internship"}
            </Link>
          </div>
        </div>
        <div className="relative z-10 md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="animate-float">
              <Image
                src="/homepage/job_recretment.png"
                alt="Recruitment"
                width={600}
                height={600}
                className="drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
