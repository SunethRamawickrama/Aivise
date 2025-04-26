import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, folderId } = await req.json();

    if (!fileId || !folderId) {
      return NextResponse.json({ error: "File ID and Folder ID are required" }, { status: 400 });
    }

    // Get both the file and folder
    const [file, folder] = await Promise.all([
      prisma.folder.findUnique({ where: { id: fileId } }),
      prisma.folder.findUnique({ where: { id: folderId } })
    ]);

    if (!file || !folder) {
      return NextResponse.json({ error: "File or folder not found" }, { status: 404 });
    }

    // If the file is already in a folder, remove the old folder path
    const fileName = file.name.split('/').pop() || file.name;

    // Update the file's name to include the folder path
    const movedFile = await prisma.folder.update({
      where: { id: fileId },
      data: {
        name: `${folder.name}/${fileName}`,
        updatedAt: new Date(), // Update the timestamp to trigger a refresh
      },
    });

    // Return both the moved file and the folder structure
    return NextResponse.json({
      movedFile,
      folderStructure: {
        id: folder.id,
        name: folder.name,
      }
    });
  } catch (error) {
    console.error("Move error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 