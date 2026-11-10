import { DataTable } from "@/components/Applications/application-table";
import { useInternship } from "@/context/internshipContext";
import { StudentApplicationsColumns } from "./StudentApplicationsColumns";

interface StudentApplicationsProps {
  internshipTitle?: string;
}

const StudentApplications = ({ internshipTitle }: StudentApplicationsProps) => {
  const { applications } = useInternship();
  const columns = StudentApplicationsColumns;
  const internshipOptions = Array.from(
    new Map(
      applications.map((application) => [
        application.internshipResponse.id,
        application.internshipResponse,
      ]),
    ).values(),
  );

  return (
    <div className="py-10 px-14">
      <h3 className="header mb-4">Recent Applications</h3>

      <DataTable
        columns={columns}
        data={applications}
        defaultInternship={internshipTitle}
        internshipOptions={internshipOptions}
        hiddenEmailInput={true}
      />
    </div>
  );
};

export default StudentApplications;
