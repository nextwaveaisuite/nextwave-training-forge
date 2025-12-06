// lib/exporter.ts

import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import PDFDocument from "pdfkit";
import { BRANDING } from "@/config/branding";

/**
 * DOCX EXPORT
 */
export async function exportToDocx(course: any): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: BRANDING.platformName,
      heading: HeadingLevel.HEADING_1,
    })
  );

  paragraphs.push(new Paragraph(BRANDING.tagline));

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
        heading: HeadingLevel.HEADING_2,
      })
    );

    mod.lessons.forEach((lesson: string) => {
      paragraphs.push(new Paragraph(lesson));
    });
  });

  paragraphs.push(
    new Paragraph(`Issued by: ${BRANDING.issuedBy}`)
  );

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
    const doc = new PDFDocument({ margin: 50 });
    const chunks: any[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc
      .fontSize(22)
      .fillColor(BRANDING.primaryColor)
      .text(BRANDING.platformName);

    doc
      .fontSize(12)
      .fillColor("gray")
      .text(BRANDING.tagline);

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("black")
      .text(course.title, { underline: true });

    doc.moveDown();
    doc.fontSize(12).text(course.overview);
    doc.moveDown();

    course.modules.forEach((mod: any) => {
      doc
        .fontSize(14)
        .fillColor(BRANDING.accentColor)
        .text(`Module ${mod.moduleNumber}: ${mod.title}`);

      mod.lessons.forEach((lesson: string) => {
        doc.fontSize(11).fillColor("black").text(`• ${lesson}`);
      });

      doc.moveDown();
    });

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Issued by ${BRANDING.issuedBy}`, {
        align: "right",
      });

    doc.end();
  });
      }
                
