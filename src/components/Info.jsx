import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import GeometricBorder from './GeometricBorder';
import FlightSearch from './FlightSearch';


const hotels = [
  {
    name: "Aston Waikiki Beach",
    description: "Beautiful beachfront resort located in the heart of Waikiki.",
    address: "2570 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.twinfinwaikiki.com/",
    mapUrl: "https://maps.google.com/maps?q=Aston+Waikiki+Beach+Honolulu&t=&z=15&ie=UTF8&iwloc=&output=embed",
    price: "$$"
  },
  {
    name: "Hilton Hawaiian Village",
    description: "Vast resort on Waikiki's widest stretch of beach, featuring multiple pools and dining options.",
    address: "2005 Kalia Road, Honolulu, HI 96815",
    link: "https://www.hiltonhawaiianvillage.com/",
    mapUrl: "https://maps.google.com/maps?q=Hilton+Hawaiian+Village&t=&z=15&ie=UTF8&iwloc=&output=embed",
    price: "$$$"
  }
];

const Info = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
        <GeometricBorder sx={{ p: { xs: 2.5, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Wedding Weekend Details
            </Typography>

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'text.secondary' }}>
                    (the wedding venue is currently a secret)
                </Typography>
            </Box>

            <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Accommodations
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Contact <a href="mailto:support@shaunfitzgarald.com" style={{ color: 'inherit', textDecoration: 'underline' }}>Shaun</a> for booking details and instructions, as we have the hookup on rooms here!
            </Typography>

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {hotels.map((hotel, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index} sx={{ display: 'flex' }}>
                        <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {hotel.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {hotel.price}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {hotel.description}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                                    {hotel.address}
                                </Typography>
                                <Box sx={{ width: '100%', height: { xs: '180px', md: '200px' }, borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                                    <iframe 
                                        src={hotel.mapUrl} 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        allowFullScreen="" 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Map of ${hotel.name}`}
                                    ></iframe>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button size="small" variant="contained" href={hotel.link} target="_blank">Book Now</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
            <FlightSearch />

        </GeometricBorder>
    </Box>
  );
};

export default Info;
