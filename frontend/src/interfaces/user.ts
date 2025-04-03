export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithRole extends User {
  role: {
    id: string;
    name: string;
  };
}