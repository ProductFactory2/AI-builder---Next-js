import { useState, useEffect } from 'react';

export default function ProjectPreview() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'

  // Fetch list of available projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/preview');
        const data = await response.json();
        
        if (response.ok) {
          setProjects(data.projects);
          // Select the first project by default if available
          if (data.projects.length > 0) {
            setSelectedProject(data.projects[0]);
          }
        } else {
          throw new Error(data.error || 'Failed to fetch projects');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (projectName) => {
    setSelectedProject(projectName);
  };

  // Function to refresh iframe content
  const refreshPreview = () => {
    const iframe = document.getElementById('preview-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Project Preview</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
            <button
              onClick={refreshPreview}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Refresh Preview"
            >
              Refresh
            </button>
          </div>
        </div>
        
        <a
          href={`/api/preview/${selectedProject}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open in New Tab
        </a>
      </div>

      {/* Preview Container */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-white">
        <div className={`relative w-full ${
          viewMode === 'mobile' ? 'pb-[177.78%]' : 'pb-[56.25%]'
        }`}>
          {selectedProject && (
            <iframe
              id="preview-iframe"
              src={`/api/preview/${selectedProject}`}
              className={`absolute top-0 left-0 h-full border-0 ${
                viewMode === 'mobile' ? 'w-[375px] mx-auto right-0' : 'w-full'
              }`}
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
            />
          )}
        </div>
      </div>

      {/* Device Preview Buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setViewMode('desktop')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'desktop' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Desktop
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'mobile' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Mobile
        </button>
      </div>
    </div>
  );
}