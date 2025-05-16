import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Container, Slide, SlideProps, Snackbar, Stack, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import heart from "../../assets/heart.webp";
import { LoaderPetFoster } from "../../components/Loader/LoaderPetFoster";
import PetFosterTextField from "../../components/PetFosterTextField/PetFosterTextField";
import ButtonPurple from "../../components/ui/ButtonPurple";
import { useAuth } from "../../hooks/useAuth";
import { useCsrf } from "../../hooks/useCsrf";
import { FosterWithUser } from "../../interfaces/foster";

const API_URL = import.meta.env.VITE_API_URL;

interface FormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  description?: string;
}

const FosterProfile = () => {

  const [fosterWithUser, setFosterWithUser] = useState<Partial<FosterWithUser>>({
    firstName: undefined,
    lastName: undefined,
    address: undefined,
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

  const { user } = useAuth();
  const { csrfToken, isLoading: isCsrfLoading } = useCsrf();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!fosterWithUser.user?.email) {
      errors.email = "L'email est requis";
    } else if (!validateEmail(fosterWithUser.user.email)) {
      errors.email = 'Veuillez entrer un email valide';
    }

    if (fosterWithUser.user?.password && fosterWithUser.user.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!fosterWithUser.firstName) {
      errors.firstName = 'Le prénom est requis';
    }

    if (!fosterWithUser.lastName) {
      errors.lastName = 'Le nom est requis';
    }

    if (!fosterWithUser.address) {
      errors.address = "L'adresse est requise";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsEditing(true);
    setFosterWithUser(prev => ({
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
      const response = await fetch(`${API_URL}/user/${user?.id}/foster`, {
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });

      const { data } = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setFosterWithUser({
        firstName: data.Foster?.firstName || '',
        lastName: data.Foster?.lastName || '',
        address: data.Foster?.address || '',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      showMessage('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/user/${user?.id}/foster`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(fosterWithUser),
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
    <Container maxWidth={false}>

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
          }
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
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack margin={4} direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="h4" fontWeight={500}>Profil de ma famille</Typography>
          <Typography variant="h5" fontWeight={600}>{`${fosterWithUser.firstName} ${fosterWithUser.lastName}`}</Typography>
        </Stack>
        <div className="img-right">
          <img src={heart} className="heart" alt="" height="100px" width="auto" />
        </div>
      </Stack>

      <Stack component="form" onSubmit={handleSubmit} alignItems="center" justifyContent="center" spacing={4}>
        <Stack direction={{ xs: "column", md: "row" }} width="100%" spacing={6} margin="auto">
          <Stack spacing={2} width="100%" alignItems="center" justifyContent="center">
            <PetFosterTextField
              label="Mon email"
              type="email"
              value={fosterWithUser.user?.email}
              onChange={handleEmailChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={isSubmitting}
            />

            <PetFosterTextField
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              value={fosterWithUser.user?.password}
              onChange={(e) => {
                setIsEditing(true);
                setFosterWithUser((prev) => ({
                  ...prev,
                  user: prev.user ? { ...prev.user, password: e.target.value } : { id: '', email: '', password: '' }
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
              label="Prénom"
              type="text"
              value={fosterWithUser.firstName}
              onChange={(e) => {
                setIsEditing(true);
                setFosterWithUser({ ...fosterWithUser, firstName: e.target.value });
              }}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              disabled={isSubmitting}
            />
            <PetFosterTextField
              label="Nom"
              type="text"
              value={fosterWithUser.lastName}
              onChange={(e) => {
                setIsEditing(true);
                setFosterWithUser({ ...fosterWithUser, lastName: e.target.value });
              }}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              disabled={isSubmitting}
            />
            <PetFosterTextField
              label="Adresse"
              type="text"
              multiline
              value={fosterWithUser.address}
              onChange={(e) => {
                setIsEditing(true);
                setFosterWithUser({ ...fosterWithUser, address: e.target.value });
              }}
              error={!!formErrors.address}
              helperText={formErrors.address}
              disabled={isSubmitting}
            />
          </Stack>
        </Stack>

        <ButtonPurple
          type="submit"
          variant="contained"
          color="primary"
          sx={{ width: "fit-content" }}
          disabled={!isEditing || isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </ButtonPurple>
      </Stack>
    </Container>

  );
};

export default FosterProfile;
