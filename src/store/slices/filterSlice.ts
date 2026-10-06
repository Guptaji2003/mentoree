import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedCompany: string;
  maxPrice: number;
  minRating: number;
  minExperience: number;
  onlyWithSlots: boolean;
  onlyVerifiedCorporate: boolean;
  sortBy: string;
  viewMode: "grid" | "list";
}

const initialState: FilterState = {
  searchTerm: "",
  selectedCategory: "All",
  selectedCompany: "All",
  maxPrice: 3000,
  minRating: 0,
  minExperience: 0,
  onlyWithSlots: false,
  onlyVerifiedCorporate: false,
  sortBy: "recommended",
  viewMode: "grid",
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompany = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setMinExperience: (state, action: PayloadAction<number>) => {
      state.minExperience = action.payload;
    },
    setOnlyWithSlots: (state, action: PayloadAction<boolean>) => {
      state.onlyWithSlots = action.payload;
    },
    setOnlyVerifiedCorporate: (state, action: PayloadAction<boolean>) => {
      state.onlyVerifiedCorporate = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    resetFilters: (state) => {
      state.searchTerm = "";
      state.selectedCategory = "All";
      state.selectedCompany = "All";
      state.maxPrice = 3000;
      state.minRating = 0;
      state.minExperience = 0;
      state.onlyWithSlots = false;
      state.onlyVerifiedCorporate = false;
      state.sortBy = "recommended";
    },
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSelectedCompany,
  setMaxPrice,
  setMinRating,
  setMinExperience,
  setOnlyWithSlots,
  setOnlyVerifiedCorporate,
  setSortBy,
  setViewMode,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
