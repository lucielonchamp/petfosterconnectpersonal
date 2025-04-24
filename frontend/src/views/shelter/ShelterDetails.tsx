import {
    Box,
    Chip,
    Container,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Shelter } from '../../interfaces/shelter';
import Header from '../../components/layout/header/Header';
import { AnimalStatus } from '../../interfaces/animal';

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
                console.log(data);

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
                <Header /> {/* Inclut le Header */}
            </Container>

            <Container maxWidth="xl">
                {/* Loading */}
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error || !shelter ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        {/* Breadcrumb */}
                        <Breadcrumbs sx={{ my: 4 }}>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/')}>
                                Accueil
                            </Link>
                            <Link underline="hover" color="inherit" onClick={() => navigate('/associations')}>
                                Associations
                            </Link>
                            <Typography color="text.primary">{shelter.name}</Typography>
                        </Breadcrumbs>

                        {/* Refuge Info */}
                        <Box display="flex" flexWrap="wrap" gap={4} my={12}>
                            <Box flex="1" minWidth="280px" justifyContent="center" display="flex">
                                <img
                                    src="https://www.la-spa.fr/app/app/uploads/2021/09/MicrosoftTeams-image-63.png"
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

                        {/* Animaux */}
                        <Typography variant="h2" fontWeight="bold" mb={3}>
                            Nous accueillons ses animaux dans notre refuge
                        </Typography>
                        {shelter.animals.length === 0 ? (
                            <Typography>Aucun animal actuellement</Typography>
                        ) : (
                            <Grid container spacing={6} pb={3}>
                                {shelter.animals.map((animal, i) => (
                                    <Grid key={i}>
                                        <Card sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0px 3px 10px 0px rgba(91, 108, 151, 0.2)', }}>
                                            <Box
                                                component="img"
                                                src={animal.picture}
                                                alt={animal.name}
                                                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                                            />
                                            <CardContent sx={{ padding: '30px' }}>
                                                <Typography fontWeight="bold" fontSize="1.1rem">
                                                    {animal.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {animal.specie.name} - {animal.breed} - {animal.age > 1 ? "ans" : "an"}
                                                </Typography>
                                                <Box mt={2}>
                                                    <Chip
                                                        label={animal.status}
                                                        color={
                                                            animal.status === AnimalStatus.FOSTERED ? "success" :
                                                                animal.status === AnimalStatus.WAITING ? "warning" :
                                                                    animal.status === AnimalStatus.SHELTERED ? "primary" : "default"
                                                        }
                                                        size="small"
                                                        sx={{ borderRadius: '6px', fontWeight: 500 }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}
