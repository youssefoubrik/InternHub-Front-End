"use client";
import PostInternshipForm from "@/components/Internship/PostInternshipForm";
import { useAuth } from "@/context/authContext";
import { Unauthorized } from "@/components/Unauthorized";
import { hasRoleCompany } from "@/utils/checkAuthority";
import { useEffect, useState } from "react";
import { useInternship } from "@/context/internshipContext";

function page() {
  const { currentUser } = useAuth();
  const { resetInternshipForm } = useInternship();
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    resetInternshipForm();
    setFormReady(true);
  }, [resetInternshipForm]);

  return currentUser && hasRoleCompany(currentUser?.role) ? (
    <div className="flex flex-col py-10">
      <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
        Create an Internship Post
      </h2>

      <div className="flex-1 pt-8 w-[90%] mx-auto flex justify-center items-center">
        {formReady && <PostInternshipForm />}
      </div>
    </div>
  ) : (
    <Unauthorized />
  );
}

export default page;
