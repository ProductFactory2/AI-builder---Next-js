"use client";

import * as React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import ProjectListings from "@/components/dashboard/projectListings";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#1C1C1C]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProjectListings />
      </main>
    </div>
  );
}
