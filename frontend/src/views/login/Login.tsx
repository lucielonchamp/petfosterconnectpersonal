import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import PetFosterTextField from '../../components/PetFosterTextField/PetFosterTextField';
import WelcomePanel from '../../components/WelcomePanel/WelcomePanel';
import { useAuth } from '../../hooks/useAuth';
import { Path } from '../../interfaces/Path';
import './Login.css';
import Header from '../../components/layout/header/Header';
import Footer from '../../components/layout/footer/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer un email valide');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate(Path.DASHBOARD);
    } catch (err) {
      console.log(err);
      // Les erreurs sont déjà gérées par le contexte
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100vw',
      }}>
        <Header />
      </Container>
      <Box className="login-container">
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
                CONNEXION
              </Typography>
              <Typography variant="subtitle1" component="h2" color="#666" mb={3}>
                Connectez-vous pour accéder à votre espace personnel
              </Typography>

              <Box component="form" onSubmit={handleSubmit} width="100%">
                <Stack spacing={2}>
                  {authError && (
                    <Typography color="error" textAlign="center">
                      {authError}
                    </Typography>
                  )}

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
                    onChange={(e) => setPassword(e.target.value)}
                    startIcon={<Lock sx={{ color: '#fff' }} />}
                    endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                    onEndIconClick={() => setShowPassword(!showPassword)}
                  />

                  <Box alignSelf="flex-end">
                    <Button
                      variant="text"
                      sx={{ color: '#333', textTransform: 'none' }}
                    >
                      Mot de passe oublié ?
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
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
                      marginTop: '1rem',
                    }}
                  >
                    {loading ? 'Connexion...' : 'Me connecter'}
                  </Button>

                  <Typography variant="body2" color="#666" align="center">
                    Pas encore de compte ?{' '}
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
                        }
                      }}
                      onClick={() => navigate(Path.REGISTER)}
                    >
                      S'inscrire
                    </Button>
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#666"
                    align="center"
                    sx={{
                      position: 'relative',
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
                        }
                      }
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
                          }
                        }}
                        onClick={() => navigate(Path.HOME)}
                      >
                        <span style={{ fontWeight: 'bold' }}>Retour&nbsp;</span> sur l'accueil
                      </Button>
                    </span>
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Box>

        <WelcomePanel
          title="Ravis de te revoir !"
        />
      </Box>
      <Container sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100vw',
      }}>
        <Footer />
      </Container>
    </>
  );
};

export default Login;
