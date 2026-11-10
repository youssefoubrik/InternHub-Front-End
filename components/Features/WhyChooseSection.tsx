"use client";
import InternshipOpportunities from "./InternshipOpportunities";
import MoroccanCompanies from "./MoroccanCompanies";
import TalentedStudents from "./TalentedStudents";
import AnimatedStats from "./AnimatedStats";
import CallToAction from "./CallToAction";
import AnimatedDivider from "./AnimatedDivider";
import { motion } from "framer-motion";

interface WhyChooseSectionProps {
  statistics: HomeStatistics;
}

const WhyChooseSection = ({ statistics }: WhyChooseSectionProps) => {
  return (
    <>
      <section className="py-16 bg-background-dark">
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

      <InternshipOpportunities statistics={statistics} />
      <AnimatedDivider />
      <AnimatedStats statistics={statistics} />
      <AnimatedDivider color="chart-1" />
      <MoroccanCompanies statistics={statistics} />
      <AnimatedDivider color="chart-2" />
      <TalentedStudents statistics={statistics} />
      <AnimatedDivider color="chart-3" />
      <CallToAction />
    </>
  );
};

export default WhyChooseSection;
