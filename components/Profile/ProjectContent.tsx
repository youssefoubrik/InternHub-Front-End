"use client";
import React, { useEffect, useRef, useState } from "react";
import { Eye, FolderOpenDot, ImageIcon, Link, Info } from "lucide-react";
import Overlay from "../Overlay";
import EditModal from "./EditModal";
import InputField from "../InputField";
import { Project, Role } from "@/types/types";
import toast from "react-hot-toast";
import CustomTooltip from "./CustomTooltip";
import ProjectInfos from "./ProjectInfos";
import { useUser } from "@/context/userContext";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";
import {
  deleteFile,
  uploadFile,
} from "@/lib/storageApi";

interface ProjectContentProps {
  project: Project;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  project,
  projects,
  setProjects,
}) => {
  const { updateProject, deleteProject, isUserProfile } = useUser();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({} as Project);
  const [file, setFile] = useState<File | null>(null);
  const editorId = `project-${project.id}`;
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);
  const releaseEditor = useProfileEditLockStore((state) => state.release);

  const handleCancel = () => {
    setEditedProject(project);
    setFile(null);
    setIsOpenModal(false);
    releaseEditor(editorId);
  };

  const handleConfirm = async () => {
    const title = editedProject?.title?.trim() || "";
    if (!title) {
      toast.error("Please enter a project title");
      return;
    }

    const link = editedProject.link?.trim() || "";
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
      const previousImage = editedProject.image;
      const image = file ? await uploadFile(file) : previousImage;
      const updatedProject = await updateProject({ ...editedProject, title, image, link });
      if (!updatedProject) {
        toast.error("Failed to update project");
        return;
      }
      if (file && previousImage) await deleteFile(previousImage);

      setEditedProject(updatedProject);
      setProjects((current) =>
        current.map((item) => item.id === updatedProject.id ? updatedProject : item)
      );
      setFile(null);
      setIsOpenModal(false);
      releaseEditor(editorId);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project : " + error);
    }
  };

  const getFullUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const handleDelete = async () => {
    try {
      // Extract the filename from the URL
      // Delete from database
      await deleteProject(project);
      await deleteFile(project.image);

      // Update state
      setProjects((current) => current.filter((p) => p.id !== project.id));

      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  useEffect(() => {
    console.log("project : ", project);
    setEditedProject(project);
  }, [project]);

  return (
    <div className="rounded-lg flex flex-col justify-between border shadow-md hover:scale-105 transition-all duration-300">
      <div className="relative overflow-hidden w-full rounded-t-lg border-b-gray-300 border-[1px] group">
        {project?.link ? (
          <a href={getFullUrl(project.link)} target="_blank" rel="noopener noreferrer">
            {project?.image ? (
              <img
                src={project.image}
                alt="Thumbnail"
                className="w-full h-40 object-cover group-hover:rotate-2 group-hover:scale-110 duration-100 ease-in cursor-pointer"
              />
            ) : (
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
            <Overlay children={<Eye className="w-14 h-14 text-primary-hover" />} />
          </a>
        ) : (
          <div>
            {project?.image ? (
            <img
              src={project.image}
              alt="Thumbnail"
              className="w-full h-40 object-cover"
            />
            ) : (
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-base font-medium text-start px-2 mt-4 mb-6">
        {project?.title}
      </div>

      {isUserProfile && (
        <div className="flex w-full font-medium text-primary divide-x-2 divide-primary-hover text-center border-t-primary-hover border-t-[2px]">
          <div
            className="w-full rounded-bl-lg py-2 cursor-pointer hover:bg-primary hover:text-white"
            onClick={() => {
              if (acquireEditor(editorId)) setIsOpenModal(true);
            }}
          >
            Edit
          </div>
          <div
            className="w-full rounded-br-lg py-2 cursor-pointer hover:bg-primary hover:text-white"
            onClick={handleDelete}
          >
            Delete
          </div>
        </div>
      )}
      <EditModal
        isOpenModal={isOpenModal}
        setIsOpenModal={(open) => {
          if (!open) releaseEditor(editorId);
          setIsOpenModal(open);
        }}
        className="bg-white max-w-xl min-h-[60vh] flex flex-col"
        title="Edit Project"
        titleClassName="text-2xl font-medium"
        cancelButton="Cancel"
        cancelButtonClassName="bg-gray-200 text-black hover:bg-gray-300"
        onCancel={handleCancel}
        confirmButton="Edit"
        confirmButtonClassName="bg-primary w-20 text-white hover:bg-primary-hover"
        onConfirm={handleConfirm}
        body={
          <ProjectInfos
            editedProject={editedProject}
            updateEditedProject={setEditedProject}
            setFile={setFile}
          />
        }
      />
    </div>
  );
};

export default ProjectContent;
