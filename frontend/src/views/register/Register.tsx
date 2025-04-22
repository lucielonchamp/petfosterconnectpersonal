import { Home, Lock, Person, Pets, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import PetFosterTextField from '../../components/PetFosterTextField/PetFosterTextField';
import WelcomePanel from '../../components/WelcomePanel/WelcomePanel';
import { useAuth } from '../../hooks/useAuth';
import './Register.css';

interface Role {
  id: number;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleError, setRoleError] = useState('');

  const steps = ['Choix du rôle', 'Informations de connexion'];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/role`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          const filteredRoles = data.data.filter(
            (role: Role) => role.name.toLowerCase() !== 'admin'
          );
          setRoles(filteredRoles);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des rôles:', err);
      }
    };
    fetchRoles();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!hasUpperCase || !hasLowerCase) {
      return 'Le mot de passe doit contenir des majuscules et des minuscules';
    }
    if (!hasNumbers) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!hasSpecialChar) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return '';
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Veuillez entrer un email valide');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);

    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedRole) {
        setRoleError('Veuillez sélectionner un rôle');
        return;
      }
      setRoleError('');
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer un email valide');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          roleId: selectedRole,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="subtitle1" color="#666" mb={2}>
              Choisissez votre rôle
            </Typography>
            <Box display="flex" justifyContent="space-around" gap={2}>
              {roles.map((role: Role) => (
                <Card
                  key={role.id}
                  sx={{
                    cursor: 'pointer',
                    flex: '1',
                    maxWidth: '200px',
                    transition: 'all 0.3s ease',
                    border:
                      selectedRole === role.id.toString()
                        ? '2px solid #5B6B94'
                        : '1px solid #e0e0e0',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => setSelectedRole(role.id.toString())}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '15px !important',
                    }}
                  >
                    <Radio
                      checked={selectedRole === role.id.toString()}
                      sx={{
                        color: '#5B6B94',
                        '&.Mui-checked': {
                          color: '#5B6B94',
                        },
                        padding: '4px',
                      }}
                    />
                    {role.name.toLowerCase() === 'shelter' ? (
                      <>
                        <Home sx={{ fontSize: 32, color: '#5B6B94', my: 1 }} />
                        <Typography variant="h6" textAlign="center" color="#333" fontSize="1rem">
                          Refuge
                        </Typography>
                        <Typography variant="body2" textAlign="center" color="#666" mt={0.5}>
                          Je représente un refuge et je cherche des familles d'accueil
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Pets sx={{ fontSize: 32, color: '#5B6B94', my: 1 }} />
                        <Typography variant="h6" textAlign="center" color="#333" fontSize="1rem">
                          Famille d'accueil
                        </Typography>
                        <Typography variant="body2" textAlign="center" color="#666" mt={0.5}>
                          Je souhaite devenir famille d'accueil pour des animaux
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
            {roleError && (
              <Typography color="error" fontSize="small" mt={1}>
                {roleError}
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Stack spacing={2} width="100%">
            <PetFosterTextField
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              startIcon={<Person sx={{ color: '#fff' }} />}
            />

            <PetFosterTextField
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
              startIcon={<Lock sx={{ color: '#fff' }} />}
              endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
              onEndIconClick={() => setShowPassword(!showPassword)}
            />

            <PetFosterTextField
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              startIcon={<Lock sx={{ color: '#fff' }} />}
              endIcon={showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      className="register-container"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box flex="0 0 60%" display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Stack spacing={2} alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="PetFoster Connect"
              sx={{ width: 120, pointerEvents: 'none' }}
            />
            <Typography variant="h4" component="h1" color="#333" sx={{ fontWeight: 'bold' }}>
              INSCRIPTION
            </Typography>
            <Typography variant="subtitle1" component="h2" color="#666" mb={3}>
              Créez votre compte pour rejoindre notre communauté
            </Typography>

            <Box width="100%" mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                {steps.map((label, index) => (
                  <Typography
                    key={label}
                    variant="body2"
                    sx={{
                      color: index <= activeStep ? '#5B6B94' : '#B7C1D3',
                      fontWeight: index <= activeStep ? 'bold' : 'normal',
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>
              <LinearProgress
                variant="determinate"
                value={(activeStep + 1) * (100 / steps.length)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#B7C1D3',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#5B6B94',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            <Box component="form" onSubmit={handleSubmit} width="100%">
              {error && (
                <Typography color="error" textAlign="center" mb={2}>
                  {error}
                </Typography>
              )}

              {renderStepContent(activeStep)}

              <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                {activeStep > 0 && (
                  <Button
                    onClick={handleBack}
                    sx={{
                      color: '#5B6B94',
                      borderRadius: '12px',
                      borderColor: '#5B6B94',
                      '&:hover': {
                        borderColor: '#4a5a83',
                        backgroundColor: 'transparent',
                      },
                    }}
                    variant="outlined"
                  >
                    Retour
                  </Button>
                )}
                <Button
                  type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                  disabled={loading}
                  sx={{
                    bgcolor: '#5B6B94',
                    '&:hover': {
                      bgcolor: '#4a5a83',
                    },
                    py: 1.5,
                    px: 3,
                    borderRadius: '12px',
                    width: 'auto',
                    minWidth: '200px',
                  }}
                >
                  {activeStep === steps.length - 1
                    ? loading
                      ? 'Inscription...'
                      : "M'inscrire"
                    : 'Suivant'}
                </Button>
              </Stack>

              <Typography variant="body2" color="#666" align="center" mt={2}>
                Déjà un compte ?{' '}
                <Button
                  variant="text"
                  sx={{
                    color: '#5B6B94',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#4a5a83',
                    },
                  }}
                  onClick={() => navigate('/login')}
                >
                  Se connecter
                </Button>
              </Typography>

              <Typography
                variant="body2"
                color="#666"
                align="center"
                sx={{
                  position: 'relative',
                  mt: 2,
                  '& .decorative-text': {
                    position: 'relative',
                    display: 'inline-block',
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      width: '40px',
                      height: '1px',
                      backgroundColor: '#333',
                      opacity: 0.5,
                    },
                    '&::before': {
                      left: '-50px',
                    },
                    '&::after': {
                      right: '-50px',
                    },
                  },
                }}
              >
                <span className="decorative-text">
                  <Button
                    variant="text"
                    sx={{
                      color: '#333',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: 'transparent',
                      },
                    }}
                    onClick={() => navigate('/')}
                  >
                    <span style={{ fontWeight: 'bold' }}>Retour&nbsp;</span> sur l'accueil
                  </Button>
                </span>
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <WelcomePanel title="Bienvenue parmi nous !" />
    </Box>
  );
};

export default Register;
