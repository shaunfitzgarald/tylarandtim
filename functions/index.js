const { onCall } = require("firebase-functions/v2/https");
const { defineFlow, startFlowsServer } = require("@genkit-ai/flow");
const { googleAI, gemini15Flash } = require("@genkit-ai/googleai");
const { configureGenkit } = require("@genkit-ai/core");
const z = require("zod");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

configureGenkit({
  plugins: [googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

// Wedding Assistant Flow
// This flow answers questions based on site content fetched from Firestore
exports.weddingAssistant = onCall({ cors: true }, async (request) => {
  const { question } = request.data;
  
  if (!question) {
     return { answer: "Please ask a question!" };
  }

  // Fetch context from Firestore (e.g. schedules, locations)
  // For now, we'll fetch everything from 'site_content' collection
  const contentSnapshot = await db.collection('site_content').get();
  let contextText = "Here is the wedding information:\n";
  
  contentSnapshot.forEach(doc => {
      const data = doc.data();
      contextText += `${doc.id}: ${JSON.stringify(data)}\n`;
  });
  
  // Basic fallback context if DB is empty
  if (contentSnapshot.empty) {
      contextText += "Date: September 6, 2026. Location: Honolulu, HI. Couple: Tylar and Timothy.";
  }

  const flowPromise = defineFlow(
    {
      name: "weddingAssistantFlow",
      inputSchema: z.string(),
      outputSchema: z.string(),
    },
    async (inputQuestion) => {
      const { generate } = require("@genkit-ai/ai");
      
      const llmResponse = await generate({
        model: gemini15Flash,
        prompt: `
          You are the helpful AI assistant for Tylar and Timothy's wedding.
          Use the following context to answer the guest's question.
          If the answer is not in the context, politely say you don't know but suggest they check back later.
          Keep answers warm, concise, and celebratory.
          
          Context:
          ${contextText}
          
          Question: ${inputQuestion}
        `,
      });

      return llmResponse.text();
    }
  );

  try {
      // Direct invocation of the flow logic for the onCall wrapper
      // In a real Genkit serving setup, we'd use startFlowsServer, 
      // but for Firebase Functions, we wrap the flow logic or use onFlow (if available in this version)
      // Simulating flow execution:
      const result = await flowPromise(question);
      return { answer: result };
  } catch (error) {
      console.error("AI Error:", error);
      return { answer: "Sorry, I'm having trouble thinking right now. Please try again." };
  }
});
