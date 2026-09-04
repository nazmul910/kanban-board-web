import { baseApi } from "../../api/baseApi";
import { IColumn } from "./columnInterface";

export const columnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getColumnsByBoard: builder.query<
      { success: boolean; data: IColumn[] },
      string
    >({
      query: (boardId) => ({
        url: `/columns/board/${boardId}`,
        method: "GET",
      }),
      providesTags: ["Column"],
    }),

    createColumn: builder.mutation<
      { success: boolean; data: IColumn },
      { title: string; boardId: string }
    >({
      query: (body) => ({
        url: "/columns",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Column",
      ],
    }),

    updateColumn: builder.mutation<
      { success: boolean; data: IColumn },
      { id: string; boardId: string; title: string }
    >({
      query: ({ id, title }) => ({
        url: `/columns/${id}`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Column",
      ],
    }),

    deleteColumn: builder.mutation<
      { success: boolean; message: string },
      { id: string; boardId: string }
    >({
      query: ({ id }) => ({
        url: `/columns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Column",
      ],
    }),

    reorderColumns: builder.mutation<
      { success: boolean; data: IColumn[] },
      { boardId: string; columnIds: string[] }
    >({
      query: ({ boardId, columnIds }) => ({
        url: `/columns/board/${boardId}/reorder`,
        method: "PATCH",
        body: { columnIds },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "Board", id: boardId },
        "Column",
      ],
    }),
  }),
});

export const {
  useGetColumnsByBoardQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useReorderColumnsMutation,
} = columnApi;
