/*
  Warnings:

  - You are about to drop the column `assignments` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `assignment` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `assignmentId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "assignments";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "assignment",
DROP COLUMN "userId",
ADD COLUMN     "assignmentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "effortNotes" TEXT NOT NULL,
    "estimatedEffort" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
