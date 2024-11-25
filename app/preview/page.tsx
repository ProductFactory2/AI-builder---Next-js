'use client'
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PreviewDisplay from "@/components/preview/previewDisplay";
import Navbar from "@/components/preview/previewNav";
import { usePreviewStore } from "@/components/preview/previewDisplay";

export default function Preview(){
    const searchParams = useSearchParams();
    const setProjectInfo = usePreviewStore(state => state.setProjectInfo);

    useEffect(() => {
        const userId = searchParams.get('userId');
        const projectName = searchParams.get('projectName')

        if (userId && projectName) {
            setProjectInfo(userId, projectName)
        }
    }, [searchParams, setProjectInfo])
    
    return(
        <>
            <Navbar/>
            <PreviewDisplay/>
        </>
    )
}