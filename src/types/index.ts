export type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

export type VerificationState = "UNVERIFIED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";

export interface VerificationDocument {
  id: string;
  documentType: "WORK_EMAIL" | "OFFER_LETTER" | "EMPLOYEE_ID" | "PAYSLIP" | "LINKEDIN";
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  verifiedDomain?: string;
  rejectionReason?: string;
}

export interface MentorService {
  id: string;
  title: string;
  durationMinutes: number;
  priceINR: number;
  description: string;
  popular?: boolean;
}

export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm in UTC
  endTime: string; // HH:mm in UTC
  localTimeDisplay: string;
  isBooked: boolean;
  isHeld?: boolean;
  heldUntil?: number; // timestamp
}

export interface Review {
  id: string;
  studentName: string;
  studentRole: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  sessionType: string;
  date: string;
}

export interface Mentor {
  id: string;
  name: string;
  headline: string;
  company: string;
  companyDomain: string;
  companyLogo?: string;
  role: string;
  category: "Engineering" | "Product" | "Design" | "Entrepreneurship" | "Placement" | "Finance" | "Data & AI" | "HR" | "Commerce" | "Law" | "Medical" | "Management" | "Science" | "Arts & Design" | string;
  experienceYears: number;
  hourlyRateINR: number;
  avatar: string;
  bio: string;
  tags: string[];
  verificationStatus: VerificationState;
  verificationBadges: {
    emailVerified: boolean;
    identityVerified: boolean;
    employmentVerified: boolean;
    linkedinVerified: boolean;
  };
  ratingAvg: number;
  totalReviews: number;
  totalMenteesHelped: number;
  featured?: boolean;
  theme?: "mentoree" | "mentors";
  services: MentorService[];
  availability: AvailabilitySlot[];
  reviews: Review[];
  meetingUrl?: string;
  actionPlanTemplate?: string[];
}

export interface BookingRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  mentorId: string;
  slotId: string;
  serviceId: string;
  status: "PENDING" | "HELD" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reservationToken: string;
  amountINR: number;
  platformCommissionINR: number;
  mentorPayoutINR: number;
  preSessionBrief: {
    careerGoal: string;
    targetCompany: string;
    experienceLevel: string;
    specificQuestions: string;
    resumeUrl?: string;
  };
  meetingUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  mentorId: string;
  mentorName: string;
  action: "SUBMITTED" | "APPROVED" | "REJECTED" | "DOC_VERIFIED";
  performedBy: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export * from "./student";
