import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

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
      <Toolbar sx={{ justifyContent: 'center', gap: 4 }}>
        <Button 
            component={Link} 
            to="/" 
            color="inherit"
            sx={{ fontWeight: location.pathname === '/' ? 700 : 400 }}
        >
            Home
        </Button>
        
        <Typography 
            variant="h4" 
            sx={{ 
                fontFamily: '"Great Vibes", cursive', 
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' }
            }}
        >
            T & T
        </Typography>

        <Button 
            component={Link} 
            to="/gallery" 
            color="inherit"
            sx={{ fontWeight: location.pathname === '/gallery' ? 700 : 400 }}
        >
            Gallery
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
