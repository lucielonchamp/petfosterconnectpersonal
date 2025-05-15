import { ArrowForward as ArrowForwardIcon, Female as FemaleIcon, LocationOn as LocationIcon, Male as MaleIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Link } from 'react-router';
import { capitalizeFirstLetter, getStatusColor, getStatusLabel } from '../../helpers/statusHelper';
import { useAuth } from '../../hooks/useAuth';
import { AnimalStatus, AnimalWithRelations } from '../../interfaces/animal';
import { Path } from '../../interfaces/Path';
import { RoleEnum } from '../../interfaces/role';
import ButtonBlue from '../ui/ButtonBlue';
import ButtonPurple from '../ui/ButtonPurple';
import './AnimalCard.css';

interface AnimalCardProps {
  animal: AnimalWithRelations;
  variant?: 'mini' | 'full';
}

const AnimalCard = ({ animal, variant = 'full' }: AnimalCardProps) => {
  const { user } = useAuth();

  if (variant === 'mini') {
    return (
      <Link to={`/animal/${animal.id}`} className="animal-card-mini">
        <div className="animal-card-mini-image">
          <img width='200px' height='200px' loading="lazy" src={animal.picture} alt={animal.name} />
        </div>
        <div className="animal-info">
          <h3>{animal.name}</h3>
          <div className="animal-brief">
            <span>{animal.breed}</span>
            <span>•</span>
            <span>{animal.age} an{animal.age > 1 ? 's' : ''}</span>
          </div>
          <Chip
            label={getStatusLabel(animal.status)}
            size="small"
            sx={{
              backgroundColor: getStatusColor(animal.status),
              color: 'white',
              fontSize: '11px',
              height: '20px',
              fontWeight: 500,
            }}
          />
        </div>
      </Link>
    );
  }

  return (
    <div className="animal-card">
      <div className="image-container">
        <img src={animal.picture} alt={animal.name} />
        <div className="status-tag">
          <Chip
            label={getStatusLabel(animal.status)}
            sx={{
              backgroundColor: getStatusColor(animal.status),
              color: 'white',
              borderRadius: '4px',
              height: '32px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          />
        </div>
      </div>
      <div className="info-container">
        <h1>{animal.name}</h1>
        <div className="tags-container">
          <Chip
            label={capitalizeFirstLetter(animal.specie?.name)}
            className="info-tag"
          />
          <Chip
            label={capitalizeFirstLetter(animal.breed)}
            className="info-tag"
          />
          <Chip
            icon={animal.sex === 'Male' ? <MaleIcon /> : <FemaleIcon />}
            label={animal.sex === 'Male' ? 'Mâle' : 'Femelle'}
            className="info-tag"
          />
          <Chip
            label={`${animal.age} ${animal.age > 1 ? 'Ans' : 'An'}`}
            className="info-tag"
          />
        </div>
        <p className="description">{animal.description}</p>
        <div className="shelter-info">
          <h2>{animal.shelter?.name}</h2>
          <div className="location">
            <LocationIcon />
            <span>{animal.shelter?.location}</span>
          </div>
          {user?.role.name === RoleEnum.FOSTER && animal.status !== AnimalStatus.FOSTERED && (
            <ButtonBlue
              href={`${Path.DASHBOARD}${Path.ADD_REQUEST.replace(':animalId', animal.id)}`}
              className="adoption-button"
              endIcon={<ArrowForwardIcon />}
            >
              Faire une demande d'accueil
            </ButtonBlue>
          )}
          <ButtonPurple
            href={`${Path.SHELTERBYID.replace(':id', animal.shelter?.id)}`}
            endIcon={<ArrowForwardIcon />}
            className="shelter-button"
          >
            Voir le refuge
          </ButtonPurple>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard; 