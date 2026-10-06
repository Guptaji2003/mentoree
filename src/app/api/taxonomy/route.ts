import { NextRequest } from "next/server";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import {
  DEFAULT_FIELD_CATEGORIES,
  DEFAULT_INTERESTS,
  DEFAULT_SKILLS,
  EDUCATION_LEVELS,
  GRADE_TYPES,
  GOAL_TYPES,
} from "@/server/modules/students/taxonomy.data";
import { db } from "@/server/db";

export async function GET(req: NextRequest) {
  try {
    // Attempt to load from database, or fallback to defaults
    let fields = await db.fieldCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }).catch(() => []);

    if (fields.length === 0) {
      fields = DEFAULT_FIELD_CATEGORIES as any;
    }

    return apiSuccess({
      fields,
      interests: DEFAULT_INTERESTS,
      skills: DEFAULT_SKILLS,
      educationLevels: EDUCATION_LEVELS,
      gradeTypes: GRADE_TYPES,
      goalTypes: GOAL_TYPES,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
