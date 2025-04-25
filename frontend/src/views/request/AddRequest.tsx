import { Alert, Box, Chip, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonBlue from "../../components/ui/ButtonBlue";
import ButtonPurple from "../../components/ui/ButtonPurple";
import { getStatusColor, getStatusLabel } from "../../helpers/statusHelper";
import { useAuth } from "../../hooks/useAuth";
import { AnimalStatus, AnimalWithRelations } from "../../interfaces/animal";
import { Path } from "../../interfaces/Path";
import { Request } from "../../interfaces/request";
import RequestForm from "./RequestForm";

const AddRequest = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState<AnimalWithRelations | null>(null);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [existingRequestForThisAnimal, setExistingRequestForThisAnimal] = useState<Request | null>(null);

  const [isFetchingAnimal, setIsFetchingAnimal] = useState<boolean>(true);
  const [isFetchingRequests, setIsFetchingRequests] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [fetchAnimalError, setFetchAnimalError] = useState<string | null>(null);
  const [fetchRequestsError, setFetchRequestsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!animalId) {
      setFetchAnimalError("ID de l'animal manquant dans l'URL.");
      setIsFetchingAnimal(false);
      return;
    }
    const fetchAnimalData = async () => {
      setIsFetchingAnimal(true);
      setFetchAnimalError(null);
      try {
        const response = await fetch(`${VITE_API_URL}/animal/${animalId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(response.status === 404 ? "Animal non trouvé." : `Erreur ${response.status} lors de la récupération des données.`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          setAnimal(result.data);
        } else {
          throw new Error(result.message || "Format de réponse invalide de l'API (animal).");
        }
      } catch (err) {
        console.error("Fetch Animal Error:", err);
        setFetchAnimalError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors du chargement de l'animal.");
        setAnimal(null);
      } finally {
        setIsFetchingAnimal(false);
      }
    };
    fetchAnimalData();
  }, [animalId, VITE_API_URL]);

  useEffect(() => {
    if (!user?.id) {
      setIsFetchingRequests(false);
      return;
    }
    const fetchUserRequestsData = async () => {
      setIsFetchingRequests(true);
      setFetchRequestsError(null);
      try {
        const response = await fetch(`${VITE_API_URL}/request/user/${user.id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 404) {
            setUserRequests([]);
          } else {
            throw new Error(`Erreur ${response.status} lors de la récupération de vos demandes.`);
          }
        } else {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setUserRequests(result.data);
          } else {
            console.warn("Format de réponse invalide ou échec lors de la récupération des demandes utilisateur:", result);
            setUserRequests([]);
          }
        }
      } catch (err) {
        console.error("Fetch User Requests Error:", err);
        setFetchRequestsError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors du chargement de vos demandes.");
        setUserRequests([]);
      } finally {
        setIsFetchingRequests(false);
      }
    };
    fetchUserRequestsData();
  }, [user?.id, VITE_API_URL]);

  useEffect(() => {
    if (animal && !isFetchingRequests) { // Check only when animal exists and requests are loaded
      const found = userRequests.find(req => req.animalId === animal.id);
      setExistingRequestForThisAnimal(found || null);
    } else {
      setExistingRequestForThisAnimal(null);
    }
  }, [animal, userRequests, isFetchingRequests]);


  const handleSubmitRequest = async (values: { fosterComment: string }) => {
    if (!animal) return;
    if (!user?.id) {
      setSubmitError("Vous devez être connecté pour faire une demande.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let userFosterId: string | undefined;
      try {
        const userResponse = await fetch(`${VITE_API_URL}/user/${user.id}/foster`, {
          credentials: 'include',
        });
        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            throw new Error("Impossible de trouver les informations de famille d'accueil. Veuillez vérifier votre profil.");
          }
          throw new Error(`Erreur ${userResponse.status} lors de la vérification du statut d'accueil.`);
        }
        const userData = await userResponse.json();
        userFosterId = userData?.data?.Foster?.id ?? userData?.data?.id;
        if (!userFosterId) {
          throw new Error("Profil famille d'accueil introuvable ou incomplet dans la réponse API.");
        }
      } catch (fosterCheckError) {
        console.error("Foster check error:", fosterCheckError);
        setSubmitError(fosterCheckError instanceof Error ? fosterCheckError.message : "Impossible de vérifier votre statut de famille d'accueil.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${VITE_API_URL}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fosterComment: values.fosterComment,
          fosterId: userFosterId,
          animalId: animal.id,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status} lors de la création de la demande.`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) { /* Ignore */ }
        throw new Error(errorMessage);
      }
      navigate(Path.REQUESTS, { state: { successMessage: 'Demande envoyée avec succès !' } });
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue lors de l\'envoi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingAnimal) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (fetchAnimalError) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Alert severity="error">{fetchAnimalError}</Alert>
        <ButtonPurple variant="outlined" onClick={() => navigate(Path.ANIMALS)} sx={{ marginTop: 2 }}>
          Retour à la liste des animaux
        </ButtonPurple>
      </Container>
    );
  }

  if (!animal) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Alert severity="warning">Impossible d'afficher les détails de l'animal.</Alert>
        <ButtonPurple variant="outlined" onClick={() => navigate('/animals')} sx={{ marginTop: 2 }}>
          Retour à la liste des animaux
        </ButtonPurple>
      </Container>
    );
  }

  const isAnimalFostered = animal.status === AnimalStatus.FOSTERED;
  const canDisplayForm = !isAnimalFostered && !existingRequestForThisAnimal && !isFetchingRequests && !fetchRequestsError;

  return (
    <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" mb={3}>
        {isAnimalFostered ? "Cet animal a trouvé une famille" : `Faire une demande d'accueil pour :`}
      </Typography>

      <Stack spacing={3} direction={{ xs: "column", md: "row" }} sx={{ marginBottom: 4 }} alignItems="center">
        <Box
          component="img"
          src={animal.picture}
          alt={`Photo de ${animal.name}`}
          sx={{
            width: { xs: '80%', sm: '60%', md: '40%' },
            maxWidth: '350px',
            aspectRatio: '1 / 1',
            height: 'auto',
            maxHeight: '400px',
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 3,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            bgcolor: 'grey.200'
          }}
        />
        <Stack spacing={1.5} width={{ xs: '100%', md: '60%' }} alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "left" }}>
          <Typography
            variant="h2" component="h2"
            sx={() => ({
              fontWeight: 'bold', lineHeight: 1.2, mb: 0.5,
              color: 'var(--color-blue)'
            })}
          >
            {animal.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {animal.breed} - {animal.specie?.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {animal.description || "Aucune description fournie."}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Refuge : {animal.shelter?.name || "Non spécifié"}
          </Typography>
          <Chip
            label={getStatusLabel(animal.status)}
            sx={{
              backgroundColor: getStatusColor(animal.status),
              color: 'white',
              borderRadius: '4px',
              height: '32px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          />
        </Stack>
      </Stack>

      <Box mt={4} pt={3} borderTop={1} borderColor="divider">
        {isFetchingRequests && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <CircularProgress size={20} />
            <Typography color="text.secondary">Vérification de vos demandes...</Typography>
          </Stack>
        )}

        {fetchRequestsError && !isFetchingRequests && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            Erreur lors du chargement de vos demandes précédentes: {fetchRequestsError}
          </Alert>
        )}

        {isAnimalFostered && !isFetchingRequests && (
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            {animal.name} est déjà dans une famille d'accueil et n'est pas disponible actuellement.
            <Stack direction="row" spacing={2} mt={2}>
              <ButtonPurple variant="contained" onClick={() => navigate(Path.ANIMALS)}>
                Voir les autres animaux
              </ButtonPurple>
            </Stack>
          </Alert>
        )}

        {existingRequestForThisAnimal && !isAnimalFostered && !isFetchingRequests && (
          <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
            Vous avez déjà soumis une demande d'accueil pour {animal.name}.
            <Stack direction="row" spacing={2} mt={2}>
              <ButtonBlue variant="contained" onClick={() => navigate(Path.REQUESTS)}>
                Voir mes demandes
              </ButtonBlue>
              <ButtonPurple variant="outlined" onClick={() => navigate(Path.ANIMALS)} >
                Voir les autres animaux
              </ButtonPurple>
            </Stack>
          </Alert>
        )}

        {canDisplayForm && (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Votre message pour le refuge
            </Typography>
            {submitError && (
              <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <RequestForm onSubmit={handleSubmitRequest} isLoading={isSubmitting} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default AddRequest;