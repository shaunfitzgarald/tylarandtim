import { useState, useEffect } from 'react';
import { 
    Box, Typography, Switch, FormControlLabel, Paper, TextField, 
    Button, Grid, Card, CardMedia, CardContent, CardActions, IconButton,
    Snackbar, Alert, CircularProgress 
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import { RegistryService } from '../services/firestore';

const RegistryManager = () => {
    const [config, setConfig] = useState({ enabled: false });
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ title: '', image: '', link: '', price: '', showPrice: true });
    const [msg, setMsg] = useState({ open: false, type: 'success', text: '' });
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const unsubConfig = RegistryService.subscribeToConfig((data) => setConfig(data));
        const unsubItems = RegistryService.subscribeToItems((data) => setItems(data));
        return () => {
            unsubConfig();
            unsubItems();
        };
    }, []);

    const handleToggle = async (e) => {
        const enabled = e.target.checked;
        try {
            await RegistryService.updateConfig(enabled);
            setMsg({ open: true, type: 'success', text: `Registry ${enabled ? 'enabled' : 'disabled'} successfully.` });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Failed to update registry config.' });
        }
    };

    const handleAutoFill = async () => {
        if (!formData.link) {
            setMsg({ open: true, type: 'warning', text: 'Please enter a link to auto-fill.' });
            return;
        }
        setFetching(true);
        try {
            // Append data extractors for price
            const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(formData.link)}&data.price.selector=meta[property="product:price:amount"],meta[property="og:price:amount"],.price,.a-price-whole&data.price.attr=content,text&data.currency.selector=meta[property="product:price:currency"],meta[property="og:price:currency"]&data.currency.attr=content`;
            
            const res = await fetch(apiUrl);
            const data = await res.json();
            
            if (data.status === 'success') {
                setFormData(prev => {
                    let priceStr = prev.price;
                    if (data.data.price) {
                        const val = Array.isArray(data.data.price) ? data.data.price[0] : data.data.price;
                        const currency = data.data.currency ? (Array.isArray(data.data.currency) ? data.data.currency[0] : data.data.currency) : '$';
                        const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
                        priceStr = val.toString().startsWith('$') || val.toString().startsWith('£') || val.toString().startsWith('€') ? val : `${symbol}${val}`;
                    }

                    return {
                        ...prev,
                        title: data.data.title || prev.title,
                        image: data.data.image?.url || data.data.logo?.url || prev.image,
                        price: priceStr || prev.price
                    };
                });
                setMsg({ open: true, type: 'success', text: 'Auto-filled successfully!' });
            } else {
                throw new Error('API returned unsuccessful status');
            }
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Could not fetch details. Some sites block scraping.' });
        } finally {
            setFetching(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.link) {
            setMsg({ open: true, type: 'warning', text: 'Title and link are required.' });
            return;
        }
        try {
            await RegistryService.addItem(formData);
            setFormData({ title: '', image: '', link: '', price: '', showPrice: true });
            setMsg({ open: true, type: 'success', text: 'Item added successfully.' });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Failed to add item.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await RegistryService.deleteItem(id);
            setMsg({ open: true, type: 'success', text: 'Item deleted.' });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Failed to delete item.' });
        }
    };

    const handleUnmark = async (id) => {
        if (!window.confirm('Are you sure you want to unmark this item? It will be available for purchase again.')) return;
        try {
            await RegistryService.unmarkItemPurchased(id);
            setMsg({ open: true, type: 'success', text: 'Item unmarked.' });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, type: 'error', text: 'Failed to unmark item.' });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6">Global Registry Visibility</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Toggle this on when you are ready for guests to see the gift registry page.
                    </Typography>
                </Box>
                <FormControlLabel
                    control={<Switch checked={config.enabled} onChange={handleToggle} color="primary" />}
                    label={config.enabled ? "Visible" : "Hidden"}
                    labelPlacement="start"
                />
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Add New Item</Typography>
                        <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField 
                                label="Product Title" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <TextField 
                                label="Image URL" 
                                placeholder="https://example.com/image.jpg"
                                value={formData.image} 
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                            />
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <TextField 
                                    label="Product Link URL" 
                                    placeholder="https://amazon.com/..."
                                    value={formData.link} 
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                    required
                                    fullWidth
                                />
                                <Button 
                                    variant="outlined" 
                                    onClick={handleAutoFill} 
                                    disabled={fetching}
                                    sx={{ height: 56, minWidth: 120 }}
                                    startIcon={fetching ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                                >
                                    Auto-Fill
                                </Button>
                            </Box>
                            <TextField 
                                label="Price (Optional)" 
                                placeholder="$50.00"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={formData.showPrice} 
                                        onChange={(e) => setFormData({...formData, showPrice: e.target.checked})} 
                                        color="primary" 
                                    />
                                }
                                label="Show price to guests"
                            />
                            <Button type="submit" variant="contained" color="primary">Add Item</Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>Current Registry Items ({items.length})</Typography>
                    <Grid container spacing={2}>
                        {items.map(item => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={item.title}
                                        sx={{ objectFit: 'contain', p: 1, bgcolor: '#f5f5f5' }}
                                    />
                                    <CardContent sx={{ pb: 0 }}>
                                        <Typography variant="subtitle1" noWrap title={item.title}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.price ? (item.showPrice !== false ? item.price : 'Price Hidden') : 'Price not listed'}
                                        </Typography>
                                        {item.purchased && (
                                            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                                                Purchased by: {item.purchasedBy || 'Anonymous'}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <Box>
                                            <Button size="small" href={item.link} target="_blank" rel="noopener">View Link</Button>
                                            {item.purchased && (
                                                <Button size="small" color="warning" onClick={() => handleUnmark(item.id)}>Unmark</Button>
                                            )}
                                        </Box>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {items.length === 0 && (
                            <Grid item xs={12}>
                                <Typography color="text.secondary">No items added yet.</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>

            <Snackbar 
                open={msg.open} 
                autoHideDuration={4000} 
                onClose={() => setMsg({ ...msg, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={msg.type}>{msg.text}</Alert>
            </Snackbar>
        </Box>
    );
};

export default RegistryManager;
