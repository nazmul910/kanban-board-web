import { baseApi } from "../../api/baseApi";
import { IBoard, IBoardMember, BoardRole } from "./boardInterface";

export const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query<{ success: boolean; data: IBoard[] }, void>({
      query: () => ({
        url: "/boards",
        method: "GET",
      }),
      providesTags: ["Board"],
    }),

    getBoardById: builder.query<{ success: boolean; data: IBoard }, string>({
      query: (boardId) => ({
        url: `/boards/${boardId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Board", id },
        { type: "Column", id: "LIST" },
        { type: "Task", id: "LIST" },
      ],
    }),

    createBoard: builder.mutation<
      { success: boolean; data: IBoard },
      { title: string }
    >({
      query: (body) => ({
        url: "/boards",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Board"],
    }),

    updateBoard: builder.mutation<
      { success: boolean; data: IBoard },
      { id: string; title: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/boards/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Board", id },
        "Board",
      ],
    }),

    deleteBoard: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board"],
    }),

    shareBoard: builder.mutation<
      { success: boolean; data: IBoardMember },
      { boardId: string; email: string; role?: BoardRole }
    >({
      query: ({ boardId, ...body }) => ({
        url: `/boards/${boardId}/members`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
      ],
    }),

    updateMemberRole: builder.mutation<
      { success: boolean; data: IBoardMember },
      { boardId: string; memberId: string; role: BoardRole }
    >({
      query: ({ boardId, memberId, role }) => ({
        url: `/boards/${boardId}/members/${memberId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
      ],
    }),

    removeMember: builder.mutation<
      { success: boolean; message: string },
      { boardId: string; memberId: string }
    >({
      query: ({ boardId, memberId }) => ({
        url: `/boards/${boardId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Activity",
      ],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardByIdQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useShareBoardMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} = boardApi;
