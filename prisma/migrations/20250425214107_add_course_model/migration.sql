-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseNumber" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "assignments" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
