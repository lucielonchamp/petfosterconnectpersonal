import {
  Box,
  Grid,
  TextField,
  Chip,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Container,
  InputAdornment,
  Checkbox,
  ListItemText
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { Shelter } from '../../interfaces/shelter';
import Header from '../../components/layout/header/Header';
import { useNavigate } from 'react-router';

const API_URL = import.meta.env.VITE_API_URL;

export default function ShelterList() {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'location'>('name');

  const uniqueCities = [...new Set(shelters.map(s => s.location))];

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetch(`${API_URL}/shelter`);
        const data = await response.json();
        setShelters(data.data);
        setFilteredShelters(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  useEffect(() => {
    let result = shelters;
    result = result.filter(shelter => !shelter.isRemoved);


    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCities.length > 0) {
      result = result.filter(s => selectedCities.includes(s.location));
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'location') {
      result = [...result].sort((a, b) => a.location.localeCompare(b.location));
    }

    setFilteredShelters(result);
  }, [searchTerm, selectedCities, sortBy, shelters]);

  return (
    <>
      <Container maxWidth="xl">
        <Header />
      </Container>
      <Box sx={{ backgroundColor: '#f5f5f5', py: 4, minHeight: 'calc(100dvh - 191px)' }}>
        <Container maxWidth="xl">
          {/* Barre de recherche */}
          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="space-between" mb={2}>
            <TextField
              placeholder="Commencer à rechercher une association"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                maxWidth: '100%',
                marginBottom: '2rem',
                '& fieldset': {
                  borderRadius: '10px',
                },
              }}
            />

            {/* Tri par localisation - par nom ou date */}
            <FormControl
              sx={{
                minWidth: 240,
              }}>
              <InputLabel
                sx={{
                  color: '#969696',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                Localisation
              </InputLabel>
              <Select
                label="Localisation"
                multiple
                value={selectedCities}
                onChange={(e) => setSelectedCities(e.target.value as string[])}
                renderValue={(selected) => (selected as string[]).join(', ')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: 240,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '8px 0'
                    }
                  },
                }}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  maxWidth: '100%',
                  '& fieldset': {
                    borderRadius: '10px',
                  },
                }}
              >
                {uniqueCities.map((city) => (
                  <MenuItem key={city} value={city}>
                    <Checkbox checked={selectedCities.includes(city)} />
                    <ListItemText primary={city} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel
                sx={{
                  color: '#969696',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                Trier par
              </InputLabel>
              <Select
                label="Trier par"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'location')}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  maxWidth: '100%',
                  color: '#969696',
                  fontSize: '16px',
                  fontWeight: '600',
                  '& fieldset': {
                    borderRadius: '10px',
                  },
                }}
              >
                <MenuItem value="name">Nom</MenuItem>
                <MenuItem value="location">Ville</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Chips des villes sélectionnées */}
          {selectedCities.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {selectedCities.map((city) => (
                <Chip
                  key={city}
                  label={city}
                  onDelete={() =>
                    setSelectedCities((prev) =>
                      prev.filter((c) => c !== city)
                    )
                  }
                  sx={{
                    backgroundColor: '#C6CBD8',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '15px 0',
                    '& svg': {
                      fill: '#ffffff',
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Liste des associations */}
          {loading ? (
            <Box display="flex" justifyContent="center"><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={5}>
              {filteredShelters.map((shelter) => (
                <Grid key={shelter.id}>
                  <Card
                    onClick={() => navigate(`/association/${shelter.id}`)}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0px 3px 10px 0px rgba(91, 108, 151, 0.2)',
                      position: 'relative',
                      borderRadius: '15px',
                    }}
                  >
                    <Chip
                      icon={<PlaceIcon sx={{ fill: '#ffffff' }} />}
                      label={shelter.location}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: '#C6CBD8',
                        color: '#fff',
                        padding: '15px 0',
                        zIndex: 1,
                        borderRadius: '4px'
                      }}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        padding: '60px 60px 20px 60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src="https://www.la-spa.fr/app/app/uploads/2021/09/MicrosoftTeams-image-63.png"
                        alt={shelter.name}
                        style={{ height: 80, marginBottom: 8 }}
                      />
                      <Typography variant="subtitle1" fontWeight="semibold" fontSize="16px">
                        {shelter.name}
                      </Typography>
                      <Box display="flex" justifyContent="center" gap={2} mt={2} flexWrap="wrap">
                        {[...new Set(shelter.animals.map(animal => animal.specie.name))].map((specieName, index) => (
                          <Chip
                            key={index}
                            label={specieName}
                            size="small"
                            sx={{
                              backgroundColor: '#C6CBD8',
                              color: '#fff',
                              padding: '5px 0',
                              zIndex: 1,
                              borderRadius: '4px'
                            }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
