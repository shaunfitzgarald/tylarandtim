// Deployment Time: 2026-02-21T02:13:00Z - Forcing API key refresh
const { genkit } = require("genkit");
const { googleAI, gemini20Flash } = require("@genkit-ai/googleai");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { z } = require("zod");

admin.initializeApp();
const db = admin.firestore();

const model = "googleai/gemini-2.0-flash"; // Fixed string for reference if needed
const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
});

// Wedding Assistant Flow
exports.weddingAssistantV2 = onRequest({ 
  cors: true,
  invoker: 'public',
  maxInstances: 10
}, async (req, res) => {
  // Handle Callable-like request or direct fetch
  const question = req.body?.data?.question || req.body?.question || req.query?.question;
  
  if (!question || typeof question !== 'string') {
     return res.status(400).send({ data: { answer: "Please ask a question!" } });
  }

  try {
    const contentSnapshot = await db.collection('site_content').get();
    let contextText = "Here is the wedding information:\n";
    contentSnapshot.forEach(doc => {
        contextText += `Section '${doc.id}': ${JSON.stringify(doc.data())}\n`;
    });
    
    // Add Important Dates and Fallback
    if (contentSnapshot.empty || true) { // Always append key dates to be safe
        contextText += `
        Important Dates:
        - Bridal Party: Saturday, May 23, 2026 (Memorial Day Weekend) in CA.
        - Bridal Shower: September 4, 2026 in HI.
        - Wedding: September 6, 2026 in HI.
        - Couple: Tylar and Timothy.
        `;
    }

    const llmResponse = await ai.generate({
      model: gemini20Flash, 
      prompt: `
        You are the helpful, warm, and celebratory AI assistant for Tylar and Timothy's wedding (Sep 6, 2026).
        
        IMPORTANT RULE: The wedding venue is a SECRET. 
        If anyone asks about the location or venue, say: "The venue is a secret until right before the wedding! Stay tuned."
        
        Context:
        ${contextText}
        
        Question: ${question}
        
        If the user wants to RSVP, kindly direct them to use the RSVP form on the website. You cannot process RSVPs directly.
      `,
    });

    return res.status(200).send({ data: { answer: llmResponse.text() } });

  } catch (error) {
      console.error("AI Error:", error);
      return res.status(500).send({ data: { answer: "Sorry, I'm having trouble thinking right now. Please try again." } });
  }
});
