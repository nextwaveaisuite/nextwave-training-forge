// lib/exporter.ts

/**
 * Export Engine
 * -------------
 * Converts generated courses into:
 * ✅ PDF
 * ✅ DOCX
 *
 * Phase 1 uses clean text formatting.
 * Phase 2 will support branding, logos, headers, footers.
 */

import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

/**
 * DOCX EXPORT
 */
export async function exportToDocx(course: any): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: course.title,
      heading: HeadingLevel.TITLE,
    })
  );

  paragraphs.push(new Paragraph(course.overview));

  course.modules.forEach((mod: any) => {
    paragraphs.push(
      new Paragraph({
        text: `Module ${mod.moduleNumber}: ${mod.title}`,
        heading: HeadingLevel.HEADING_1,
      })
    );

    mod.lessons.forEach((lesson: string) => {
      paragraphs.push(new Paragraph(lesson));
    });

    mod.activities.forEach((activity: string) => {
      paragraphs.push(new Paragraph(`Activity: ${activity}`));
    });

    mod.assessments.forEach((assessment: string) => {
      paragraphs.push(new Paragraph(`Assessment: ${assessment}`));
    });
  });

  const document = new Document({
    sections: [{ children: paragraphs }],
  });

  return Packer.toBuffer(document);
}

/**
 * PDF EXPORT
 */
export function exportToPdf(course: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(22).text(course.title, { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(course.overview);
    doc.moveDown();

    course.modules.forEach((mod: any) => {
      doc.fontSize(16).text(`Module ${mod.moduleNumber}: ${mod.title}`);
      doc.moveDown();

      mod.lessons.forEach((lesson: string) => {
        doc.fontSize(12).text(`• ${lesson}`);
      });

      doc.moveDown();
    });

    doc.end();
  });
  }
  
