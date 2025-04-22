import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

interface ButtonPurpleProps extends ButtonProps {
  fontSize?: string;
}

const ButtonPurple = styled(Button, {
  shouldForwardProp: prop => prop !== 'fontSize',
})<ButtonPurpleProps>(({ fontSize }) => ({
  fontFamily: 'var(--font)',
  backgroundColor: 'var(--color-purple)',
  padding: '12px 20px',
  fontSize: fontSize || '14px',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-white)',
  borderRadius: '15px',
  textDecoration: 'none',
  textTransform: 'none',
  letterSpacing: '0',
  '&:hover, &:focus, &:active': {
    backgroundColor: 'var(--color-purple-hover)',
    color: 'var(--color-white)',
    textDecoration: 'none',
  },
}));

export default ButtonPurple;
