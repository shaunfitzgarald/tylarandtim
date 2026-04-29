import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            When you use this website to submit an RSVP or interact with our AI chatbot, we may collect personal information such as your name, email address, phone number, dietary restrictions, and RSVP status. We also collect the content of any messages you send to the AI chatbot.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            The personal information you provide is used strictly for wedding registration, event planning, and guest list management purposes. This includes contacting you regarding event updates, coordinating seating, and accommodating dietary needs. 
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. AI Chatbot Data Processing
          </Typography>
          <Typography variant="body1" paragraph>
            Our website utilizes an AI-powered chatbot to assist with inquiries and the registration process. The information and messages you provide to the chatbot are processed by artificial intelligence systems (such as OpenAI models) to understand and respond to your requests accurately. Please refrain from sharing sensitive personal information beyond what is necessary for your wedding RSVP.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Information Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We respect your privacy and do not sell, rent, or lease your personal information to third parties. Your data is shared only with the vendors (such as caterers for dietary needs) and services (such as our database and AI providers) strictly necessary to plan and manage the wedding event.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Privacy;
