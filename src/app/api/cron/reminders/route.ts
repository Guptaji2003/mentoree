import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { env } from "@/server/env";
import { NotificationService } from "@/server/modules/notifications/notifications.service";
import { apiSuccess, apiError, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  return handleReminders(req);
}

export async function POST(req: NextRequest) {
  return handleReminders(req);
}

async function handleReminders(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecretParam = req.nextUrl.searchParams.get("secret");

    const isAuthorized =
      authHeader === `Bearer ${env.CRON_SECRET}` ||
      cronSecretParam === env.CRON_SECRET;

    if (!isAuthorized && process.env.NODE_ENV === "production") {
      return apiError("Unauthorized cron invocation", 401, "Unauthorized");
    }

    const now = new Date();
    const in24HoursMin = new Date(now.getTime() + 23.9 * 60 * 60 * 1000);
    const in24HoursMax = new Date(now.getTime() + 24.1 * 60 * 60 * 1000);

    const in1HourMin = new Date(now.getTime() + 50 * 60 * 1000);
    const in1HourMax = new Date(now.getTime() + 70 * 60 * 1000);

    // Find upcoming CONFIRMED bookings around 24h and 1h marks
    const upcomingBookings = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        slot: {
          OR: [
            { startTime: { gte: in24HoursMin, lte: in24HoursMax } },
            { startTime: { gte: in1HourMin, lte: in1HourMax } },
          ],
        },
      },
      include: {
        student: true,
        mentor: { include: { user: true } },
        slot: true,
      },
    });

    let remindersSent = 0;
    for (const b of upcomingBookings) {
      await NotificationService.sendEmailNotification({
        userId: b.studentId,
        to: b.student.email,
        subject: `⏰ Reminder: Upcoming Mentorship Session with ${b.mentor.user.name}`,
        html: `
          <p>Hi ${b.student.name},</p>
          <p>Your session with <strong>${b.mentor.user.name}</strong> is scheduled for <strong>${b.slot.startTime.toUTCString()}</strong>.</p>
          <p><strong>Join URL:</strong> <a href="${b.meetingUrl}">${b.meetingUrl}</a></p>
        `,
        type: "SESSION_REMINDER",
        payload: { bookingId: b.id, startTime: b.slot.startTime },
      });
      remindersSent++;
    }

    return apiSuccess({ success: true, remindersSent });
  } catch (err) {
    return handleRouteError(err);
  }
}
