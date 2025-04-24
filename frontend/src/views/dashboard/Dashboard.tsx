import {
  CalendarMonth as CalendarIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
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
import { RoleEnum } from '../../interfaces/role';
import { AnimalStatus, AnimalWithRelations } from '../../interfaces/animal';
import { RequestStatus, RequestWithRelations } from '../../interfaces/request';
import { LoaderPetFoster } from '../../components/Loader/LoaderPetFoster';
import { useNavigate } from 'react-router';
import { getStatusColor, getStatusLabel } from '../../helpers/statusHelper';
import { Path } from '../../interfaces/Path';

// Types
interface User {
  id: string;
  email: string;
  role: {
    id: string;
    name: RoleEnum;
  };
}

interface DashboardCard {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user, loading } = useAuth() as { user: User | null; loading: boolean; logout: () => Promise<void> };
  const [stats, setStats] = useState<DashboardCard[]>([]);

  const [animals, setAnimals] = useState<AnimalWithRelations[]>([]);
  const [requests, setRequests] = useState<RequestWithRelations[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const getDashboardData = async () => {

    setIsLoading(true);

    const typeOfUser: RoleEnum = user?.role?.name || RoleEnum.ADMIN;

    if (typeOfUser === RoleEnum.FOSTER || typeOfUser === RoleEnum.SHELTER) {

      const responseUser = await fetch(`${API_URL}/user/${user?.id}/${user?.role?.name}`);

      const { data: userWithProfile } = await responseUser.json();

      const profileId = userWithProfile[typeOfUser.replace(/^./, typeOfUser[0].toUpperCase())].id

      // ANIMALS
      const responseAnimals = await fetch(`${API_URL}/animal/${typeOfUser}/${profileId}`, {
        credentials: 'include',
      });

      const { data: animalsData } = await responseAnimals.json();
      setAnimals(animalsData)

      // REQUEST

      const requestResponse = await fetch(`${API_URL}/request/user/${user?.id}`, {
        credentials: 'include',
      })

      const { data: requestData } = await requestResponse.json();
      setRequests(requestData);

    }

    setStatsByRole(typeOfUser);
  };

  function setStatsByRole(role: RoleEnum | undefined) {
    switch (role) {
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
            value: animals?.filter((animal) => animal.status !== AnimalStatus.FOSTERED).length || 0,
            icon: <PetsIcon sx={{ fontSize: 40 }} />,
            color: '#4CAF50'
          },
          {
            title: 'Demandes en Attente',
            value: requests?.filter((request) => request.status === RequestStatus.PENDING).length || 0,
            icon: <CalendarIcon sx={{ fontSize: 40 }} />,
            color: '#FF9800'
          },
          {
            title: 'Animaux en famille',
            value: animals?.filter((animal) => animal.status === AnimalStatus.FOSTERED).length || 0,
            icon: <HomeIcon sx={{ fontSize: 40 }} />,
            color: '#2196F3'
          }
        ]);
        break;

      case 'foster':
        setStats([
          {
            title: 'Animaux accueillis',
            value: animals?.length || 0,
            icon: <PetsIcon sx={{ fontSize: 40 }} />,
            color: '#4CAF50'
          },
          {
            title: 'Statut',
            value: 'Disponible', // TODO: à changer quand le statut sera géré
            icon: <CalendarIcon sx={{ fontSize: 40 }} />,
            color: '#2196F3'
          },
          {
            title: 'Demandes d\'accueil',
            value: requests?.length || 0,
            icon: <PersonIcon sx={{ fontSize: 40 }} />,
            color: '#FF9800'
          }
        ]);
        break;

      default:
        setStats([]);
    }

  }

  useEffect(() => {
    setStatsByRole(user?.role?.name);
  }, [user, animals, requests])

  useEffect(() => {
    getDashboardData();
    setIsLoading(false);
  }, [user])

  const handleNavigateAnimals = (animalId: string) => () => {
    navigate(Path.ANIMAL_DETAIL.replace(':id', animalId));
  };

  const handleNavigateRequests = (requestId: string) => () => {
    navigate(`${Path.DASHBOARD}${Path.REQUEST.replace(':requestId', requestId)}`);
  }

  if (isLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LoaderPetFoster />
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
            {
              user?.role?.name === RoleEnum.SHELTER ?
                'Animaux au refuge'
                : user?.role?.name === RoleEnum.FOSTER ?
                  'Animaux chez vous'
                  :
                  'Liste des animaux'

            }
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
                {/* <TableCell align="right">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map((animal) => (
                <TableRow key={animal.id} onClick={handleNavigateAnimals(animal.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={animal.picture}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1
                        }}
                      />
                      {animal.name}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(animal.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{animal?.specie?.name}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.age}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(animal.status)}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(animal.status),
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  {/* <TableCell align="right">
                    <IconButton size="small">
                      <MenuIcon />
                    </IconButton>
                  </TableCell> */}
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
            {
              user?.role?.name === RoleEnum.SHELTER ?
                'Demandes d\'accueil'
                : user?.role?.name === RoleEnum.FOSTER ?
                  'Demandes envoyées'
                  :
                  'Liste des demandes'

            }
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
                {/* <TableCell align="right">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request?.id} onClick={handleNavigateRequests(request?.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={request?.animal.picture}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1
                        }}
                      />
                      {request?.animal.name}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        request.status === RequestStatus.ACCEPTED ? 'Validée' :
                          request.status === RequestStatus.REFUSED ? 'Refusée' : 'En attente'
                      }
                      color={
                        request.status === RequestStatus.ACCEPTED ? 'success' :
                          request.status === RequestStatus.REFUSED ? 'error' : 'warning'
                      }
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  {/* <TableCell align="right">
                    <IconButton size="small">
                      <MenuIcon />
                    </IconButton>
                  </TableCell> */}
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
