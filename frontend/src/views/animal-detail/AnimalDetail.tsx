import {
  Home as HomeIcon
} from '@mui/icons-material';
import {
  Breadcrumbs,
  Container,
  Link,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AnimalCard from '../../components/animal/AnimalCard';
import Header from '../../components/layout/header/Header';
import { AnimalWithRelations } from '../../interfaces/animal';
import './AnimalDetail.css';
import Footer from '../../components/layout/footer/Footer';

interface ApiResponse {
  success: boolean;
  message: string;
  data: AnimalWithRelations[];
}

const AnimalDetail = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<AnimalWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shelterAnimals, setShelterAnimals] = useState<AnimalWithRelations[]>([]);

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

          <AnimalCard animal={animal} />

          {shelterAnimals.length > 0 && (
            <div className="other-animals-section">
              <Typography variant="h3" className="section-title">
                Autres animaux du refuge
              </Typography>

              <div className="animals-grid">
                {shelterAnimals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} variant="mini" />
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default AnimalDetail;