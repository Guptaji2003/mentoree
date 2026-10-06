import { db } from "@/server/db";
import { SessionPayload } from "../auth/auth.service";
import {
  CreateMentorServiceInput,
  UpdateMentorServiceInput,
} from "./mentor-services.schema";

export class MentorServicesService {
  /**
   * Helper to ensure the authenticated user has a mentor profile
   */
  private static async getMentorProfile(userId: string) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });
    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found for authenticated user");
    }
    return mentor;
  }

  /**
   * List all services for the logged-in mentor (including DRAFT, PAUSED, ARCHIVED)
   */
  public static async listServicesForMentor(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.mentorService.findMany({
      where: { mentorId: mentor.id },
      include: {
        serviceQuestions: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Public list of published services for a mentor (for students)
   */
  public static async getPublicServicesForMentor(mentorId: string) {
    return db.mentorService.findMany({
      where: {
        mentorId,
        status: "PUBLISHED",
      },
      include: {
        serviceQuestions: {
          where: { status: "ACTIVE" },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { popular: "desc" },
    });
  }

  /**
   * Get single service detail with ownership check
   */
  public static async getServiceById(session: SessionPayload, serviceId: string) {
    const mentor = await this.getMentorProfile(session.userId);

    const service = await db.mentorService.findUnique({
      where: { id: serviceId },
      include: {
        serviceQuestions: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!service) {
      throw new Error("404 Not Found: Service not found");
    }

    if (service.mentorId !== mentor.id && session.role !== "ADMIN") {
      throw new Error("403 Forbidden: You do not own this service");
    }

    return service;
  }

  /**
   * Create a new service with custom booking questions and deliverables
   */
  public static async createService(
    session: SessionPayload,
    input: CreateMentorServiceInput
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    const created = await db.$transaction(async (tx) => {
      const service = await tx.mentorService.create({
        data: {
          mentorId: mentor.id,
          title: input.title,
          category: input.category,
          durationMinutes: input.durationMinutes,
          priceINR: input.priceINR,
          currency: input.currency || "INR",
          description: input.description,
          detailedDescription: input.detailedDescription || null,
          sessionType: input.sessionType || "VIDEO",
          deliverables: input.deliverables || [],
          topicsCovered: input.topicsCovered || [],
          targetAudience: input.targetAudience || null,
          bookingMode: input.bookingMode || "INSTANT",
          status: input.status || "PUBLISHED",
          popular: input.popular || false,
        },
      });

      if (input.customQuestions && input.customQuestions.length > 0) {
        await tx.serviceQuestion.createMany({
          data: input.customQuestions.map((q, idx) => ({
            serviceId: service.id,
            question: q.question,
            type: q.type || "SHORT_TEXT",
            required: q.required !== undefined ? q.required : true,
            options: q.options || [],
            sortOrder: q.sortOrder !== undefined ? q.sortOrder : idx,
            status: "ACTIVE",
          })),
        });
      }

      return tx.mentorService.findUnique({
        where: { id: service.id },
        include: { serviceQuestions: true },
      });
    });

    return created;
  }

  /**
   * Update service details & custom questions
   */
  public static async updateService(
    session: SessionPayload,
    serviceId: string,
    input: UpdateMentorServiceInput
  ) {
    const service = await this.getServiceById(session, serviceId);

    const updated = await db.$transaction(async (tx) => {
      // 1. Update core service fields
      const s = await tx.mentorService.update({
        where: { id: service.id },
        data: {
          title: input.title !== undefined ? input.title : service.title,
          category: input.category !== undefined ? input.category : service.category,
          durationMinutes:
            input.durationMinutes !== undefined
              ? input.durationMinutes
              : service.durationMinutes,
          priceINR: input.priceINR !== undefined ? input.priceINR : service.priceINR,
          currency: input.currency !== undefined ? input.currency : service.currency,
          description:
            input.description !== undefined ? input.description : service.description,
          detailedDescription:
            input.detailedDescription !== undefined
              ? input.detailedDescription
              : service.detailedDescription,
          sessionType:
            input.sessionType !== undefined ? input.sessionType : service.sessionType,
          deliverables:
            input.deliverables !== undefined ? input.deliverables : service.deliverables,
          topicsCovered:
            input.topicsCovered !== undefined
              ? input.topicsCovered
              : service.topicsCovered,
          targetAudience:
            input.targetAudience !== undefined
              ? input.targetAudience
              : service.targetAudience,
          bookingMode:
            input.bookingMode !== undefined ? input.bookingMode : service.bookingMode,
          status: input.status !== undefined ? input.status : service.status,
          popular: input.popular !== undefined ? input.popular : service.popular,
        },
      });

      // 2. If customQuestions were supplied, replace them
      if (input.customQuestions !== undefined) {
        await tx.serviceQuestion.deleteMany({
          where: { serviceId: service.id },
        });

        if (input.customQuestions.length > 0) {
          await tx.serviceQuestion.createMany({
            data: input.customQuestions.map((q, idx) => ({
              serviceId: service.id,
              question: q.question,
              type: q.type || "SHORT_TEXT",
              required: q.required !== undefined ? q.required : true,
              options: q.options || [],
              sortOrder: q.sortOrder !== undefined ? q.sortOrder : idx,
              status: "ACTIVE",
            })),
          });
        }
      }

      return tx.mentorService.findUnique({
        where: { id: service.id },
        include: { serviceQuestions: true },
      });
    });

    return updated;
  }

  /**
   * Change service status: PUBLISHED, PAUSED, DRAFT, ARCHIVED
   */
  public static async changeServiceStatus(
    session: SessionPayload,
    serviceId: string,
    status: "DRAFT" | "PUBLISHED" | "PAUSED" | "ARCHIVED"
  ) {
    const service = await this.getServiceById(session, serviceId);

    return db.mentorService.update({
      where: { id: service.id },
      data: { status },
      include: { serviceQuestions: true },
    });
  }

  /**
   * Delete or archive service: if historical bookings exist, soft-archive instead of hard-delete
   */
  public static async deleteService(session: SessionPayload, serviceId: string) {
    const service = await this.getServiceById(session, serviceId);

    const bookingCount = await db.booking.count({
      where: { serviceId: service.id },
    });

    if (bookingCount > 0) {
      // Soft-archive to preserve historical financial and session records
      await db.mentorService.update({
        where: { id: service.id },
        data: { status: "ARCHIVED" },
      });
      return {
        success: true,
        archived: true,
        message: "Service has historical bookings and was safely archived",
      };
    } else {
      await db.mentorService.delete({
        where: { id: service.id },
      });
      return {
        success: true,
        archived: false,
        message: "Service deleted successfully",
      };
    }
  }
}
