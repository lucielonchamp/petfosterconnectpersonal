export enum SpecieNameEnum {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  REPTILE = 'reptile',
  OTHER = 'other',
}

export interface Specie {
  id: string;
  name: SpecieNameEnum;
}

export interface SpecieWithAnimals extends Specie {
  animals: {
    id: string;
    name: string;
    status: string;
  }[];
}
