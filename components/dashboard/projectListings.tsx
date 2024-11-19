'use client'

import * as React from 'react'
import { useEffect, useState } from "react";
import { Search, ChevronDown, Plus, Zap, Pencil, Trash2, Code, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import type {RootState} from '@/store/store';
import { addProject } from '@/store/projectSlice';
import { useRouter } from 'next/navigation';

interface Project {
  _id: string
  name: string
  technologies: string[]
}

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-[#1C1C1C] p-6">
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
  const dispatch = useDispatch();
  const router = useRouter();
  const localProjects = useSelector((state: RootState) => state.projects.localProjects);

  // Fetch projects from the server
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from the server
  const fetchProjects = async() =>{
    const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      console.log(data);
      setProjects(data);
  }

  // Delete a project from the server
  const deleteProject = async(id: string) =>{
    console.log("Deleting project with ID:", id);
    const response = await fetch(`/api/projects/${id}`,{
        method: 'DELETE',
      });
    if (!response.ok) throw new Error('Failed to delete project');
    setProjects((prevProjects) => prevProjects.filter(project => project._id !== id));
  }

  // Modify the return statement to combine both API and local projects
  const allProjects = [...projects, ...localProjects];
  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-[#292929] p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Your Projects</h1>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-md bg-[#1E1E1E] pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5722] max-w-7xl"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="flex h-10 items-center gap-2 rounded-md bg-[#1E1E1E] px-4 text-white">
            All projects
            <ChevronDown className="h-4 w-4 text-[#F05D23]" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-[#F05D23] px-4 text-white hover:bg-[#F05D23]/90 shadow-lg shadow-orange-400/50"
          >
            <Plus className="h-4 w-4" />
            Create
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
              className="flex items-center justify-between rounded-lg border border-[#FF5722]/10 bg-[#1E1E1E] p-5 hover:border-[#FF5722]/50"
            >
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-medium text-white">{project.name}</h3>
                <div className="flex items-center gap-2">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1 rounded bg-[#1C1C1C] px-2 py-1 text-sm text-gray-400"
                    >
                      {tech === 'HTML' && <Code className="h-3 w-3" />}
                      {tech === 'ReactJS' && <div className="text-[#61DAFB]">⚛</div>}
                      {tech === 'Tailwind CSS' && <div className="text-[#38BDF8]">🌊</div>}
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Zap className="h-4 w-4 text-[#F05D23]"  />
                </button>
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Pencil className="h-4 w-4 text-[#F05D23] " />
                </button>
                <button className="rounded-md p-2 text-gray-400 hover:bg-[#1C1C1C] hover:text-white">
                  <Trash2 
                    className="h-4 w-4 text-[#F05D23]" 
                    onClick={() => deleteProject(project._id)}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                onClick={() => setSelectedTech(['HTML', 'ReactJS'])}
                className={`px-4 py-2 rounded ${
                  selectedTech.join(',') === 'HTML,ReactJS' 
                    ? 'bg-[#F05D23] text-white' 
                    : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                HTML & ReactJS
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
    </div>
  )
}