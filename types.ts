export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  owner: {
    id: string;
    name: string;
  };
  imageUrl: string;
  description: string;
  gender: string;
  size: string;
}

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
  };
  receiver: {
    id: string;
    name: string;
  };
  createdAt: string;
}
