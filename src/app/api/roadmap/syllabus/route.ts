import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {

  try { 
    
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    const { courseName, courseNumber, instructor, file } = Object.fromEntries(formData);

    if (
        typeof courseName !== "string" ||
        typeof courseNumber !== "string" ||
        typeof instructor !== "string"
      ) {
        return NextResponse.json({ error: "Missing or invalid course data" }, { status: 400 });
      }

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);
    const fileName = `${uuidv4()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("syllabi")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/syllabi/${data.path}`;

    const course = await prisma.course.create({
        data: {
          courseName,
          courseNumber,
          instructor,
          fileUrl,
          assignments: [],
          userId,
        },
      });

    return NextResponse.json({ success: true, course}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  
}
