import { AnimalStatus } from '../interfaces/animal';

interface StatusConfig {
  label: string;
  color: string;
}

const STATUS_CONFIG: Record<AnimalStatus, StatusConfig> = {
  [AnimalStatus.FOSTERED]: {
    label: 'En famille d\'accueil',
    color: '#10B981', // vert
  },
  [AnimalStatus.WAITING]: {
    label: 'En attente',
    color: '#F59E0B', // orange
  },
  [AnimalStatus.SHELTERED]: {
    label: 'Au refuge',
    color: '#5B6C97', // bleu
  },
};

export const getStatusLabel = (status: AnimalStatus): string => {
  return STATUS_CONFIG[status]?.label || 'Statut inconnu';
};

export const getStatusColor = (status: AnimalStatus): string => {
  return STATUS_CONFIG[status]?.color || '#64748B'; // gris par défaut
};

export const capitalizeFirstLetter = (string: string): string => {
  return string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase();
}; 