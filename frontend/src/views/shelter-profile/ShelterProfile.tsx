import { Edit as EditIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Avatar, Box, Button, Card, CardContent, Fade, Paper, Slide, SlideProps, Snackbar, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <LoaderPetFoster />
      </Box>
    );
  }

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* En-tête du profil */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'flex-start', gap: 3, }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={logoPreview || shelterWithUser.picture || dog}
                  alt="Logo de la structure"
                  sx={{
                    width: { xs: 120, md: 80 },
                    height: { xs: 120, md: 80 },
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    minWidth: 0,
                    width: 36,
                    height: 36,
                    borderRadius: '50%'
                  }}
                >
                  <EditIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: isMobile ? 'center' : 'left' }}>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                  {shelterWithUser.name || 'Ma structure'}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {shelterWithUser.location || 'Localisation non définie'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Formulaire */}


          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Fade in={true} timeout={800}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                  <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Identifiants
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <PetFosterTextField
                          label="Adresse email"
                          type="email"
                          fullWidth
                          value={shelterWithUser.user?.email}
                          onChange={handleEmailChange}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          disabled={isSubmitting}
                          size="small"
                        />

                        <PetFosterTextField
                          type={showPassword ? 'text' : 'password'}
                          label="Mot de passe"
                          fullWidth
                          value={shelterWithUser.user?.password}
                          placeholder="Laisser vide pour conserver le mot de passe actuel"
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
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations structure
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <PetFosterTextField
                          label="Nom de la structure"
                          type="text"
                          fullWidth
                          value={shelterWithUser.name}
                          onChange={e => {
                            setIsEditing(true);
                            setShelterWithUser({ ...shelterWithUser, name: e.target.value });
                          }}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          disabled={isSubmitting}
                          size="small"
                        />

                        <PetFosterTextField
                          label="Localisation"
                          type="text"
                          fullWidth
                          value={shelterWithUser.location}
                          onChange={e => {
                            setIsEditing(true);
                            setShelterWithUser({ ...shelterWithUser, location: e.target.value });
                          }}
                          error={!!formErrors.location}
                          helperText={formErrors.location}
                          disabled={isSubmitting}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Description
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <PetFosterTextField
                        label="Présentez votre structure"
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        value={shelterWithUser.description}
                        onChange={e => {
                          setIsEditing(true);
                          setShelterWithUser({ ...shelterWithUser, description: e.target.value });
                        }}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                        disabled={isSubmitting}
                      />
                    </Box>
                  </CardContent>
                </Card>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <ButtonPurple
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isEditing || isSubmitting}
                    sx={{ px: 4 }}
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </ButtonPurple>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Box>

      </Paper>
    </>
  );
};

export default ShelterProfile;
