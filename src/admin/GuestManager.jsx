import { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Use DataGrid for the table
import { GuestService } from '../services/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const GuestManager = () => {
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        const unsubscribe = GuestService.subscribeToGuests((data) => {
            setGuests(data);
        });
        return () => unsubscribe();
    }, []);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const items = Array.from(guests);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        setGuests(items); // Optimistic update
        await GuestService.updateGuestOrder(items);
    };

    // Columns for display (if using DataGrid or custom table)
    // For DnD, a custom list is often easier than DataGrid integration, 
    // but user asked for "Table View". 
    // We'll implement a Custom Table Row for DnD compatibility.

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                Guest List Management
            </Typography>
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="guests">
                    {(provided) => (
                        <Paper 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '50px 2fr 2fr 1fr 1fr 1fr', p: 2, borderBottom: '1px solid #333', fontWeight: 'bold' }}>
                                <Box></Box>
                                <Box>Name</Box>
                                <Box>Email</Box>
                                <Box>RSVP</Box>
                                <Box>+Guests</Box>
                                <Box>Dietary</Box>
                            </Box>

                            {guests.map((guest, index) => (
                                <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '50px 2fr 2fr 1fr 1fr 1fr',
                                                p: 2,
                                                borderBottom: '1px solid #eee',
                                                bgcolor: 'background.paper',
                                                alignItems: 'center',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                                                <DragIndicatorIcon color="action" />
                                            </Box>
                                            <Box>{guest.fullName || 'No Name'}</Box>
                                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{guest.email}</Box>
                                            <Box>
                                                <Chip 
                                                    label={guest.attending === 'yes' ? 'Attending' : 'Decline'} 
                                                    color={guest.attending === 'yes' ? 'success' : 'error'} 
                                                    size="small" 
                                                />
                                            </Box>
                                            <Box>{guest.plusOnes || 0}</Box>
                                            <Box>{guest.dietary || '-'}</Box>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Paper>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default GuestManager;
