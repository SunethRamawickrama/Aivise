import { NextResponse } from "next/server";
import skills from "@/data/skills.json"; 
export async function GET() {
  return NextResponse.json(skills);
}
export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching for this route
export const runtime = "edge"; // Use edge runtime for faster response times