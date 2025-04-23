import {
  ArrowForward as ArrowForwardIcon,
  Female as FemaleIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Male as MaleIcon
} from '@mui/icons-material';
import {
  Breadcrumbs,
  Chip,
  Container,
  Link,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import Header from '../../components/layout/header/Header';
import ButtonPurple from '../../components/ui/ButtonPurple';
import { capitalizeFirstLetter, getStatusColor, getStatusLabel } from '../../helpers/statusHelper';
import { Animal, AnimalStatus, AnimalWithRelations } from '../../interfaces/animal';
import './AnimalDetail.css';
import ButtonBlue from '../../components/ui/ButtonBlue';
import { Path } from '../../interfaces/Path';
import { useAuth } from '../../hooks/useAuth';
import { RoleEnum } from '../../interfaces/role';

interface ApiResponse {
  success: boolean;
  message: string;
  data: Animal[];
}

const AnimalDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<AnimalWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shelterAnimals, setShelterAnimals] = useState<Animal[]>([]);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/animal/${id}`);
        const data = await response.json();

        if (data.success) {
          setAnimal(data.data);
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchShelterAnimals = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/animal/shelter/${animal?.shelter?.id}`);
        const result: ApiResponse = await response.json();

        // Filtrer pour exclure l'animal actuel
        const otherAnimals = result.data.filter(a => a?.id !== animal?.id);
        setShelterAnimals(otherAnimals);
      } catch (error) {
        console.error('Erreur lors du chargement des animaux:', error);
      }
    };

    fetchShelterAnimals();
  }, [animal?.id, animal?.shelter?.id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!animal) return <div className="not-found">Animal non trouvé</div>;

  return (
    <>
      <Header />
      <div className="animal-detail">
        <Container>
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="/"
              className="breadcrumb-link"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Accueil
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/animals"
              className="breadcrumb-link"
            >
              Animaux
            </Link>
            <Typography color="text.primary" className="breadcrumb-current">
              {animal.name}
            </Typography>
          </Breadcrumbs>
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
              <Typography variant="h1">
                {animal.name}
              </Typography>

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

              <Typography className="description">
                {animal.description}
              </Typography>

              <div className="shelter-info">
                <Typography variant="h2">
                  {animal.shelter?.name}
                </Typography>
                <div className="location">
                  <LocationIcon />
                  <Typography>{animal.shelter?.location}</Typography>
                </div>
                {
                  user?.role.name === RoleEnum.FOSTER && animal.status !== AnimalStatus.FOSTERED && (
                    <ButtonBlue
                      href={`${Path.DASHBOARD}${Path.ADD_REQUEST.replace(':animalId', animal.id)}`}
                      className="adoption-button"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Faire une demande d'accueil
                    </ButtonBlue>
                  )
                }
                <ButtonPurple
                  href={`/shelter/${animal.shelter?.id}`}
                  endIcon={<ArrowForwardIcon />}
                  className="shelter-button"
                >
                  Voir le refuge
                </ButtonPurple>
              </div>
            </div>
          </div>

          {shelterAnimals.length > 0 && (
            <div className="other-animals-section">
              <Typography variant="h3" className="section-title">
                Autres animaux du refuge
              </Typography>

              <div className="animals-grid">
                {shelterAnimals.map((animal) => (
                  <RouterLink
                    key={animal.id}
                    to={`/animal/${animal.id}`}
                    className="animal-card-mini"
                  >
                    <div className="animal-card-mini-image">
                      <img src={animal.picture} alt={animal.name} />
                    </div>
                    <div className="animal-info">
                      <Typography variant="h3">{animal.name}</Typography>
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
                  </RouterLink>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default AnimalDetail;