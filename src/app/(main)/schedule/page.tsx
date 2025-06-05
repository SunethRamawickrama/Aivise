"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { CourseSelector } from "@/components/courseSelector";
import { Course } from "@/components/courseSelector";
import ScheduleList from "./components/scheduleList";

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");

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

  const handleChange = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setSelectedCourse(course.id);
    } else {
      alert("Course id doesn't exists");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <CourseSelector
        className="mt-8 ml-8"
        courses={courses}
        selectedCourseId={selectedCourse}
        onChangeCourse={handleChange}
      ></CourseSelector>

      {selectedCourse === "" ? (
        <p className="ml-8 mt-6"> No course selected</p>
      ) : (
        <ScheduleList courseId={selectedCourse}></ScheduleList>
      )}
    </div>
  );
}
