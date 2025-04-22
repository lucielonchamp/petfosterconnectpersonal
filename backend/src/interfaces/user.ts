import { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {}

export interface UserWithRole extends User {
  role: {
    id: string;
    name: string;
  };
}
