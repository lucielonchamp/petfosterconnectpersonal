import { ArrowBack as ArrowBackIcon, CalendarToday as CalendarIcon, Person as PersonIcon, PetsOutlined as PetsIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { LoaderPetFoster } from "../../components/Loader/LoaderPetFoster";
import ButtonPurple from '../../components/ui/ButtonPurple';
import { getRequestStatusLabel } from '../../helpers/statusHelper';
import { useAuth } from "../../hooks/useAuth";
import { Path } from "../../interfaces/Path";
import { RequestStatus, RequestWithRelations } from "../../interfaces/request";

const getUserFullName = (fosterData: RequestWithRelations['foster'] | undefined): string => {
  if (!fosterData) return "Inconnu";
  const { firstName, lastName } = fosterData;
  return `${firstName} ${lastName}`;
}

const RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [request, setRequest] = useState<RequestWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [shelterComment, setShelterComment] = useState<string>('');

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchRequestDetails = useCallback(async () => {
    if (!requestId) {
      setError("ID de demande manquant.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setUpdateError(null);

    try {
      const response = await fetch(`${VITE_API_URL}/request/${requestId}`, { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 404) throw new Error("Demande non trouvée.");
        if (response.status === 403) throw new Error("Accès non autorisé à cette demande.");
        throw new Error(`Erreur ${response.status} lors du chargement de la demande.`);
      }
      const result = await response.json();
      if (result.success && result.data) {
        const fetchedRequest = result.data as RequestWithRelations;
        setRequest(fetchedRequest);
        setShelterComment(fetchedRequest.shelterComment || '');
      } else {
        throw new Error(result.message || "Format de réponse invalide de l'API.");
      }
    } catch (err) {
      console.error("Fetch Request Details Error:", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, [requestId, VITE_API_URL, user?.id, user?.role?.name]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleUpdateRequest = async (newStatus: RequestStatus.ACCEPTED | RequestStatus.REFUSED) => {
    if (!request || user?.role?.name !== 'shelter' || request.status !== RequestStatus.PENDING) {
      setUpdateError("Action non autorisée ou impossible pour cette demande.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const body = {
        status: newStatus,
        shelterComment: shelterComment.trim() || null
      };

      const response = await fetch(`${VITE_API_URL}/request/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errMsg = `Erreur ${response.status} lors de la mise à jour.`;
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch (e) {
          console.error("Error parsing error response:", e);
          throw new Error(errMsg);
        }
      }

      const result = await response.json();
      if (result.success && result.data) {
        setRequest(result.data);
      } else {
        throw new Error(result.message || "La mise à jour a échoué.");
      }

    } catch (err) {
      console.error("Update Request Error:", err);
      setUpdateError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LoaderPetFoster />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          <ButtonPurple
            variant="outlined"
            onClick={() => navigate(`${Path.DASHBOARD}${Path.REQUESTS}`)}
            startIcon={<ArrowBackIcon />}
          >
            Retour à la liste des demandes
          </ButtonPurple>
        </Paper>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Alert severity="warning" sx={{ mb: 3 }}>Impossible de charger les détails de la demande.</Alert>
          <ButtonPurple
            variant="outlined"
            onClick={() => navigate(`${Path.DASHBOARD}${Path.REQUESTS}`)}
            startIcon={<ArrowBackIcon />}
          >
            Retour à la liste des demandes
          </ButtonPurple>
        </Paper>
      </Container>
    );
  }

  const showShelterActions = user?.role?.name === 'shelter' && request?.status === RequestStatus.PENDING;
  const showShelterCommentDisplay = !!request.shelterComment &&
    (request.status === RequestStatus.ACCEPTED || request.status === RequestStatus.REFUSED);

  const getRequestStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.ACCEPTED: return '#2e7d32'; // vert
      case RequestStatus.REFUSED: return '#F44336';  // rouge
      default: return '#ed6c02';                     // orange (en attente)
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2 },
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* En-tête */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Détails de la Demande
                </Typography>
                <Chip
                  label={getRequestStatusLabel(request.status)}
                  size="medium"
                  sx={{
                    mt: 1,
                    bgcolor: getRequestStatusColor(request.status),
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    px: 1
                  }}
                />
              </Box>
              <ButtonPurple
                variant="outlined"
                onClick={() => navigate(`${Path.DASHBOARD}${Path.REQUESTS}`)}
                startIcon={<ArrowBackIcon />}
              >
                Retour
              </ButtonPurple>
            </Stack>
          </Box>

          {updateError &&
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onClose={() => setUpdateError(null)}
            >
              {updateError}
            </Alert>
          }

          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
              {/* Carte Animal */}
              <Card variant="outlined" sx={{ flex: 1, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  {request.animal ? (
                    <Box>
                      <Box
                        sx={{
                          position: 'relative',
                          height: 200,
                          overflow: 'hidden',
                          borderBottom: '1px solid rgba(0,0,0,0.08)'
                        }}
                      >
                        <Box
                          component="img"
                          src={request.animal.picture || '/placeholder-image.png'}
                          alt={`Photo de ${request.animal.name}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 1.5,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          }}
                        >
                          <Typography
                            variant="h5"
                            component={Link}
                            to={Path.ANIMAL_DETAIL.replace(':id', request.animalId)}
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {request.animal.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          <PetsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Animal Concerné
                        </Typography>

                        <Stack spacing={2} mt={2}>

                          {request.animal.breed && (
                            <Typography variant="body1">
                              <Typography component="span" color="text.secondary" fontWeight="medium">Race : </Typography>
                              {request.animal.breed}
                            </Typography>
                          )}

                          {request.animal.age && (
                            <Typography variant="body1">
                              <Typography component="span" color="text.secondary" fontWeight="medium">Âge : </Typography>
                              {request.animal.age}
                            </Typography>
                          )}

                          <ButtonPurple
                            variant="contained"
                            size="small"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => navigate(Path.ANIMAL_DETAIL.replace(':id', request.animalId))}
                          >
                            Voir la fiche complète
                          </ButtonPurple>
                        </Stack>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography color="text.secondary">Informations sur l'animal non disponibles.</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Carte Informations */}
              <Card variant="outlined" sx={{ flex: 1.5, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Informations sur la Demande
                  </Typography>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.03)'
                      }}
                    >
                      <Typography fontWeight="medium" flex={1}>Demandeur</Typography>
                      <Typography>{getUserFullName(request.foster)}</Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.03)'
                      }}
                    >
                      <Typography fontWeight="medium" flex={1}>
                        <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Date de soumission
                      </Typography>
                      <Typography>
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                      Message du demandeur
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2,
                        borderColor: 'rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          fontStyle: !request.fosterComment ? 'italic' : 'normal',
                          color: !request.fosterComment ? 'text.secondary' : 'inherit'
                        }}
                      >
                        {request.fosterComment || "(Aucun message fourni)"}
                      </Typography>
                    </Paper>

                    {showShelterCommentDisplay && (
                      <>
                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                          Réponse du refuge
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: 'rgba(91,108,151,0.05)',
                            borderColor: 'var(--color-purple)'
                          }}
                        >
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {request.shelterComment}
                          </Typography>
                        </Paper>
                      </>
                    )}

                    {showShelterActions && (
                      <Card
                        variant="outlined"
                        sx={{
                          mt: 3,
                          borderRadius: 2,
                          borderColor: 'rgba(0,0,0,0.1)',
                          bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Actions du Refuge
                          </Typography>
                          <TextField
                            label="Ajouter un commentaire (optionnel)"
                            multiline
                            rows={3}
                            fullWidth
                            value={shelterComment}
                            onChange={(e) => setShelterComment(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            disabled={isUpdating}
                            placeholder="Votre message sera visible par le demandeur"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'white'
                              }
                            }}
                          />
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            mt={2}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateRequest(RequestStatus.ACCEPTED)}
                              disabled={isUpdating}
                              startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                              sx={{
                                flex: 1,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold'
                              }}
                            >
                              Accepter la demande
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleUpdateRequest(RequestStatus.REFUSED)}
                              disabled={isUpdating}
                              startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                              sx={{
                                flex: 1,
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold'
                              }}
                            >
                              Refuser la demande
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Box>
      </Paper>
    </Container>
  );
};

export default RequestDetails;