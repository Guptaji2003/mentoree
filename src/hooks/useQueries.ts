"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mentor } from "@/types";
import { StudentProfileData } from "@/types/student";

/**
 * Centralized TanStack Query Keys Factory
 */
export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  mentors: {
    all: () => ["mentors"] as const,
    list: (filters?: { category?: string; search?: string; company?: string }) =>
      ["mentors", "list", filters || {}] as const,
    detail: (id: string) => ["mentors", "detail", id] as const,
    services: (mentorId: string) => ["mentors", "services", mentorId] as const,
    availableSlots: (mentorId: string, serviceId?: string, timezone?: string) =>
      ["mentors", "available-slots", mentorId, serviceId || "all", timezone || "default"] as const,
    recommendations: (limit?: number) =>
      ["mentors", "recommendations", limit || 4] as const,
  },
  student: {
    profile: () => ["student", "profile"] as const,
    bookings: () => ["student", "bookings"] as const,
    goals: () => ["student", "goals"] as const,
    payments: () => ["student", "payments"] as const,
    savedMentors: () => ["student", "saved-mentors"] as const,
  },
  mentorPortal: {
    dashboard: () => ["mentor", "dashboard"] as const,
    services: () => ["mentor", "services"] as const,
    serviceDetail: (id: string) => ["mentor", "services", id] as const,
    workingHours: () => ["mentor", "working-hours"] as const,
    rules: () => ["mentor", "rules"] as const,
    blockedDates: () => ["mentor", "blocked-dates"] as const,
    breaks: () => ["mentor", "breaks"] as const,
    overrides: () => ["mentor", "overrides"] as const,
    calendar: () => ["mentor", "calendar"] as const,
    bookings: (tab?: string) => ["mentor", "bookings", tab || "ALL"] as const,
    bookingDetail: (id: string) => ["mentor", "bookings", "detail", id] as const,
    availability: () => ["mentor", "availability"] as const,
    sessions: () => ["mentor", "sessions"] as const,
    earnings: () => ["mentor", "earnings"] as const,
  },
  admin: {
    metrics: () => ["admin", "metrics"] as const,
    verifications: () => ["admin", "verifications"] as const,
    students: () => ["admin", "students"] as const,
    bookings: () => ["admin", "bookings"] as const,
    auditLogs: () => ["admin", "audit-logs"] as const,
  },
};

// ==========================================
// 1. Mentors Public Directory Queries
// ==========================================

export function useMentors(filters?: { category?: string; search?: string; company?: string }) {
  return useQuery({
    queryKey: queryKeys.mentors.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "All") {
        params.set("category", filters.category);
      }
      if (filters?.search && filters.search.trim().length > 0) {
        params.set("search", filters.search.trim());
      }
      if (filters?.company && filters.company !== "All") {
        params.set("company", filters.company);
      }

      const res = await fetch(`/api/mentors?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load mentors directory");
      }
      const json = await res.json();
      return (json.data?.mentors || []) as Mentor[];
    },
  });
}

export function useMentorRecommendations(limit: number = 4) {
  return useQuery({
    queryKey: queryKeys.mentors.recommendations(limit),
    queryFn: async () => {
      const res = await fetch(`/api/student/recommendations/mentors?limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to load mentor recommendations");
      }
      const json = await res.json();
      return (json.data?.recommendations || []) as any[];
    },
  });
}

export function useMentorServicesPublic(mentorId: string) {
  return useQuery({
    queryKey: queryKeys.mentors.services(mentorId),
    queryFn: async () => {
      const res = await fetch(`/api/mentors/${mentorId}/services`);
      if (!res.ok) {
        throw new Error("Failed to load mentor services");
      }
      const json = await res.json();
      return (json.data?.services || []) as any[];
    },
    enabled: !!mentorId,
  });
}

