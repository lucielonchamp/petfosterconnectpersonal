import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Container, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import logo from '../../assets/logo.png';
import WelcomePanel from '../../components/WelcomePanel/WelcomePanel';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Veuillez entrer un email valide');
            return;
        }
        // Logique de connexion à implémenter
    };

    const commonTextFieldSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: '#B7C1D3',
            borderRadius: '12px',
            '& fieldset': {
                borderColor: '#B7C1D3',
                borderRadius: '12px',
            },
            '&:hover fieldset': {
                borderColor: '#5B6B94',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#5B6B94',
            },
        },
        '& .MuiOutlinedInput-input': {
            color: '#333',
            '&::placeholder': {
                color: '#fff',
                opacity: 1,
            },
        },
    };

    return (
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
                        <Typography variant="h4" color="#333" sx={{ fontWeight: 'bold' }}>
                            CONNEXION
                        </Typography>
                        <Typography variant="subtitle1" color="#666" mb={3}>
                            How to i get started lorem ipsum dolor at?
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} width="100%">
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={commonTextFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: '#fff' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={commonTextFieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: '#fff' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: '#fff' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    Me connecter
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
                                        onClick={() => navigate('/register')}
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
                                            onClick={() => navigate('/')}
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
    );
};

export default Login;
