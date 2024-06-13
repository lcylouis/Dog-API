import axios, { AxiosResponse } from "axios";

const API_URL =
  "https://6a8af7ff-46e5-4a76-8dd6-ac8cc296d1c0-00-1bhptioq723n1.sisko.replit.dev";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  token?: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
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

export interface Message {
  id: string;
  userId: string;
  dogId: string;
  send: string;
  sendAt: string;
  reply: string;
  replyAt: string;
}

export interface MessageRequest {
  id: string;
  userId: string;
  dogId: string;
  send: string;
  sendAt: string;
  reply: string;
  replyAt: string;
}

export interface MessageUpdate {
  id: string;
  dogId: string;
  send: string;
}

export interface Doglist {
  id: string;
  userId: string;
  dogId: string;
}
export interface DoglistRequest {
  userId: string;
  dogId: string;
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

export const getDoglists = async (): Promise<Doglist[]> =>
  (await axios.get<Doglist[]>(`${API_URL}/doglists`)).data;

export const createDoglist = async (data: DoglistRequest): Promise<Doglist> =>
  (await axios.post<Doglist>(`${API_URL}/doglists`, data)).data;

export const updateDoglist = async (
  id: string,
  data: DoglistRequest,
): Promise<Doglist> =>
  (await axios.put<Doglist>(`${API_URL}/doglists/${id}`, data)).data;

export const deleteDoglist = async (id: string): Promise<void> =>
  await axios.delete(`${API_URL}/doglists/${id}`);

export const getDogs = async (): Promise<Dog[]> =>
  (await axios.get<Dog[]>(`${API_URL}/dogs`)).data;

export const createDog = async (data: DogRequest): Promise<Dog> =>
  (await axios.post<Dog>(`${API_URL}/dogs`, data)).data;

export const updateDog = async (id: string, data: DogRequest): Promise<Dog> =>
  (await axios.put<Dog>(`${API_URL}/dogs/${id}`, data)).data;

export const deleteDog = async (id: string): Promise<void> =>
  await axios.delete(`${API_URL}/dogs/${id}`);

export const getMessages = async (): Promise<Message[]> =>
  (await axios.get<Message[]>(`${API_URL}/messages`)).data;



export const createMessage = async (data: MessageRequest): Promise<Message> =>
  (await axios.post<Message>(`${API_URL}/messages`, data)).data;

export const updateMessage = async (
  messageId: string,
  data: MessageRequest,
): Promise<Message> =>
  (await axios.put<Message>(`${API_URL}/messages/${messageId}`, data)).data;

export const deleteMessage = async (messageId: string): Promise<void> =>
  await axios.delete(`${API_URL}/messages/${messageId}`);
