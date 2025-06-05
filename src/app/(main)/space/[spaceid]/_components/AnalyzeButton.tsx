"use client";

import React, { useState } from "react";
import FeedbackDrawer from "./feedbackDrawer";

interface props {
  fileUrl: string;
  folderId: string;
}

export default function AnalyzeButton({ fileUrl, folderId }: props) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          fileUrl: fileUrl,
          folderId: folderId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze document");
      }

      if (data.success && data.feedback) {
        setFeedback(data.feedback);
        setDrawerOpen(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while analyzing the document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className={`ml-auto mr-auto mb-4 mt-0 flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 4a1 1 0 011 1v2h2a1 1 0 010 2h-2v2h2a1 1 0 010 2h-2v2a1 1 0 11-2 0v-2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 010-2h2v-2H7a1 1 0 010-2h2V5a1 1 0 011-1h4z"
          />
        </svg>
        {isLoading ? "Analyzing..." : "Analyze with AI"}
      </button>

      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

      {feedback && (
        <FeedbackDrawer
          feedback={feedback}
          open={drawerOpen}
          setOpen={setDrawerOpen}
        />
      )}
    </>
  );
}
