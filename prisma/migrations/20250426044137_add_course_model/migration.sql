/*
  Warnings:

  - You are about to drop the column `assignments` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "assignments";

-- CreateTable
CREATE TABLE "Assignments" (
    "id" TEXT NOT NULL,
    "assignmentName" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "estimatedEffort" TEXT,
    "effortNotes" TEXT,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Assignments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assignments" ADD CONSTRAINT "Assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
