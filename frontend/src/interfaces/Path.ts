export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  ANIMAL_DETAIL = '/animal/:id',
  ANIMALS = '/animals',
  SHELTERS = '/associations',
  SHELTERBYID = '/association/:id',

  // Terms
  TERMSSERVICE = '/terms-service',
  LEGALNOTICE = '/legal-notice',
  PRIVACYPOLICY = '/privacy-policy',

  // Connected Base Route
  DASHBOARD = '/dashboard',

  // --- Nested under DASHBOARD ---
  // Define these as RELATIVE paths
  REQUESTS = '/requests',
  REQUEST = '/request/:requestId',
  ADD_REQUEST = '/request/add/:animalId',
  SHELTER_PROFILE = '/shelter/profile',
  FOSTER_PROFILE = '/foster/profile',
  ANIMAL_EDIT = '/animal/edit/:id',
  ANIMAL_CREATE = '/animal/create',

}