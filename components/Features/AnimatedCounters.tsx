"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Briefcase, Building, Users, Globe, GraduationCap } from "lucide-react";
import { universitiesSchools } from "@/utils/universities-schools";

interface AnimatedCountersProps {
  statistics: HomeStatistics;
}

const CounterItem = ({
  value,
  label,
  icon,
  delay,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
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
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
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
        {icon}
      </motion.div>

      <motion.div
        className="text-4xl font-bold text-primary mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        {count}+
      </motion.div>

      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
};

const AnimatedCounters = ({ statistics }: AnimatedCountersProps) => {
  const counters = [
    {
      value: statistics.totalInternshipsCount,
      label: "Active Internships",
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      delay: 0,
    },
    {
      value: statistics.totalCompaniesCount,
      label: "Partner Companies",
      icon: <Building className="w-8 h-8 text-primary" />,
      delay: 0.1,
    },
    {
      value: statistics.totalStudentsCount,
      label: "Registered Students",
      icon: <Users className="w-8 h-8 text-primary" />,
      delay: 0.2,
    },
    {
      value: statistics.remoteInternshipsCount,
      label: "Remote Opportunities",
      icon: <Globe className="w-8 h-8 text-primary" />,
      delay: 0.3,
    },
    {
      value: universitiesSchools.length,
      label: "Universities & Schools",
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      delay: 0.4,
    },
  ];

  return (
    <section className="py-28 bg-background-dark border-b border-primary-light">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold mb-4">InternHub in Numbers</h2>
          <p className="text-gray-600 max-w-2xl text-base mx-auto">
            Join our growing community of students, companies, and internship
            opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {counters.map((counter, index) => (
            <CounterItem
              key={index}
              value={counter.value}
              label={counter.label}
              icon={counter.icon}
              delay={counter.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedCounters;
