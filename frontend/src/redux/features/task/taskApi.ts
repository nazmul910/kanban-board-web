import { baseApi } from "../../api/baseApi";
import { ITask, IMoveTaskPayload } from "./taskInterface";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleTask: builder.query<{ success: boolean; data: ITask }, string>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    createTask: builder.mutation<
      { success: boolean; data: ITask },
      { title: string; description?: string; columnId: string; boardId: string }
    >({
      query: (args) => ({
        url: "/tasks",
        method: "POST",
        body: {
          title: args.title,
          description: args.description,
          columnId: args.columnId,
        },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
        "Task",
      ],
    }),

    updateTask: builder.mutation<
      { success: boolean; data: ITask },
      { id: string; boardId: string; title?: string; description?: string | null }
    >({
      query: ({ id, title, description }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: { title, description },
      }),
      invalidatesTags: (_result, _error, { boardId, id }) => [
        { type: "Board", id: boardId },
        { type: "Task", id },
        "Activity",
      ],
    }),

    deleteTask: builder.mutation<
      { success: boolean; message: string },
      { id: string; boardId: string }
    >({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
        "Task",
      ],
    }),

    moveTask: builder.mutation<
      { success: boolean; data: ITask },
      IMoveTaskPayload
    >({
      query: ({ id, destinationColumnId, destinationIndex }) => ({
        url: `/tasks/${id}/move`,
        method: "PATCH",
        body: { destinationColumnId, destinationIndex },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
      ],
    }),
  }),
});

export const {
  useGetSingleTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
} = taskApi;
