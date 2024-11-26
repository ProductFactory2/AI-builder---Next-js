'use client'

import React from 'react';
import { create } from 'zustand';

// Create a store to share state between components
interface PreviewStore {
  selectedDevice: 'desktop' | 'tablet' | 'mobile';
<<<<<<< HEAD
  selectedTemplate: 'template1' | 'template2' | 'template3',
  userId: string | null;
  projectName: string | null;
  setSelectedDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setSelectedTemplate: (template: 'template1' | 'template2' | 'template3') => void
  setProjectInfo: (userId: string, projectName: string) => void;
=======
  setSelectedDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
>>>>>>> origin/M-userauth-functionalities
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  selectedDevice: 'desktop',
<<<<<<< HEAD
  selectedTemplate: 'template1',
  userId: null,
  projectName: null,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template}),
  setProjectInfo: (userId, projectName) => set({ userId, projectName}),
=======
  setSelectedDevice: (device) => set({ selectedDevice: device }),
>>>>>>> origin/M-userauth-functionalities
}));

const deviceDimensions = {
  desktop: { width: '100%', height: 'calc(100vh - 64px)' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' }
};

export default function PreviewDisplay() {
<<<<<<< HEAD
  const {selectedDevice, selectedTemplate, userId, projectName} = usePreviewStore();
  
  const previewUrl = userId && projectName ? `api/preview/${userId}/${projectName}/${selectedTemplate}/index.html`: '';
=======
  const selectedDevice = usePreviewStore((state) => state.selectedDevice);
>>>>>>> origin/M-userauth-functionalities
  
  return (
    <div className="flex justify-center bg-zinc-800 min-h-[calc(100vh-64px)] p-4">
      <div 
        className="bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: deviceDimensions[selectedDevice].width,
          height: deviceDimensions[selectedDevice].height,
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 96px)',
        }}
      >
        <iframe
<<<<<<< HEAD
          src={previewUrl}
=======
          src="/preview-content"
>>>>>>> origin/M-userauth-functionalities
          className="w-full h-full border-0"
          title="Preview Content"
        />
      </div>
    </div>
  );
}