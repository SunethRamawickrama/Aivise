"use client";

import React, { useEffect, useState } from "react";

interface Skill {
  skill: string;
  count: number;
}

interface Problem {
  title: string;
  link: string;
}

export default function CampusToolPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsResp = await fetch("/api/campustool/skills");
        const skillsData = await skillsResp.json();
        setSkills(skillsData);

        const leetcodeResp = await fetch("/api/campustool/leetcode");
        const leetcodeData = await leetcodeResp.json();
        setProblems(leetcodeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading Campus Tool...</p>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Welcome to the Campus Opportunities & Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore top skills, internships insights, and practice for technical
          interviews.
        </p>
      </div>

      {/* Skills Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          🔥 Top Internship Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center"
            >
              <p className="text-lg font-medium">
                {item.skill.replace(/_/g, " ")}
              </p>
              <p className="text-sm text-gray-500">{item.count} mentions</p>
            </div>
          ))}
        </div>
      </section>

      {/* LeetCode Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          🧠 Practice LeetCode Problems
        </h2>
        <ul className="space-y-3">
          {problems.map((problem, idx) => (
            <li key={idx}>
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {problem.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
