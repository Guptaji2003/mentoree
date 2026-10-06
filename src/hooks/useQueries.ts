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
// 1. Mentors Queries & Mutations
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
// 3. Admin Portal Queries & Mutations
// ==========================================

export function useAdminVerifications() {
  return useQuery({
    queryKey: queryKeys.admin.verifications(),
    queryFn: async () => {
      const res = await fetch("/api/admin/verifications");
      if (!res.ok) {
        // Return fallback applicants if API is mock/empty
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
// 4. Mentor Portal Queries & Mutations
// ==========================================

export function useMentorAvailability() {
  return useQuery({
    queryKey: queryKeys.mentorPortal.availability(),
    queryFn: async () => {
      const res = await fetch("/api/mentor/availability");
      if (!res.ok) {
        return [] as any[];
      }
      const json = await res.json();
      return (json.data?.slots || []) as any[];
    },
  });
}

export function useCreateSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotData: { date: string; startTime: string; endTime: string }) => {
      const res = await fetch("/api/mentor/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotData),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to create slot");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.availability() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}

export function useDeleteSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slotId: string) => {
      const res = await fetch(`/api/mentor/availability/${slotId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to delete slot");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorPortal.availability() });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentors.all() });
    },
  });
}
