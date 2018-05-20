export interface User {
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  createdAt?: Date | string;
}

export enum UserRole {
  Client = 'client',
  Vendor = 'vendor'
}

export interface UserWithPassword extends User {
  password: string;
}
