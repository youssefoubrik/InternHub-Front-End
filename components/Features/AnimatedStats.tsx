"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface AnimatedStatsProps {
  statistics: HomeStatistics;
}

const StatItem = ({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 16)); // Update every 16ms (60fps)

      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="text-4xl md:text-5xl font-bold text-primary mb-2"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: delay + 0.2,
          type: "spring",
          stiffness: 200,
        }}
      >
        {count}+
      </motion.div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
};

const AnimatedStats = ({ statistics }: AnimatedStatsProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-4">Growing Every Day</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our expanding community of students, companies, and internship
            opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <StatItem
            value={statistics.totalInternshipsCount}
            label="Internships"
            delay={0}
          />
          <StatItem
            value={statistics.remoteInternshipsCount}
            label="Remote Positions"
            delay={0.1}
          />
          <StatItem
            value={statistics.onSiteInternshipsCount}
            label="On-Site Positions"
            delay={0.2}
          />
          <StatItem
            value={statistics.totalCompaniesCount}
            label="Companies"
            delay={0.3}
          />
          <StatItem
            value={statistics.totalStudentsCount}
            label="Students"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
