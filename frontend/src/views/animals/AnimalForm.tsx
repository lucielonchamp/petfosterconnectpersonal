import { ArrowBack, Delete, PhotoCamera, Save } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useCsrf } from '../../hooks/useCsrf';
import { AnimalStatus } from '../../interfaces/animal';
import { Path } from '../../interfaces/Path';
import { RoleEnum } from '../../interfaces/role';

interface AnimalFormData {
    name: string;
    age: number;
    breed: string;
    description: string;
    sex: 'Male' | 'Female';
    status: AnimalStatus;
    shelterId: string;
    specieId: string;
    picture?: File;
}

const AnimalForm = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { csrfToken, isLoading: isCsrfLoading } = useCsrf();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [species, setSpecies] = useState<{ id: string; name: string }[]>([]);
    const [formData, setFormData] = useState<AnimalFormData>({
        name: '',
        age: 0,
        breed: '',
        description: '',
        sex: 'Male',
        status: AnimalStatus.SHELTERED,
        shelterId: '',
        specieId: '',
    });
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (user?.role?.name !== RoleEnum.SHELTER) {
            navigate(Path.DASHBOARD);
        }

        const fetchData = async () => {
            if (isCsrfLoading) {
                return;
            }

            try {
                await fetchUserShelter();
                await fetchSpecies();
                if (id) {
                    await fetchAnimal();
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };

        fetchData();
    }, [id, user, isCsrfLoading]);

    const fetchUserShelter = async () => {
        try {
            const response = await fetch(`${API_URL}/user/${user?.id}/shelter`, {
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });
            const { data } = await response.json();
            if (data?.Shelter?.id) {
                setFormData(prev => ({
                    ...prev,
                    shelterId: data.Shelter.id
                }));
            } else {
                setError('Vous devez être associé à un refuge pour créer un animal');
                navigate(Path.DASHBOARD);
            }
        } catch (error) {
            setError('Erreur lors de la récupération du refuge');
            navigate(Path.DASHBOARD);
        }
    };

    const fetchSpecies = async () => {
        try {
            const response = await fetch(`${API_URL}/species`, {
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });
            const { data } = await response.json();
            setSpecies(data);
        } catch (error) {
            setError('Erreur lors du chargement des espèces');
        }
    };

    const fetchAnimal = async () => {
        try {
            const response = await fetch(`${API_URL}/animal/${id}`, {
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });
            const { data } = await response.json();
            if (data) {
                setFormData({
                    name: data.name,
                    age: data.age,
                    breed: data.breed,
                    description: data.description,
                    sex: data.sex || 'Male',
                    status: data.status || AnimalStatus.SHELTERED,
                    shelterId: data.shelterId,
                    specieId: data.specieId,
                });
                if (data.picture) {
                    setPreviewUrl(data.picture);
                }
            }
        } catch (error) {
            setError('Erreur lors du chargement de l\'animal');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string | AnimalStatus>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                picture: file
            }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'picture' && value instanceof File) {
                formDataToSend.append('picture', value);
            } else if (value !== undefined && key !== 'picture') {
                formDataToSend.append(key, value.toString());
            }
        });

        if (user?.id) {
            formDataToSend.append('userId', user.id);
        }

        try {
            const url = id ? `${API_URL}/animal/${id}` : `${API_URL}/animal`;
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde');
            }

            setSuccess(id ? 'Animal mis à jour avec succès' : 'Animal créé avec succès');
            setTimeout(() => navigate(Path.DASHBOARD), 2000);
        } catch (error) {
            setError('Erreur lors de la sauvegarde de l\'animal');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;

        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/animal/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfToken
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            setSuccess('Animal supprimé avec succès');
            setTimeout(() => navigate(Path.DASHBOARD), 2000);
        } catch (error) {
            setError('Erreur lors de la suppression de l\'animal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    mb: 4
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* En-tête */}
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: isMobile ? 2 : 0,
                                mb: 3
                            }}
                        >
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                {id ? 'Modifier un animal' : 'Ajouter un nouvel animal'}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={() => navigate(Path.DASHBOARD)}
                                sx={{
                                    borderRadius: '8px',
                                    borderColor: 'var(--color-primary, #5b6c97)',
                                    color: 'var(--color-primary, #5b6c97)'
                                }}
                            >
                                Retour
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                    </Box>

                    {/* Alertes */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                            {/* Section gauche - image */}
                            <Box sx={{ flex: isMobile ? '1 1 auto' : '1' }}>
                                <Card
                                    elevation={0}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 3,
                                        backgroundColor: 'rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            borderRadius: 2,
                                            backgroundColor: previewUrl ? 'transparent' : 'rgba(0,0,0,0.05)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            overflow: 'hidden',
                                            mb: 2,
                                            border: '1px dashed rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Aperçu"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        ) : (
                                            <Typography color="text.secondary">
                                                Aucune image sélectionnée
                                            </Typography>
                                        )}
                                    </Box>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        startIcon={<PhotoCamera />}
                                        sx={{
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--color-primary, #5b6c97)',
                                            '&:hover': {
                                                backgroundColor: 'var(--color-primary-dark, #4a5a7d)'
                                            }
                                        }}
                                    >
                                        {previewUrl ? 'Changer la photo' : 'Ajouter une photo'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </Card>
                            </Box>

                            {/* Section droite - champs */}
                            <Box sx={{ flex: isMobile ? '1 1 auto' : '2', display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <TextField
                                            fullWidth
                                            label="Nom"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: '8px' } }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Espèce</InputLabel>
                                            <Select
                                                name="specieId"
                                                value={formData.specieId}
                                                onChange={handleSelectChange}
                                                label="Espèce"
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                {species.map((specie) => (
                                                    <MenuItem key={specie.id} value={specie.id}>
                                                        {specie.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <TextField
                                            fullWidth
                                            label="Race"
                                            name="breed"
                                            value={formData.breed}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: '8px' } }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <TextField
                                            fullWidth
                                            label="Âge"
                                            name="age"
                                            type="number"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            required
                                            InputProps={{ sx: { borderRadius: '8px' } }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Sexe</InputLabel>
                                            <Select
                                                name="sex"
                                                value={formData.sex}
                                                onChange={handleSelectChange}
                                                label="Sexe"
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                <MenuItem value="Male">Mâle</MenuItem>
                                                <MenuItem value="Female">Femelle</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Statut</InputLabel>
                                            <Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleSelectChange}
                                                label="Statut"
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                <MenuItem value={AnimalStatus.SHELTERED}>Au refuge</MenuItem>
                                                <MenuItem value={AnimalStatus.FOSTERED}>En famille d'accueil</MenuItem>
                                                <MenuItem value={AnimalStatus.WAITING}>En attente</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box sx={{ flex: '1 1 100%' }}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            multiline
                                            rows={6}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            InputProps={{ sx: { borderRadius: '8px' } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Boutons d'action */}
                        <Box sx={{ mt: 3 }}>
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    flexDirection: isMobile ? 'column-reverse' : 'row'
                                }}
                            >
                                {id && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleDelete}
                                        disabled={loading}
                                        startIcon={<Delete />}
                                        sx={{
                                            borderRadius: '8px',
                                            [isMobile ? 'width' : '']: '100%'
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                    sx={{
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--color-primary, #5b6c97)',
                                        '&:hover': {
                                            backgroundColor: 'var(--color-primary-dark, #4a5a7d)'
                                        },
                                        [isMobile ? 'width' : '']: '100%'
                                    }}
                                >
                                    {id ? 'Enregistrer les modifications' : 'Créer l\'animal'}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
};

export default AnimalForm; 