import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { model } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  function removeJsonComments(jsonString: string) {
    return jsonString.replace(/\/\/.*$/gm, "").trim();
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { assignments, id } = await req.json();

    const prompt = `You are a study assistant. I will provide a list of upcoming assignments and exams. 
    
     Your job is to break them down into smaller subtasks and generate a personalized schedule for the student (You should do this for all the assignments). 
     Prioritize tasks that are due sooner or are more important (e.g., midterms, major projects). A single assignment can have multiple subtasks.

     Each subtask should include:

      task: a short name for the subtask
      dueDate: the suggested date to complete this subtask. Decide this based on the assignment due date
      assignment: the assignment or exam this task supports(this should relate to the name of the assignment that is given to you. 
      Include the real id of the assignment from the database)

      content: short learning materials, helper questions, or study strategies for this step(this is the most important
      aspect of your output. For example, if this is for a paper, let the user work on a small chunk of it, if the assignment
      is an exam give some quiz-like questions, etc)

      Format the output as a JSON array. Example:

[
  {
    "task": "Review lecture notes for Week 4",
    "dueDate": "2025-06-01",
    "assignment": {
      "id": id from the given set of assignments
      "title": "Midterm Exam",
      "dueDate": "2025-06-07"
    },
    "content": "Summarize key concepts from lectures, and identify weak areas to revisit."
  },
  {
    "task": "Start outline for final paper",
    "dueDate": "2025-06-02",
    "assignment": {
      "id": id from the given set of assignments
      "title": "Final Research Paper",
      "dueDate": "2025-06-20"
    },
    "content": "Decide on your topic, identify 3 key sources, and begin outlining your argument."
  }
]
Only include tasks that are realistically doable given the time remaining before each assignment's due date.

Assignments:
${assignments
  .map(
    (a: any, i: number) =>
      `Due: ${a.id}. ${a.name} - Due: ${a.dueDate}, Estimated Effort: ${a.estimatedEffort}, Notes: ${a.effortNotes}`
  )
  .join("\n")}

`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log(text);

    const fixedText = text.trim().replace(/```json|```/g, "");
    const cleanedText = removeJsonComments(fixedText);
    const json = JSON.parse(cleanedText);

    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    console.log("The prop course is" + id);
    console.log("The existing course is " + existingCourse?.courseNumber);

    if (!existingCourse) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
      });
    }

    const courseId = existingCourse?.id;

    const subTasks = await Promise.all(
      json.map((item: any) =>
        prisma.schedule.create({
          data: {
            task: item.task,
            dueDate: new Date(item.dueDate),
            content: item.content,
            assignmentId: item.assignment?.id || "", // fixed here too
            courseId: courseId,
          },
        })
      )
    );

    //console.log(subTasks);

    return NextResponse.json(json);
  } catch (err: any) {
    console.error("Gemini Schedule Generation Error:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
