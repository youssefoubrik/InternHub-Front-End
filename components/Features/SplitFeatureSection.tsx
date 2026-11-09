"use client";
import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import "@/styles/inclined-line.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MotionLink = motion(Link);

interface StatisticItemProps {
  value: number;
  label: string;
  delay: number;
}

interface SplitFeatureSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  statistics: StatisticItemProps[];
  actionLabel: string;
  actionLink: string;
  reverseLayout?: boolean;
  bgColor?: string;
  noAction?: boolean;
}

const StatisticItem = ({ value, label, delay }: StatisticItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <CheckCircleIcon className="w-7 h-7 text-green-500 flex-shrink-0" />
      <div className="text-center">
        <motion.span
          className="font-bold text-primary text-2xl mr-2"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + 0.2,
            type: "spring",
            stiffness: 200,
          }}
        >
          {isInView ? value : 0}+
        </motion.span>
        <span className="text-xl">{label}</span>
      </div>
    </motion.div>
  );
};

const SplitFeatureSection = ({
  title,
  description,
  icon,
  statistics,
  actionLabel,
  actionLink,
  reverseLayout = false,
  bgColor = "bg-background",
  noAction = false,
}: SplitFeatureSectionProps) => {
  const router = useRouter();

  return (
    <section className={`${bgColor}`}>
      <div>
        <div
          className={`flex flex-col items-center py-28 px-14 ${
            reverseLayout ? "md:flex-row-reverse" : "md:flex-row"
          } items-center gap-10 border-b border-primary-light`}
        >
          {/* Left side - Text content */}
          <motion.div
            className="md:w-[60%]"
            initial={{ opacity: 0, x: reverseLayout ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {icon}
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
            </div>

            <motion.p
              className="text-xl text-center text-pretty text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {description}
            </motion.p>
            {!noAction && (
              <div className="flex justify-center">
                <motion.a
                  href={actionLink}
                  className="inline-block bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {actionLabel}
                </motion.a>
              </div>
            )}
          </motion.div>

          {/* Right side - Statistics (without card) */}
          <motion.div
            className="md:w-1/2 flex flex-col items-center text-center"
            initial={{ opacity: 0, x: reverseLayout ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mx-auto space-y-16">
              {statistics.map((stat, index) => (
                <StatisticItem
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SplitFeatureSection;
