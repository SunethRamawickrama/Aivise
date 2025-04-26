import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { userId },
      orderBy: { courseNumber: "desc" },
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching courses:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
