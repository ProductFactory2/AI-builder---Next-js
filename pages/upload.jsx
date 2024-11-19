import { useState } from 'react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setStatus(`Selected ${selectedFiles.length} files`);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.length) {
      setError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading...');
    setError('');

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Successfully uploaded ${files.length} files to MongoDB!`);
        setFiles([]);
        // Reset the file input
        e.target.reset();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload files');
      setStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Upload Files to MongoDB Atlas
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Files to Upload
          </label>
          <input 
            type="file" 
            onChange={handleFileChange}
            multiple
            className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer 
              focus:outline-none focus:border-blue-500"
            accept=".html,.css,.js,.json,.txt,.xml"
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
          {isUploading ? 'Uploading...' : 'Upload to MongoDB'}
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
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li 
                key={index} 
                className="flex justify-between text-sm bg-white p-2 rounded"
              >
                <span>{file.name}</span>
                <span>{(file.size / 1024).toFixed(2)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}