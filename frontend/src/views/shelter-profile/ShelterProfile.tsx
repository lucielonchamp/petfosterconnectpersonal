import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, Container, Slide, SlideProps, Snackbar, Stack, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import dog from "../../assets/dog.webp";
import { LoaderPetFoster } from "../../components/Loader/LoaderPetFoster";
import PetFosterTextField from "../../components/PetFosterTextField/PetFosterTextField";
import ButtonPurple from "../../components/ui/ButtonPurple";
import { useAuth } from "../../hooks/useAuth";
import { useCsrf } from "../../hooks/useCsrf";
import { ShelterWithUser } from "../../interfaces/shelter";

const API_URL = import.meta.env.VITE_API_URL;

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  location?: string;
  description?: string;
}

const ShelterProfile = () => {
  const { user } = useAuth();
  const { csrfToken, isLoading: isCsrfLoading } = useCsrf();
  const [shelterWithUser, setShelterWithUser] = useState<Partial<ShelterWithUser>>({
    name: undefined,
    location: undefined,
    description: undefined,
    picture: undefined,
    user: {
      id: '',
      email: '',
      password: undefined,
    },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!shelterWithUser.user?.email) {
      errors.email = "L'email est requis";
    } else if (!validateEmail(shelterWithUser.user.email)) {
      errors.email = 'Veuillez entrer un email valide';
    }

    if (shelterWithUser.user?.password && shelterWithUser.user.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!shelterWithUser.name) {
      errors.name = 'Le nom de la structure est requis';
    }

    if (!shelterWithUser.location) {
      errors.location = 'La localisation est requise';
    }

    if (!shelterWithUser.description) {
      errors.description = 'La description est requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsEditing(true);
    setShelterWithUser(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, email: value } : { id: '', email: value },
    }));
    if (value && !validateEmail(value)) {
      setFormErrors(prev => ({ ...prev, email: 'Veuillez entrer un email valide' }));
    } else {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showMessage = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getUserInformations = async () => {
    if (isCsrfLoading) return;

    try {
      const response = await fetch(`${API_URL}/user/${user?.id}/shelter`, {
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });

      const { data } = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setShelterWithUser({
        name: data.Shelter?.name || '',
        location: data.Shelter?.location || '',
        description: data.Shelter?.description || '',
        picture: data.Shelter?.picture || '',
        user: {
          id: data.id,
          email: data.email,
        },
      });
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors du chargement du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append('picture', file);
    formData.append('name', shelterWithUser.name || '');

    try {
      const response = await fetch(`${API_URL}/user/${user?.id}/shelter`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'upload du logo');
      }

      if (data.success && data.data?.Shelter?.picture) {
        setShelterWithUser(prev => ({
          ...prev,
          picture: data.data.Shelter.picture
        }));
        showMessage('Logo mis à jour avec succès', 'success');
      } else {
        console.error('Données de réponse invalides:', data);
        throw new Error('Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      showMessage(error instanceof Error ? error.message : 'Erreur lors de l\'upload du logo', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/user/${user?.id}/shelter`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(shelterWithUser),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      setIsEditing(false);
      showMessage('Profil mis à jour avec succès', 'success');
    } catch (err) {
      console.error(err);
      showMessage(err instanceof Error ? err.message : 'Erreur lors de la mise à jour', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getUserInformations();
  }, [isCsrfLoading]);

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LoaderPetFoster />
      </Container>
    );
  }

  return (
    <Container sx={{ bgcolor: '#f5f5f5' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{
          '& .MuiAlert-root': {
            minWidth: '300px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
            '& .MuiAlert-message': {
              fontSize: '0.9rem',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack spacing={4} margin={4} sx={{ display: 'flex', flexDirection: { sm: 'column', lg: 'row' } }}>
        <Stack flex={1}>
          <Stack marginBottom={4}>
            <Typography variant="h1">Profil de ma structure</Typography>
            <Typography variant="h2">{shelterWithUser.name}</Typography>
          </Stack>

          <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={4}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} width="100%" spacing={6} margin="auto">
              <Stack spacing={2} width="100%" alignItems="center" justifyContent="center">
                <PetFosterTextField
                  label="Mon email"
                  type="email"
                  value={shelterWithUser.user?.email}
                  onChange={handleEmailChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={isSubmitting}
                />

                <PetFosterTextField
                  type={showPassword ? 'text' : 'password'}
                  label="Mot de passe"
                  value={shelterWithUser.user?.password}
                  onChange={e => {
                    setIsEditing(true);
                    setShelterWithUser(prev => ({
                      ...prev,
                      user: prev.user
                        ? { ...prev.user, password: e.target.value }
                        : { id: '', email: '', password: '' },
                    }));
                  }}
                  endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                  onEndIconClick={() => setShowPassword(!showPassword)}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={isSubmitting}
                />
              </Stack>

              <Stack spacing={2} width="100%" alignItems="center" justifyContent="center">
                <PetFosterTextField
                  label="Nom de ma structure"
                  type="text"
                  value={shelterWithUser.name}
                  onChange={e => {
                    setIsEditing(true);
                    setShelterWithUser({ ...shelterWithUser, name: e.target.value });
                  }}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  disabled={isSubmitting}
                />
                <PetFosterTextField
                  label="Localisation"
                  type="text"
                  value={shelterWithUser.location}
                  onChange={e => {
                    setIsEditing(true);
                    setShelterWithUser({ ...shelterWithUser, location: e.target.value });
                  }}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  disabled={isSubmitting}
                />
              </Stack>
            </Stack>

            <PetFosterTextField
              label="Description"
              type="text"
              multiline
              rows={4}
              value={shelterWithUser.description}
              onChange={e => {
                setIsEditing(true);
                setShelterWithUser({ ...shelterWithUser, description: e.target.value });
              }}
              error={!!formErrors.description}
              helperText={formErrors.description}
              disabled={isSubmitting}
            />

            <ButtonPurple
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: 'fit-content' }}
              disabled={!isEditing || isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </ButtonPurple>
          </Stack>
        </Stack>

        <Stack spacing={2} alignItems="center" sx={{ width: 300 }}>
          <Box
            component="img"
            src={logoPreview || shelterWithUser.picture || dog}
            alt="Logo de la structure"
            sx={{
              width: 200,
              height: 200,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid white',
              marginBottom: 2
            }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ width: 'fit-content' }}
          >
            {shelterWithUser.picture ? 'Changer le logo' : 'Ajouter un logo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ShelterProfile;
