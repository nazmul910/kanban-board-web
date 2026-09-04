import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    credentials: "include", 
  }),
  tagTypes: ["User", "Board", "Column", "Task", "Activity"],
  endpoints: () => ({}),
});
