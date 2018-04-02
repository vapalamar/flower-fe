export interface User {
  id: number;
  email: string;
  createdAt?: Date | string;
}

export interface UserWithPassword extends User {
  password: string;
}
