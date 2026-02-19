import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GeometricBorder from './GeometricBorder';
import { useContent } from '../hooks/useContent';

const Hero = () => {
  const { content } = useContent('home_hero', {
    title: 'Save the Date',
    names: 'Tylar & Timothy',
    date: 'September 6, 2026',
    location: 'Honolulu, HI',
    subtext: 'We invite you to celebrate our wedding'
  });

  return (
    <Box sx={{ 
      minHeight: '90vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <GeometricBorder sx={{ p: { xs: 4, md: 8 }, maxWidth: '800px', mx: 2, bgcolor: 'rgba(255,255,255,0.8)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="overline" sx={{ letterSpacing: 4, color: 'text.secondary', mb: 2, display: 'block' }}>
            {content.title}
          </Typography>

          <Typography variant="h1" component="div" sx={{ mb: 2, color: 'primary.main' }}>
            {content.names}
          </Typography>

          <Box sx={{ my: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ height: '1px', width: '60px', bgcolor: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic' }}>
              {content.date}
            </Typography>
            <Box sx={{ height: '1px', width: '60px', bgcolor: 'primary.main' }} />
          </Box>

          <Typography variant="h6" sx={{ letterSpacing: 2, mb: 1 }}>
            {content.location}
          </Typography>
          
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
             {content.subtext}
          </Typography>

        </motion.div>
      </GeometricBorder>
    </Box>
  );
};

export default Hero;
