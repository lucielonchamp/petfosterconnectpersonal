import { RoleEnum } from "./role";

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

export interface UserWithRelations extends User {
  role: {
    id: string;
    name: RoleEnum;
  };
  shelter: {
    id: string;
    name: string;
    address: string;
  };
  foster: {
    id: string;
  };
};