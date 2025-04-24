import { useEffect, useState, useCallback } from 'react';
import { Alert, Box, Button, CircularProgress, Container, Divider, Paper, Stack, TextField, Typography, Chip } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { RequestStatus, RequestWithRelations } from "../../interfaces/request";
import { Path } from "../../interfaces/Path";
import ButtonPurple from '../../components/ui/ButtonPurple';
import { getRequestStatusLabel, getRequestStatusColor } from '../../helpers/statusHelper';
import { Link, useNavigate, useParams } from 'react-router';

const getUserFullName = (fosterData: RequestWithRelations['foster'] | undefined): string => {
  if (!fosterData) return "Inconnu";
  const { firstName, lastName } = fosterData;
  return `${firstName} ${lastName}`;
}

const RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

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
        // **Improved Authorization Check:**
        const fetchedRequest = result.data as RequestWithRelations;

        // TODO : mettre en place une vérification que la demande vient de l'association qui la voit sinon return

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
          throw new Error(errMsg);
        }
      }

      const result = await response.json();
      if (result.success && result.data) {
        setRequest(result.data);
        // TODO: navigate soit vers la liste des requêtes soit vers le dashboard, soit mettre à jour la page avec les nouvelles data 
        // navigate(Path.REQUESTS, { state: { successMessage: `Demande ${newStatus === RequestStatus.ACCEPTED ? 'acceptée' : 'refusée'} avec succès.` } });
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
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Alert severity="error">{error}</Alert>
        <ButtonPurple variant="outlined" onClick={() => navigate(Path.REQUESTS)} sx={{ marginTop: 2 }}>
          Retour à la liste des demandes
        </ButtonPurple>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Alert severity="warning">Impossible de charger les détails de la demande.</Alert>
        <ButtonPurple variant="outlined" onClick={() => navigate(Path.REQUESTS)} sx={{ marginTop: 2 }}>
          Retour à la liste des demandes
        </ButtonPurple>
      </Container>
    );
  }

  const showShelterActions = user?.role?.name === 'shelter' && request?.status === RequestStatus.PENDING;

  const showShelterCommentDisplay = !!request.shelterComment &&
    (request.status === RequestStatus.ACCEPTED || request.status === RequestStatus.REFUSED);


  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Détails de la Demande
        </Typography>
        <ButtonPurple variant="outlined" onClick={() => navigate(Path.REQUESTS)} >
          Retour à la liste
        </ButtonPurple>
      </Stack>

      {updateError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>{updateError}</Alert>}

      <Paper elevation={3} sx={{ padding: { xs: 2, md: 4 } }}>
        <Stack gap={4} flexDirection={{ xs: 'column', md: 'row' }}>

          <Stack flex={1} minWidth={{ md: 300 }}>
            <Typography variant="h6" gutterBottom>Animal Concerné</Typography>
            <Divider sx={{ mb: 2 }} />
            {request.animal ? (
              <Stack spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={request.animal.picture || '/placeholder-image.png'}
                  alt={`Photo de ${request.animal.name}`}
                  sx={{
                    width: '100%',
                    maxWidth: '300px',
                    height: 'auto',
                    maxHeight: '300px',
                    aspectRatio: '1 / 1',
                    objectFit: "cover",
                    borderRadius: 2,
                    boxShadow: 1,
                    mb: 1,
                    bgcolor: 'grey.200'
                  }}
                />
                <Link
                  to={Path.ANIMAL_DETAIL.replace(':animalId', request.animalId)}
                >
                  <Typography
                    sx={{ color: 'var(--color-blue)', fontWeight: 600 }}
                    variant="h5"
                    textAlign="center"
                  >

                    {request.animal.name}
                  </Typography>
                </Link>
              </Stack>
            ) : (
              <Typography color="text.secondary">Informations sur l'animal non disponibles.</Typography>
            )}
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          <Stack flex={1.5}>
            <Typography variant="h6" gutterBottom>Informations sur la Demande</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span" sx={{ fontWeight: 'medium' }}>Statut : </Typography>
                <Chip
                  label={getRequestStatusLabel(request.status)}
                  size="small"
                  sx={{
                    bgcolor: getRequestStatusColor(request.status),
                    color: 'white',
                    fontWeight: 500,
                    verticalAlign: 'middle',
                    ml: 1
                  }}
                />
              </Box>
              <Typography variant="body1">
                <Typography variant="body2" color="text.secondary" component="span" sx={{ fontWeight: 'medium' }}>Demandeur : </Typography>
                {getUserFullName(request.foster)}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body2" color="text.secondary" component="span" sx={{ fontWeight: 'medium' }}>Soumise le : </Typography>
                {request.createdAt ? new Date(request.createdAt).toLocaleString('fr-FR') : 'N/A'}
              </Typography>
              <Typography variant="body1">
                <Typography variant="body2" color="text.secondary" component="span" sx={{ fontWeight: 'medium' }}>Mise à jour le : </Typography>
                {request.updatedAt ? new Date(request.updatedAt).toLocaleString('fr-FR') : 'N/A'}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>Message du demandeur :</Typography>
              <Paper variant="outlined" sx={{ p: 2, background: (theme) => theme.palette.grey[100] }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {request.fosterComment || "(Aucun message fourni)"}
                </Typography>
              </Paper>

              {showShelterCommentDisplay && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>Réponse du refuge :</Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {request.shelterComment}
                    </Typography>
                  </Paper>
                </>
              )}

              {showShelterActions && (
                <Box mt={3} pt={3} borderTop={1} borderColor="divider">
                  <Typography variant="h6" gutterBottom>Actions du Refuge</Typography>
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
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                    <Button
                      variant="contained"
                      color='success'
                      onClick={() => handleUpdateRequest(RequestStatus.ACCEPTED)}
                      disabled={isUpdating}
                      startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                      sx={{ flexGrow: 1 }}
                    >
                      Accepter la demande
                    </Button>
                    <Button
                      variant="contained"
                      color='error'
                      onClick={() => handleUpdateRequest(RequestStatus.REFUSED)}
                      disabled={isUpdating}
                      startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                      sx={{ flexGrow: 1 }}
                    >
                      Refuser la demande
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RequestDetails;