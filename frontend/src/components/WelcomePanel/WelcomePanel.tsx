import dogImage from '@/assets/dog-login.png?url';
import { Box, Typography } from '@mui/material';
import './WelcomePanel.css';

interface WelcomePanelProps {
  title: string;
}

const WelcomePanel = ({ title }: WelcomePanelProps) => {
  return (
    <Box className="welcome-panel">
      <Box className="welcome-content">
        <Box className="welcome-text-container">
          <Typography
            variant="h5"
            className="welcome-title"
            sx={{
              fontWeight: 'bold',
              width: '100%',
              fontSize: '2.4rem',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box component="img" src={dogImage} alt="Chien d'accueil" className="dog-image" />
      </Box>
    </Box>
  );
};

export default WelcomePanel;
