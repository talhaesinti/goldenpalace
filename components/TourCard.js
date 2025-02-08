import React from 'react';
import { Card, CardContent, Typography, Button, CardActions, Box } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import CurrencyLiraIcon from '@mui/icons-material/CurrencyLira';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatTitle, formatPrice } from '@/utils/formatters';
import Image from 'next/image';

const TourCard = ({ tour }) => {
  const { thumbnail, name, price, start_date, end_date, airline } = tour;

  return (
    <Card
      sx={{
        width: '100%',
        minWidth: '320px',
        maxWidth: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        margin: '0 auto',
        transition: 'all 0.3s ease',
        backgroundColor: '#fff',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '180px' }}>
        <Image
          src={thumbnail || '/placeholder-tour.jpg'}
          alt={name}
          fill
          style={{
            objectFit: 'cover',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
          sizes="(max-width: 320px) 100vw, 320px"
        />
      </div>

      <CardContent sx={{ p: 2, flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#2c3e50',
            mb: 2,
            height: 'auto',
            minHeight: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {formatTitle(name)}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightIcon sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
            <Typography sx={{ color: '#2c3e50', fontSize: '1rem', fontWeight: '500' }}>
              {airline}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: '#2196f3', fontSize: '1.2rem' }} />
            <Typography sx={{ color: '#2c3e50', fontSize: '1rem', fontWeight: '500' }}>
              {new Date(start_date).toLocaleDateString('tr-TR')} / {new Date(end_date).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyLiraIcon sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
            <Typography 
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}
            >
              {formatPrice(price)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            borderRadius: '6px',
            py: 0.6,
            px: 2,
            fontSize: '0.9rem',
            fontWeight: '500',
            textTransform: 'none',
            backgroundColor: '#7e57c2',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#6a1b9a',
            },
          }}
        >
          {formatTitle("Detayları İncele")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TourCard;
