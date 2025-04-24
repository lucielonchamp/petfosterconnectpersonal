export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  ANIMAL_DETAIL = '/animal/:id',
  ANIMALS = '/animals',
  SHELTERS = '/associations',
  SHELTERBYID = '/association/:id',

  // Connected Base Route
  DASHBOARD = '/dashboard',

  // --- Nested under DASHBOARD ---
  // Define these as RELATIVE paths
  REQUESTS = '/requests',
  ADD_REQUEST = '/request/add/:animalId',
  SHELTER_PROFILE = 'shelter/profile',
  FOSTER_PROFILE = 'foster/profile',

}