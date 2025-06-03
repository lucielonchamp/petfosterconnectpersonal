import { Animal } from "./animal";
import { Foster } from "./foster";
import { Shelter } from "./shelter";

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
}

export interface Request {
  id: string;
  status: RequestStatus;
  animalId: string;
  fosterId: string;
  shelterId: string;
  fosterComment: string;
  shelterComment: string;
  answeredDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithRelations extends Request {
  shelter: Shelter;
  foster: Foster;
  animal: Animal;
}
