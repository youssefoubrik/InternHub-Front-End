import { Building2, Pencil, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import InputField from "../InputField";
import SearchableCombobox from "../SearchableCombobox";
import { DatePicker } from "../DatePicker";
import TextEditor from "../TextEditor";
import { Company, Experience, Role } from "@/types/types";
import { useUser } from "@/context/userContext";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { universitiesSchools } from "@/utils/universities-schools";
import {
  HistoryErrors,
  normalizeExperience,
  validateExperience,
} from "@/lib/validation/studentHistory";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

interface ExperienceInfosProps {
  object: Experience | null;
  setExperiences: Dispatch<SetStateAction<Experience[]>>;
  setWantToAdd: Dispatch<SetStateAction<boolean>>;
  FLAG?: "VIEW" | "EDIT" | "NEW";
}

const ExperienceInfos = ({
  object,
  setExperiences,
  setWantToAdd,
  FLAG = "VIEW",
}: ExperienceInfosProps) => {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [flag, setFlag] = useState<"VIEW" | "EDIT" | "NEW">(FLAG);

  // const initialCompanyState = { name: "", logo: "", address: "" };
  // const initialExperienceState = { poste: "", company: initialCompanyState, startDate: "", endDate: "", description: "" };
  const [experience, setExperience] = useState<Experience>(
    object || ({} as Experience),
  );
  const [errors, setErrors] = useState<HistoryErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const editorId = `experience-${object?.id ?? "new"}`;
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);
  const {
    companies,
    getCompanies,
    createExperience,
    updateExperience,
    deleteExperience,
    isUserProfile,
  } = useUser();

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    if (flag === "EDIT") {
      if (experience?.description) {
        setShowEditor(true);
      }
    }
  }, [flag, experience?.description, experience?.company]);

  useEffect(() => {
    companies.push(
      ...universitiesSchools.map<Company>((school) => ({
        id: school.name,
        name: school.name,
        location: { latitude: 0, longitude: 0 },
        description: "",
        ice: "",
        blocked: false,
        blockedAt: null,
        internships: [],
        links: {},
        tel: "",
        email: "",
        role: Role.COMPANY,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
  }, [companies]);

  const handleSelectCombobox = (value: string) => {
    setExperience({
      ...experience,
      company: value,
    });
    setErrors((current) => ({ ...current, company: undefined }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    const normalized = normalizeExperience(experience);
    const nextErrors = validateExperience(normalized);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSaving(true);
    try {
      let res: Experience;
      if (flag === "NEW") {
        res = await createExperience(normalized);
      } else {
        res = await updateExperience(normalized);
      }
      if (!res) return;
      setExperiences((prev) =>
        flag === "NEW"
          ? [...prev, res]
          : prev.map((item) => (item.id === res.id ? res : item)),
      );
      setExperience(res);
      setFlag("VIEW");
      releaseEditor(editorId);
      if (flag === "NEW") setWantToAdd(false);
    } catch (error) {
      toast.error("Failed to save experience : " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setExperience(object || ({} as Experience));
    setFlag("VIEW");
    setErrors({});
    releaseEditor(editorId);
    if (setWantToAdd) setWantToAdd(false);
  };

  const handleCompanyOptions = (options: Company[]) => [
    ...options,
    ...universitiesSchools.map<Company>((school) => ({
      id: school.name,
      name: school.name,
      location: { latitude: 0, longitude: 0 },
      description: "",
      ice: "",
      blocked: false,
      blockedAt: null,
      internships: [],
      links: {},
      tel: "",
      email: "",
      role: Role.COMPANY,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ];

  return (
    <Accordion
      type="single"
      collapsible={flag === "VIEW" ? true : false}
      defaultValue={flag === "VIEW" ? undefined : "item-1"}
    >
      <AccordionItem
        value="item-1"
        className="border-[2px] divide-y-2 rounded-lg py-1 px-4 overflow-hidden"
      >
        <AccordionTrigger
          className="[&>svg]:hidden min-w-0 focus:ring-0 focus:outline-none hover:no-underline"
          onClick={(e) => {
            if (flag !== "VIEW") {
              e.stopPropagation();
            }
          }}
        >
          <div className="w-full min-w-0 flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            {/* LEFT: Icon + Title/Company */}
            <div className="flex gap-4 justify-start items-center w-full min-w-0">
              <div className="w-14 h-14 flex-shrink-0">
                <Building2 className="w-full h-full" />
              </div>
              <div className="h-full min-w-0 w-full space-y-1 text-start">
                {flag === "VIEW" ? (
                  <>
                    <p className="font-medium">{experience?.poste}</p>
                    <p className="flex font-normal text-gray-700">
                      {experience?.company}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <InputField
                        value={experience?.poste}
                        type="text"
                        placeholder="Title..."
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setExperience({
                            ...experience,
                            poste: e.target.value,
                          });
                          setErrors((current) => ({
                            ...current,
                            poste: undefined,
                          }));
                        }}
                        className="border border-gray-300 focus:bg-gray-100/50 hover:bg-gray-100/50 focus:text-gray-700 hover:text-gray-700 md:max-w-96 w-full"
                      />
                      {errors.poste && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.poste}
                        </p>
                      )}
                      <div className="flex flex-col gap-1 font-normal text-gray-700">
                        <SearchableCombobox
                          defaultValue={experience?.company || ""}
                          options={handleCompanyOptions(companies)}
                          onSelect={handleSelectCombobox}
                          classNameButton="bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 w-full md:max-w-96"
                        />
                        {errors.company && (
                          <p className="text-sm text-red-600" role="alert">
                            {errors.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: Dates + Actions - Direct sibling of LEFT */}
            <div className="flex flex-col gap-4 w-full min-w-0 items-stretch md:w-auto md:items-end md:justify-self-end">
              {flag === "VIEW" ? (
                <>
                  <div className="flex w-full flex-col gap-2 items-stretch md:w-auto md:flex-row md:items-center md:self-end">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {experience?.startDate} - {experience?.endDate}
                    </span>
                    <div className="flex gap-2">
                      {isUserProfile && (
                        <Pencil
                          className="text-primary h-6 w-6 hover:text-primary-hover cursor-pointer"
                          onClick={() => {
                            if (!acquireEditor(editorId)) return;
                            setErrors({});
                            setFlag("EDIT");
                          }}
                        />
                      )}
                      {isUserProfile && (
                        <Trash2
                          className="text-primary h-6 w-6 hover:text-primary-hover cursor-pointer"
                          onClick={() => {
                            deleteExperience(experience);
                            toast.success("Experience deleted successfully");
                            setExperiences((prev) =>
                              prev.filter((exp) => exp?.id !== experience?.id),
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid w-full min-w-0 grid-cols-1 gap-2 md:w-auto md:grid-cols-[minmax(135px,1fr)_auto_minmax(135px,1fr)] md:items-start">
                    <div className="flex min-w-0 flex-col gap-1">
                      <DatePicker
                        value={experience?.startDate}
                        setDateValue={(value: string) => {
                          setExperience({ ...experience, startDate: value });
                          setErrors((current) => ({
                            ...current,
                            startDate: undefined,
                          }));
                        }}
                        className="bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 w-full min-w-0"
                      />
                      {errors.startDate && (
                        <p
                          className="text-sm text-red-600 w-full md:w-auto"
                          role="alert"
                        >
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <span className="self-start md:pt-2">-</span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div
                        className={`flex min-w-0 flex-col gap-2 ${
                          experience?.endDate === "PRESENT"
                            ? "flex-col-reverse"
                            : "flex-col"
                        }`}
                      >
                        <DatePicker
                          value={
                            experience?.endDate === "PRESENT"
                              ? ""
                              : experience?.endDate
                          }
                          setDateValue={(value: string) => {
                            setExperience({ ...experience, endDate: value });
                            setErrors((current) => ({
                              ...current,
                              endDate: undefined,
                            }));
                          }}
                          resetDate={experience?.endDate === "PRESENT"}
                          className="bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 w-full min-w-0"
                        />
                        {errors.endDate && (
                          <p
                            className="text-sm text-red-600 w-full md:w-auto"
                            role="alert"
                          >
                            {errors.endDate}
                          </p>
                        )}
                        <Button
                          variant={"outline"}
                          onClick={() => {
                            setExperience({
                              ...experience,
                              endDate: "PRESENT",
                            });
                            setErrors((current) => ({
                              ...current,
                              endDate: undefined,
                            }));
                          }}
                          className="rounded-md bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 text-black py-2 px-4 font-medium text-sm cursor-pointer w-full md:w-auto"
                        >
                          PRESENT
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 text-base flex flex-col">
          {flag === "VIEW" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: experience?.description || "No description provided",
              }}
            />
          ) : (
            <>
              {showEditor ? (
                <TextEditor
                  value={experience?.description || ""}
                  onChange={(value: string) => {
                    setExperience({ ...experience, description: value });
                    setErrors((current) => ({
                      ...current,
                      description: undefined,
                    }));
                  }}
                  style={{ minHeight: "400px", maxHeight: "900px" }}
                  modules={{ toolbar: true }}
                  className="bg-background w-full h-full"
                />
              ) : (
                <span
                  className="bg-background rounded-lg py-4 w-full h-full text-center cursor-text border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 block"
                  onClick={() => setShowEditor(true)}
                >
                  Click Here to Add Description
                </span>
              )}
              {errors.description && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4 my-2 w-full">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 hover:bg-opacity-90 w-full sm:w-auto"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {flag === "NEW" ? "Save" : "Edit"}
                </button>
                <button
                  className="bg-gray-300 text-black py-2 px-4 rounded opacity-75 hover:bg-gray-400 hover:bg-opacity-60 w-full sm:w-auto"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExperienceInfos;
