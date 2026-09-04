import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IActivityState {
  isDrawerOpen: boolean;
  selectedBoardId: string | null;
  filterAction: string;
}

const initialState: IActivityState = {
  isDrawerOpen: false,
  selectedBoardId: null,
  filterAction: "ALL",
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    setSelectedBoardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBoardId = action.payload;
    },
    setFilterAction: (state, action: PayloadAction<string>) => {
      state.filterAction = action.payload;
    },
    resetActivityState: (state) => {
      state.isDrawerOpen = false;
      state.selectedBoardId = null;
      state.filterAction = "ALL";
    },
  },
});

export const {
  setIsDrawerOpen,
  setSelectedBoardId,
  setFilterAction,
  resetActivityState,
} = activitySlice.actions;

export default activitySlice.reducer;
