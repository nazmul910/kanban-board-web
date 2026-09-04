import { baseApi } from "../../api/baseApi";
import {
  IAuthResponse,
  IGenericResponse,
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from "./authInterface";
import { clearUser, setUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.user) {
            dispatch(setUser(data.data.user));
          }
        } catch {}
      },
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<IGenericResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
          dispatch(baseApi.util.resetApiState());
        } catch {}
      },
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<IGenericResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch {
          dispatch(clearUser());
        }
      },
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
