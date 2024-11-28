'use client'

import React from 'react';
import { create } from 'zustand';

// Create a store to share state between components
interface PreviewStore {
  selectedDevice: 'desktop' | 'tablet' | 'mobile';
  selectedTemplate: 'template1' | 'template2' | 'template3',
  userId: string | null;
  projectName: string | null;
  isTemplateSelected: boolean;
  setSelectedDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setSelectedTemplate: (template: 'template1' | 'template2' | 'template3') => void
  setProjectInfo: (userId: string, projectName: string) => void;
  setTemplateSelected: (selected: boolean) => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  selectedDevice: 'desktop',
  selectedTemplate: 'template1',
  userId: null,
  projectName: null,
  isTemplateSelected: false,
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template}),
  setProjectInfo: (userId, projectName) => set({ userId, projectName}),
  setTemplateSelected: (selected) => set({ isTemplateSelected:selected})
}));

const deviceDimensions = {
  desktop: { width: '100%', height: 'calc(100vh - 64px)' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' }
};

export default function PreviewDisplay() {
  const {selectedDevice, selectedTemplate, userId, projectName} = usePreviewStore();
  
  const previewUrl = userId && projectName ? `/api/preview/${userId}/${projectName}/${selectedTemplate}/index.html`: '';
  
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
          src={previewUrl}
          className="w-full h-full border-0"
          title="Preview Content"
        />
      </div>
    </div>
  );
}