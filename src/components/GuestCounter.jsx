import { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { GuestService } from '../services/firestore';
import GeometricBorder from './GeometricBorder';

const GuestCounter = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Real-time listener for guest count
    let unsubscribe = () => {};
    try {
      unsubscribe = GuestService.subscribeToGuests((guests) => {
        const total = guests.reduce((acc, guest) => {
          if (guest.attending === 'yes') {
              return acc + 1 + (guest.plusOnes || 0);
          }
          return acc;
        }, 0);
        setCount(total);
      }, (error) => {
        console.warn("Public user cannot see guest count details (permissions)");
        setCount(0); // Optional: default to 0 for public
      });
    } catch (err) {
      console.warn("GuestCounter subscribe error:", err);
    }

    return () => unsubscribe();
  }, []);

  if (count === null) return null; // Loading state

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
      <GeometricBorder sx={{ minWidth: 200, textAlign: 'center', p: 4 }}>
        <Typography variant="h2" sx={{ fontSize: '4rem', color: 'primary.main', lineHeight: 1 }}>
          {count}
        </Typography>
        <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
          Guests Attending
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
          See you in Honolulu!
        </Typography>
      </GeometricBorder>
    </Box>
  );
};

export default GuestCounter;
