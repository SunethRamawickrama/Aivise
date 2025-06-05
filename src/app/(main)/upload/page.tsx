"use client";
import React, { useState } from "react"; // Added useState
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react"; //added
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

export default function Page() {
  const [file, setFile] = useState<File | null>(null); // Added state for file
  const [isDragging, setIsDragging] = useState(false); // Added isDragging state
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    let formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const folderId = data.folderId;

        if (!folderId) {
          alert("Error fetching folder id");
          return;
        }

        alert("File uploaded successfully! Now redirecting to the canvas :)");
        router.push(`/space/${folderId}`);
      } else {
        alert("Error uploading file. Try again :(");
      }
    } catch (error) {
      console.error("Upload error:", error); // More specific error logging
      alert("Error uploading file.  Check console for details.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="h-full flex items-center justify-center">
        <div
          className={cn(
            "w-64 h-64 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors",
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              Drop your file here
            </p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUpload(file);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
