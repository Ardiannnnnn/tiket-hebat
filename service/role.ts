import api from "./api";

export interface Role {
  id: number;
  role_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GetRolesResponse {
  status: boolean;
  message: string;
  data: Role[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

export const getRoles = async () => {
  try {
    const response = await api.get<GetRolesResponse>("/roles?page=1&limit=5");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};