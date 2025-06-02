"use client";
import React from "react";
import { Assignment } from "./Calendar";

interface GeneratePlanProps {
  assignments: Assignment[];
  course: string;
}

export default function GeneratePlan({
  assignments,
  course,
}: Readonly<GeneratePlanProps>) {
  console.log(course);

  const getRoadmap = async () => {
    try {
      const res = await fetch("/api/roadmap/gemini-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignments: assignments,
          id: course,
        }),
      });

      if (res.ok) {
        alert("schedule generated successfully!");
      }
      const data = await res.json();
      //console.log("Schedule Plan:", data);
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    }
  };

  return (
    <>
      <button
        onClick={getRoadmap}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        📊 Generate Schedule with Gemini
      </button>
    </>
  );
}
