import BusinessIcon from '@mui/icons-material/Business';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PetsIcon from '@mui/icons-material/Pets';
import { Box, Button, Checkbox, Container, FormControlLabel, Popover, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Header from '../../components/layout/header/Header';
import { capitalizeFirstLetter, getStatusLabel } from '../../helpers/statusHelper';
import { AnimalStatus, AnimalWithRelations } from '../../interfaces/animal';
import { Specie } from '../../interfaces/specie';
import Footer from '../../components/layout/footer/Footer';
import { AnimalListCard } from '../../components/animal/AnimalListCard';
import BoxStyle from '../../components/style/BoxStyle';

interface Filters {
  sex: string[];
  specieId: string[];
  breed: string;
  minAge: number;
  maxAge: number;
  status: string[];
  shelterId: string[];
}

const Animals = () => {
  const [animals, setAnimals] = useState<AnimalWithRelations[]>([]);
  const [allSpecies, setAllSpecies] = useState<Specie[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    sex: [],
    specieId: [],
    breed: '',
    minAge: 0,
    maxAge: 30,
    status: [],
    shelterId: []
  });

  // États pour les popovers
  const [speciesPopover, setSpeciesPopover] = useState<null | HTMLElement>(null);
  const [sexPopover, setSexPopover] = useState<null | HTMLElement>(null);
  const [agePopover, setAgePopover] = useState<null | HTMLElement>(null);
  const [statusPopover, setStatusPopover] = useState<null | HTMLElement>(null);
  const [shelterPopover, setShelterPopover] = useState<null | HTMLElement>(null);

  // Extraire les associations uniques des animaux
  const uniqueShelters = [...new Map(animals.map(animal => [animal.shelter.id, animal.shelter])).values()];
  // Définition des filtres rapides
  const quickFilters = {
    sex: [
      { label: 'Mâles', value: 'Male', icon: <MaleIcon /> },
      { label: 'Femelles', value: 'Female', icon: <FemaleIcon /> }
    ],
    status: [
      { label: getStatusLabel(AnimalStatus.FOSTERED), value: AnimalStatus.FOSTERED },
      { label: getStatusLabel(AnimalStatus.WAITING), value: AnimalStatus.WAITING },
      { label: getStatusLabel(AnimalStatus.SHELTERED), value: AnimalStatus.SHELTERED }
    ]
  };

  const VITE_API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Charger les animaux sans filtre pour obtenir toutes les espèces
    const fetchInitialAnimals = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/animal`);
        const data = await response.json();
        if (data.success) {
          // Extraire et stocker toutes les espèces uniques
          const uniqueSpeciesMap = new Map(
            data.data.map((animal: AnimalWithRelations) => [
              animal.specie.id,
              animal.specie
            ])
          );
          const species = Array.from(uniqueSpeciesMap.values()) as Specie[];
          setAllSpecies(species.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (error) {
        console.error('Error fetching initial animals:', error);
      }
    };

    fetchInitialAnimals();
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const queryParams = new URLSearchParams();

        // Gestion des filtres multiples
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(v => {
              if (v) {
                queryParams.append(key, v);
              }
            });
          } else if (value && typeof value === 'string' && value.trim() !== '') {
            queryParams.append(key, value);
          } else if (typeof value === 'number' && value > 0) {
            queryParams.append(key, value.toString());
          }
        });

        const response = await fetch(`${VITE_API_URL}/animal?${queryParams}`);
        const data = await response.json();
        if (data.success) {
          setAnimals(data.data);
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    fetchAnimals();
  }, [filters]);

  const handleAgeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setFilters(prev => ({
        ...prev,
        minAge: newValue[0],
        maxAge: newValue[1]
      }));
    }
  };

  const handleSimpleFilter = (filterType: keyof Filters, value: string) => {
    const filterKey = `${filterType}-${value}`;
    const newActiveFilters = [...activeFilters];
    const filterIndex = newActiveFilters.indexOf(filterKey);

    if (filterIndex > -1) {
      newActiveFilters.splice(filterIndex, 1);
      setFilters(prev => ({
        ...prev,
        [filterType]: Array.isArray(prev[filterType])
          ? (prev[filterType] as string[]).filter(v => v !== value)
          : []
      }));
    } else {
      newActiveFilters.push(filterKey);
      setFilters(prev => ({
        ...prev,
        [filterType]: Array.isArray(prev[filterType])
          ? [...(prev[filterType] as string[]), value]
          : [value]
      }));
    }

    setActiveFilters(newActiveFilters);
  };



  return (
    <>
      <Container maxWidth="xl">
        <Header />
      </Container>
      <Box>
        <Container>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}>
            {/* Filtres */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              marginBottom: 2,
              marginTop: 2,

            }}>
              {/* Boutons de filtres */}
              <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                borderRadius: '16px',
                padding: 0,
              }}>
                <Button
                  onClick={(e) => setSpeciesPopover(e.currentTarget)}
                  variant={filters.specieId.length > 0 ? "contained" : "outlined"}
                  startIcon={<PetsIcon />}
                  sx={{
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: filters.specieId.length > 0 ? 'white' : 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    backgroundColor: filters.specieId.length > 0 ? 'var(--color-primary, #5b6c97)' : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.specieId.length > 0 ? 'var(--color-primary, #5b6c97)' : 'var(--color-background, #f1f5f9)'
                    }
                  }}
                >
                  Espèces {filters.specieId.length > 0 && `(${filters.specieId.length})`}
                </Button>
                <Popover
                  open={Boolean(speciesPopover)}
                  anchorEl={speciesPopover}
                  onClose={() => setSpeciesPopover(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 300,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sélectionner les espèces
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {allSpecies.map((specie) => (
                      <FormControlLabel
                        key={specie.id}
                        control={
                          <Checkbox
                            checked={filters.specieId.includes(specie.id)}
                            onChange={() => handleSimpleFilter('specieId', specie.id)}
                            sx={{
                              color: 'var(--color-primary, #5b6c97)',
                              '&.Mui-checked': {
                                color: 'var(--color-primary, #5b6c97)',
                              },
                            }}
                          />
                        }
                        label={capitalizeFirstLetter(specie.name)}
                        sx={{
                          color: 'var(--color-text, #64748b)',
                          '&:hover': {
                            backgroundColor: 'var(--color-background, #f1f5f9)',
                            borderRadius: '4px',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Popover>

                <Button
                  onClick={(e) => setSexPopover(e.currentTarget)}
                  variant={filters.sex.length > 0 ? "contained" : "outlined"}
                  sx={{
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: filters.sex.length > 0 ? 'white' : 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    backgroundColor: filters.sex.length > 0 ? 'var(--color-primary, #5b6c97)' : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.sex.length > 0 ? 'var(--color-primary, #5b6c97)' : 'var(--color-background, #f1f5f9)'
                    }
                  }}
                >
                  Sexe {filters.sex.length > 0 && `(${filters.sex.length})`}
                </Button>
                <Popover
                  open={Boolean(sexPopover)}
                  anchorEl={sexPopover}
                  onClose={() => setSexPopover(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 300,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sélectionner le sexe
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {quickFilters.sex.map((filter) => (
                      <FormControlLabel
                        key={filter.value}
                        control={
                          <Checkbox
                            checked={filters.sex.includes(filter.value)}
                            onChange={() => handleSimpleFilter('sex', filter.value)}
                            sx={{
                              color: 'var(--color-primary, #5b6c97)',
                              '&.Mui-checked': {
                                color: 'var(--color-primary, #5b6c97)',
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {filter.icon}
                            {filter.label}
                          </Box>
                        }
                        sx={{
                          color: 'var(--color-text, #64748b)',
                          '&:hover': {
                            backgroundColor: 'var(--color-background, #f1f5f9)',
                            borderRadius: '4px',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Popover>

                <Button
                  onClick={(e) => setAgePopover(e.currentTarget)}
                  variant={filters.minAge > 0 || filters.maxAge < 30 ? "contained" : "outlined"}
                  sx={{
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: filters.minAge > 0 || filters.maxAge < 30 ? 'white' : 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    backgroundColor: filters.minAge > 0 || filters.maxAge < 30 ? 'var(--color-primary, #5b6c97)' : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.minAge > 0 || filters.maxAge < 30 ? 'var(--color-primary, #5b6c97)' : 'var(--color-background, #f1f5f9)'
                    }
                  }}
                >
                  Âge {(filters.minAge > 0 || filters.maxAge < 30) && `(${filters.minAge}-${filters.maxAge} ans)`}
                </Button>
                <Popover
                  open={Boolean(agePopover)}
                  anchorEl={agePopover}
                  onClose={() => setAgePopover(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 300,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sélectionner une tranche d'âge
                  </Typography>
                  <Slider
                    value={[filters.minAge, filters.maxAge]}
                    onChange={handleAgeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={30}
                    step={1}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                      { value: 30, label: '30' }
                    ]}
                    sx={{
                      color: 'var(--color-primary, #5b6c97)',
                      '& .MuiSlider-thumb': {
                        backgroundColor: 'var(--color-primary, #5b6c97)',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: 'var(--color-primary, #5b6c97)',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'var(--color-border, #e2e8f0)',
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {filters.minAge} ans
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {filters.maxAge} ans
                    </Typography>
                  </Box>
                </Popover>

                <Button
                  onClick={(e) => setStatusPopover(e.currentTarget)}
                  variant={filters.status.length > 0 ? "contained" : "outlined"}
                  sx={{
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: filters.status.length > 0 ? 'white' : 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    backgroundColor: filters.status.length > 0 ? 'var(--color-primary, #5b6c97)' : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.status.length > 0 ? 'var(--color-primary, #5b6c97)' : 'var(--color-background, #f1f5f9)'
                    }
                  }}
                >
                  Statut {filters.status.length > 0 && `(${filters.status.length})`}
                </Button>
                <Popover
                  open={Boolean(statusPopover)}
                  anchorEl={statusPopover}
                  onClose={() => setStatusPopover(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 300,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sélectionner le statut
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {quickFilters.status.map((filter) => (
                      <FormControlLabel
                        key={filter.value}
                        control={
                          <Checkbox
                            checked={filters.status.includes(filter.value)}
                            onChange={() => handleSimpleFilter('status', filter.value)}
                            sx={{
                              color: 'var(--color-primary, #5b6c97)',
                              '&.Mui-checked': {
                                color: 'var(--color-primary, #5b6c97)',
                              },
                            }}
                          />
                        }
                        label={filter.label}
                        sx={{
                          color: 'var(--color-text, #64748b)',
                          '&:hover': {
                            backgroundColor: 'var(--color-background, #f1f5f9)',
                            borderRadius: '4px',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Popover>

                <Button
                  onClick={(e) => setShelterPopover(e.currentTarget)}
                  variant={filters.shelterId.length > 0 ? "contained" : "outlined"}
                  startIcon={<BusinessIcon />}
                  sx={{
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    color: filters.shelterId.length > 0 ? 'white' : 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    backgroundColor: filters.shelterId.length > 0 ? 'var(--color-primary, #5b6c97)' : 'transparent',
                    '&:hover': {
                      backgroundColor: filters.shelterId.length > 0 ? 'var(--color-primary, #5b6c97)' : 'var(--color-background, #f1f5f9)'
                    }
                  }}
                >
                  Associations {filters.shelterId.length > 0 && `(${filters.shelterId.length})`}
                </Button>
                <Popover
                  open={Boolean(shelterPopover)}
                  anchorEl={shelterPopover}
                  onClose={() => setShelterPopover(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: {
                      p: 2,
                      width: 300,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Sélectionner les associations
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {uniqueShelters.map((shelter) => (
                      <FormControlLabel
                        key={shelter.id}
                        control={
                          <Checkbox
                            checked={filters.shelterId.includes(shelter.id)}
                            onChange={() => handleSimpleFilter('shelterId', shelter.id)}
                            sx={{
                              color: 'var(--color-primary, #5b6c97)',
                              '&.Mui-checked': {
                                color: 'var(--color-primary, #5b6c97)',
                              },
                            }}
                          />
                        }
                        label={shelter.name}
                        sx={{
                          color: 'var(--color-text, #64748b)',
                          '&:hover': {
                            backgroundColor: 'var(--color-background, #f1f5f9)',
                            borderRadius: '4px',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Popover>

                <Box sx={{ flexGrow: 1 }} /> {/* Espace flexible pour pousser le bouton à droite */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFilters({
                      sex: [],
                      specieId: [],
                      breed: '',
                      minAge: 0,
                      maxAge: 30,
                      status: [],
                      shelterId: []
                    });
                    setActiveFilters([]);
                  }}
                  sx={{
                    borderRadius: '8px',
                    color: 'var(--color-text, #64748b)',
                    borderColor: 'var(--color-border, #e2e8f0)',
                    '&:hover': {
                      backgroundColor: 'var(--color-background, #f1f5f9)',
                      borderColor: 'var(--color-primary, #5b6c97)',
                      color: 'var(--color-primary, #5b6c97)'
                    }
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </Box>
            </Box>

            {/* Grille des animaux */}
            <BoxStyle>
              {animals.map((animal) => (
                <AnimalListCard animal={animal} key={animal.id} />
              ))}
            </BoxStyle>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Animals;