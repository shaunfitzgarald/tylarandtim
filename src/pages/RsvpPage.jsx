import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GeometricBorder from '../components/GeometricBorder';
import RSVPForm from '../components/RSVPForm';

const RsvpPage = () => {
    return (
        <Box sx={{ pt: 15, pb: 10, minHeight: '100vh', backgroundColor: '#fff' }}>
            <Container maxWidth="md">
                <GeometricBorder>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: '"Great Vibes", cursive', color: '#D4AF37' }}>
                            RSVP
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', mx: 'auto' }}>
                            We can't wait to celebrate with you! Please let us know if you'll be joining us by September 6, 2026.
                        </Typography>
                    </Box>
                    <RSVPForm />
                </GeometricBorder>
            </Container>
        </Box>
    );
};

export default RsvpPage;
