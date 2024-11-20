'use client'
import { useState } from 'react'
import { Laptop, Smartphone, Tablet, ArrowLeft, ChevronDown } from 'lucide-react'
import Image from "next/image"
import logo from '@/public/assets/images/logo.png'
import { usePreviewStore } from './previewDisplay'

export default function PreviewNav() {
  const { selectedDevice, setSelectedDevice } = usePreviewStore();
  const [selectedTemplate, setSelectedTemplate] = useState('Template 01')

  return (
    <div className="flex h-16 items-center justify-between bg-zinc-900 px-4">
      <div className="flex items-center gap-4">
        <Image
          src={logo}
          alt="Logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="relative group">
          <button
            className="flex items-center justify-between w-[180px] px-3 py-2 text-white bg-transparent border border-orange-500 rounded-md"
          >
            <span>{selectedTemplate}</span>
            <ChevronDown className="h-4 w-4 text-orange-500" />
          </button>
          <div className="absolute top-full left-0 w-[180px] mt-1 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg hidden group-hover:block">
            {['Template 01', 'Template 02', 'Template 03'].map((template) => (
              <button
                key={template}
                className="block w-full px-3 py-2 text-left text-white hover:bg-zinc-700"
                onClick={() => setSelectedTemplate(template)}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
          <button
            key={device}
            className={`p-2 rounded-md ${selectedDevice === device ? 'text-orange-500' : 'text-gray-400'}`}
            onClick={() => setSelectedDevice(device)}
          >
            {device === 'desktop' && <Laptop className="h-5 w-5" />}
            {device === 'tablet' && <Tablet className="h-5 w-5" />}
            {device === 'mobile' && <Smartphone className="h-5 w-5" />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          Confirm
        </button>
        <button className="p-2 text-orange-500">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}