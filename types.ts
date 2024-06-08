export interface Dog {
  id: string;
  name: string;
  description: string;
  age: number;
  gender: string;
  imageUrl: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  dogId: Array<string>;
  role: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}
