import { useEffect, useState } from 'react';

export const useCsrf = () => {
    const [csrfToken, setCsrfToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchCsrfToken = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/csrf-token`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success && data.token) {
                setCsrfToken(data.token);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du token CSRF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCsrfToken();
    }, []);

    return { csrfToken, isLoading };
}; 