import { Shelter as PrismaShelter } from '@prisma/client';

export interface Shelter extends PrismaShelter {}

export interface ShelterWithUser extends Shelter {
  user: {
    id: string;
    email: string;
    roleId: string;
  };
}
