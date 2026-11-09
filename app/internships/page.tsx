"use client";
import HorizontalFilters from "@/components/HorizontalFilters";
import InternshipItem from "@/components/InternshipItem/InternshipItem";
import { useFilters } from "@/context/FiltersContext";
import { useInternship } from "@/context/internshipContext";
import { Internship, InternshipType, WorkMode } from "@/types/types";
import { list, table } from "@/utils/Icons";
import { motion } from "framer-motion";
import React, { useEffect } from "react";

export default function page() {
  const { internships, searchInternships } = useInternship();
  const { filters } = useFilters();

  useEffect(() => {
    searchInternships(filters);
  }, [filters]);

  // const filetredJobs =
  //   filters.remote ||
  //   filters.onSite ||
  //   filters.hybrid ||
  //   filters.pfa ||
  //   filters.pfe ||
  //   filters.initiation ||
  //   filters.paid
  //     ? internships?.filter((internship) => {
  //         if (filters.remote && internship?.workMode === WorkMode.REMOTE)
  //           return true;
  //         if (filters.onSite && internship?.workMode === WorkMode.ON_SITE)
  //           return true;
  //         if (filters.hybrid && internship?.workMode === WorkMode.HYBRID)
  //           return true;

  //         if (filters.pfa && internship?.tags.includes(InternshipType.PFA))
  //           return true;
  //         if (filters.pfe && internship?.tags.includes(InternshipType.PFE))
  //           return true;
  //         if (
  //           filters.initiation &&
  //           internship?.tags.includes(InternshipType.INITIATION)
  //         )
  //           return true;

  //         if (filters.paid && internship?.paid) return true;
  //       })
  //     : internships;

  return (
    <main className="px-14">
      <div className="w-full mb-14">
        {/* Horizontal Filters */}
        <HorizontalFilters />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full"
        >
          <div
            className={`grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1`}
          >
            {internships?.length > 0 ? (
              internships?.map((internship: Internship) => (
                <InternshipItem key={internship?.id} internship={internship} />
              ))
            ) : (
              <div className="mx-auto grid col-span-full items-center justify-center">
                <img
                  src="notFound.png"
                  alt="Not Found"
                  width={"600rem"}
                  height={"600rem"}
                />
                <p className="text-xl md:text-3xl font-bold w-full flex justify-center text-[#ff5a31]">
                  No Internships Found!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
