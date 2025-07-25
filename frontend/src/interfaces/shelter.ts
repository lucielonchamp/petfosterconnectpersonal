import { AnimalWithRelations } from "./animal";

export interface Shelter {
  animals: AnimalWithRelations[];
  isRemoved: boolean;
  id: string;
  name: string;
  location: string;
  description: string;
  picture: string;
}

export interface ShelterWithUser extends Shelter {
  user: {
    id: string;
    email: string;
    password?: string;
    roleId?: string;
  };
}