export function usePublicAvailableSlots(
  mentorId: string,
  serviceId?: string,
  timezone?: string
) {
  return useQuery({
    queryKey: queryKeys.mentors.availableSlots(mentorId, serviceId, timezone),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (timezone) params.set("timezone", timezone);
      const endpoint = serviceId
        ? `/api/mentors/${mentorId}/services/${serviceId}/available-slots?${params.toString()}`
        : `/api/mentors/${mentorId}/availability`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error("Failed to calculate available slots");
      }
      const json = await res.json();
      return json.data || { slots: [] };
    },
    enabled: !!mentorId,
  });
}

// ==========================================
// 2. Student Portal Queries & Mutations
// ==========================================

export function useStudentProfile() {
  return useQuery({
    queryKey: queryKeys.student.profile(),
    queryFn: async () => {
      const res = await fetch("/api/student/profile");
      if (!res.ok) {
        throw new Error("Failed to load student profile");
      }
      const json = await res.json();
      return (json.data?.profile || null) as StudentProfileData | null;
    },
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<StudentProfileData>) => {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.message || "Failed to update student profile");
      }

      const json = await res.json();
      return json.data?.profile as StudentProfileData;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.student.profile(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.student.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.recommendations() });
    },
  });
}

export function useStudentBookings() {
  return useQuery({
    queryKey: queryKeys.student.bookings(),
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        throw new Error("Failed to load bookings");
      }
      const json = await res.json();
      return (json.data?.bookings || []) as any[];
    },
  });
}

// ==========================================
// 3. Mentor Portal Queries & Mutations
// ==========================================

export function useMentorDashboard() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.dashboard(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/dashboard");
      if (!res.ok) {
        throw new Error("Failed to load mentor dashboard");
      }
      const json = await res.json();
      return json.data || null;
    },
  });
}

export function useMentorServices() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.services(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/services");
      if (!res.ok) {
        throw new Error("Failed to load mentor services");
      }
      const json = await res.json();
      return (json.data?.services || []) as any[];
    },
  });
}

export function useCreateMentorServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/mentor/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to create service");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.services() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useUpdateMentorServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/mentor/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to update service");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.services() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.serviceDetail(variables.id) });
    },
  });
}

export function useChangeServiceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/mentor/services/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to update service status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.services() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useDeleteMentorServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await fetch(`/api/mentor/services/${serviceId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete service");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.services() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

// Availability Hooks
export function useMentorWorkingHours() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.workingHours(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability/working-hours");
      if (!res.ok) {
        throw new Error("Failed to load working hours");
      }
      const json = await res.json();
      return json.data?.workingHours || null;
    },
  });
}

export function useUpdateWorkingHoursMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/mentor/availability/working-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to update working hours");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.workingHours() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useMentorSchedulingRules() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.rules(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability/rules");
      if (!res.ok) {
        throw new Error("Failed to load scheduling rules");
      }
      const json = await res.json();
      return json.data?.rules || null;
    },
  });
}

export function useUpdateSchedulingRulesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/mentor/availability/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to update rules");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.rules() });
    },
  });
}

export function useMentorBlockedDates() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.blockedDates(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability/blocked-dates");
      if (!res.ok) {
        throw new Error("Failed to load blocked dates");
      }
      const json = await res.json();
      return (json.data?.blockedDates || []) as any[];
    },
  });
}

export function useCreateBlockedDateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/mentor/availability/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to create blocked date");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.blockedDates() });
    },
  });
}

export function useDeleteBlockedDateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/mentor/availability/blocked-dates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete blocked date");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.blockedDates() });
    },
  });
}

export function useMentorBreaks() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.breaks(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability/break");
      if (!res.ok) {
        throw new Error("Failed to load breaks");
      }
      const json = await res.json();
      return (json.data?.breaks || []) as any[];
    },
  });
}

export function useSetMentorBreakMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/mentor/availability/break", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to set break");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.breaks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useDeleteBreakMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/mentor/availability/break/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete break");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.breaks() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useMentorCalendarConnections() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.calendar(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability/calendar");
      if (!res.ok) {
        throw new Error("Failed to load calendar connections");
      }
      const json = await res.json();
      return (json.data?.connections || []) as any[];
    },
  });
}

export function useToggleCalendarSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ connectionId, syncEnabled }: { connectionId: string; syncEnabled: boolean }) => {
      const res = await fetch("/api/mentor/availability/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, syncEnabled }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to toggle sync");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.calendar() });
    },
  });
}

// Mentor Bookings & Actions
export function useMentorBookingsList(tab?: string) {
  return useQuery({
    queryKey: queryKeys.mentorPortal.bookings(tab),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tab) params.set("tab", tab);
      const res = await fetch(`/api/mentor/bookings?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load mentor bookings");
      }
      const json = await res.json();
      return (json.data?.bookings || []) as any[];
    },
  });
}

