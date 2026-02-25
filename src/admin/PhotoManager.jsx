import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, CircularProgress, ImageList, ImageListItem, ImageListItemBar, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { PhotoService } from '../services/photoService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const PhotoManager = () => {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = PhotoService.subscribeToPhotos((data) => {
            setPhotos(data);
        });
        return () => unsubscribe();
    }, []);

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            // Upload sequentially or parallel
            for (const file of files) {
                await PhotoService.uploadPhoto(file);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload some images.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (photo) => {
        if (window.confirm("Are you sure you want to delete this photo?")) {
            await PhotoService.deletePhoto(photo.id, photo.storagePath);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const items = Array.from(photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setPhotos(items); // Optimistic update
        await PhotoService.updatePhotoOrder(items);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    Photo Grid
                </Typography>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload Photos'}
                    <input type="file" hidden multiple accept="image/*,video/*" onChange={handleFileUpload} />
                </Button>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="photos" direction="horizontal">
                    {(provided) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                                gap: 2 
                            }}
                        >
                            {photos.map((photo, index) => (
                                <Draggable key={photo.id} draggableId={photo.id} index={index}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                position: 'relative',
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                bgcolor: 'white',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            {photo.type === 'video' ? (
                                                <video
                                                    src={photo.url}
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption || 'Gallery Image'}
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                                                    loading="lazy"
                                                />
                                            )}
                                            <Box 
                                                sx={{ 
                                                    position: 'absolute', 
                                                    top: 0, 
                                                    right: 0, 
                                                    bgcolor: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '0 0 0 8px'
                                                }}
                                            >
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDelete(photo)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Box 
                                                sx={{ 
                                                    position: 'absolute', 
                                                    top: 0, 
                                                    left: 0, 
                                                    p: 0.5,
                                                    bgcolor: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '0 0 8px 0',
                                                    cursor: 'grab'
                                                }}
                                            >
                                                <DragIndicatorIcon fontSize="small" />
                                            </Box>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default PhotoManager;
