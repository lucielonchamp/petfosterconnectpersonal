import { Specie as PrismaSpecie } from '@prisma/client';

export enum SpecieNameEnum {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  REPTILE = 'reptile',
  OTHER = 'other',
}

export interface Specie extends PrismaSpecie {}

export interface SpecieWithAnimals extends Specie {
  animals: {
    id: string;
    name: string;
    status: string;
  }[];
}
