import { NextResponse } from "next/server";
import skills from "@/data/skills.json";

export async function GET() {
  return NextResponse.json(skills);
}

export const dynamic = "force-dynamic"; 
