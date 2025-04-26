import { NextResponse } from "next/server";
import leetcode from "@/data/leetcode_problems.json"; 
export async function GET() {
  return NextResponse.json(leetcode);
}
export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching for this route

