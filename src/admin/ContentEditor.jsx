import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { ContentService } from '../services/firestore';

const SECTIONS = [
    {
        id: 'home_hero',
        title: 'Home - Hero Section',
        fields: [
            { key: 'title', label: 'Main Title (e.g. Save the Date)' },
            { key: 'names', label: 'Names (e.g. Timothy & Tylar)' },
            { key: 'date', label: 'Wedding Date' },
            { key: 'location', label: 'Location (City, State)' },
            { key: 'subtext', label: 'Subtext (e.g. Invitation to come)' },
        ]
    },
    {
        id: 'wedding_details',
        title: 'Wedding Details',
        fields: [
            { key: 'ceremonyDate', label: 'Ceremony Date (Full String)' },
            { key: 'ceremonyTime', label: 'Time Range' },
            { key: 'venueName', label: 'Venue Name' },
            { key: 'venueAddress', label: 'Venue Address (Multi-line)' },
            { key: 'dressCode', label: 'Dress Code Title' },
            { key: 'dressCodeDesc', label: 'Dress Code Description' },
        ]
    }
];

const ContentEditor = () => {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [formData, setFormData] = useState({});
    const [msg, setMsg] = useState({ open: false, type: 'success', text: '' });

    const loadSectionData = async (sectionId) => {
        const data = await ContentService.getContent(sectionId);
        if (data) {
            setFormData(data);
        } else {
            setFormData({});
        }
    };

    useEffect(() => {
        loadSectionData(activeSection);
    }, [activeSection]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        try {
            await ContentService.updateContent(activeSection, formData);
            setMsg({ open: true, type: 'success', text: 'Content updated successfully!' });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Failed to save content.' });
        }
    };

    const currentSectionConfig = SECTIONS.find(s => s.id === activeSection);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                {SECTIONS.map(s => (
                    <Button 
                        key={s.id} 
                        variant={activeSection === s.id ? 'contained' : 'outlined'}
                        onClick={() => setActiveSection(s.id)}
                    >
                        {s.title}
                    </Button>
                ))}
            </Box>

            <Paper sx={{ p: 4, maxWidth: 800 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    Edit: {currentSectionConfig.title}
                </Typography>

                <Grid container spacing={3}>
                    {currentSectionConfig.fields.map((field) => (
                        <Grid item xs={12} key={field.key}>
                            <TextField
                                fullWidth
                                label={field.label}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                multiline={field.key.includes('Address') || field.key.includes('Desc')}
                                rows={field.key.includes('Address') || field.key.includes('Desc') ? 3 : 1}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Button 
                    variant="contained" 
                    size="large" 
                    sx={{ mt: 4 }}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </Paper>

            <Snackbar 
                open={msg.open} 
                autoHideDuration={6000} 
                onClose={() => setMsg({ ...msg, open: false })}
            >
                <Alert severity={msg.type}>{msg.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ContentEditor;
