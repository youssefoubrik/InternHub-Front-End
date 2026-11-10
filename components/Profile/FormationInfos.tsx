import { Dot, Pencil, School, Trash2 } from "lucide-react";
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
import { Formation } from "@/types/types";
import { useUser } from "@/context/userContext";
import toast from "react-hot-toast";
import { universitiesSchools } from "@/utils/universities-schools";
import {
  HistoryErrors,
  normalizeFormation,
  validateFormation,
} from "@/lib/validation/studentHistory";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

interface FormationInfosProps {
  object: Formation | null;
  setFormations: Dispatch<SetStateAction<Formation[]>>;
  setWantToAdd: Dispatch<SetStateAction<boolean>>;
  FLAG: "VIEW" | "EDIT" | "NEW";
}

const FormationInfos = ({
  object,
  setFormations,
  setWantToAdd,
  FLAG = "VIEW",
}: FormationInfosProps) => {
  // const [ showEditor , setShowEditor ] = useState<boolean>(false);
  const [flag, setFlag] = useState<"VIEW" | "EDIT" | "NEW">(FLAG);

  // const [isOpen, setIsOpen] = useState<boolean>(FLAG !== "VIEW");
  // const initialCompanyState = { name: "", logo: "", address: "" };
  // const initialFormationState = { domain: "", company: initialCompanyState, startDate: "", endDate: "", diploma: "" };
  const [formation, setFormation] = useState<Formation>(
    object || ({} as Formation),
  );
  const [errors, setErrors] = useState<HistoryErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const editorId = `formation-${object?.id ?? "new"}`;
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);
  const { createFormation, updateFormation, deleteFormation, isUserProfile } =
    useUser();

  const handleSelectCombobox = (value: string) => {
    setFormation({
      ...formation,
      company: value,
    });
    setErrors((current) => ({ ...current, company: undefined }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    const normalized = normalizeFormation(formation);
    const nextErrors = validateFormation(normalized);
    // Description length validation (50-1000 chars) - if Formation has description field
    // Note: Formation type doesn't have description in current types, but keeping for consistency
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSaving(true);
    try {
      let res: Formation;
      if (flag === "NEW") {
        res = await createFormation(normalized);
      } else {
        res = await updateFormation(normalized);
      }
      if (!res) return;
      setFormations((prev) =>
        flag === "NEW"
          ? [...prev, res]
          : prev.map((item) => (item.id === res.id ? res : item)),
      );
      setFormation(res);
      setFlag("VIEW");
      releaseEditor(editorId);
      if (flag === "NEW") setWantToAdd(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save formation",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormation(object || ({} as Formation));
    setFlag("VIEW");
    releaseEditor(editorId);
    if (setWantToAdd) setWantToAdd(false);
  };

  console.log("formation : ", formation);

  return (
    <Accordion type="single">
      <AccordionItem
        value="item-1"
        className="border-[2px] divide-y-2 rounded-lg py-1 px-4 overflow-hidden"
      >
        <AccordionTrigger
          className="[&>svg]:hidden min-w-0 flex flex-col gap-4 focus:ring-0 focus:outline-none hover:no-underline"
          onClick={(e) => {
            if (flag !== "VIEW") {
              e.stopPropagation();
            }
          }}
        >
          <div className="w-full min-w-0 flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="flex gap-4 justify-center items-center w-full min-w-0">
              <div className="w-14 h-14 flex-shrink-0">
                <School className="w-full h-full" />
              </div>
              <div className="h-full min-w-0 space-y-1 text-start w-full">
                {flag === "VIEW" ? (
                  <>
                    <p className="font-medium">{formation?.company}</p>
                    <p className="flex font-normal text-gray-700">
                      {formation?.domain} <Dot width={17} />{" "}
                      {formation?.diploma}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 font-normal text-gray-700 w-full">
                      <SearchableCombobox
                        defaultValue={formation?.company ?? ""}
                        options={universitiesSchools}
                        onSelect={handleSelectCombobox}
                        classNameButton="bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 w-full"
                      />
                      {errors.company && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.company}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                      <InputField
                        value={formation?.domain}
                        type="text"
                        placeholder="Domain..."
                        className="border border-gray-300 focus:bg-gray-100/50 hover:bg-gray-100/50 focus:text-gray-700 hover:text-gray-700 w-full md:flex-1"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFormation({
                            ...formation,
                            domain: e.target.value,
                          });
                          setErrors((current) => ({
                            ...current,
                            domain: undefined,
                          }));
                        }}
                      />
                      {errors.domain && (
                        <p
                          className="text-sm text-red-600 w-full md:hidden"
                          role="alert"
                        >
                          {errors.domain}
                        </p>
                      )}
                      <Dot width={17} className="md:block hidden" />
                      <InputField
                        value={formation?.diploma}
                        type="text"
                        placeholder="Diploma..."
                        className="border border-gray-300 focus:bg-gray-100/50 hover:bg-gray-100/50 focus:text-gray-700 hover:text-gray-700 w-full md:flex-1"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFormation({
                            ...formation,
                            diploma: e.target.value,
                          });
                          setErrors((current) => ({
                            ...current,
                            diploma: undefined,
                          }));
                        }}
                      />
                      {errors.diploma && (
                        <p
                          className="text-sm text-red-600 w-full md:hidden"
                          role="alert"
                        >
                          {errors.diploma}
                        </p>
                      )}
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      {errors.domain && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.domain}
                        </p>
                      )}
                      {errors.diploma && (
                        <p className="text-sm text-red-600" role="alert">
                          {errors.diploma}
                        </p>
                      )}
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
                      {formation?.startDate} - {formation?.endDate}
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
                            deleteFormation(formation);
                            toast.success("Formation deleted successfully");
                            setFormations((prev) =>
                              prev.filter((exp) => exp.id !== formation.id),
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
                        value={formation?.startDate}
                        setDateValue={(value: string) => {
                          setFormation({ ...formation, startDate: value });
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
                          formation?.endDate === "PRESENT"
                            ? "flex-col-reverse"
                            : "flex-col"
                        }`}
                      >
                        <DatePicker
                          value={
                            formation?.endDate === "PRESENT"
                              ? ""
                              : formation?.endDate
                          }
                          setDateValue={(value: string) => {
                            setFormation({ ...formation, endDate: value });
                            setErrors((current) => ({
                              ...current,
                              endDate: undefined,
                            }));
                          }}
                          resetDate={formation?.endDate === "PRESENT"}
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
                        <div
                          onClick={() => {
                            setFormation({ ...formation, endDate: "PRESENT" });
                            setErrors((current) => ({
                              ...current,
                              endDate: undefined,
                            }));
                          }}
                          className="rounded-md bg-background border border-gray-300 hover:bg-gray-100/50 hover:text-gray-700 text-black py-2 px-4 font-medium text-sm cursor-pointer w-full md:w-auto"
                        >
                          PRESENT
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {flag !== "VIEW" && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
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
          )}
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  );
};

export default FormationInfos;
