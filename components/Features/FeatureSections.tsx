"use client";
import SplitFeatureSection from "./SplitFeatureSection";
import { Briefcase, Building, Users } from "lucide-react";
import { motion } from "framer-motion";
import EnhancedCallToAction from "./EnhancedCallToAction";
import AnimatedCounters from "./AnimatedCounters";
import InfinitePartnerSlider from "./InfinitePartnerSlider";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Role } from "@/types/types";

interface FeatureSectionsProps {
  statistics: HomeStatistics;
}

const FeatureSections = ({ statistics }: FeatureSectionsProps) => {
  const { currentUser } = useAuth();
  const featureSections = [
    {
      title: "Diverse Internship Opportunities",
      description:
        "Explore a wide range of internship listings across various domains and industries throughout Morocco.",
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      statistics: [
        {
          value: statistics.totalInternshipsCount,
          label: "Active internship listings",
          delay: 0,
        },
        {
          value: statistics.remoteInternshipsCount,
          label: "Remote internships",
          delay: 0.1,
        },
        {
          value: statistics.onSiteInternshipsCount,
          label: "On-Site internships",
          delay: 0.2,
        },
      ],
      actionLabel: "Browse Internships",
      actionLink: "/internships",
      reverseLayout: false,
      bgColor: "bg-background-dark",
    },
    {
      title: "Leading Moroccan Companies",
      description:
        "Connect with top Moroccan companies offering valuable internships to bright and motivated students.",
      icon: <Building className="w-8 h-8 text-primary" />,
      statistics: [
        {
          value: statistics.totalCompaniesCount,
          label: "Trusted Moroccan companies",
          delay: 0,
        },
        {
          value: statistics.totalApplicants,
          label: "Total of applicants",
          delay: 0.2,
        },
        {
          value: statistics.totalAcceptedApplicants,
          label: "Successful placements",
          delay: 0.1,
        },
      ],
      actionLabel: "View Companies",
      actionLink: "/companies",
      reverseLayout: true,
      bgColor: "bg-background-dark",
    },
    {
      title: "Talented Students Ready for Internships",
      description:
        "Access a diverse pool of Moroccan students eager to start their professional journey with your company.",
      icon: <Users className="w-8 h-8 text-primary" />,
      statistics: [
        {
          value: statistics.totalStudentsCount,
          label: "Registered students",
          delay: 0,
        },
        {
          value: statistics.privatePublicSchoolsCount,
          label: "Private and public schools",
          delay: 0.1,
        },
        {
          value: statistics.universitiesCount,
          label: "Universities",
          delay: 0.2,
        },
      ],
      actionLabel:
        currentUser?.role === Role.STUDENT
          ? "Browse Internships"
          : "Post an Internship",
      actionLink:
        currentUser?.role === Role.STUDENT
          ? "/internships"
          : currentUser?.role === Role.COMPANY
          ? "/post-internship"
          : "/signup/company",
      reverseLayout: false,
      bgColor: "bg-gradient-to-t from-background to-background-dark",
    },
  ];

  return (
    <>
      <section className="py-16 bg-background-dark border-b border-primary-light">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="text-primary font-extrabold">InternHub</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              InternHub connects talented students with leading companies across
              Morocco, creating valuable opportunities for both parties.
            </p>
          </motion.div>
        </div>
      </section>

      <SplitFeatureSection
        title={featureSections[0].title}
        description={featureSections[0].description}
        icon={featureSections[0].icon}
        statistics={featureSections[0].statistics}
        actionLabel={featureSections[0].actionLabel}
        actionLink={featureSections[0].actionLink}
        reverseLayout={featureSections[0].reverseLayout}
        bgColor={featureSections[0].bgColor}
      />

      <AnimatedCounters statistics={statistics} />

      <SplitFeatureSection
        title={featureSections[1].title}
        description={featureSections[1].description}
        icon={featureSections[1].icon}
        statistics={featureSections[1].statistics}
        actionLabel={featureSections[1].actionLabel}
        actionLink={featureSections[1].actionLink}
        reverseLayout={featureSections[1].reverseLayout}
        bgColor={featureSections[1].bgColor}
        noAction={true}
      />

      <InfinitePartnerSlider />

      <SplitFeatureSection
        title={featureSections[2].title}
        description={featureSections[2].description}
        icon={featureSections[2].icon}
        statistics={featureSections[2].statistics}
        actionLabel={featureSections[2].actionLabel}
        actionLink={featureSections[2].actionLink}
        reverseLayout={featureSections[2].reverseLayout}
        bgColor={featureSections[2].bgColor}
      />

      {!currentUser && <EnhancedCallToAction />}
    </>
  );
};

export default FeatureSections;
