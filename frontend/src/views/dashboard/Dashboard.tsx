import {
  CalendarMonth as CalendarIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

// Types
interface User {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

interface DashboardCard {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
}

interface Animal {
  id: string;
  name: string;
  image: string;
  species: string;
  breed: string;
  age: string;
  status: string;
  createdAt: string;
}

interface FosterRequest {
  id: string;
  animalName: string;
  animalImage: string;
  requestDate: string;
  status: 'Validé' | 'En attente' | 'Refusé';
}

const Dashboard = () => {
  const { user, loading } = useAuth() as { user: User | null; loading: boolean; logout: () => Promise<void> };
  const [stats, setStats] = useState<DashboardCard[]>([]);

  // Données fictives
  const recentAnimals: Animal[] = [
    {
      id: '1',
      name: 'Vaiana',
      image: 'https://placekitten.com/50/50',
      species: 'Chat',
      breed: 'Siamois',
      age: '3 ans',
      status: 'En famille',
      createdAt: '12/03/2025'
    },
    {
      id: '2',
      name: 'Brioche',
      image: 'https://placekitten.com/51/51',
      species: 'Chat',
      breed: 'Européen',
      age: '4 ans',
      status: "À l'association",
      createdAt: '11/03/2025'
    },
    // ... autres animaux
  ];

  const recentRequests: FosterRequest[] = [
    {
      id: '1',
      animalName: 'Vaiana',
      animalImage: 'https://placekitten.com/50/50',
      requestDate: '12/03/2025',
      status: 'Validé'
    },
    {
      id: '2',
      animalName: 'Brioche',
      animalImage: 'https://placekitten.com/51/51',
      requestDate: '11/03/2025',
      status: 'En attente'
    },
    // ... autres demandes
  ];

  useEffect(() => {
    if (user) {
      switch (user.role.name) {
        case 'admin':
          setStats([
            {
              title: 'Utilisateurs Total',
              value: '156',
              icon: <PersonIcon sx={{ fontSize: 40 }} />,
              color: '#2196F3'
            },
            {
              title: 'Refuges Actifs',
              value: '12',
              icon: <HomeIcon sx={{ fontSize: 40 }} />,
              color: '#4CAF50'
            },
            {
              title: 'Familles d\'Accueil',
              value: '45',
              icon: <PetsIcon sx={{ fontSize: 40 }} />,
              color: '#FF9800'
            }
          ]);
          break;

        case 'shelter':
          setStats([
            {
              title: 'Animaux Hébergés',
              value: '24',
              icon: <PetsIcon sx={{ fontSize: 40 }} />,
              color: '#4CAF50'
            },
            {
              title: 'Demandes en Attente',
              value: '8',
              icon: <CalendarIcon sx={{ fontSize: 40 }} />,
              color: '#FF9800'
            },
            {
              title: 'Familles d\'Accueil',
              value: '15',
              icon: <HomeIcon sx={{ fontSize: 40 }} />,
              color: '#2196F3'
            }
          ]);
          break;

        case 'foster':
          setStats([
            {
              title: 'Animaux en Accueil',
              value: '2',
              icon: <PetsIcon sx={{ fontSize: 40 }} />,
              color: '#4CAF50'
            },
            {
              title: 'Statut',
              value: 'Disponible',
              icon: <CalendarIcon sx={{ fontSize: 40 }} />,
              color: '#2196F3'
            },
            {
              title: 'Demandes Reçues',
              value: '3',
              icon: <PersonIcon sx={{ fontSize: 40 }} />,
              color: '#FF9800'
            }
          ]);
          break;

        default:
          setStats([]);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="error">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
        flex: 1
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
        Tableau de bord
      </Typography>

      {/* Stats cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3,
        mb: 4
      }}>
        {stats.map((stat, index) => (
          <Paper
            key={index}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              background: '#fff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Recent animals table */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Derniers animaux ajoutés
          </Typography>
          <Button
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Voir plus
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Espèce</TableCell>
                <TableCell>Race</TableCell>
                <TableCell>Âge</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAnimals.map((animal) => (
                <TableRow key={animal.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={animal.image}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1
                        }}
                      />
                      {animal.name}
                    </Box>
                  </TableCell>
                  <TableCell>{animal.createdAt}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.age}</TableCell>
                  <TableCell>
                    <Chip
                      label={animal.status}
                      color={animal.status === 'En famille' ? 'success' : 'warning'}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MenuIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent requests table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Dernières demandes d'accueil
          </Typography>
          <Button
            color="primary"
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Voir plus
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Animal</TableCell>
                <TableCell>Date de la demande</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRequests.map((request) => (
                <TableRow key={request.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={request.animalImage}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1
                        }}
                      />
                      {request.animalName}
                    </Box>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'Validé' ? 'success' :
                          request.status === 'Refusé' ? 'error' : 'warning'
                      }
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MenuIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Dashboard;
