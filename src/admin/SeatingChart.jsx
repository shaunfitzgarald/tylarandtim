import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Grid } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GuestService } from '../services/firestore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// We'll define 10 tables
const TOTAL_TABLES = 10;
const TABLES = Array.from({ length: TOTAL_TABLES }, (_, i) => `table-${i + 1}`);

const SeatingChart = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch guests who are attending
        const unsubscribe = GuestService.subscribeToGuests((data) => {
            const attendees = data.filter(g => g.attending === 'yes' || g.rsvpStatus === 'attending');
            setGuests(attendees);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside a valid droppable
        if (!destination) return;

        // Dropped back in the same position
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Determine new table ID:
        // If dropped in "unassigned", tableId is null.
        // If dropped in "table-X", tableId is "table-X".
        const newTableId = destination.droppableId === 'unassigned' ? null : destination.droppableId;

        // Optimistically update local state
        const updatedGuests = guests.map((g) => 
            g.id === draggableId ? { ...g, tableId: newTableId } : g
        );
        setGuests(updatedGuests);

        // Update Firestore
        try {
            await GuestService.updateGuestTable(draggableId, newTableId);
        } catch (error) {
            console.error("Error updating guest table:", error);
            // Revert state if necessary in a real app, though subscription usually fixes it.
        }
    };

    if (loading) return <Box sx={{ p: 2 }}>Loading Seating Chart...</Box>;

    const unassignedGuests = guests.filter(g => !g.tableId);
    
    // Group guests by table
    const tableGroups = TABLES.reduce((acc, tableId) => {
        acc[tableId] = guests.filter(g => g.tableId === tableId);
        return acc;
    }, {});

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
                Visual Seating Chart
            </Typography>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={4}>
                    {/* Unassigned Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
                                Unassigned ({unassignedGuests.length})
                            </Typography>
                            
                            <Droppable droppableId="unassigned">
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            flexGrow: 1,
                                            overflowY: 'auto',
                                            bgcolor: snapshot.isDraggingOver ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                            p: 1,
                                            borderRadius: 1,
                                            transition: 'background-color 0.2s ease',
                                        }}
                                    >
                                        {unassignedGuests.map((guest, index) => (
                                            <GuestDraggable key={guest.id} guest={guest} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Paper>
                    </Grid>

                    {/* Tables Area */}
                    <Grid item xs={12} md={9}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 4, 
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            p: 2,
                            bgcolor: '#fafafa',
                            borderRadius: 2,
                            minHeight: 'calc(100vh - 200px)'
                        }}>
                            {TABLES.map((tableId, index) => {
                                const tableGuests = tableGroups[tableId];
                                return (
                                    <TableDroppable 
                                        key={tableId} 
                                        tableId={tableId} 
                                        tableNumber={index + 1} 
                                        guests={tableGuests} 
                                    />
                                );
                            })}
                        </Box>
                    </Grid>
                </Grid>
            </DragDropContext>
        </Box>
    );
};

// Sub-component for a Draggable Guest Item
const GuestDraggable = ({ guest, index }) => (
    <Draggable draggableId={guest.id} index={index}>
        {(provided, snapshot) => {
            // Calculate total seats this guest group takes (guest + plus ones)
            const seatCount = 1 + (Number(guest.plusOnes) || 0);

            return (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={snapshot.isDragging ? 4 : 1}
                    sx={{
                        p: 1.5,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: snapshot.isDragging ? 'primary.light' : 'white',
                        color: snapshot.isDragging ? 'white' : 'text.primary',
                        borderRadius: 2,
                        userSelect: 'none',
                        transition: 'box-shadow 0.2s',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DragIndicatorIcon sx={{ mr: 1, color: snapshot.isDragging ? 'white' : 'action.active', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {guest.fullName || 'Unknown Guest'}
                        </Typography>
                    </Box>
                    {seatCount > 1 && (
                        <Chip 
                            label={`Total: ${seatCount}`} 
                            size="small" 
                            sx={{ 
                                height: 20, 
                                fontSize: '0.7rem', 
                                bgcolor: snapshot.isDragging ? 'rgba(255,255,255,0.2)' : 'rgba(212, 175, 55, 0.1)',
                                color: snapshot.isDragging ? 'white' : 'primary.main',
                                fontWeight: 'bold'
                            }} 
                        />
                    )}
                </Paper>
            );
        }}
    </Draggable>
);

// Sub-component for a Circular Table Droppable Zone
const TableDroppable = ({ tableId, tableNumber, guests }) => {
    // Tally the number of actual seats taken up by the assigned guests
    const seatsTaken = guests.reduce((total, g) => total + 1 + (Number(g.plusOnes) || 0), 0);
    const capacity = 8; // Assuming 8-top tables
    const isFull = seatsTaken >= capacity;

    return (
        <Droppable droppableId={tableId}>
            {(provided, snapshot) => (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '280px'
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#555' }}>
                        Table {tableNumber}
                    </Typography>
                    
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                            width: 250,
                            height: 250,
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `3px solid ${snapshot.isDraggingOver ? '#D4AF37' : '#e0e0e0'}`,
                            bgcolor: snapshot.isDraggingOver 
                                ? 'rgba(212, 175, 55, 0.05)' 
                                : isFull ? 'rgba(244, 67, 54, 0.05)' : 'white',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            p: 2,
                            overflowY: 'auto',
                            boxShadow: snapshot.isDraggingOver ? '0 0 20px rgba(212, 175, 55, 0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Center table decoration/number */}
                        {guests.length === 0 && (
                             <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5, fontStyle: 'italic', position: 'absolute' }}>
                                 Empty Table
                             </Typography>
                        )}
                        
                        <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                            zIndex: 1
                        }}>
                            {guests.map((guest, index) => (
                                <GuestDraggable key={guest.id} guest={guest} index={index} />
                            ))}
                            {provided.placeholder}
                        </Box>

                        {/* Capacity Tracker */}
                        <Box sx={{ 
                            position: 'absolute', 
                            bottom: -15, 
                            bgcolor: isFull ? 'error.main' : 'primary.main',
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                             {seatsTaken} / {capacity} Seats
                        </Box>
                    </Box>
                </Box>
            )}
        </Droppable>
    );
};

export default SeatingChart;
