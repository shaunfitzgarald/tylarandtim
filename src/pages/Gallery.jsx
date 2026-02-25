import { useState, useEffect } from 'react';
import { Box, Container, Typography, Modal } from '@mui/material';
import { PhotoService } from '../services/photoService';
import GeometricBorder from '../components/GeometricBorder';
import Masonry from '@mui/lab/Masonry';
import { motion } from 'framer-motion';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const unsubscribe = PhotoService.subscribeToPhotos((data) => {
            setPhotos(data);
        });
        return () => unsubscribe();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6, color: 'primary.main' }}>
                Our Gallery
            </Typography>

            {/* Masonry Layout - Fallback to CSS columns if @mui/lab not installed yet, 
                but plan assumes we'll install it or use CSS grid. 
                Using CSS columns for simplicity and performance without extra deps if possible, 
                but user requested full features. Let's use simple CSS columns for "Masonry" effect.
            */}
            <Box sx={{ 
                columnCount: { xs: 1, sm: 2, md: 3, lg: 4 },
                columnGap: 2
            }}>
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{ breakInside: 'avoid', marginBottom: 16 }}
                    >
                        {photo.type === 'video' ? (
                            <Box 
                                component="video"
                                src={photo.url}
                                muted
                                playsInline
                                loop
                                onClick={() => setSelectedPhoto(photo)}
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                sx={{
                                    width: '100%',
                                    display: 'block',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                                    }
                                }}
                            />
                        ) : (
                            <Box 
                                component="img"
                                src={photo.url}
                                alt={photo.caption}
                                onClick={() => setSelectedPhoto(photo)}
                                sx={{
                                    width: '100%',
                                    display: 'block',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                                    }
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </Box>

            {/* Lightbox Modal */}
            <Modal
                open={!!selectedPhoto}
                onClose={() => setSelectedPhoto(null)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box 
                    sx={{ 
                        outline: 'none', 
                        maxWidth: '90vw', 
                        maxHeight: '90vh',
                        position: 'relative'
                    }}
                    onClick={() => setSelectedPhoto(null)}
                >
                    {selectedPhoto && (
                        <GeometricBorder sx={{ p: 1, bgcolor: 'black' }}>
                            {selectedPhoto.type === 'video' ? (
                                <video 
                                    src={selectedPhoto.url} 
                                    controls
                                    autoPlay
                                    playsInline
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '80vh', 
                                        display: 'block' 
                                    }} 
                                />
                            ) : (
                                <img 
                                    src={selectedPhoto.url} 
                                    alt={selectedPhoto.caption} 
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '80vh', 
                                        display: 'block' 
                                    }} 
                                />
                            )}
                        </GeometricBorder>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default Gallery;
