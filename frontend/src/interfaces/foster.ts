export interface Foster {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FosterWithUser extends Foster {
  user: {
    id: string;
    email: string;
    password?: string;
    roleId?: string;
  };
}
