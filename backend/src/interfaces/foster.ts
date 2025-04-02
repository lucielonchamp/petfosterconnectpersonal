import { Foster as PrismaFoster } from '@prisma/client';

export interface Foster extends PrismaFoster { }

export interface FosterWithUser extends Foster {
  user: {
    id: string;
    email: string;
    roleId: string;
  };
}
