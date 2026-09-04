import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITask } from "./taskInterface";

export interface ITaskState {
  selectedTaskId: string | null;
  editingTask: ITask | null;
  taskToDelete: ITask | null;
  activeDraggingTaskId: string | null;
  filterQuery: string;
}

const initialState: ITaskState = {
  selectedTaskId: null,
  editingTask: null,
  taskToDelete: null,
  activeDraggingTaskId: null,
  filterQuery: "",
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setEditingTask: (state, action: PayloadAction<ITask | null>) => {
      state.editingTask = action.payload;
    },
    setTaskToDelete: (state, action: PayloadAction<ITask | null>) => {
      state.taskToDelete = action.payload;
    },
    setActiveDraggingTaskId: (state, action: PayloadAction<string | null>) => {
      state.activeDraggingTaskId = action.payload;
    },
    setFilterQuery: (state, action: PayloadAction<string>) => {
      state.filterQuery = action.payload;
    },
    resetTaskState: (state) => {
      state.selectedTaskId = null;
      state.editingTask = null;
      state.taskToDelete = null;
      state.activeDraggingTaskId = null;
      state.filterQuery = "";
    },
  },
});

export const {
  setSelectedTaskId,
  setEditingTask,
  setTaskToDelete,
  setActiveDraggingTaskId,
  setFilterQuery,
  resetTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;
