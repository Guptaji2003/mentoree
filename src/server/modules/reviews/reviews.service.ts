import { db } from "@/server/db";
import { BookingStatus } from "@prisma/client";
import { CreateReviewInput } from "./reviews.schema";

export class ReviewsService {
  /**
   * Create Review (Student of COMPLETED booking only; once per booking; rating 1-5)
   */
  public static async createReview(studentId: string, input: CreateReviewInput) {
    const booking = await db.booking.findUnique({
      where: { id: input.bookingId },
      include: { review: true, mentor: true },
    });

    if (!booking) {
      throw new Error("404 Not Found: Booking not found");
    }

    if (booking.studentId !== studentId) {
      throw new Error("403 Forbidden: Only the mentee who booked this session can submit a review");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error(`400 Bad Request: Reviews can only be submitted for COMPLETED sessions (current: ${booking.status})`);
    }

    if (booking.review) {
      throw new Error("409 Conflict: A review has already been submitted for this session");
    }

    const result = await db.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId: booking.id,
          mentorId: booking.mentorId,
          rating: input.rating,
          comment: input.comment,
        },
      });

      // Recalculate average rating & total reviews for the mentor
      const allReviews = await tx.review.findMany({
        where: { mentorId: booking.mentorId, hidden: false },
        select: { rating: true },
      });

      const totalReviews = allReviews.length;
      const ratingAvg =
        totalReviews > 0
          ? Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
          : input.rating;

      await tx.mentorProfile.update({
        where: { id: booking.mentorId },
        data: {
          ratingAvg,
          totalReviews,
        },
      });

      return review;
    });

    return result;
  }

  /**
   * Admin: Hide/Unhide Review
   */
  public static async toggleHideReview(reviewId: string, hidden: boolean) {
    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error("404 Not Found: Review not found");
    }

    return db.review.update({
      where: { id: reviewId },
      data: { hidden },
    });
  }
}
