import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
    useEffect(() => {
        // Mettre à jour le titre de la page
        document.title = title;

        // Mettre à jour la description
        const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', description);
        document.head.appendChild(meta);
    }, [title, description]);

    return null;
};

export default SEO;
