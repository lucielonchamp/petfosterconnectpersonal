enum RequestStatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused'
}

interface Request {
  id: string;
  status: RequestStatusEnum;
  foster_comment?: string;
  shelter_comment?: string;
  answered_date?: Date;
  created_at: Date;
  shelter_id: string;
  foster_id: string;
  animal_id: string;
  updated_at: Date;
}