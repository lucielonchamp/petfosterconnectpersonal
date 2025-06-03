import { RoleEnum } from "../interfaces/role";
import { UserWithRelations } from "../interfaces/user";

export interface User {
  id: string;
  email: string;
  role: {
    id: string;
    name: RoleEnum;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserWithRelations;
  data?: UserWithRelations;
}

export interface AuthContextType {
  user: UserWithRelations | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
