import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import GeometricBorder from './GeometricBorder';
import { useContent } from '../hooks/useContent';

const hotels = [
  {
    name: "The Royal Hawaiian",
    description: "The Pink Palace of the Pacific. Luxury resort on Waikiki Beach.",
    link: "https://www.royal-hawaiian.com/",
    price: "$$$$"
  },
  {
    name: "Moana Surfrider",
    description: "A Westin Resort & Spa, Waikiki Beach. Historic victorian elegance.",
    link: "https://www.marriott.com/en-us/hotels/hnlwa-moana-surfrider-a-westin-resort-and-spa-waikiki-beach/overview/",
    price: "$$$"
  },
  {
    name: "Sheraton Waikiki",
    description: "Modern comfort with infinity pool and ocean views.",
    link: "https://www.marriott.com/en-us/hotels/hnlws-sheraton-waikiki/overview/",
    price: "$$"
  }
];

const Info = () => {
  const { content } = useContent('wedding_details', {
    ceremonyDate: 'Saturday, September 6, 2026',
    ceremonyTime: '4:00 PM - 10:00 PM',
    venueName: 'Kualoa Ranch',
    venueAddress: '49-560 Kamehameha Hwy\nKaneohe, HI 96744',
    dressCode: 'Black Tie Optional',
    dressCodeDesc: 'We ask that men wear tuxedos or dark suits and women wear evening gowns or midi cocktail dresses.'
  });

  return (
    <Box sx={{ py: 8 }}>
        <GeometricBorder sx={{ p: { xs: 2, md: 6 }, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Wedding Weekend Details
            </Typography>

            <Grid container spacing={4} sx={{ mb: 6, textAlign: 'left' }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif', borderBottom: '1px solid #D4AF37', pb: 1 }}>
                        Ceremony & Reception
                    </Typography>
                    <Typography variant="h6">{content.ceremonyDate}</Typography>
                    <Typography variant="body1">{content.ceremonyTime}</Typography>
                    <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                        **{content.venueName}**<br />
                        {content.venueAddress}
                    </Typography>
                    <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        href="https://goo.gl/maps/placeholder"
                        target="_blank"
                    >
                        View Map
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom sx={{ fontFamily: '"Cormorant Garamond", serif', borderBottom: '1px solid #D4AF37', pb: 1 }}>
                        {content.dressCode}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {content.dressCodeDesc}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Please note the ceremony will be on grass, so block heels are recommended.
                    </Typography>
                </Grid>
            </Grid>

            <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Accommodations
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                We have secured room blocks at the following hotels. Please reference the **Tylar & Tim Wedding** when booking.
            </Typography>

            <Grid container spacing={3}>
                {hotels.map((hotel, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div" gutterBottom>
                                    {hotel.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {hotel.price}
                                </Typography>
                                <Typography variant="body2">
                                    {hotel.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button size="small" variant="contained" href={hotel.link} target="_blank">Book Now</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </GeometricBorder>
    </Box>
  );
};

export default Info;
