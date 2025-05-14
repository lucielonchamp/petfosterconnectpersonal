import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
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
                    status: AnimalStatus.SHELTERED,
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
        <>
            <Container sx={{ backgroundColor: '#f5f5f5' }}>
                <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>
                            {id ? 'Modifier l\'animal' : 'Créer un nouvel animal'}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Âge"
                                    name="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Race"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleInputChange}
                                    required
                                />

                                <FormControl fullWidth required>
                                    <InputLabel>Sexe</InputLabel>
                                    <Select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleSelectChange}
                                        label="Sexe"
                                    >
                                        <MenuItem value="Male">Mâle</MenuItem>
                                        <MenuItem value="Female">Femelle</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required>
                                    <InputLabel>Espèce</InputLabel>
                                    <Select
                                        name="specieId"
                                        value={formData.specieId}
                                        onChange={handleSelectChange}
                                        label="Espèce"
                                    >
                                        {species.map((specie) => (
                                            <MenuItem key={specie.id} value={specie.id}>
                                                {specie.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        Choisir une photo
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {previewUrl && (
                                        <Box sx={{ mt: 2 }}>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(Path.DASHBOARD)}
                                    >
                                        Annuler
                                    </Button>
                                    {id && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDelete}
                                            disabled={loading}
                                        >
                                            Supprimer
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : id ? 'Modifier' : 'Créer'}
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default AnimalForm; 