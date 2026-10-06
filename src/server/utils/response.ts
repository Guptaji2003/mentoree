import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  details?: unknown;
}

export function apiSuccess<T>(data: T, status: number = 200, headers?: HeadersInit) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status, headers }
  );
}

export function apiError(
  message: string,
  statusCode: number = 400,
  error: string = "Bad Request",
  details?: unknown,
  headers?: HeadersInit
) {
  const body: ApiErrorResponse = {
    statusCode,
    error,
    message,
    timestamp: new Date().toISOString(),
    ...(details ? { details } : {}),
  };
  return NextResponse.json(body, { status: statusCode, headers });
}

export function handleRouteError(err: unknown) {
  console.error("[Route Error Handler]:", err);

  if (err instanceof ZodError) {
    const formatted = (err as any).issues ? (err as any).issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ") : err.message;
    return apiError(
      formatted || "Input validation failed",
      400,
      "Validation Error",
      err.format()
    );
  }

  if (err instanceof Error) {
    if (err.message.startsWith("401") || err.message.toLowerCase().includes("unauthorized")) {
      return apiError(err.message, 401, "Unauthorized");
    }
    if (err.message.startsWith("403") || err.message.toLowerCase().includes("forbidden")) {
      return apiError(err.message, 403, "Forbidden");
    }
    if (err.message.startsWith("404") || err.message.toLowerCase().includes("not found")) {
      return apiError(err.message, 404, "Not Found");
    }
    if (err.message.startsWith("409") || err.message.toLowerCase().includes("conflict")) {
      return apiError(err.message, 409, "Conflict");
    }
    if (err.message.startsWith("429") || err.message.toLowerCase().includes("rate limit")) {
      return apiError(err.message, 429, "Too Many Requests");
    }
    return apiError(err.message, 500, "Internal Server Error");
  }

  return apiError("An unexpected error occurred", 500, "Internal Server Error");
}
