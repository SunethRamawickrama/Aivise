"use client";
import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import { Assignment } from "./components/Calendar";
import GeneratePlan from "./components/GeneratePlan";

type Course = {
  id: string;
  courseName: string;
  courseNumber: string;
  instructor: string;
};

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({
    courseName: "",
    courseNumber: "",
    instructor: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignmentsForTheCurrentCourse, setAssignmentsForTheCurrentCourse] =
    useState<Assignment[]>([]);
  const [currentCourse, setCurrentCourse] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return alert("No file selected :(");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("courseName", formData.courseName);
    uploadFormData.append("courseNumber", formData.courseNumber);
    uploadFormData.append("instructor", formData.instructor);

    try {
      const resp = await fetch("/api/roadmap/syllabus", {
        method: "POST",
        body: uploadFormData,
      });

      if (resp.ok) {
        alert("Syllabus uploaded successfully!");
        await loadCourses();
      } else {
        alert("Error uploading file.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadCourses = async () => {
    try {
      const resp = await fetch("/api/roadmap/courses");
      if (!resp.ok) return alert("Error fetching courses");

      const { courses } = await resp.json();
      setCourses(courses);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const fetchAssignments = async (courseNumber: string) => {
    try {
      const resp = await fetch(
        `/api/roadmap/assignments?courseNumber=${courseNumber}`
      );
      const data = await resp.json();
      console.log(data);
      console.log(data.assignmentsForTheCourseFromDB);
      setAssignmentsForTheCurrentCourse(
        data.assignmentsForTheCourseFromDB || []
      );
    } catch (err) {
      console.error("Failed to load assignments:", err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (currentCourse) {
      fetchAssignments(currentCourse);
    }
  }, [currentCourse]);

  return (
    <div className="space-y-4">
      {/* Add Course Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ➕ Add Course
      </button>

      {/* Course Form */}
      {showForm && (
        <div className="border p-4 rounded-lg shadow-md bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="courseName"
              onChange={handleFormDataChange}
              placeholder="Course Name"
              className="border rounded-md px-4 py-2"
            />
            <input
              name="courseNumber"
              onChange={handleFormDataChange}
              placeholder="Course Number"
              className="border rounded-md px-4 py-2"
            />
            <input
              name="instructor"
              onChange={handleFormDataChange}
              placeholder="Instructor"
              className="border rounded-md px-4 py-2"
            />
            <div className="col-span-3">
              <p className="text-sm text-gray-600">Upload syllabus</p>
              <input type="file" onChange={handleUpload} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                alert("Please upload the file to complete submission")
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Course
            </button>
          </div>
        </div>
      )}

      {/* Course Selector */}
      <div className="relative w-full max-w-sm">
        <select
          value={selectedCourse}
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedCourse(selectedId);
            const selected = courses.find((c) => c.id === selectedId);
            if (selected) setCurrentCourse(selected.courseNumber);
          }}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseNumber} - {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Component */}
      <Calendar assignments={assignmentsForTheCurrentCourse} />

      <GeneratePlan
        assignments={assignmentsForTheCurrentCourse}
        course={selectedCourse}
      ></GeneratePlan>
    </div>
  );
}
