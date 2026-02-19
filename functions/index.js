const { onCall } = require("firebase-functions/v2/https");
const { googleAI, gemini15Flash } = require("@genkit-ai/googleai");
const { configureGenkit } = require("@genkit-ai/core");
const { generate } = require("@genkit-ai/ai");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

// Wedding Assistant Flow
exports.weddingAssistant = onCall({ cors: true }, async (request) => {
  const question = request.data?.question || request.data;
  
  if (!question || typeof question !== 'string') {
     return { answer: "Please ask a question!" };
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

    const llmResponse = await generate({
      model: gemini15Flash,
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

    return { answer: llmResponse.text() };

  } catch (error) {
      console.error("AI Error:", error);
      return { answer: "Sorry, I'm having trouble thinking right now. Please try again." };
  }
});
