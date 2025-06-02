import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseNumber = searchParams.get("courseNumber");

    if (!courseNumber) {
      return NextResponse.json(
        { error: "Missing courseNumber" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        userId,
        courseNumber,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const assignmentsForTheCourseFromDB =
      (await prisma.assignment.findMany({
        where: {
          courseId: course.id,
        },
      })) || [];

    console.log(assignmentsForTheCourseFromDB);

    return NextResponse.json(
      { assignmentsForTheCourseFromDB },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching assignments:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
