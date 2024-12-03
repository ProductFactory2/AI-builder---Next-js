"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import PreviewDisplay from "@/components/preview/previewDisplay";
import Navbar from "@/components/preview/previewNav";
import { usePreviewStore } from "@/components/preview/previewDisplay";
import { error } from "console";

export default function Preview() {
  const params = useParams();
  const { setProjectInfo, setTemplateSelected, setSelectedTemplate } =
    usePreviewStore();

  useEffect(() => {
    const userId = params.userId as string;
    const projectName = params.projectName as string;

    if (userId && projectName) {
      setProjectInfo(userId, projectName);

      // Check if template is already selected by checking metadata
      fetch(`/api/preview/status?userId=${userId}&projectName=${projectName}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.isSelected) {
            setTemplateSelected(true);
            setSelectedTemplate(data.selectedTemplate);
          }
          else{
            setTemplateSelected(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [params, setProjectInfo, setTemplateSelected, setSelectedTemplate]);

  return (
    <>
      <Navbar />
      <PreviewDisplay />
    </>
  );
}
