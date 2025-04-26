import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Get the item to delete
    const item = await prisma.folder.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // If it's a file (has fileUrl), delete from Supabase storage
    if (item.fileUrl) {
      const fileName = item.fileUrl.split('/').pop();
      if (fileName) {
        const { error } = await supabase.storage
          .from("assignments")
          .remove([fileName]);
        
        if (error) {
          console.error("Error deleting file from storage:", error);
        }
      }
    }

    // Delete from database
    await prisma.folder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 