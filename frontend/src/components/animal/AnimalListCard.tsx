import { useNavigate } from "react-router";
import { AnimalWithRelations } from "../../interfaces/animal";
import { Card, Box, CardMedia, Chip, CardContent, Typography } from "@mui/material";
import { getStatusLabel, getStatusColor, capitalizeFirstLetter } from "../../helpers/statusHelper";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

export const AnimalListCard = ({ animal }: { animal: AnimalWithRelations }) => {
  const navigate = useNavigate();
  return (
    <Card
      key={animal.id}
      onClick={() => navigate(`/animal/${animal.id}`)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--color-border, #e2e8f0)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ position: 'relative', padding: '25%' }}>
        <CardMedia
          component="img"
          image={animal.picture || '/no-image.png'}
          width='200px'
          height='200px'
          alt={animal.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 12,
          left: 12
        }}>
          <Chip
            label={getStatusLabel(animal.status)}
            sx={{
              backgroundColor: getStatusColor(animal.status),
              color: 'white',
              borderRadius: '4px',
              height: '24px',
              fontSize: '12px',
              fontWeight: 500
            }}
          />
        </Box>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-dark, #1e293b)',
            mb: 1
          }}
        >
          {animal.name}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={capitalizeFirstLetter(animal.specie.name)}
            size="small"
            sx={{
              backgroundColor: 'var(--color-background, #f1f5f9)',
              color: 'var(--color-text, #64748b)',
              borderRadius: '4px',
              height: '24px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid var(--color-border, #e2e8f0)'
            }}
          />
          <Chip
            label={animal.sex === 'Male' ? 'Mâle' : 'Femelle'}
            icon={animal.sex === 'Male' ? <MaleIcon /> : <FemaleIcon />}
            size="small"
            sx={{
              backgroundColor: 'var(--color-background, #f1f5f9)',
              color: 'var(--color-text, #64748b)',
              borderRadius: '4px',
              height: '24px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid var(--color-border, #e2e8f0)'
            }}
          />
          <Chip
            label={`${animal.age} ${animal.age > 1 ? 'ans' : 'an'}`}
            size="small"
            sx={{
              backgroundColor: 'var(--color-background, #f1f5f9)',
              color: 'var(--color-text, #64748b)',
              borderRadius: '4px',
              height: '24px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid var(--color-border, #e2e8f0)'
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'var(--color-text, #64748b)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5
          }}
        >
          {animal.description}
        </Typography>
      </CardContent>
    </Card>
  )
};