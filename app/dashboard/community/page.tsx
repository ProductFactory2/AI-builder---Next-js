"use client";

import * as React from "react";
import Sidebar from "@/components/dashboard/sidebar";


export default function CommunityPage() {
  return (
    <div className="flex h-screen bg-[#1C1C1C]">
      <Sidebar />
    <main className="flex-1 overflow-auto text-white">
        community
      </main>
    </div>
  );
}