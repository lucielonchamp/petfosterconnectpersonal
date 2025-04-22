export interface Shelter {
  id: string;
  name: string;
  location: string;
  description: string;
}

export interface ShelterWithUser extends Shelter {
  user: {
    id: string;
    email: string;
    password?: string;
    roleId?: string;
  };
}
