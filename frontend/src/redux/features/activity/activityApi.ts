import { baseApi } from "../../api/baseApi";
import { IActivity } from "./activityInterface";

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoardActivities: builder.query<
      { success: boolean; data: IActivity[] },
      string
    >({
      query: (boardId) => ({
        url: `/boards/${boardId}/activities`,
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),

    getTaskActivities: builder.query<
      { success: boolean; data: IActivity[] },
      string
    >({
      query: (taskId) => ({
        url: `/tasks/${taskId}/activities`,
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetBoardActivitiesQuery, useGetTaskActivitiesQuery } =
  activityApi;
