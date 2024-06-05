export interface User {
  id: string;
  username: string;
  email: string;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  username: string;
  email: string;
}
