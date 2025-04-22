import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

interface PetFosterInputProps extends Omit<TextFieldProps, 'InputProps'> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
}

const PetFosterInput = ({
  startIcon,
  endIcon,
  onEndIconClick,
  ...textFieldProps
}: PetFosterInputProps) => {
  const commonTextFieldSx = {
    '& label': {
      color: '#34748e',
      fontWeight: 'bold',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#B7C1D3',
      borderRadius: '12px',
      height: textFieldProps.multiline ? 'auto' : '45px',
      cursor: 'text',
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
      '&.Mui-focused': {
        '& .MuiOutlinedInput-input': {
          caretColor: '#000',
        },
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#333',
      padding: textFieldProps.multiline ? '14px' : '8px 14px',
      fontSize: '0.9rem',
      '&::placeholder': {
        color: '#fff',
        opacity: 1,
        fontSize: '0.9rem',
      },
      '&::selection': {
        backgroundColor: '#5B6B94',
        color: '#fff',
      },
    },
    '& .MuiInputAdornment-root': {
      '& .MuiSvgIcon-root': {
        fontSize: '1.2rem',
      },
      '& .MuiIconButton-root': {
        padding: '4px',
      },
    },
  };

  const inputProps = {
    startAdornment: startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>,
    endAdornment: endIcon && (
      <InputAdornment position="end">
        <IconButton onClick={onEndIconClick} edge="end" sx={{ color: '#fff' }}>
          {endIcon}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <TextField
      {...textFieldProps}
      fullWidth
      variant="outlined"
      sx={{ ...commonTextFieldSx, ...textFieldProps.sx }}
      InputProps={inputProps}
    />
  );
};

export default PetFosterInput;
