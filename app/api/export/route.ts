// app/api/export/route.ts

import { NextResponse } from "next/server";
import { exportToDocx, exportToPdf } from "@/lib/exporter";

export async function POST(req: Request) {
  try {
    const { course, format } = await req.json();

    if (!course || !format) {
      throw new Error("Missing course or format");
    }

    let fileBuffer: Buffer;
    let contentType: string;
    let fileName: string;

    if (format === "pdf") {
      fileBuffer = await exportToPdf(course);
      contentType = "application/pdf";
      fileName = "course.pdf";
    } else if (format === "docx") {
      fileBuffer = await exportToDocx(course);
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      fileName = "course.docx";
    } else {
      throw new Error("Unsupported export format");
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
        }
      
