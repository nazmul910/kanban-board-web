import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IColumnState {
  isAddingColumn: boolean;
  editingColumnId: string | null;
  columnToDeleteId: string | null;
}

const initialState: IColumnState = {
  isAddingColumn: false,
  editingColumnId: null,
  columnToDeleteId: null,
};

export const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setIsAddingColumn: (state, action: PayloadAction<boolean>) => {
      state.isAddingColumn = action.payload;
    },
    setEditingColumnId: (state, action: PayloadAction<string | null>) => {
      state.editingColumnId = action.payload;
    },
    setColumnToDeleteId: (state, action: PayloadAction<string | null>) => {
      state.columnToDeleteId = action.payload;
    },
    resetColumnState: (state) => {
      state.isAddingColumn = false;
      state.editingColumnId = null;
      state.columnToDeleteId = null;
    },
  },
});

export const {
  setIsAddingColumn,
  setEditingColumnId,
  setColumnToDeleteId,
  resetColumnState,
} = columnSlice.actions;

export default columnSlice.reducer;
