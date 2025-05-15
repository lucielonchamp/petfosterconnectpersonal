import {
    Alert,
    Box,
    Breadcrumbs,
    Chip,
    CircularProgress,
    Container,
    Link,
    Typography,
} from '@mui/material';
import {
    Home as HomeIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AnimalCard from '../../components/animal/AnimalCard';
import Header from '../../components/layout/header/Header';
import { Shelter } from '../../interfaces/shelter';
import Footer from '../../components/layout/footer/Footer';
import '../animal-detail/AnimalDetail.css';
import SEO from '../../components/layout/seo/SEO';

const API_URL = import.meta.env.VITE_API_URL;

export default function ShelterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [shelter, setShelter] = useState<Shelter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error] = useState<string | null>(null);

    useEffect(() => {
        const fetchShelter = async () => {
            try {
                const res = await fetch(`${API_URL}/shelter/${id}`);
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();

                if (data?.data?.isRemoved) {
                    navigate("/associations")
                }

                setShelter(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchShelter();
    }, [id]);

    const uniqueSpecies = [...new Set(shelter?.animals?.map((a) => a.specie.name))];

    return (
        <>
            <SEO
                title={`${shelter?.name} - Association - PetFoster`}
                description={`En savoir plus sur l'association ${shelter?.name}, partenaire de PetFoster.`}
            />
            <Header />
            <Container maxWidth="xl">
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error || !shelter ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Container sx={{ padding: 0 }}>
                        <Breadcrumbs sx={{ marginBottom: '20px' }}>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                                Accueil
                            </Link>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/associations')}>
                                Associations
                            </Link>
                            <Typography color="text.primary">{shelter.name}</Typography>
                        </Breadcrumbs>

                        <Box display="flex" flexWrap="wrap" gap={4} my={12}>
                            <Box flex="1" minWidth="280px" justifyContent="center" display="flex"
                                sx={{
                                    '& img': {
                                        width: '100%',
                                        height: { xs: '200px', xl: '500px' },
                                        aspectRatio: '1 / 1',
                                        objectFit: 'contain',
                                    }
                                }}>
                                <img
                                    src={shelter.picture}
                                    alt={shelter.name}
                                />
                            </Box>

                            <Box flex="1" minWidth="300px">
                                <Typography variant="h4" fontWeight="bold" mb={2}>
                                    {shelter.name}
                                </Typography>
                                <Typography variant="body1" mb={3}>
                                    {shelter.description}
                                </Typography>
                                <Typography component="p" variant="subtitle1" fontWeight={600}>
                                    Adresse
                                </Typography>
                                <Chip label={shelter.location} sx={{ mb: 2, mt: 1, backgroundColor: 'var(--color-purple)', color: '#fff' }} />

                                <Typography component="p" variant="subtitle1" fontWeight={600}>
                                    Espèces présentes :
                                </Typography>
                                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                                    {uniqueSpecies.map((specie, i) => (
                                        <Chip key={i} label={specie} sx={{ backgroundColor: 'var(--color-purple)', color: '#fff' }} />
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="h3" fontWeight="bold" mb={3}>
                            Nous accueillons ses animaux dans notre refuge
                        </Typography>
                        {shelter?.animals.length === 0 ? (
                            <Typography>Aucun animal actuellement</Typography>
                        ) : (
                            <div className="animals-grid">
                                {shelter?.animals.map((animal) => (
                                    <AnimalCard key={animal.id} animal={animal} variant="mini" />
                                ))}
                            </div>
                        )}
                    </Container>
                )}
            </Container >
            <Container maxWidth="xl">
                <Footer />
            </Container>
        </>
    );
}
