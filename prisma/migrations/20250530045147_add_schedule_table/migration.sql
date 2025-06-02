-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "assignment" JSONB NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
