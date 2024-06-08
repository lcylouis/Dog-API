import axios, { AxiosResponse } from "axios";

const API_URL =
  "https://6a8af7ff-46e5-4a76-8dd6-ac8cc296d1c0-00-1bhptioq723n1.sisko.replit.dev";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  dogId: string;
  role: string;
  token?: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  dogId: string;
  role: string;
}

export interface Dog {
  id: string;
  name: string;
  description: string;
  age: number;
  gender: string;
  imageUrl: string;
}

export interface DogRequest {
  name: string;
  description: string;
  age: number;
  gender: string;
  imageUrl: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
}

export const getUsers = async (): Promise<User[]> =>
  (await axios.get<User[]>(`${API_URL}/users`)).data;

export const createUser = async (data: UserRequest): Promise<User> =>
  (await axios.post<User>(`${API_URL}/users`, data)).data;

export const updateUser = async (
  userId: string,
  data: UserRequest,
): Promise<User> =>
  (await axios.put<User>(`${API_URL}/users/${userId}`, data)).data;

export const deleteUser = async (userId: string): Promise<void> =>
  await axios.delete(`${API_URL}/users/${userId}`);

export const getDogs = async (): Promise<Dog[]> =>
  (await axios.get<Dog[]>(`${API_URL}/dogs`)).data;

export const createDog = async (data: DogRequest): Promise<Dog> =>
  (await axios.post<Dog>(`${API_URL}/dogs`, data)).data;

export const updateDog = async (id: string, data: DogRequest): Promise<Dog> =>
  (await axios.put<Dog>(`${API_URL}/dogs/${id}`, data)).data;

export const deleteDog = async (id: string): Promise<void> =>
  await axios.delete(`${API_URL}/dogs/${id}`);
