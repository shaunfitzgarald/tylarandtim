const { onRequest } = require("firebase-functions/v2/https");
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

const cors = require('cors')({ origin: true });

// Wedding Assistant Flow
exports.weddingAssistantV2 = onRequest(async (req, res) => {
  cors(req, res, async () => {
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
  
      console.log("LLM RESPONSE RAW:", JSON.stringify(llmResponse));
      let textOut = "Wait... I am reading our notes...";
      if (llmResponse && llmResponse.text) {
          textOut = typeof llmResponse.text === 'function' ? llmResponse.text() : llmResponse.text;
      } else if (llmResponse && llmResponse.candidates && llmResponse.candidates.length > 0) {
          textOut = llmResponse.candidates[0].message?.content?.[0]?.text || "Unable to read response.";
      }
  
      return res.status(200).send({ data: { answer: textOut } });
  
    } catch (error) {
        console.error("AI Error:", error);
        return res.status(500).send({ data: { answer: "Sorry, I'm having trouble thinking right now. Please try again." } });
    }
  });
});
