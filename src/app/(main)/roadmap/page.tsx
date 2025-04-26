'use client'
import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';

export default function Page() {
  
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState ("");
  const [formData, setFormData] = useState({
    courseName: '',
    courseNumber: '',
    instructor: '',
  });

  const [ courses, setCourses ] = useState ([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      alert("No file selected :(");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('courseName', formData.courseName);
    uploadFormData.append('courseNumber', formData.courseNumber);
    uploadFormData.append('instructor', formData.instructor);

    try {
      const resp = await fetch('/api/roadmap/syllabus', {
        method: 'POST',
        body: uploadFormData,
      });

      if (resp.ok) {
        alert('Syllabus uploaded and course info sent successfully :)');
      } else {
        alert('Error uploading file and course info :(');
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
      const resp = await fetch('/api/roadmap/courses'); // Make sure this route exists
  
      if (!resp.ok) {
        alert('Error fetching courses :(');
        return;
      }
  
      const { courses } = await resp.json(); // Destructure from the JSON response
      setCourses(courses); // Now it's defined!
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);


  return (
    <div className="space-y-4">
      {/* Add Course Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ➕ Add Course
      </button>

      {/* Form Section */}
      {showForm && (
        <div className="border p-4 rounded-lg shadow-md bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="courseName"
              onChange={handleFormDataChange}
              type="text"
              placeholder="Course Name"
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="courseNumber"
              onChange={handleFormDataChange}
              type="text"
              placeholder="Course Number"
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="instructor"
              onChange={handleFormDataChange}
              type="text"
              placeholder="Instructor's Name"
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* File Upload */}
            <div className="col-span-1 md:col-span-3 space-y-2">
              <p className="text-sm text-gray-600">Upload syllabus</p>
              <input type="file" onChange={handleUpload} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Submit Course
            </button>
          </div>
        </div>
      )}

      {/* Course Dropdown */}
      <div className="relative w-full max-w-sm">

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option disabled value="">
          Select a course
        </option>

        {courses.map((course: any) => (
          <option key={course.id} value={course.id}>
            {course.courseNumber} - {course.courseName}
          </option>
        ))}
      </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <Calendar />
    </div>
  );
}
