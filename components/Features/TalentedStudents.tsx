"use client";
import { Users } from "lucide-react";
import AnimatedFeatureCard from "./AnimatedFeatureCard";
import FeatureHeader from "./FeatureHeader";
import { motion } from "framer-motion";

interface TalentedStudentsProps {
  statistics: HomeStatistics;
}

const TalentedStudents = ({ statistics }: TalentedStudentsProps) => {
  const featureData = {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Talented Students Ready for Internships",
    description:
      "Access a diverse pool of Moroccan students eager to start their professional journey with your company.",
    benefits: [
      `${statistics.totalStudentsCount}+ Registered students`,
      "Diverse profiles from various fields of study",
      "Students from different schools and universities",
    ],
    actionLabel: "Post an Internship",
    actionLink: "/post-internship",
  };

  return (
    <section className="py-20 bg-gradient-to-t from-background to-background-dark">
      <div className="container mx-auto px-4">
        <FeatureHeader 
          title="Find Talented Students on"
          subtitle="Connect with thousands of motivated students looking for internship opportunities"
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

export default TalentedStudents;
