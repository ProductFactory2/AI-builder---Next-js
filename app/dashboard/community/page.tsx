"use client";

import * as React from "react";
import Sidebar from "@/components/dashboard/sidebar";


export default function CommunityPage() {
  return (
    <div className="flex h-screen bg-[#1C1C1C]">
      <Sidebar />
    <main className="flex-1 overflow-auto text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Community Page</h1>
        <p className="text-gray-400 text-sm">coming soon</p>
      </main>
    </div>
  );
}
