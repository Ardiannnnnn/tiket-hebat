import api, { Baseapi } from "./api";
import type { User, GetUsersResponse, UserResponse } from "../types/user";

// Get users with pagination
export const getUsers = async (
  page: number = 1,
  limit: number = 5,
  search = ""
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (search.trim() !== "") {
      params.append("search", search.trim());
    }
    const response = await api.get<GetUsersResponse>(
      `/users?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch users:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// Get user by ID
// Get user by ID
export const getUserById = async (id: number): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch user:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
// Create new user
export const createUser = async (data: any): Promise<boolean> => {
  try {
    const response = await Baseapi.post<UserResponse>("/user/create", data);
    return true;
  } catch (error: any) {
    console.error(
      "Failed to create user:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// Update user
export const updateUser = async (id: number , userData: Partial<User>): Promise<boolean> => {
  try {
    const response = await Baseapi.put<UserResponse>(
      `/user/update/${id}`,
      userData
    );
    return true;
  } catch (error: any) {
    console.error(
      "Failed to update user:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: number) => {
  try {
    const response = await Baseapi.delete<UserResponse>(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to delete user:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
