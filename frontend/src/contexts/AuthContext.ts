import { createContext } from 'react';
import { AuthContextType } from '../types/auth.types';

// Valeurs par défaut du contexte
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  login: async () => {
    throw new Error("AuthContext n'est pas initialisé");
  },
  logout: async () => {
    throw new Error("AuthContext n'est pas initialisé");
  },
  checkAuth: async () => {
    throw new Error("AuthContext n'est pas initialisé");
  },
};

// Création du contexte avec les valeurs par défaut
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
