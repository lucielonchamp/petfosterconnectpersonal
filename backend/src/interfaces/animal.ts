import { Animal as PrismaAnimal } from '@prisma/client';

export enum AnimalStatus {
  FOSTERED = 'fostered',
  WAITING = 'waiting',
  SHELTERED = 'sheltered',
}

export interface Animal extends PrismaAnimal {}

export interface AnimalWithRelations extends Animal {
  specie: {
    id: string;
    name: string;
  };
  shelter: {
    id: string;
    name: string;
    location: string;
  };
  foster?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
