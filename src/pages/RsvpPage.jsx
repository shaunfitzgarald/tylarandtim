import { Box, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GeometricBorder from '../components/GeometricBorder';
import RSVPForm from '../components/RSVPForm';
import { GuestService } from '../services/firestore';

const RsvpPage = () => {
    const [guestCount, setGuestCount] = useState(0);

    useEffect(() => {
        const unsubscribe = GuestService.subscribeToGuestCount((count) => {
            setGuestCount(count);
        });
        return () => unsubscribe();
    }, []);
    return (
        <Box sx={{ pt: 15, pb: 10, minHeight: '100vh', backgroundColor: '#fff' }}>
            <Container maxWidth="md">
                <GeometricBorder>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: '"Great Vibes", cursive', color: '#D4AF37', wordBreak: 'break-word' }}>
                            RSVP
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', mx: 'auto' }}>
                            We can't wait to celebrate with you! Please let us know if you'll be joining us by September 6, 2026.
                        </Typography>
                        <Box sx={{ mt: 3, p: 2, display: 'inline-block', border: '1px solid #D4AF37', borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                             <Typography variant="h6" sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                Current Guest Count: {guestCount}
                             </Typography>
                        </Box>
                    </Box>
                    <RSVPForm />
                </GeometricBorder>
            </Container>
        </Box>
    );
};

export default RsvpPage;
