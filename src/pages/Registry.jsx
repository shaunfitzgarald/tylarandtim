import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';
import { RegistryService } from '../services/firestore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const MotionPaper = motion.create(Paper);

const AMAZON_REGISTRY_URL = 'https://www.amazon.com/wedding/share/TimothyandTylar?dplnkId=ec0e90a9-fc33-45fc-8b87-ff0436c7da54&dplnk=Y&ref_=aau_ios_h5f';

const Registry = () => {
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
        const unsubItems = RegistryService.subscribeToItems((data) => setItems(data));
        return () => {
            unsubItems();
        };
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 6, minHeight: '100vh', backgroundColor: '#fafafa' }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h2" sx={{ fontFamily: '"Great Vibes", cursive', textTransform: 'none', color: 'primary.main', mb: 2 }}>
                    Gift Registry
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth="sm" mx="auto" sx={{ fontSize: '1.2rem' }}>
                    Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered on Amazon.
                </Typography>
            </Box>

            {/* Amazon Registry Featured Card */}
            <Box sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fffdf7 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(212, 175, 55, 0.15)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(212, 175, 55, 0.12)',
                            color: 'primary.main',
                            mb: 2
                        }}
                    >
                        <CardGiftcardIcon sx={{ fontSize: 36 }} />
                    </Box>

                    <Typography variant="h4" sx={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, mb: 1, color: '#1A1A1A' }}>
                        Amazon Wedding Registry
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                        Browse our complete wishlist on Amazon for our home and future together.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        href={AMAZON_REGISTRY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon />}
                        sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.6)',
                            }
                        }}
                    >
                        Shop Our Amazon Registry
                    </Button>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontSize: '0.95rem', fontStyle: 'italic' }}>
                        For e-gift cards, please use: <strong>tylar.zanders18@gmail.com</strong>
                    </Typography>
                </Paper>
            </Box>

            {items.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ textAlign: 'center', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, mb: 4, color: 'primary.main' }}>
                        Additional Registry Items
                    </Typography>
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
                </>
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
