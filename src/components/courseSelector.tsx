import clsx from "clsx";

export type Course = {
  id: string;
  courseName: string;
  courseNumber: string;
  Instructor: string;
};

interface courseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onChangeCourse: (courseId: string) => void;
  className?: string;
}

export function CourseSelector({
  courses,
  selectedCourseId,
  onChangeCourse,
  className,
}: Readonly<courseSelectorProps>) {
  return (
    <>
      <div className={clsx("relative w-full max-w-sm", className)}>
        <select
          value={selectedCourseId}
          onChange={(e) => onChangeCourse(e.target.value)}
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
    </>
  );
}
