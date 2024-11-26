'use client'

import * as React from 'react'
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Search, ChevronDown, Plus, Zap, Pencil, Trash2, Code, X ,SquareTerminal,View} from 'lucide-react'
=======
import { Search, ChevronDown, Plus, Zap, Pencil, Trash2, Code, X } from 'lucide-react'
>>>>>>> origin/M-userauth-functionalities
import { useDispatch, useSelector } from 'react-redux';
import type {RootState} from '@/store/store';
import { addProject } from '@/store/projectSlice';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import tailwind from '@/public/images/tailwind.png'
import { useSession } from "next-auth/react"

interface Project {
  _id: string
  name: string
  technologies: string[]
<<<<<<< HEAD
  finalPrompt?: string
  referenceFile?: string  
=======
>>>>>>> origin/M-userauth-functionalities
}

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<<<<<<< HEAD
      <div className="relative w-[95%] sm:w-full max-w-md rounded-lg bg-[#1C1C1C] p-6">
=======
      <div className="relative w-full max-w-md rounded-lg bg-[#1C1C1C] p-6">
>>>>>>> origin/M-userauth-functionalities
        <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{open: boolean, projectId: string | null}>({
    open: false,
    projectId: null
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const localProjects = useSelector((state: RootState) => state.projects.localProjects);
  const { data: session } = useSession()
  const [filterType, setFilterType] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
<<<<<<< HEAD
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [selectedProjectPrompt, setSelectedProjectPrompt] = useState<string>('');
=======

>>>>>>> origin/M-userauth-functionalities
  // Fetch projects from the server
  useEffect(() => {
    fetchProjects();
  }, [session]);

  // Fetch projects from the server
  const fetchProjects = async() => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/projects?userId=${session.user.id}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  // Delete a project from the server
  const deleteProject = async(id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete project');
      
      // Only update state if delete was successful
      setProjects((prevProjects) => prevProjects.filter(project => project._id !== id));
      setDeleteConfirmation({ open: false, projectId: null });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  // Modify the return statement to combine both API and local projects
  const allProjects = [...projects, ...localProjects];
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
<<<<<<< HEAD
    
    // Updated filter logic
    const matchesTech = (() => {
      switch (filterType) {
        case 'all':
          return true;
        case 'react-tailwind':
          return project.technologies.includes('ReactJS') && 
                 project.technologies.includes('Tailwind CSS');
        case 'html-tailwind':
          return project.technologies.includes('HTML') && 
                 project.technologies.includes('Tailwind CSS');
        default:
          return true;
      }
    })();
=======
    const matchesTech = filterType === 'all' 
      ? true 
      : filterType === 'html-react'
        ? project.technologies.includes('HTML') && project.technologies.includes('ReactJS')
        : project.technologies.includes('HTML') && project.technologies.includes('Tailwind CSS');
>>>>>>> origin/M-userauth-functionalities
    
    return matchesSearch && matchesTech;
  });

  const handleCreateProject = () => {

    if (newProjectName && selectedTech.length > 0) {
      const newProject = {
        _id: Date.now().toString(),
        name: newProjectName,
        technologies: selectedTech,
      };
      dispatch(addProject(newProject));
      setIsCreateModalOpen(false);
      router.push('/chatbot');
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

<<<<<<< HEAD
  // Update the filter options
  const filterOptions = [
    { label: 'All projects', value: 'all' },
    { label: 'ReactJS & Tailwind CSS', value: 'react-tailwind' },
    { label: 'HTML & Tailwind CSS', value: 'html-tailwind' }
  ];

  // Update the filter button UI
  const filterButton = (
    <div className="relative">
      <button 
        className="flex h-10 items-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-white hover:bg-[#2A2A2A]"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span className="text-sm">
          {filterOptions.find(option => option.value === filterType)?.label || 'All projects'}
        </span>
=======
  // Add filter options
  const filterOptions = [
    { label: 'All projects', value: 'all' },
    { label: 'HTML & ReactJS', value: 'html-react' },
    { label: 'HTML & Tailwind', value: 'html-tailwind' },
  ];

  // Replace the existing filter button with this dropdown
  const filterButton = (
    <div className="relative">
      <button 
        className="flex h-10 items-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-white"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {filterOptions.find(option => option.value === filterType)?.label}
>>>>>>> origin/M-userauth-functionalities
        <ChevronDown className="h-4 w-4 text-[#F05D23]" />
      </button>

      {isFilterOpen && (
<<<<<<< HEAD
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#1E1E1E] py-1 shadow-lg z-10 border border-[#2A2A2A]">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-[#2A2A2A] transition-colors
                ${filterType === option.value ? 'text-[#F05D23]' : 'text-white'}`}
=======
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#1E1E1E] py-1 shadow-lg">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className="block w-full px-4 py-2 text-left text-white hover:bg-[#2A2A2A]"
>>>>>>> origin/M-userauth-functionalities
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

<<<<<<< HEAD
  const openPromptModal = (project: Project) => {
    setSelectedProjectPrompt(project.finalPrompt || '');
    setIsPromptModalOpen(true);
  };

  const viewFile = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/file`);
      if (response.status === 500) {
       alert('File not found');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

=======
>>>>>>> origin/M-userauth-functionalities
  return (
    <div className="min-h-screen bg-[#292929] p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Your Projects</h1>
      </div>

<<<<<<< HEAD
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:flex-1">
=======
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="relative flex-1">
>>>>>>> origin/M-userauth-functionalities
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< HEAD
            className="w-full h-10 rounded-md bg-[#1E1E1E] pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-4">
          {filterButton}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-none h-10 items-center gap-2 rounded-md bg-[#F05D23] px-4 text-white hover:bg-[#F05D23]/90 shadow-lg shadow-orange-400/50"
          >
            {/* <Plus className="h-4 w-4" /> */}
            + Create
=======
            className="h-10 rounded-md bg-[#1E1E1E] pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] max-w-7xl"
          />
        </div>

        <div className="flex items-center gap-4">
          {filterButton}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-[#F05D23] px-4 text-white hover:bg-[#F05D23]/90 shadow-lg shadow-orange-400/50"
          >
            <Plus className="h-4 w-4" />
            Create
>>>>>>> origin/M-userauth-functionalities
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
<<<<<<< HEAD
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-[#FF5722]/10 bg-[#1E1E1E] p-5 hover:border-[#FF5722]/50 gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <h3 className="text-lg font-medium text-white">{project.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
=======
              className="flex items-center justify-between rounded-lg border border-[#FF5722]/10 bg-[#1E1E1E] p-5 hover:border-[#FF5722]/50"
            >
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium text-white">{project.name}</h3>
                <div className="flex items-center gap-2">
>>>>>>> origin/M-userauth-functionalities
                  {project.technologies.map((tech:any) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1 rounded bg-[#1C1C1C] px-2 py-1 text-sm text-gray-400"
                    >
                      {tech === 'HTML' && <Code className="h-3 w-3" />}
                      {tech === 'ReactJS' && <div className="text-[#61DAFB]">⚛</div>}
                      {tech === 'Tailwind CSS' && <div className="text-[#38BDF8]"><Image src={tailwind} alt="CatMod AI Logo" width={20} height={20} className="rounded-full" /> </div>}
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => viewFile(project._id)} className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <View className="h-4 w-4 text-[#F05D23]" />
                </button>
                <button 
                  className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white"
                  onClick={() => openPromptModal(project)}
                >
                  <SquareTerminal className="h-4 w-4 text-[#F05D23]" />
                </button>
=======
              <div className="flex items-center gap-2">
>>>>>>> origin/M-userauth-functionalities
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Zap className="h-4 w-4 text-[#F05D23]"  />
                </button>
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Pencil className="h-4 w-4 text-[#F05D23] " />
                </button>
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Trash2 
                    className="h-4 w-4 text-[#F05D23]" 
                    onClick={() => handleDeleteClick(project._id)}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
<<<<<<< HEAD
        
      )}

<Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
        <div className="space-y-4">
          <h2 className="text-center text-white text-2xl font-semibold">Project Prompt</h2>
          <div>
            <textarea
              value={selectedProjectPrompt}
              readOnly
              className="h-48 w-full rounded-md bg-[#2A2A2A] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            />
          </div>
        </div>
      </Dialog>

=======
      )}

>>>>>>> origin/M-userauth-functionalities
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <div className="space-y-4">
          <h2 className="text-center text-white text-2xl font-semibold">To a new beginning</h2>
          <div>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="h-10 w-full rounded-md bg-[#2A2A2A] px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            />
          </div>
          <div className="space-y-2">
            <div className="text-white mb-2">Select Technologies:</div>
            <div className="space-x-2">
              <button
<<<<<<< HEAD
                onClick={() => setSelectedTech(['ReactJS', 'Tailwind CSS'])}
                className={`px-4 py-2 rounded ${
                  selectedTech.join(',') === 'ReactJS,Tailwind CSS' 
=======
                onClick={() => setSelectedTech(['HTML', 'ReactJS'])}
                className={`px-4 py-2 rounded ${
                  selectedTech.join(',') === 'HTML,ReactJS' 
>>>>>>> origin/M-userauth-functionalities
                    ? 'bg-[#F05D23] text-white' 
                    : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
<<<<<<< HEAD
                ReactJS & Tailwind CSS
=======
                HTML & ReactJS
>>>>>>> origin/M-userauth-functionalities
              </button>
              <button
                onClick={() => setSelectedTech(['HTML', 'Tailwind CSS'])}
                className={`px-4 py-2 rounded ${
                  selectedTech.join(',') === 'HTML,Tailwind CSS' 
                    ? 'bg-[#F05D23] text-white' 
                    : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                HTML & Tailwind CSS
              </button>
            </div>
          </div>
          <button
            onClick={handleCreateProject}
            className="mt-4 h-10 w-full rounded-md bg-[#F05D23] font-medium text-white hover:bg-[#F05D23]/90 disabled:opacity-50"
            disabled={!newProjectName || selectedTech.length === 0}
          >
            Create
          </button>
        </div>
      </Dialog>

      <Dialog open={deleteConfirmation.open} onOpenChange={(open) => setDeleteConfirmation({ open, projectId: null })}>
        <div className="space-y-4">
          <h2 className="text-center text-white text-2xl font-semibold">Confirm Delete</h2>
          <p className="text-center text-gray-400">Are you sure you want to delete this project?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setDeleteConfirmation({ open: false, projectId: null })}
              className="px-4 py-2 rounded bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
<<<<<<< HEAD
              className="px-4 py-2 rounded bg-[#F05D23] text-white hover:bg-[#F05D23]/80"
=======
              className="px-4 py-2 rounded bg-[#ff3d3d] text-white hover:bg-[#f01515]/90"
>>>>>>> origin/M-userauth-functionalities
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
<<<<<<< HEAD
      
=======
>>>>>>> origin/M-userauth-functionalities
    </div>
  )
}