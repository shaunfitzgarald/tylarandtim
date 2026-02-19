import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import GeometricBorder from './GeometricBorder';
import FlightSearch from './FlightSearch';
import { useContent } from '../hooks/useContent';

const hotels = [
  {
    name: "The Royal Hawaiian",
    description: "The Pink Palace of the Pacific. Historic luxury on Waikiki Beach.",
    address: "2259 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.royal-hawaiian.com/",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.394979185633!2d-157.82949642426992!3d21.275634980436952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d87196029e5%3A0xc3af00135d96c8c7!2sThe%20Royal%20Hawaiian%2C%20a%20Luxury%20Collection%20Resort%2C%20Waikiki!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
    price: "$$$$"
  },
  {
    name: "Moana Surfrider",
    description: "A Westin Resort & Spa. 'The First Lady of Waikiki'. Victorian elegance.",
    address: "2365 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.marriott.com/en-us/hotels/hnlwa-moana-surfrider-a-westin-resort-and-spa-waikiki-beach/overview/",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.441864115865!2d-157.82772592427003!3d21.273872980437796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0072710344b563%3A0x6e9c40e53a5160b7!2sMoana%20Surfrider%2C%20A%20Westin%20Resort%20%26%20Spa%2C%20Waikiki%20Beach!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
    price: "$$$"
  },
  {
    name: "Sheraton Waikiki",
    description: "Modern comfort with infinity pool and breathtaking ocean views.",
    address: "2255 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.marriott.com/en-us/hotels/hnlws-sheraton-waikiki/overview/",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.3912648875323!2d-157.82969962426992!3d21.275774580436892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d8711420d91%3A0x2600863920700078!2sSheraton%20Waikiki!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
    price: "$$$"
  },
  {
    name: "Alohilani Resort",
    description: "Chic, modern resort featuring a standard-setting oceanarium.",
    address: "2490 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.alohilaniresort.com/",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.525868645063!2d-157.82522792427015!3d21.2707149804393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c007276d49925e1%3A0x608e682247167512!2s%27Alohilani%20Resort%20Waikiki%20Beach!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
    price: "$$"
  },
  {
    name: "Hyatt Regency Waikiki",
    description: "Twin towers offering spacious rooms and cultural center.",
    address: "2424 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.hyatt.com/en-US/hotel/hawaii/hyatt-regency-waikiki-beach-resort-and-spa/hnlrw",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.4812328148965!2d-157.8266203242701!3d21.27239308043851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c007273934f593b%3A0xcd3e680a6c6a49db!2sHyatt%20Regency%20Waikiki%20Beach%20Resort%20%26%20Spa!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
    price: "$$"
  },
  {
    name: "Outrigger Waikiki",
    description: "Home of Duke's Waikiki, right on the sand.",
    address: "2335 Kalākaua Ave, Honolulu, HI 96815",
    link: "https://www.outrigger.com/hawaii/oahu/outrigger-waikiki-beach-resort",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.425985834863!2d-157.82823632426997!3d21.274469780437517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d878772960f%3A0x8e5f29f07449339e!2sOutrigger%20Waikiki%20Beach%20Resort!5e0!3m2!1sen!2sus!4v1708226000000!5m2!1sen!2sus",
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
    <Box sx={{ py: { xs: 4, md: 8 } }}>
        <GeometricBorder sx={{ p: { xs: 2.5, md: 6 }, textAlign: 'center' }}>
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
