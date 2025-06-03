import { ReactNode, useEffect, useState } from 'react';
import { AuthResponse } from '../types/auth.types';
import { AuthContext } from './AuthContext';
import { UserWithRelations } from '../interfaces/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await checkAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      const data: AuthResponse = await response.json();

      if (!data.success) {
        setUser(null);
        setError(null);
        return;
      }

      if (data.user) {
        setUser(data.user);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la vérification de l'authentification"
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
