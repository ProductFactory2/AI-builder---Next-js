"use client";

import { Laptop, Smartphone, Tablet, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "@/public/assets/images/logo.png";
import { usePreviewStore } from "./previewDisplay";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PreviewNav() {
  const { push } = useRouter();

  const {
    selectedDevice,
    selectedTemplate,
    isTemplateSelected,
    userId,
    projectName,
    setSelectedDevice,
    setSelectedTemplate,
    setTemplateSelected,
  } = usePreviewStore();

  const handleTemplateSelection = async () => {
    console.log("handleTemplateSelection", selectedTemplate, projectName);
    try {
      const response = await fetch("/api/preview/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          projectName,
          selectedTemplate,
        }),
      });
      console.log("response", response);
      if (response.ok) {
        setTemplateSelected(true);
      }
    } catch (error) {
      console.error("Failed to select template:", error);
    }
  };

  const handleDownload = async () => {
    if (!userId || !projectName || !selectedTemplate) return;

    const downloadUrl = `/api/preview/download?userId=${userId}&projectName=${projectName}&template=${selectedTemplate}`;

    // Trigger download
    window.location.href = downloadUrl;
  };

  //Template maping
  const templateMapping = {
    "Template 1": "template1",
    "Template 2": "template2",
    "Template 3": "template3",
  } as const;

  const displayMapping = {
    template1: "Template 1",
    template2: "Template 2",
    template3: "Template 3",
  } as const;
  const redirectToDashboard = () => {
    push("/");
  };
  return (
    <div className="flex h-16 items-center justify-between bg-zinc-900 px-4">
      <div className="flex items-center gap-4">
        <Image
          src={logo}
          alt="Logo"
          width={48}
          height={48}
          className="rounded-full"
          onClick={redirectToDashboard}
        />
        {isTemplateSelected ? (
          <h1 className="text-white text-xl">{projectName}</h1>
        ) : (
          <div className="relative group">
            <button className="flex items-center justify-between w-[180px] px-3 py-2 text-white bg-transparent border border-orange-500 rounded-md">
              <span>{displayMapping[selectedTemplate]}</span>
              <ChevronDown className="h-4 w-4 text-orange-500" />
            </button>
            <div className="absolute top-full left-0 w-[180px] bg-zinc-800 border border-zinc-700 rounded-md shadow-lg hidden group-hover:block">
              {Object.entries(templateMapping).map(([display, value]) => (
                <button
                  key={value}
                  className="block w-full px-3 py-2 text-left text-white hover:bg-zinc-700"
                  onClick={() => setSelectedTemplate(value)}
                >
                  {display}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {(["desktop", "tablet", "mobile"] as const).map((device) => (
          <button
            key={device}
            className={`p-2 rounded-md ${
              selectedDevice === device ? "text-orange-500" : "text-gray-400"
            }`}
            onClick={() => setSelectedDevice(device)}
          >
            {device === "desktop" && <Laptop className="h-5 w-5" />}
            {device === "tablet" && <Tablet className="h-5 w-5" />}
            {device === "mobile" && <Smartphone className="h-5 w-5" />}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {isTemplateSelected ? (
          <>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Download
            </button>
            <button
              // className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white"
              className="rounded-md p-2 text-white bg-orange-500 relative group cursor-not-allowed"
            >
              <p>Customize</p>
            <span
              className="absolute hidden group-hover:block  left-1/2 transform -translate-x-1/2 
                px-3 py-1 text-sm bg-gray-800 text-white rounded-md whitespace-nowrap"
            >
              Coming Soon!
            </span>
            </button>
            {/* <button>
              <Pencil className="h-4 w-4 text-[#F05D23] " />
            </button> */}
          </>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Confirm
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription className="text-lg text-gray-300">
                  By selecting{" "}
                  <span className="text-orange-500">&ldquo;Confirm&rdquo;</span>{" "}
                  you will choose this template, and the other two templates
                  will be permanently deleted and cannot be recovered.
                </AlertDialogDescription>
                <AlertDialogTitle className="text-xl text-gray-200 mt-4">
                  Are you sure you want to proceed?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleTemplateSelection}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
