"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Zap,
  Pencil,
  Trash2,
  Code,
  X,
  SquareTerminal,
  View,
  File,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addProject } from "@/store/projectSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import tailwind from "@/public/images/tailwind.png";
import { useSession } from "next-auth/react";
import { PasswordSetupModal } from "@/components/dashboard/PasswordSetupModal";

interface Project {
  _id: string;
  name: string;
  technologies: string[];
  finalPrompt?: string;
  referenceFile?: string;
}

const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[95%] sm:w-full max-w-md rounded-lg bg-[#1C1C1C] p-6">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};


export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{
    open: boolean;
    projectId: string | null;
  }>({
    open: false,
    projectId: null,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const localProjects = useSelector(
    (state: RootState) => state.projects.localProjects
  );
  const { data: session } = useSession();
  const [filterType, setFilterType] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [selectedProjectPrompt, setSelectedProjectPrompt] =
    useState<string>("");
  const [errorProjectName, setErrorProjectName] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);

  // Add this useEffect to check auth provider
  useEffect(() => {
    const checkAuthProvider = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/user/profile`);
        const userData = await response.json();
        if (userData.authProvider === 'google') {
          setShowPasswordSetup(true);
        }
      }
    };
    checkAuthProvider();
  }, [session]);

  // Add password setup success handler
  const handlePasswordSetupSuccess = () => {
    setShowPasswordSetup(false);
    fetchProjects(); // Refresh projects after password setup
  };

  // Fetch projects from the server
  useEffect(() => {
    fetchProjects();
  }, [session]);

  // Fetch projects from the server
  const fetchProjects = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/projects?userId=${session.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Delete a project from the server
  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      // Only update state if delete was successful
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== id)
      );
      setDeleteConfirmation({ open: false, projectId: null });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Modify the return statement to combine both API and local projects
  const allProjects = [...projects, ...localProjects];
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Updated filter logic
    const matchesTech = (() => {
      switch (filterType) {
        case "all":
          return true;
        case "react-tailwind":
          return (
            project.technologies.includes("ReactJS") &&
            project.technologies.includes("Tailwind CSS")
          );
        case "html-tailwind":
          return (
            project.technologies.includes("HTML") &&
            project.technologies.includes("Tailwind CSS")
          );
        default:
          return true;
      }
    })();
    return matchesSearch && matchesTech;
  });

  const handleCreateProject = async () => {
    const response = await fetch(`/api/projects/${session?.user?.id}`);
    const data = await response.json();
    // if (data.some((project: Project) => project.name === newProjectName)) {
    //   setErrorProjectName(true);
    //   return;
    // }
    const existingProjects = data.map((project:any) => project.name.toLowerCase());
    if (existingProjects.includes(newProjectName.toLowerCase())) {
      setErrorProjectName(true);
      return;
    }
    if (newProjectName.trim().length>0 && selectedTech.length > 0) {
      const newProject = {
        _id: Date.now().toString(),
        name:  newProjectName.replace(/\s+/g, '-'),
        technologies: selectedTech,
        local_name: newProjectName
      };
      dispatch(addProject(newProject));
      setIsCreateModalOpen(false);
      console.log(newProject)
      router.push("/chatbot");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmation({ open: true, projectId: id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.projectId) {
      await deleteProject(deleteConfirmation.projectId);
      setDeleteConfirmation({ open: false, projectId: null });
    }
  };

  // Update the filter options
  const filterOptions = [
    { label: "All projects", value: "all" },
    { label: "ReactJS & Tailwind CSS", value: "react-tailwind" },
    { label: "HTML & Tailwind CSS", value: "html-tailwind" },
  ];

  // Update the filter button UI
  const filterButton = (
    <div className="relative">
      <button
        className="flex h-10 items-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-white hover:bg-[#2A2A2A]"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span className="text-sm">
          {filterOptions.find((option) => option.value === filterType)?.label ||
            "All projects"}
        </span>
        <ChevronDown className="h-4 w-4 text-[#F05D23]" />
      </button>

      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#1E1E1E] py-1 shadow-lg z-10 border border-[#2A2A2A]">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#2A2A2A] transition-colors
                ${
                  filterType === option.value ? "text-[#F05D23]" : "text-white"
                }`}
              onClick={() => {
                setFilterType(option.value);
                setIsFilterOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const openPromptModal = (project: Project) => {
    setSelectedProjectPrompt(project.finalPrompt || "");
    setIsPromptModalOpen(true);
  };

   //show file or image

  const viewFile = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/file`);
      if (response.status === 500) {
        alert("File not found");
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  const navigatePreviewPage = (projectName: string) => {
    console.log("sdasd", projectName);
    router.push(`/preview/${session.user.id}/${projectName.name.trim().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="min-h-screen bg-[#292929] p-6">
      {showPasswordSetup ? (
        <div className="flex items-center justify-center min-h-screen">
          <PasswordSetupModal onPasswordSet={handlePasswordSetupSuccess} />
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Your Projects</h1>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your project"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-md bg-[#1E1E1E] pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              />
              {searchQuery && (
                <X
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
              )}
            </div>

            <div className="flex w-full sm:w-auto items-center gap-4">
              {filterButton}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 sm:flex-none h-10 items-center gap-2 rounded-md bg-[#F05D23] px-4 text-white hover:bg-[#F05D23]/90 shadow-md shadow-orange-400/50"
                // className="flex-1 sm:flex-none h-10 items-center gap-2 rounded-md bg-[#F05D23] px-4 text-white hover:bg-[#F05D23]/90 shadow-lg shadow-orange-400/50"
              >
                {/* <Plus className="h-4 w-4" /> */}+ Create
              </button>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center text-gray-400">
              No projects to display
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-[#FF5722]/10 bg-[#1E1E1E] p-5 hover:border-[#FF5722]/50 gap-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                    <h3 className="text-lg font-medium text-white">
                      {project.name.replace(/-/g, ' ')}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.technologies.map((tech: any) => (
                        <div
                          key={tech}
                          className="flex items-center gap-1 rounded bg-[#1C1C1C] px-2 py-1 text-sm text-gray-400"
                        >
                          {tech === "HTML" && <Code className="h-3 w-3" />}
                          {tech === "ReactJS" && (
                            <div className="text-[#61DAFB]">⚛</div>
                          )}
                          {tech === "Tailwind CSS" && (
                            <div className="text-[#38BDF8]">
                              <Image
                                src={tailwind}
                                alt="CatMod AI Logo"
                                width={20}
                                height={20}
                                className="rounded-full"
                              />{" "}
                            </div>
                          )}
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {project.referenceFile && <button onClick={() => viewFile(project._id)} className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                      <File className="h-4 w-4 text-[#F05D23]" />
                    </button>} 
                    <button
                      className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white relative group"
                      onClick={() => openPromptModal(project)}
                    >
                      <span
                        className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 
               mb-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
                      >
                        Prompt Preview
                      </span>
                      <SquareTerminal className="h-4 w-4 text-[#F05D23]" />
                    </button>
                    <button
                      onClick={() => navigatePreviewPage(project)}
                      className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white relative group"
                    >
                      <View className="h-4 w-4 text-[#F05D23]" />
                      <span
                        className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 
                       mb-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
                      >
                        View Project
                      </span>
                    </button>
                    <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white relative group cursor-not-allowed">
                      <Pencil className="h-4 w-4 text-[#F05D23] " />
                      <span
                        className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 
               mb-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
                      >
                        Coming Soon!
                      </span>
                    </button>

                    <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white relative group">
                      <Trash2
                        className="h-4 w-4 text-[#F05D23]"
                        onClick={() => handleDeleteClick(project._id)}
                      />
                      <span
                        className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 
               mb-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
                      >
                        Delete Project
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
            <div className="space-y-4">
              <h2 className="text-center text-white text-2xl font-semibold">
                Project Prompt
              </h2>
              <div>
                <textarea
                  value={selectedProjectPrompt}
                  readOnly
                  className="h-48 w-full rounded-md bg-[#2A2A2A] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>
            </div>
          </Dialog>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <div className="space-y-4">
              <h2 className="text-center text-white text-2xl font-semibold">
                To a new beginning
              </h2>
              <div>
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="h-10 w-full rounded-md bg-[#2A2A2A] px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>
              {errorProjectName && (
                <p className="text-red-500 text-center">
                  Project name already exists
                </p>
              )}
              <div className="space-y-2">
                <div className="text-white mb-2">Select Technologies:</div>
                <div className="flex space-x-2 ">
                  <div className="relative group">
                    <button
                      disabled={true}
                      onClick={() => setSelectedTech(["ReactJS", "Tailwind CSS"])}
                      className={`pl-4 pr-2 py-2 rounded cursor-not-allowed after:content-['Coming Soon']  ${
                        selectedTech.join(",") === "ReactJS,Tailwind CSS"
                          ? "bg-[#F05D23] text-white"
                          : "bg-[#2A2A2A] text-gray-400"
                      }`}
                    >
                      ReactJS & Tailwind CSS
                    </button>
                    <span
                      className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 
               mb-2 px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
                    >
                      Coming Soon!
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTech(["HTML", "Tailwind CSS"])}
                    className={`pl-4 pr-2 py-2 rounded ${
                      selectedTech.join(",") === "HTML,Tailwind CSS"
                        ? "bg-[#F05D23] text-white"
                        : "bg-[#2A2A2A] text-gray-400"
                    }`}
                  >
                    HTML & Tailwind CSS
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreateProject}
                className="mt-4 h-10 w-full rounded-md bg-[#F05D23] font-medium text-white hover:bg-[#F05D23]/90 disabled:opacity-50"
                disabled={!newProjectName || newProjectName.trim().length == 0 || selectedTech.length === 0}
              >
                Create
              </button>
            </div>
          </Dialog>

          <Dialog
            open={deleteConfirmation.open}
            onOpenChange={(open) =>
              setDeleteConfirmation({ open, projectId: null })
            }
          >
            <div className="space-y-4">
              <h2 className="text-center text-white text-2xl font-semibold">
                Confirm Delete
              </h2>
              <p className="text-center text-gray-400">
                Are you sure you want to delete this project?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() =>
                    setDeleteConfirmation({ open: false, projectId: null })
                  }
                  className="px-4 py-2 rounded bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded bg-[#F05D23] text-white hover:bg-[#F05D23]/80"
                >
                  Delete
                </button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
}
