export interface MeResponse {
  status: boolean;
  message: string;
  data: MeUserData;
}

export interface MeUserData {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  role_name: string;
  description: string;
}
