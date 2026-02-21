import { Box } from '@mui/material';

// Reusable component that adds the "Gold Geometric Invitation Border" around content
const GeometricBorder = ({ children, sx }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        padding: { xs: 2, md: '30px' },
        margin: { xs: 1, md: '20px' },
        border: '1px solid #D4AF37', // Outer thin gold line
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      {/* Inner Border with corners */}
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          border: '2px solid #D4AF37', // Thicker inner gold line
          pointerEvents: 'none',
          zIndex: 1,
          // CSS mask or clip-path could be used here for the "curved corners" if needed strictly
          // For now, using standard double-border look to match the "Art Deco" vibe
        }}
      />
      
      {/* Corner Decorations (Optional, to match the "scalloped" look if desired later via SVG) */}
      
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default GeometricBorder;
