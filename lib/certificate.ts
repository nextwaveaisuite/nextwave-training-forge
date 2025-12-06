// lib/certificate.ts

/**
 * Certificate Generator (Phase 1)
 * -------------------------------
 * Generates a simple but professional
 * course completion certificate.
 */

import PDFDocument from "pdfkit";
import { BRANDING } from "@/config/branding";

export function generateCertificate(
  learnerName: string,
  courseTitle: string
): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 60 });
    const chunks: any[] = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc
      .fontSize(28)
      .fillColor(BRANDING.primaryColor)
      .text("Certificate of Completion", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor("black")
      .text("This certifies that", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(22)
      .fillColor(BRANDING.accentColor)
      .text(learnerName, { align: "center" });

    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text("has successfully completed", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(18)
      .text(courseTitle, { align: "center", underline: true });

    doc.moveDown(3);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Issued by ${BRANDING.issuedBy}`, { align: "center" });

    doc.end();
  });
}
