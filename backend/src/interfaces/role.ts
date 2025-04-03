import { Role as PrismaRole } from '@prisma/client';

export interface Role extends PrismaRole { }

export interface RoleWithUsers extends Role {
  users: {
    id: string;
    email: string;
  }[];
}

export enum RoleEnum {
  SHELTER = 'shelter',
  FOSTER = 'foster'
}