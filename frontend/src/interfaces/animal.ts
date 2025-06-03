export enum AnimalStatus {
  FOSTERED = 'fostered',
  WAITING = 'waiting',
  SHELTERED = 'sheltered',
}

export interface Animal {
  id: string;
  name: string;
  picture: string;
  specieId: string;
  breed: string;
  sex: string;
  age: number;
  description: string;
  status: AnimalStatus;
  shelterId: string;
  createdAt: Date;
  updatedAt: Date;
  fosterId?: string;
}

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
