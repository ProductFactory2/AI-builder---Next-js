'use client'
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PreviewDisplay from "@/components/preview/previewDisplay";
import Navbar from "@/components/preview/previewNav";
import { usePreviewStore } from "@/components/preview/previewDisplay";

export default function Preview() {
    const searchParams = useSearchParams();
    const { setProjectInfo, setTemplateSelected, setSelectedTemplate } = usePreviewStore();

    useEffect(() => {
        const userId = searchParams.get('userId');
        const projectName = searchParams.get('projectName');

        if (userId && projectName) {
            setProjectInfo(userId, projectName);
            
            // Check if template is already selected by checking metadata
            fetch(`/api/preview/status?userId=${userId}&projectName=${projectName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.isSelected) {
                        setTemplateSelected(true);
                        setSelectedTemplate(data.selectedTemplate);
                    }
                })
                .catch(console.error);
        }
    }, [searchParams, setProjectInfo, setTemplateSelected, setSelectedTemplate]);

    return (
        <>
            <Navbar />
            <PreviewDisplay />
        </>
    );
}