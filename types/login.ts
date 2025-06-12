export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: {
      id: number;
      role_name: string;
      description: string;
    };
    created_at: string;
    updated_at: string;
    access_token?: string; // Make it optional with '?' since it might come separately
  };
}

// You can also create a separate type for token if needed
export interface TokenResponse {
  access_token: string;
}
