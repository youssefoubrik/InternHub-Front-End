"use client";
import FeatureCard from "@/components/Cards/FeatureCard";
import { Briefcase, Building, Users } from "lucide-react";
interface WhyChooseClientProps {
  statistics: HomeStatistics;
}
const WhyChooseClient: React.FC<WhyChooseClientProps> = ({ statistics }) => {
  const generateFeatures = (statistics: HomeStatistics) => [
    {
      icon: <Briefcase className="w-6 h-6 text-primary" />,
      title: "Diverse Internship Opportunities",
      description:
        "Explore a wide range of internship listings across various domains.",
      benefits: [
        `${statistics.totalInternshipsCount}+ Active internship listings`,
        `${statistics.remoteInternshipsCount}+ Remote internships`,
        `${statistics.onSiteInternshipsCount}+ On-Site internships`,
      ],
      actionLabel: "Browse Internships",
      actionLink: "/internships",
    },
    {
      icon: <Building className="w-6 h-6 text-primary" />,
      title: "Leading Moroccan Companies",
      description:
        "Connect with top Moroccan companies offering internships to bright students",
      benefits: [
        `${statistics.totalCompaniesCount}+ Trusted Moroccan companies`,
        "Exclusive internship opportunities",
        "Direct application process for internships",
      ],
      actionLabel: "View Companies",
      actionLink: "/companies",
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Talented Students Ready for Internships",
      description:
        "Access a diverse pool of Moroccan students eager to start their professional",
      benefits: [
        `${statistics.totalStudentsCount}+ Registered students`,
        "Diverse profiles from various fields of study",
        "Students from different schools and universities",
      ],
      actionLabel: "Post an Internship",
      actionLink: "/post-internship",
    },
  ];
  return (
    <section className="py-20 bg-background-dark">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose{" "}
          <span className="text-primary font-extrabold">InternHub</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {generateFeatures(statistics).map((feature, index) => (
            <FeatureCard {...feature} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseClient;
