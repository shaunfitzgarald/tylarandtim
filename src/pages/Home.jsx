import { Box, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import GuestCounter from '../components/GuestCounter';
import Info from '../components/Info';
import GeometricBorder from '../components/GeometricBorder';
import RSVPForm from '../components/RSVPForm';
import { GuestService } from '../services/firestore';

const Home = () => {
    const [guestCount, setGuestCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = GuestService.subscribeToGuestCount((count) => {
            setGuestCount(count);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (location.hash === '#rsvp-section') {
            setTimeout(() => {
                const element = document.getElementById('rsvp-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    return (
        <Box>
            <Hero />
            
            <Box id="rsvp-section" sx={{ pt: 10, pb: 2, backgroundColor: '#fff' }}>
                <Container maxWidth="md">
                    <GeometricBorder>
                        <Box sx={{ textAlign: 'center', mb: 0 }}>
                            <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: '"Great Vibes", cursive', color: '#D4AF37', wordBreak: 'break-word' }}>
                                RSVP
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', mx: 'auto' }}>
                                We can't wait to celebrate with you! To ensure you receive your official invitation, please kindly RSVP by June 3rd, 2026.
                            </Typography>
                            {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <GeometricBorder sx={{ 
                                    p: 0, 
                                    m: 0,
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(212, 175, 55, 0.02)',
                                    width: 140,
                                    height: 140,
                                }}>
                                    <Typography variant="h2" sx={{ fontSize: '3rem', color: '#D4AF37', lineHeight: 1 }}>
                                      {guestCount}
                                    </Typography>
                                    <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.7rem', color: '#D4AF37', mt: 1 }}>
                                      Guests Attending
                                    </Typography>
                                </GeometricBorder>
                            </Box> */}
                        </Box>
                        <RSVPForm />
                    </GeometricBorder>
                </Container>
            </Box>
            
            <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
                <GuestCounter />

                <Info />
            </Container>
        </Box>
    );
};

export default Home;