export function useMentorBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.mentorPortal.bookingDetail(id),
    queryFn: async () => {
      const res = await fetch(`/api/mentor/bookings/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load booking detail");
      }
      const json = await res.json();
      return json.data?.booking || null;
    },
    enabled: !!id,
  });
}

export function useAcceptBookingRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/mentor/bookings/${bookingId}/accept`, {
        method: "POST",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to accept booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useDeclineBookingRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason: string }) => {
      const res = await fetch(`/api/mentor/bookings/${bookingId}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to decline booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useMarkNoShowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      party,
      notes,
    }: {
      bookingId: string;
      party: "STUDENT" | "MENTOR";
      notes?: string;
    }) => {
      const res = await fetch(`/api/mentor/bookings/${bookingId}/no-show`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ party, notes }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to mark no-show");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.dashboard() });
    },
  });
}

export function useMentorEarnings() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.earnings(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/earnings");
      if (!res.ok) {
        throw new Error("Failed to load earnings");
      }
      const json = await res.json();
      return json.data || null;
    },
  });
}

// ==========================================
// 4. Admin Portal Queries & Mutations
// ==========================================

export function useAdminVerifications() {
  return useQuery({
    queryKey: queryKeys.admin.verifications(),
    queryFn: async () => {
      const res = await fetch("/api/admin/verifications");
      if (!res.ok) {
        return [] as any[];
      }
      const json = await res.json();
      return (json.data?.applicants || []) as any[];
    },
  });
}

export function useApproveMentorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mentorId: string) => {
      const res = await fetch(`/api/admin/verifications/${mentorId}/approve`, {
        method: "POST",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to approve mentor");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.verifications() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}

export function useRejectMentorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentorId, reason }: { mentorId: string; reason: string }) => {
      const res = await fetch(`/api/admin/verifications/${mentorId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to reject mentor");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.verifications() });
    },
  });
}

// ==========================================
// 5. Booking Details & Lifecycle Mutations
// ==========================================

export function useBookingDetail(bookingId: string) {
  return useQuery({
    queryKey: ["booking", "detail", bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (!res.ok) {
        throw new Error("Failed to load booking details");
      }
      const json = await res.json();
      return json.data?.booking || null;
    },
    enabled: !!bookingId,
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason: string }) => {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to cancel booking");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.bookings() });
      queryClient.invalidateQueries({ queryKey: ["booking", "detail", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}

export function useRescheduleBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      newSlotId,
      reason,
    }: {
      bookingId: string;
      newSlotId: string;
      reason?: string;
    }) => {
      const res = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSlotId, reason }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to reschedule booking");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.bookings() });
      queryClient.invalidateQueries({ queryKey: ["booking", "detail", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}

export function useCompleteBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      actionPlanDeliverable,
    }: {
      bookingId: string;
      actionPlanDeliverable?: string;
    }) => {
      const res = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionPlanDeliverable }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to complete booking");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.bookings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.sessions() });
      queryClient.invalidateQueries({ queryKey: ["mentor", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", "detail", variables.bookingId] });
    },
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { bookingId: string; mentorId: string; rating: number; comment: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to submit review");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.bookings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}
