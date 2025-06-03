import { Request as PrismaRequest } from '@prisma/client';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
}

export interface Request extends PrismaRequest {}

export interface RequestWithRelations extends Request {
  shelter: {
    id: string;
    name: string;
    location: string;
  };
  foster: {
    id: string;
    firstName: string;
    lastName: string;
  };
  animal: {
    id: string;
    name: string;
    specieId: string;
  };
}
