"use client";
import { Building } from "lucide-react";
import AnimatedFeatureCard from "./AnimatedFeatureCard";
import FeatureHeader from "./FeatureHeader";
import { motion } from "framer-motion";

interface MoroccanCompaniesProps {
  statistics: HomeStatistics;
}

const MoroccanCompanies = ({ statistics }: MoroccanCompaniesProps) => {
  const featureData = {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: "Leading Moroccan Companies",
    description:
      "Connect with top Moroccan companies offering valuable internships to bright and motivated students.",
    benefits: [
      `${statistics.totalCompaniesCount}+ Trusted Moroccan companies`,
      "Exclusive internship opportunities",
      "Direct application process for internships",
    ],
    actionLabel: "View Companies",
    actionLink: "/companies",
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FeatureHeader
          title="Partner with Top Companies on"
          subtitle="Join hundreds of leading Moroccan companies looking for talented interns"
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

export default MoroccanCompanies;
