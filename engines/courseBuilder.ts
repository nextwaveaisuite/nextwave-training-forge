// engines/courseBuilder.ts

/**
 * Universal Course Builder Engine (UCB)
 * ------------------------------------
 * Generates COMPLETE training & study programs.
 * Designed to support:
 * - Ministry
 * - Industry
 * - Education
 * - Government
 *
 * This engine is tier-aware but tier enforcement
 * must happen BEFORE calling this engine.
 */

export interface CourseInput {
  title: string;
  courseType:
    | "WORKSHOP"
    | "SHORT_COURSE"
    | "CERTIFICATE"
    | "DIPLOMA"
    | "DEGREE"
    | "BIBLE_STUDY"
    | "MINISTRY_PROGRAM";
  audience: string;
  durationWeeks: number;
  depth: "BASIC" | "STANDARD" | "ADVANCED" | "ACADEMIC";
  language: string;
  country: string;
  ministryMode: boolean;
  bibleTranslation?: string;
}

export interface CourseModule {
  moduleNumber: number;
  title: string;
  description: string;
  lessons: string[];
  activities: string[];
  assessments: string[];
}

export interface GeneratedCourse {
  title: string;
  overview: string;
  learningOutcomes: string[];
  modules: CourseModule[];
}

/**
 * MAIN ENTRY POINT
 */
export async function buildCourse(
  input: CourseInput
): Promise<GeneratedCourse> {
  const moduleCount = calculateModuleCount(
    input.courseType,
    input.durationWeeks
  );

  const modules: CourseModule[] = [];

  for (let i = 1; i <= moduleCount; i++) {
    modules.push(generateModule(input, i));
  }

  return {
    title: input.title,
    overview: generateOverview(input),
    learningOutcomes: generateLearningOutcomes(input),
    modules,
  };
}

/**
 * INTERNAL HELPERS
 */

function calculateModuleCount(
  courseType: CourseInput["courseType"],
  durationWeeks: number
): number {
  switch (courseType) {
    case "WORKSHOP":
      return Math.max(2, durationWeeks);
    case "SHORT_COURSE":
      return Math.max(4, durationWeeks);
    case "CERTIFICATE":
      return Math.max(8, durationWeeks);
    case "DIPLOMA":
      return Math.max(12, durationWeeks);
    case "DEGREE":
      return Math.max(24, durationWeeks);
    case "BIBLE_STUDY":
      return Math.max(6, durationWeeks);
    case "MINISTRY_PROGRAM":
      return Math.max(16, durationWeeks);
    default:
      return 6;
  }
}

function generateOverview(input: CourseInput): string {
  if (input.ministryMode) {
    return `This ${input.courseType.toLowerCase()} is designed to equip learners with strong biblical foundations, practical ministry application, and spiritual development using the ${input.bibleTranslation} translation.`;
  }

  return `This ${input.courseType.toLowerCase()} is designed to provide structured, practical, and outcome-focused training for ${input.audience} in ${input.country}.`;
}

function generateLearningOutcomes(input: CourseInput): string[] {
  const baseOutcomes = [
    "Demonstrate understanding of core concepts",
    "Apply knowledge in real-world scenarios",
    "Complete assessments to required standards",
  ];

  if (input.ministryMode) {
    baseOutcomes.push(
      "Interpret and apply Scripture faithfully",
      "Demonstrate spiritual maturity and ministry skills"
    );
  }

  if (input.depth === "ACADEMIC") {
    return baseOutcomes.concat([
      "Critically analyse subject matter",
      "Engage with advanced theory and application",
    ]);
  }

  return baseOutcomes;
}

function generateModule(
  input: CourseInput,
  moduleNumber: number
): CourseModule {
  const prefix = input.ministryMode ? "Biblical" : "Core";

  return {
    moduleNumber,
    title: `${prefix} Module ${moduleNumber}`,
    description: `This module covers key concepts and skills related to ${input.title}.`,
    lessons: generateLessons(input),
    activities: generateActivities(input),
    assessments: generateAssessments(input),
  };
}

function generateLessons(input: CourseInput): string[] {
  if (input.ministryMode) {
    return [
      "Scriptural foundations",
      "Theological overview",
      "Ministry application",
      "Reflection and prayer",
    ];
  }

  return [
    "Core concepts",
    "Practical examples",
    "Industry or community application",
    "Review and summary",
  ];
}

function generateActivities(input: CourseInput): string[] {
  return input.ministryMode
    ? [
        "Bible reflection exercise",
        "Group discussion",
        "Personal journal activity",
      ]
    : [
        "Case study analysis",
        "Practical task",
        "Group discussion",
      ];
}

function generateAssessments(input: CourseInput): string[] {
  if (input.depth === "BASIC") {
    return ["Short quiz", "Participation task"];
  }

  if (input.depth === "ADVANCED" || input.depth === "ACADEMIC") {
    return ["Written assignment", "Applied project", "Final assessment"];
  }

  return ["Knowledge check quiz", "Practical assessment"];
}
