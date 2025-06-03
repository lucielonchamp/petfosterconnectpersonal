import { Box, IconButton, InputAdornment, TextField, TextFieldProps, Typography, alpha } from '@mui/material';
import { ReactNode, forwardRef, useState } from 'react';

interface PetFosterInputProps extends Omit<TextFieldProps, 'InputProps' | 'variant' | 'label'> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconClick?: () => void;
  label?: React.ReactNode;
}

const PetFosterInput = forwardRef<HTMLDivElement, PetFosterInputProps>(({
  startIcon,
  endIcon,
  onEndIconClick,
  label,
  error,
  helperText,
  fullWidth = true,
  sx,
  ...textFieldProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  // Palette de couleurs modernisée
  const colors = {
    background: '#F7F9FC',
    backgroundFocused: '#FFFFFF',
    backgroundDisabled: '#EBEEF5',
    backgroundError: '#FFF5F5',
    text: '#2A3258',
    textLight: '#6B7280',
    primary: '#5b6c97',
    primaryLight: '#5b6c97',
    primaryDark: '#5b6c97',
    border: '#D1D5DB',
    borderFocused: '#5b6c97',
    label: '#6B7280',
    labelFocused: '#5b6c97',
    placeholder: '#A6A9B6',
    icon: '#6B7280',
    iconFocused: '#5b6c97',
  };

  const inputId = textFieldProps.id || `pet-foster-input-${Math.random().toString(36).substr(2, 9)}`;

  const containerSx = {
    marginY: 1.2,
    width: fullWidth ? '100%' : 'auto',
    ...(sx || {}),
  };

  const labelSx = {
    color: isFocused ? colors.labelFocused : colors.label,
    fontWeight: isFocused ? 'bold' : 'medium',
    fontSize: '0.95rem',
    marginBottom: '6px',
    transition: 'color 0.2s ease',
    marginLeft: '2px',
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: isFocused ? colors.backgroundFocused : colors.background,
      borderRadius: '10px',
      height: textFieldProps.multiline ? 'auto' : '50px',
      cursor: 'text',
      boxShadow: isFocused ? `0 4px 12px ${alpha(colors.primary, 0.12)}` : 'none',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: isFocused ? colors.borderFocused : colors.border,
        borderRadius: '10px',
        transition: 'border-color 0.2s ease',
      },
      '&:hover fieldset': {
        borderColor: colors.borderFocused,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.borderFocused,
        borderWidth: '2px',
      },
      '&.Mui-error': {
        backgroundColor: colors.backgroundError,
      },
      '&.Mui-disabled': {
        backgroundColor: colors.backgroundDisabled,
        opacity: 0.8,
      },
    },
    '& .MuiOutlinedInput-input': {
      color: colors.text,
      padding: textFieldProps.multiline ? '16px' : '14px 16px',
      fontSize: '0.95rem',
      fontWeight: 'normal',
      letterSpacing: '0.01em',
      '&::placeholder': {
        color: colors.placeholder,
        opacity: 1,
        fontSize: '0.9rem',
      },
      '&::selection': {
        backgroundColor: alpha(colors.primary, 0.2),
        color: colors.text,
      },
    },
    '& .MuiFormHelperText-root': {
      marginLeft: '6px',
      marginTop: '3px',
      fontSize: '0.75rem',
      lineHeight: 1.2,
      fontWeight: error ? 'medium' : 'normal',
    },
  };

  const inputProps = {
    startAdornment: startIcon && (
      <InputAdornment position="start">
        {startIcon}
      </InputAdornment>
    ),
    endAdornment: endIcon && (
      <InputAdornment position="end">
        <IconButton
          onClick={onEndIconClick}
          edge="end"
          size="small"
          sx={{
            color: isFocused ? colors.iconFocused : colors.icon,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.1),
              color: colors.primaryLight,
            },
            padding: '6px',
          }}
        >
          {endIcon}
        </IconButton>
      </InputAdornment>
    ),
  };

  return (
    <Box sx={containerSx} ref={ref}>
      {label && (
        <Typography
          component="label"
          variant="body2"
          sx={labelSx}
          htmlFor={inputId}
        >
          {label}
        </Typography>
      )}

      <TextField
        id={inputId}
        {...textFieldProps}
        variant="outlined"
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        sx={textFieldSx}
        InputProps={inputProps}
        onFocus={(e) => {
          setIsFocused(true);
          if (textFieldProps.onFocus) textFieldProps.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (textFieldProps.onBlur) textFieldProps.onBlur(e);
        }}
        InputLabelProps={{ shrink: false }}
        label={undefined}
      />
    </Box>
  );
});

export default PetFosterInput;
