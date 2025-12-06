// app/api/generate/route.ts

/**
 * Course Generation API (Phase 1)
 * -------------------------------
 * This endpoint:
 * - Validates incoming requests
 * - Enforces tier rules
 * - Sanitizes all input
 * - Builds the course
 * - Applies language + ministry logic
 *
 * This is the FIRST full working feature of认为
 * NextWave Training Forge.
 */

import { NextResponse } from "next/server";

import { buildCourse } from "@/engines/courseBuilder";
import { translateCourse } from "@/engines/languageEngine";
import { buildMinistryContent } from "@/engines/ministryEngine";
import { assertTierAccess } from "@/engines/tierGatekeeper";

import {
  sanitizeObject,
  assertValidInput,
  checkRateLimit,
  auditLog,
} from "@/lib/security";

/**
 * POST /api/generate
 */
export async function POST(req: Request) {
  try {
    const body = sanitizeObject(await req.json());

    // --- TEMP AUTH STUB (Phase 1)
    // Replace with real auth later
    const user = {
      id: "temp-user",
      tier: "PRO",
    };

    checkRateLimit(user.id);

    const {
      title,
      courseType,
      audience,
      durationWeeks,
      depth,
      language,
      country,
      ministryMode,
      bibleTranslation,
    } = body;

    // --- VALIDATION
    assertValidInput(title, "Missing course title");
    assertValidInput(courseType, "Missing course type");
    assertValidInput(language, "Missing language");
    assertValidInput(country, "Missing country");

    // --- TIER ENFORCEMENT
    assertTierAccess(user.tier, {
      requestedLanguage: language,
      requestedBibleTranslation: bibleTranslation,
      ministryMode,
    });

    // --- BUILD COURSE CORE
    let course = await buildCourse({
      title,
      courseType,
      audience,
      durationWeeks,
      depth,
      language,
      country,
      ministryMode,
      bibleTranslation,
    });

    // --- APPLY MINISTRY CONTENT
    if (ministryMode && bibleTranslation) {
      const ministryBlock = buildMinistryContent({
        translation: bibleTranslation,
        topic: title,
      });

      course.modules[0].lessons.unshift(ministryBlock.intro);
    }

    // --- APPLY LANGUAGE TRANSLATION
    if (language !== "en") {
      course = translateCourse(course, language);
    }

    auditLog(user.id, "COURSE_GENERATED", {
      title,
      ministryMode,
      language,
      country,
    });

    return NextResponse.json({
      success: true,
      course,
    });

  } catch (error: any) {
    console.error("GENERATION_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 400 }
    );
  }
      }
  
