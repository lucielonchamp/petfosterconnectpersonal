enum AnimalStatusEnum {
  FOSTERED = 'fostered',
  WAITING = 'waiting',
  SHELTERED = 'sheltered',
}

interface Animal {
  id: string;
  name: string;
  picture: string;
  specie_id: string;
  breed: string;
  sex: string;
  age: number;
  description: string;
  status: AnimalStatusEnum;
  shelter_id: string;
  created_at: Date;
  updated_at: Date;
}