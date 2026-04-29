import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using this website to view information or submit your RSVP for Tylar and Tim's wedding, you agree to be bound by these Terms of Service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. AI Chatbot Usage
          </Typography>
          <Typography variant="body1" paragraph>
            This website features an AI-powered chatbot designed to assist with wedding information and the RSVP process. By interacting with the chatbot, you understand that your messages are processed by an automated system. You agree to use the chatbot responsibly and refrain from submitting any inappropriate, offensive, or unsolicited content.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Wedding Registration and RSVP
          </Typography>
          <Typography variant="body1" paragraph>
            When submitting your RSVP or registering for wedding events, you agree to provide accurate and complete information. This includes your name, contact details, and any specified dietary restrictions. Your RSVP is subject to the venue's capacity and the final guest list managed by the couple.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Changes to Event Details
          </Typography>
          <Typography variant="body1" paragraph>
            Wedding details, including venues, times, and dates, are subject to change. While we strive to keep this website updated, we recommend checking back closer to the wedding date for any final adjustments. We will attempt to notify registered guests of any significant changes.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            This website is provided for informational and logistical purposes related to the wedding. The creators and the couple are not liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or the AI chatbot.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terms;
