import { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, IconButton, Chip, Button, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { GuestService } from '../services/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

    // CRUD State
    const [openModal, setOpenModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        attending: 'yes',
        plusOnes: 0,
        dietary: ''
    });

    const handleOpenAdd = () => {
        setEditingGuest(null);
        setFormData({ firstName: '', lastName: '', email: '', attending: 'yes', plusOnes: 0, dietary: '' });
        setOpenModal(true);
    };

    const handleOpenEdit = (guest) => {
        setEditingGuest(guest);
        // Safely parse names if they only exist as fullName from old AI data
        let fName = guest.firstName || '';
        let lName = guest.lastName || '';
        if (!guest.firstName && guest.fullName) {
            const parts = guest.fullName.split(' ');
            fName = parts[0];
            lName = parts.slice(1).join(' ');
        }
        
        setFormData({
            firstName: fName,
            lastName: lName,
            email: guest.email || '',
            attending: guest.attending || 'yes',
            plusOnes: guest.plusOnes || 0,
            dietary: guest.dietary || ''
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            };

            if (editingGuest) {
                await GuestService.updateGuest(editingGuest.id, payload);
            } else {
                await GuestService.addGuest(payload);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving guest:", error);
            alert(error.message);
        }
    };

    const handleDelete = async (guestId) => {
        if (window.confirm("Are you sure you want to completely remove this RSVP? This action cannot be undone.")) {
            try {
                await GuestService.deleteGuest(guestId);
            } catch (error) {
                console.error("Error deleting guest:", error);
                alert("Could not delete guest.");
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
                    Guest List Management
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PersonAddIcon />}
                    onClick={handleOpenAdd}
                >
                    Add Guest
                </Button>
            </Box>
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="guests">
                    {(provided) => (
                        <Paper 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '50px 2fr 2fr 1fr 1fr 1fr 100px', p: 2, borderBottom: '1px solid #333', fontWeight: 'bold' }}>
                                <Box></Box>
                                <Box>Name</Box>
                                <Box>Email</Box>
                                <Box>RSVP</Box>
                                <Box>+Guests</Box>
                                <Box>Dietary</Box>
                                <Box>Actions</Box>
                            </Box>

                            {guests.map((guest, index) => (
                                <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '50px 2fr 2fr 1fr 1fr 1fr 100px',
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
                                            <Box>
                                                <IconButton size="small" color="primary" onClick={() => handleOpenEdit(guest)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(guest.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
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
