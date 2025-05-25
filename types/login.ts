export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  status: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
