"use client";

import Script from 'next/script'

export default function CommunityPage() {
  return (
    <div className="flex-1 overflow-auto text-white flex flex-col items-center justify-center p-10">
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js" 
        strategy="afterInteractive"
      />
      
      <h1 className="text-2xl font-bold text-red-500">Community Page</h1>
      <p className="text-gray-400 text-sm">coming soon</p>
      
      {/* @ts-ignore */}
      <spline-viewer url="https://prod.spline.design/U9O6K7fXziMEU7Wu/scene.splinecode" />
    </div>
  );
}
