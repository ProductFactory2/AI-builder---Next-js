import { useState } from 'react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleDirectoryChange = async (e) => {
    const items = Array.from(e.target.files);
    
    // Create a tree structure of the files
    const fileTree = items.reduce((tree, file) => {
      const relativePath = file.webkitRelativePath;
      const pathParts = relativePath.split('/');
      
      // First part is the root directory name
      if (!projectName && pathParts[0]) {
        setProjectName(pathParts[0]);
      }
      
      return [...tree, {
        file,
        path: relativePath,
        relativePath: pathParts.slice(1).join('/') // Remove root dir from path
      }];
    }, []);

    setFiles(fileTree);
    setStatus(`Selected ${items.length} files from directory`);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.length) {
      setError('Please select a directory to upload');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading project directory...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('projectName', projectName);
      
      // Append files and paths separately
      files.forEach((fileInfo) => {
        formData.append('files', fileInfo.file);
        formData.append('paths', fileInfo.relativePath);
      });

      console.log('Uploading files:', files.map(f => f.relativePath));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Successfully uploaded project with ${files.length} files!`);
        setFiles([]);
        setProjectName('');
        // Reset the file input
        e.target.reset();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload directory');
      setStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Upload Project Directory to MongoDB Atlas
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Project Directory
          </label>
          <input 
            type="file"
            onChange={handleDirectoryChange}
            webkitdirectory="true"
            directory="true"
            multiple
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer 
              focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={!files.length || isUploading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-colors duration-300 
            ${files.length && !isUploading 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Project'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 rounded-lg text-center 
          ${status.includes('Successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
          }`}
        >
          {status}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <h2 className="font-semibold mb-2 text-lg">Selected Files:</h2>
          <div className="text-sm mb-3 text-gray-600">
            Project: {projectName}
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((fileInfo, index) => (
              <li 
                key={index} 
                className="flex flex-col text-sm bg-white p-2 rounded"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{fileInfo.relativePath}</span>
                  <span>{(fileInfo.file.size / 1024).toFixed(2)} KB</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}