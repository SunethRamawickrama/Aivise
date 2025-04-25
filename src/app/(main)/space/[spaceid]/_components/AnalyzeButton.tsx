'use client';

import React, {useState} from 'react';
import FeedbackDrawer from './feedbackDrawer';

interface props{
  fileUrl: string;
  folderId: string;
}

export default function AnalyzeButton( {fileUrl, folderId} : props) {

  const [ feedback, setFeedback] = useState<string | null>(null);
  const [ drawerOpen, setDrawerOpen] = useState(false)

  const handleButtonClick = async() => {
    
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        fileUrl: fileUrl,      // from Supabase
        folderId: folderId,    // from DB
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const data = await res.json();
    console.log("Analysis result:", data);

    if (data.success && data.feedback) {
        setFeedback(data.feedback);
        setDrawerOpen(true);
    }

  };

  return (
    <>

    <button onClick={handleButtonClick} className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition transform duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 4a1 1 0 011 1v2h2a1 1 0 010 2h-2v2h2a1 1 0 010 2h-2v2a1 1 0 11-2 0v-2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 010-2h2v-2H7a1 1 0 010-2h2V5a1 1 0 011-1h4z" />
      </svg>
    Analyze with AI
    </button>

    {feedback && (
        <FeedbackDrawer
          feedback={feedback}
          open={drawerOpen}
          setOpen={setDrawerOpen}
        />
      )
    }
    
    </>

  );
}