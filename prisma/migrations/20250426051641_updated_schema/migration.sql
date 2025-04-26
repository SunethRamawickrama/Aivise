/*
  Warnings:

  - You are about to drop the `Assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignments" DROP CONSTRAINT "Assignments_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "assignments" JSONB[];

-- DropTable
DROP TABLE "Assignments";
