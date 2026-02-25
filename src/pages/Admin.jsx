import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Container, Button } from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Login from '../components/Login';
import GuestManager from '../admin/GuestManager';
import PhotoManager from '../admin/PhotoManager';
import ContentEditor from '../admin/ContentEditor';
import SeatingChart from '../admin/SeatingChart';

const Admin = () => {
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;

    if (!user) {
        return <Login />;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                    Admin Dashboard
                </Typography>
                <Button variant="outlined" onClick={() => signOut(auth)}>
                    Logout
                </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="admin tabs">
                    <Tab label="Guest List & RSVPs" />
                    <Tab label="Seating Chart" />
                    <Tab label="Photo Gallery" />
                    <Tab label="Site Content" />
                </Tabs>
            </Box>

            {tab === 0 && <GuestManager />}
            {tab === 1 && <SeatingChart />}
            {tab === 2 && <PhotoManager />}
            {tab === 3 && <ContentEditor />}
        </Container>
    );
};

export default Admin;
