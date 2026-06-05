import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import { RegistryService } from '../services/firestore';
import { Link } from 'react-router-dom';

const MotionPaper = motion.create(Paper);

const Registry = () => {
    const [config, setConfig] = useState({ enabled: null });
    const [items, setItems] = useState([]);
    const [purchaseDialog, setPurchaseDialog] = useState({ open: false, itemId: null, buyerName: '' });

    const handleOpenPurchase = (id) => setPurchaseDialog({ open: true, itemId: id, buyerName: '' });
    const handleClosePurchase = () => setPurchaseDialog({ open: false, itemId: null, buyerName: '' });

    const handleConfirmPurchase = async () => {
        if (purchaseDialog.itemId) {
            await RegistryService.markItemPurchased(purchaseDialog.itemId, purchaseDialog.buyerName);
        }
        handleClosePurchase();
    };

    useEffect(() => {
        const unsubConfig = RegistryService.subscribeToConfig((data) => setConfig(data));
        const unsubItems = RegistryService.subscribeToItems((data) => setItems(data));
        return () => {
            unsubConfig();
            unsubItems();
        };
    }, []);

    if (config.enabled === null) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
    }

    if (!config.enabled) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontFamily: '"Great Vibes", cursive', textTransform: 'none', color: 'primary.main', mb: 3 }}>
                    Gift Registry
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Our registry is not quite ready yet. Please check back closer to the wedding date!
                </Typography>
                <Button variant="outlined" component={Link} to="/" sx={{ mt: 2 }}>
                    Return Home
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 6, minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" sx={{ fontFamily: '"Great Vibes", cursive', textTransform: 'none', color: 'primary.main', mb: 2 }}>
                    Gift Registry
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth="sm" mx="auto">
                    Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered for a few items below.
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth="sm" mx="auto" sx={{ mt: 2 }}>
                    Please use the email tylar.zanders18@gmail.com for all egiftcards.
                </Typography>
            </Box>

            <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
                {items.map((item, index) => (
                    <MotionPaper
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        elevation={2}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: 6,
                                '& .overlay': {
                                    opacity: 1
                                }
                            }
                        }}
                    >
                        <Box sx={{ position: 'relative', bgcolor: '#fff', pt: 2, px: 2, opacity: item.purchased ? 0.6 : 1 }}>
                            <Box
                                component="img"
                                src={item.image || 'https://via.placeholder.com/400x400?text=Gift'}
                                alt={item.title}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    maxHeight: 300,
                                    borderRadius: 2
                                }}
                            />
                            {item.purchased && (
                                <Box sx={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    bgcolor: 'rgba(0,0,0,0.7)', color: 'white', px: 2, py: 1, borderRadius: 2,
                                    fontWeight: 'bold', letterSpacing: 1
                                }}>
                                    PURCHASED
                                </Box>
                            )}
                        </Box>
                        
                        <Box sx={{ p: 3, opacity: item.purchased ? 0.6 : 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {item.title}
                            </Typography>
                            {item.price && item.showPrice !== false && (
                                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 500, mb: 2 }}>
                                    {item.price}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    sx={{ borderRadius: 2, textTransform: 'none', py: 1 }}
                                    disabled={item.purchased}
                                >
                                    View / Buy
                                </Button>
                                {!item.purchased && (
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        fullWidth 
                                        sx={{ borderRadius: 2, textTransform: 'none', py: 1 }}
                                        onClick={() => handleOpenPurchase(item.id)}
                                    >
                                        I Bought This
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </MotionPaper>
                ))}
            </Masonry>

            {items.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography color="text.secondary">
                        No items have been added to the registry yet.
                    </Typography>
                </Box>
            )}

            <Dialog open={purchaseDialog.open} onClose={handleClosePurchase}>
                <DialogTitle>Mark as Purchased</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Thank you so much! If you've purchased this gift, please leave your name below so the couple knows who to thank.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your Name (Optional)"
                        fullWidth
                        variant="outlined"
                        value={purchaseDialog.buyerName}
                        onChange={(e) => setPurchaseDialog({ ...purchaseDialog, buyerName: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClosePurchase} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmPurchase} variant="contained" color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Registry;
