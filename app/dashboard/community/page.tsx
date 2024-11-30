"use client";

import Script from 'next/script'

export default function CommunityPage() {
  return (
    <div className="flex-1 overflow-hidden text-white">
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js" 
        strategy="afterInteractive"
      />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">Community Page</h1>
        <p className="text-gray-400 text-sm">coming soon</p>
      </div>
      
      <div className="h-screen w-full">
        <spline-viewer 
          url="https://prod.spline.design/U9O6K7fXziMEU7Wu/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
