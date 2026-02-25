import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Paper
} from '@mui/material';
import GeometricBorder from './GeometricBorder';
import { GuestService } from '../services/firestore';
import { motion } from 'framer-motion';

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    attending: 'yes',
    plusOnes: 0,
    dietary: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await GuestService.addGuest({
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        plusOnes: parseInt(formData.plusOnes) || 0,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      if (err.message === "This email has already been used to RSVP.") {
         setError(err.message);
      } else {
         setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: 'primary.main', mb: 2 }}>
          Thank you!
        </Typography>
        <Typography variant="body1">
          Your RSVP has been received. We can't wait to celebrate with you!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 1, md: 2 } }}>
      <GeometricBorder sx={{ maxWidth: '600px', width: '100%', p: { xs: 2, md: 4 } }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 4 }}>
          RSVP
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>Will you be attending?</FormLabel>
            <RadioGroup
              name="attending"
              value={formData.attending}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="yes" control={<Radio />} label="Joyfully Accept" />
              <FormControlLabel value="no" control={<Radio />} label="Regretfully Decline" />
            </RadioGroup>
          </FormControl>

          {formData.attending === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Number of Guests (Including yourself)</InputLabel>
                <Select
                  name="plusOnes"
                  value={formData.plusOnes}
                  onChange={handleChange}
                  label="Number of Guests (Including yourself)"
                >
                  <MenuItem value={0}>Just me (1)</MenuItem>
                  <MenuItem value={1}>Me + 1 Guest (2)</MenuItem>
                  <MenuItem value={2}>Me + 2 Guests (3)</MenuItem>
                  <MenuItem value={3}>Me + 3 Guests (4)</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Dietary Restrictions / Notes"
                name="dietary"
                multiline
                rows={3}
                value={formData.dietary}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
            </motion.div>
          )}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Sending...' : 'Send RSVP'}
          </Button>
        </form>
      </GeometricBorder>
    </Box>
  );
};

export default RSVPForm;
