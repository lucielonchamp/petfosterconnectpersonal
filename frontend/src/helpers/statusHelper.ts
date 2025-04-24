import { AnimalStatus } from '../interfaces/animal';
import { RequestStatus } from '../interfaces/request';

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

export const getRequestStatusLabel = (status: RequestStatus): string => {
  switch (status) {
    case RequestStatus.PENDING:
      return 'En attente';
    case RequestStatus.ACCEPTED:
      return 'Acceptée';
    case RequestStatus.REFUSED:
      return 'Refusée';
    default:
      return 'Inconnu';
  }
};

export const getRequestStatusColor = (status: RequestStatus): string => {
  switch (status) {
    case RequestStatus.PENDING:
      return 'warning.main';
    case RequestStatus.ACCEPTED:
      return 'success.main';
    case RequestStatus.REFUSED:
      return 'error.main';
    default:
      return 'grey.500';
  }
};