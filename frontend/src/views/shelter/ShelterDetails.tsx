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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AnimalCard from '../../components/animal/AnimalCard';
import Header from '../../components/layout/header/Header';
import { Shelter } from '../../interfaces/shelter';
import Footer from '../../components/layout/footer/Footer';

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
            <Container maxWidth="xl">
                <Header />
            </Container>

            <Container maxWidth="xl">
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error || !shelter ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <Breadcrumbs sx={{ my: 4 }}>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
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
                                        height: '500px',
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
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Adresse
                                </Typography>
                                <Chip label={shelter.location} sx={{ mb: 2, mt: 1 }} />

                                <Typography variant="subtitle1" fontWeight={600}>
                                    Espèces présentes :
                                </Typography>
                                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                                    {uniqueSpecies.map((specie, i) => (
                                        <Chip key={i} label={specie} sx={{ backgroundColor: '#C6CBD8', color: '#fff' }} />
                                    ))}
                                </Box>
                            </Box>
                        </Box>

                        <Typography variant="h2" fontWeight="bold" mb={3}>
                            Nous accueillons ses animaux dans notre refuge
                        </Typography>
                        {shelter?.animals.length === 0 ? (
                            <Typography>Aucun animal actuellement</Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(3, 1fr)',
                                        md: 'repeat(4, 1fr)',
                                        lg: 'repeat(5, 1fr)'
                                    },
                                    gap: 2,
                                    pb: 3,

                                }}
                            >
                                {shelter?.animals.map((animal) => (
                                    <AnimalCard key={animal.id} animal={animal} variant="mini" />
                                ))}
                            </Box>
                        )}
                    </>
                )}
            </Container>
            <Container maxWidth="xl">
                <Footer />
            </Container>
        </>
    );
}
