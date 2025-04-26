import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { model } from "@/lib/gemini";

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

    const supabaseResp = await fetch(fileUrl);

    if (!supabaseResp.ok) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 400 });
    }

    const contentType = supabaseResp.headers.get("content-type");
    const buffer = Buffer.from(await supabaseResp.arrayBuffer());

    console.log("Buffer works");

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Extract a list of assignments including their name and due date from the following syllabus. Also, try to estimate how long each assignment might take, based on the description, materials, or schedule. Format it like a JSON array with fields: assignmentName, dueDate, estimatedEffort, effortNotes." },
            {
              inlineData: {
                mimeType: contentType || "application/pdf",
                data: buffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

   


    const text = await result.response.text(); 
    console.log("Gemini output:", text);


    let assignmentData: any[] = [];

    const fixedText = text.trim().replace(/```json|```/g, '');


    try {
    
      console.log("Before passing");
      assignmentData = JSON.parse(fixedText);
      console.log("After passing");
    } 
    
    catch (e) {
      return NextResponse.json({ error: "", raw: text }, { status: 400 });
    } 

    if (!Array.isArray(assignmentData) || !assignmentData.every(item => typeof item === "object")) {
        return NextResponse.json({ error: "Gemini response is not a valid array of assignment objects", raw: text }, { status: 400 });
    }

    console.log("Parsed assignmentData:", assignmentData);

    const course = await prisma.course.create({
        data: {
          courseName,
          courseNumber,
          instructor,
          fileUrl,
          userId,
          assignments: (assignmentData), // Converting to JSON array
        },
      });


    return NextResponse.json({ success: true, course }, { status: 200 });
  } catch (err: any) {
    console.error("Course creation failed:", err); // add this
    return NextResponse.json({ error: JSON.stringify(err) }, { status: 500 });
  }
}
