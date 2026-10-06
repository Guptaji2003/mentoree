import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  activeAuthModal: "login" | "signup" | null;
  isInspectMentorModalOpen: boolean;
  inspectingMentorId: string | null;
  isCareerLoopModalOpen: boolean;
  toasts: ToastNotification[];
}

const initialState: UIState = {
  sidebarOpen: false,
  sidebarCollapsed: false,
  activeAuthModal: null,
  isInspectMentorModalOpen: false,
  inspectingMentorId: null,
  isCareerLoopModalOpen: false,
  toasts: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    openAuthModal: (state, action: PayloadAction<"login" | "signup">) => {
      state.activeAuthModal = action.payload;
    },
    closeAuthModal: (state) => {
      state.activeAuthModal = null;
    },
    openInspectMentorModal: (state, action: PayloadAction<string>) => {
      state.isInspectMentorModalOpen = true;
      state.inspectingMentorId = action.payload;
    },
    closeInspectMentorModal: (state) => {
      state.isInspectMentorModalOpen = false;
      state.inspectingMentorId = null;
    },
    setCareerLoopModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCareerLoopModalOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastNotification, "id">>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  openAuthModal,
  closeAuthModal,
  openInspectMentorModal,
  closeInspectMentorModal,
  setCareerLoopModalOpen,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
