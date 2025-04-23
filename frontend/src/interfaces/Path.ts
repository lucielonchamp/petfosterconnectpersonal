export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  ANIMAL_DETAIL = '/animal/:id',
  ANIMALS = '/animals',

  // Connected Base Route
  DASHBOARD = '/dashboard',

  // --- Nested under DASHBOARD ---
  // Define these as RELATIVE paths
  REQUESTS = '/requests',
  SHELTER_PROFILE = 'shelter/profile',
  FOSTER_PROFILE = 'foster/profile',

}