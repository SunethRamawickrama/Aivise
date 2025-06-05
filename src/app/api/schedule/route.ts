import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const courseId = searchParams.get("courseId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = Math.max((page - 1) * limit, 0);

  if (!courseId) {
    return NextResponse.json({ error: "Missing course id!" }, { status: 400 });
  }

  const [scheduleList, total] = await Promise.all([
    prisma.schedule.findMany({
      where: { courseId },
      orderBy: { dueDate: "asc" },
      skip,
      take: limit,
    }),
    prisma.schedule.count({
      where: { courseId },
    }),
  ]);

  return NextResponse.json({
    data: scheduleList,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
