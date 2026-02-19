import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Default to light for the "Card" feel, but supports dark sections
    primary: {
      main: '#D4AF37', // Gold matching the foil
    },
    secondary: {
      main: '#8B0000', // Deep Red for envelopes/accents
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      dark: '#121212', // For dark mode sections
    },
    text: {
      primary: '#1A1A1A', // Soft black for better readability
      secondary: '#D4AF37', // Gold text
      contrast: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
    h1: {
      fontFamily: '"Great Vibes", cursive', // Script for Names
      fontSize: '4rem',
      color: '#D4AF37',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif', // Serif for Dates/Headers
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: '1.1rem',
    },
    button: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp edges for geometric feel
          border: '1px solid #D4AF37',
          color: '#D4AF37',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid #D4AF37',
          },
        },
        contained: {
            backgroundColor: '#D4AF37',
            color: '#FFFFFF',
            '&:hover': {
                backgroundColor: '#b8962e',
            }
        }
      },
    },
  },
});

export default theme;
