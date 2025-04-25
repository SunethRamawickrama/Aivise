import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest){
    try{
        const {fileUrl, folderId} = await req.json();
        console.log( "extrcated the request successfully " + fileUrl + " " + folderId)

        const supabaseResp = await fetch(fileUrl);
        
        if (!supabaseResp.ok) {
            return NextResponse.json({ error: "Failed to download file" }, { status: 400 });
        }

        console.log("supabase response was successful" + supabaseResp)

        const contentType = supabaseResp.headers.get("content-type");
        const buffer = Buffer.from(await supabaseResp.arrayBuffer());

        console.log("buffer works");

        const model = genAI.getGenerativeModel({
          model: "models/gemini-1.5-flash",
      });      
        
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: "Please read this document and provide constructive feedback for improvement." },
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
      
      const feedback = await result.response.text();

        console.log("Gemini resposne " + feedback);
      
        return NextResponse.json({
            success: true,
            feedback,
            folderId,
        });

    }
    
    catch (error) {
        return NextResponse.json({ error: "Something went wrong in the server :(" + error }, { status: 500 });
    }
}

/*

// PDF fileif (contentType?.includes("pdf")) {
            const pdfData = await PdfParse(buffer);
            textContent += pdfData.text;
        }

        // Word file (.docx)
        else if (contentType?.includes("wordprocessingml")) {
            const result = await mammoth.extractRawText({ buffer });
            textContent += result.value;
        }

        // Unsupported format
        else {
            return NextResponse.json({ error: "Unsupported file format. Try word or pdf" }, { status: 415 });
}

import mammoth from 'mammoth';
import { v4 as uuidv4 } from "uuid";
import PdfParse from 'pdf-parse';

*/
        