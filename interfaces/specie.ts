enum SpecieNameEnum {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  REPTILE = 'reptile',
  OTHER = 'other'
}

interface Specie {
  id: string;
  name: SpecieNameEnum;
  created_at: Date;
  updated_at: Date;
}