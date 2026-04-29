import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        opacity: 0.8,
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="caption" color="text.secondary" align="center" display="block" gutterBottom>
          <Link component={RouterLink} to="/terms" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, mr: 2 }}>
            Terms of Service
          </Link>
          <Link component={RouterLink} to="/privacy" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Privacy Policy
          </Link>
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          &copy; {new Date().getFullYear()} Tylar & Tim. All rights reserved.
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
          Made with ❤️ by{' '}
          <Link 
            color="inherit" 
            href="https://shaunfitzgarald.com" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            shaunfitzgarald
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
