"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import HeroSection from "@/components/HeroSection";
import FeatureSections from "@/components/Features/FeatureSections";
import { universitiesSchools } from "@/utils/universities-schools";
import BackgroundSquares from "@/components/Home/BackgroundSquares";
import { DEFAULT_DATA_CONSTANTS } from "@/constants/data-constants";



export default function Home() {
    
    const [statistics, setStatistics] = useState<HomeStatistics>(DEFAULT_DATA_CONSTANTS.statistics);

    useEffect(() => {
        async function fetchStatistics() {
            try {
                const [
                    { data: totalCompanies },
                    { data: totalStudents },
                    { data: totalInternships },
                    { data: remoteInternships },
                    { data: onSiteInternships },
                    { data: totalApplicants },
                    { data: totalAcceptedApplicants },
                ] = await Promise.all([
                    axios.get("/companies/count"),
                    axios.get("/students/count"),
                    axios.get("/internships/count"),
                    axios.get("/internships/count/remote"),
                    axios.get("/internships/count/on-site"),
                    axios.get("/applications/count/students"),
                    axios.get("/applications/count/students/ACCEPTED"),
                ]);

                setStatistics({
                    totalCompaniesCount: totalCompanies || 0,
                    totalStudentsCount: totalStudents || 0,
                    totalInternshipsCount: totalInternships || 0,
                    remoteInternshipsCount: remoteInternships || 0,
                    onSiteInternshipsCount: onSiteInternships || 0,
                    privatePublicSchoolsCount: universitiesSchools.filter(
                        (school) => school.type === "school",
                    ).length,
                    universitiesCount: universitiesSchools.filter(
                        (univ) => univ.type === "university",
                    ).length,
                    totalApplicants: totalApplicants || 0,
                    totalAcceptedApplicants: totalAcceptedApplicants || 0,
                });
            } catch (err) {
                toast.error("Failed to fetch statistics", {
                    id: "fetch-statistics",
                });
                console.error("Failed to fetch statistics:", err);
            }
        }

        fetchStatistics();
    }, []);

    return (
        <main className="relative">
            <BackgroundSquares />
            <HeroSection />
            <FeatureSections statistics={statistics} />
        </main>
    );
}
