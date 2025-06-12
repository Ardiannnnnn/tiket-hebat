export interface User {
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
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface GetUsersResponse {
  status: boolean;
  message: string;
  data: User[];
  meta: Meta;
}

export interface UserResponse {
  status: boolean;
  message: string;
  data: User;
}