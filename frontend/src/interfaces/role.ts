export interface Role {
  id: string;
  name: string;
}

export interface RoleWithUsers extends Role {
  users: {
    id: string;
    email: string;
  }[];
}

export enum RoleEnum {
  FOSTER = 'foster',
  SHELTER = 'shelter',
  ADMIN = 'admin'
}
