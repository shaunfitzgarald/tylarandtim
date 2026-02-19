import { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'RSVP', path: '/rsvp' }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', pt: 4, backgroundColor: '#fff' }}>
      <Typography variant="h4" sx={{ my: 2, fontFamily: '"Great Vibes", cursive', color: 'primary.main' }}>
        T & T
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ justifyContent: 'center' }}>
            <Button 
                component={Link} 
                to={item.path} 
                sx={{ 
                    color: 'text.primary', 
                    fontWeight: location.pathname === item.path ? 700 : 400,
                    fontSize: '1.2rem',
                    my: 1
                }}
            >
                <ListItemText primary={item.label} />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        bgcolor: 'background.default'
      }}
    >
      <Toolbar sx={{ justifyContent: { xs: 'space-between', md: 'center' }, gap: { md: 4 } }}>
        
        {isMobile && (
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 1, color: 'primary.main' }}
            >
                <MenuIcon fontSize="large" />
            </IconButton>
        )}

        <Typography 
            variant="h4" 
            sx={{ 
                fontFamily: '"Great Vibes", cursive', 
                color: 'primary.main',
                textAlign: { xs: 'center', md: 'left' },
                flexGrow: { xs: 1, md: 0 },
                mr: { xs: 6, md: 0 } // Balance the menu icon
            }}
        >
            T & T
        </Typography>

        {!isMobile && navItems.map((item) => (
            <Button 
                key={item.label}
                component={Link} 
                to={item.path} 
                color="inherit"
                sx={{ 
                    fontWeight: location.pathname === item.path ? 700 : 400,
                    border: item.path === '/rsvp' ? '1px solid #D4AF37' : 'none',
                    px: item.path === '/rsvp' ? 3 : 1
                }}
            >
                {item.label}
            </Button>
        ))}
      </Toolbar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
