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

  const handleButtonClick = ()=> {
    console.log('hello world')
  }


  return (

    <>
    
    <main className="h-full w-full relative bg-netural-100 touch-none">
      <div className="h-full flex items-center justify-center p-4">
      <div title="" className="w-full max-w-4xl h-[80vh] shadow-md rounded-md overflow-hidden">
        <iframe
          src={folder.fileUrl}
          className="w-full h-full"
        ></iframe>
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
