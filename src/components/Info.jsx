import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import GeometricBorder from './GeometricBorder';
import FlightSearch from './FlightSearch';


const hotels = [
    //   {
    //     name: "The Grand Islander, a Hilton Grand Vacations Club",
    //     description: "Luxurious all-suite resort within the Hilton Hawaiian Village, offering spacious accommodations with full kitchens and private balconies.",
    //     address: "2023 Kalia Road, Honolulu, HI 96815",
    //     link: "https://www.hiltongrandvacations.com/en/resorts-and-destinations/hawaii/oahu/the-grand-islander-by-hilton-grand-vacations",
    //     mapUrl: "https://maps.google.com/maps?q=The+Grand+Islander,+a+Hilton+Grand+Vacations+Club&t=&z=15&ie=UTF8&iwloc=&output=embed",
    //     price: "$$$"
    //   },
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

                <Box
                    sx={{
                        mb: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: { xs: 1.5, sm: 3 },
                        px: 2,
                    }}
                >
                    <Box sx={{ height: '1px', width: { xs: '30px', sm: '70px' }, bgcolor: 'primary.main', opacity: 0.7 }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontStyle: 'italic',
                            fontWeight: 500,
                            fontSize: { xs: '1.2rem', sm: '1.45rem', md: '1.6rem' },
                            color: 'text.primary',
                            letterSpacing: '0.04em',
                            textAlign: 'center',
                        }}
                    >
                        Ceremony at Magic Island · Reception to Follow
                    </Typography>
                    <Box sx={{ height: '1px', width: { xs: '30px', sm: '70px' }, bgcolor: 'primary.main', opacity: 0.7 }} />
                </Box>

                <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                    Accommodations
                </Typography>
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    {/* <Typography variant="body1" sx={{ mb: 3 }}>
                        Contact <a href="mailto:support@shaunfitzgarald.com" style={{ color: 'inherit', textDecoration: 'underline' }}>Shaun</a> if you have any questions, but make sure to use our wedding discount when booking!
                    </Typography> */}
                    <Box sx={{ 
                        display: 'inline-block', 
                        textAlign: 'left', 
                        bgcolor: 'background.paper', 
                        p: 3, 
                        borderRadius: 2, 
                        boxShadow: 2,
                        borderTop: '4px solid',
                        borderColor: 'primary.main'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: 'primary.main', textAlign: 'center' }}>
                            Guest Room Wedding Discount!!
                        </Typography>
                        <ol style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Go to <a href="https://www.hiltonhawaiianvillage.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: 'bold' }}>www.HiltonHawaiianVillage.com</a></li>
                            <li>Put in the dates</li>
                            <li>Click on <strong>Special Rates</strong></li>
                            <li>Enter <strong>WED</strong> in the Group Code box</li>
                            <li>Click <strong>Done</strong></li>
                            <li>Then click <strong>Check Rates</strong> for a <strong>20% discount</strong> off regular rates</li>
                        </ol>
                    </Box>
                </Box>

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
