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
                    sx={{ color: '#fff' }}
                >
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