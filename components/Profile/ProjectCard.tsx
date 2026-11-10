"use client";
import React, { useEffect, useState } from "react";
import PlusButton from "../PlusButton";
import ProjectContent from "./ProjectContent";
import { Project } from "@/types/types";
import EditModal from "./EditModal";
import ProjectInfos from "./ProjectInfos";
import toast from "react-hot-toast";
import { useUser } from "@/context/userContext";
import { uploadFile } from "@/lib/storageApi";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

const ProjectCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const { student, createProject, isUserProfile } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newProject, setNewProject] = useState<Project>({} as Project);
  const editorId = "project-new";
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);

  const handleCancel = () => {
    setNewProject({
      id: "",
      title: "",
      image: "",
      link: "",
    });
    setFile(null);
    setIsOpenModal(false);
    releaseEditor(editorId);
  };

  const handleConfirm = async () => {
    const title = newProject?.title?.trim() || "";
    if (!title) {
      toast.error("Please enter a project title");
      return;
    }

    const link = newProject.link?.trim() || "";
    if (link) {
      try {
        const url = new URL(link);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        toast.error("Please enter a valid http or https URL");
        return;
      }
    }

    try {
      const publicUrl = file ? await uploadFile(file) : "";
      const result = await createProject({
        ...newProject,
        title,
        link,
        image: publicUrl,
      });
      if (!result) {
        toast.error("Failed to create project");
        return;
      }
      toast.success("Project created successfully");
      setProjects((previous) => [...previous, result]);
      setIsOpenModal(false);
      releaseEditor(editorId);
      setNewProject({ id: "", title: "", image: "", link: "" });
      setFile(null);
    } catch (error) {
      toast.error("Failed to create project : " + error);
    }
  };

  useEffect(() => {
    if (student?.projects) {
      setProjects(student?.projects);
    }
  }, [student?.projects]);

  return (
    <div className="bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 w-full space-y-7">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-800 font-medium">Projects</h2>
      </div>
      <div
        className={`px-4 gap-6 grid grid-cols-4 ${
          projects.length > 0 ? "grid-cols-1 text-center" : ""
        }`}
      >
        {projects.map((project) => (
          <ProjectContent
            key={project?.id}
            project={project}
            projects={projects}
            setProjects={setProjects}
          />
        ))}
        {projects?.length === 0 && !isUserProfile && (
          <div className="col-span-4 text-center">
            <p className="text-lg text-gray-600">No projects found.</p>
          </div>
        )}
        {isUserProfile && (
          <div className="w-1/2 h-full" onClick={() => {
            if (acquireEditor(editorId)) setIsOpenModal(true);
          }}>
            <PlusButton className="w-full h-full" />
          </div>
        )}
      </div>

      {isUserProfile && (
        <EditModal
          isOpenModal={isOpenModal}
          setIsOpenModal={(open) => {
            if (!open) releaseEditor(editorId);
            setIsOpenModal(open);
          }}
          className="bg-white max-w-xl min-h-[60vh] flex flex-col"
          title="Add New Project"
          titleClassName="text-2xl font-medium"
          cancelButton="Cancel"
          cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
          onCancel={handleCancel}
          confirmButton="Add"
          confirmButtonClassName="bg-primary w-20 text-white hover:bg-primary-hover"
          onConfirm={handleConfirm}
          body={
            <ProjectInfos
              editedProject={newProject}
              updateEditedProject={setNewProject}
              isNewProject={true}
              setFile={setFile}
            />
          }
        />
      )}
    </div>
  );
};

export default ProjectCard;
