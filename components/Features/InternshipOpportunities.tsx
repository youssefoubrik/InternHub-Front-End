"use client";
import { Briefcase } from "lucide-react";
import AnimatedFeatureCard from "./AnimatedFeatureCard";
import FeatureHeader from "./FeatureHeader";
import { motion } from "framer-motion";

interface InternshipOpportunitiesProps {
  statistics: HomeStatistics;
}

const InternshipOpportunities = ({
  statistics,
}: InternshipOpportunitiesProps) => {
  const featureData = {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Diverse Internship Opportunities",
    description:
      "Explore a wide range of internship listings across various domains and industries throughout Morocco.",
    benefits: [
      `${statistics.totalInternshipsCount}+ Active internship listings`,
      `${statistics.remoteInternshipsCount}+ Remote internships`,
      `${statistics.onSiteInternshipsCount}+ On-Site internships`,
    ],
    actionLabel: "Browse Internships",
    actionLink: "/internships",
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background-dark">
      <div className="container mx-auto px-4">
        <FeatureHeader
          title="Find Your Perfect Internship on"
          subtitle="Discover thousands of internship opportunities from leading companies across Morocco"
        />

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedFeatureCard {...featureData} index={0} />
        </motion.div>
      </div>
    </section>
  );
};

export default InternshipOpportunities;
