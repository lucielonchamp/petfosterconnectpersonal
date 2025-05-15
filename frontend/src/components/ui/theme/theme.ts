import { createTheme } from '@mui/material/styles';
import typography from './typography';

const theme = createTheme({
  palette: {
    
    primary: {
      main: '#5b6c97',
      light: '#5b6c97',
      dark: '#5b6c97',
    },
    secondary: {
      main: '#5b6c97',
      light: '#5b6c97',
      dark: '#5b6c97',
    },
  },
  
  typography: typography,
});

export default theme;
