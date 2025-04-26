import React from "react";
import Info from "./Info";
import Toolbar from "./Toolbar";
import AnalyzeButton from "./AnalyzeButton";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


interface CanvasProps {
  spaceId: string;
}

export async function Canvas({ spaceId }: CanvasProps) {

  const folder = await prisma.folder.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!folder) {
    notFound();
  }

  const getFilePreview = () => {
    const fileUrl = folder.fileUrl;
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();

    // Handle PDF files
    if (fileExtension === 'pdf') {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
        />
      );
    }
    
    // Handle Word documents
    else if (fileExtension === 'docx' || fileExtension === 'doc') {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
          className="w-full h-full"
        />
      );
    }
    
    // Handle image files
    else if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension || '')) {
      return (
        <img
          src={fileUrl}
          alt={folder.name}
          className="w-full h-full object-contain"
        />
      );
    }
    
    // Default case for unsupported files
    else {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Preview not available for this file type</p>
        </div>
      );
    }
  };




  return (

    <>
    
    <main className="h-full w-full relative bg-netural-100 touch-none">
      <div className="h-full flex items-center justify-center p-4">
      <div title="" className="w-full max-w-4xl h-[80vh] shadow-md rounded-md overflow-hidden">
        {getFilePreview()}
      </div>
      </div>

    <Info />
    <Toolbar />
    <AnalyzeButton fileUrl={folder.fileUrl} folderId={spaceId} />
    </main>
    
    </>
    
    
  );
}

export default Canvas;
