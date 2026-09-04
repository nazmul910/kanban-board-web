import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoardState } from "./boardInterface";

const initialState: IBoardState = {
  selectedBoardId: null,
  searchQuery: "",
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setSelectedBoardId: (state, action: PayloadAction<string | null>) => {
      state.selectedBoardId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetBoardState: (state) => {
      state.selectedBoardId = null;
      state.searchQuery = "";
    },
  },
});

export const { setSelectedBoardId, setSearchQuery, resetBoardState } =
  boardSlice.actions;

export default boardSlice.reducer;
