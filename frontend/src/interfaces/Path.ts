export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',

  // Connected Base Route
  DASHBOARD = '/dashboard',

  // --- Nested under DASHBOARD ---
  // Define these as RELATIVE paths
  ANIMALS = '/animals',
  REQUESTS = '/requests',
  SHELTER_PROFILE = 'shelter/profile',
  FOSTER_PROFILE = 'foster/profile'
}