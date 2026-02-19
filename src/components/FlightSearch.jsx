import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SearchIcon from '@mui/icons-material/Search';

const FlightSearch = () => {
    const [origin, setOrigin] = useState('');
    const [loading, setLoading] = useState(false);
    const [flightData, setFlightData] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFlightData(null);

        // Simulate API delay
        setTimeout(() => {
            const mockFlights = [
                { airline: 'Hawaiian Airlines', price: '$450', duration: '5h 40m', stops: 'Non-stop' },
                { airline: 'Delta', price: '$480', duration: '5h 55m', stops: 'Non-stop' },
                { airline: 'United', price: '$420', duration: '8h 20m', stops: '1 stop' },
            ];
            setFlightData(mockFlights);
            setLoading(false);
        }, 1500);
    };

    return (
        <Box sx={{ mt: 8, mb: 4, p: { xs: 2, md: 4 }, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#fafafa' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif', color: 'primary.main', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2, textAlign: { xs: 'center', sm: 'left' } }}>
                <FlightTakeoffIcon fontSize="large" /> Check Flights to Honolulu (HNL)
            </Typography>
            <Typography variant="body1" paragraph>
                Finding the best flights for the big day! Enter your departing city below to see estimated prices.
            </Typography>

            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <TextField 
                    label="Departing From (City or Airport Code)" 
                    variant="outlined" 
                    value={origin} 
                    onChange={(e) => setOrigin(e.target.value)} 
                    required
                    sx={{ flexGrow: 1, backgroundColor: 'white' }}
                />
                <Button 
                    variant="contained" 
                    size="large" 
                    type="submit" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    sx={{ px: 4 }}
                >
                    {loading ? 'Searching...' : 'Search Flights'}
                </Button>
            </Box>

            {flightData && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Prices are estimates for Sept 2-9, 2026. <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer">Book on Google Flights</a>
                        </Alert>
                    </Grid>
                    {flightData.map((flight, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{flight.airline}</Typography>
                                    <Typography variant="h4" color="primary">{flight.price}</Typography>
                                    <Typography color="text.secondary">{flight.duration} • {flight.stops}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FlightSearch;
