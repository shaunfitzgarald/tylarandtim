import { Box, Container } from '@mui/material';
import Hero from '../components/Hero';
import GuestCounter from '../components/GuestCounter';
import Info from '../components/Info';
import GeometricBorder from '../components/GeometricBorder';

const Home = () => {
    return (
        <Box>
            <Hero />
            
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <GuestCounter />

                <Info />
            </Container>
        </Box>
    );
};

export default Home;
