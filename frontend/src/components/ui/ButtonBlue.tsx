import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface ButtonBlueProps extends ButtonProps {
  fontSize?: string;
}

const ButtonBlue = styled(Button, {
  shouldForwardProp: prop => prop !== 'fontSize',
})<ButtonBlueProps>(({ fontSize }) => ({
  fontFamily: 'var(--font)',
  backgroundColor: 'var(--color-blue)',
  padding: '12px 20px',
  fontSize: fontSize || '14px',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-white)',
  borderRadius: '15px',
  textDecoration: 'none',
  textTransform: 'none',
  letterSpacing: '0',
  '&:hover, &:focus, &:active': {
    backgroundColor: 'var(--color-blue-hover)',
    color: 'var(--color-white)',
    textDecoration: 'none',
  },
}));

export default ButtonBlue;
