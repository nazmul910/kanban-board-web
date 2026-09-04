import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import boardReducer from "./features/board/boardSlice";
import columnReducer from "./features/column/columnSlice";
import taskReducer from "./features/task/taskSlice";
import activityReducer from "./features/activity/activitySlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    board: boardReducer,
    column: columnReducer,
    task: taskReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
