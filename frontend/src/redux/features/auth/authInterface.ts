export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken?: string;
  };
}

export interface IGenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
