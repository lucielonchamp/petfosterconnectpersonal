export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused'
}

export interface Request {
  id: string;
  status: RequestStatus;
  fosterComment: string;
  shelterComment: string;
  answeredDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

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