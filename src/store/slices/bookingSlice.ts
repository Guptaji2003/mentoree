import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  selectedMentorId: string | null;
  selectedSlotId: string | null;
  selectedSlotDate: string | null;
  selectedSlotTime: string | null;
  bookingStep: "SELECT_SLOT" | "REVIEW" | "PAYMENT" | "CONFIRMED";
  notes: string;
}

const initialState: BookingState = {
  selectedMentorId: null,
  selectedSlotId: null,
  selectedSlotDate: null,
  selectedSlotTime: null,
  bookingStep: "SELECT_SLOT",
  notes: "",
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startBooking: (state, action: PayloadAction<{ mentorId: string }>) => {
      state.selectedMentorId = action.payload.mentorId;
      state.selectedSlotId = null;
      state.bookingStep = "SELECT_SLOT";
      state.notes = "";
    },
    selectSlot: (
      state,
      action: PayloadAction<{ slotId: string; date: string; time: string }>
    ) => {
      state.selectedSlotId = action.payload.slotId;
      state.selectedSlotDate = action.payload.date;
      state.selectedSlotTime = action.payload.time;
      state.bookingStep = "REVIEW";
    },
    setBookingStep: (
      state,
      action: PayloadAction<"SELECT_SLOT" | "REVIEW" | "PAYMENT" | "CONFIRMED">
    ) => {
      state.bookingStep = action.payload;
    },
    setBookingNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    resetBooking: (state) => {
      state.selectedMentorId = null;
      state.selectedSlotId = null;
      state.selectedSlotDate = null;
      state.selectedSlotTime = null;
      state.bookingStep = "SELECT_SLOT";
      state.notes = "";
    },
  },
});

export const {
  startBooking,
  selectSlot,
  setBookingStep,
  setBookingNotes,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
