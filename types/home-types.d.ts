declare global {
    interface SquareProps {
        size: number;
        top: number;
        left: number;
        color: string;
        delay: number;
        duration: number;
        rotation?: number;
        blur?: number;
    }

    interface HomeStatistics {
        totalInternshipsCount: number;
        remoteInternshipsCount: number;
        onSiteInternshipsCount: number;
        totalCompaniesCount: number;
        totalStudentsCount: number;
        privatePublicSchoolsCount: number;
        universitiesCount: number; 
        totalApplicants: number;
        totalAcceptedApplicants: number;
    }
}

export {};