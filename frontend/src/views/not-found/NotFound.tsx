import { Container, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import notFoundImage from '../../assets/404.png';
import ButtonPurple from '../../components/ui/ButtonPurple';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={4} alignItems="center">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '2.5rem' },
            textAlign: 'center',
            color: '#5B6C97',
            fontWeight: 'bold',
          }}
        >
          Oups ! On a perdu la piste...
        </Typography>

        <img
          src={notFoundImage}
          alt="404 - Page non trouvée"
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1rem', md: '1.3rem' },
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          Nos amis à quatre pattes ont peut-être emporté cette page dans leur cachette préférée.
        </Typography>

        <ButtonPurple
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            mt: 4,
            px: 4,
            py: 1.5,
            borderRadius: '50px',
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
        >
          Retourner à la maison
        </ButtonPurple>
      </Stack>
    </Container>
  );
};

export default NotFound;
