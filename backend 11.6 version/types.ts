export interface Dog {
  id: string;
  name: string;
  description: string;
  age: number;
  gender: string;
  imageUrl: string;
}

export interface Doglist {
  id: string;
  userId: string;
  dogId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
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
