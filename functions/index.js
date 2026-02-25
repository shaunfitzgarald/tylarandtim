const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const cors = require('cors')({ origin: true });

// Wedding Assistant Flow
exports.weddingAssistantV2 = onRequest({ cors: true, invoker: 'public' }, async (req, res) => {
  cors(req, res, async () => {
    const question = req.body?.data?.question || req.body?.question || req.query?.question;
    let history = req.body?.data?.history || [];
    
    // Ensure history roles are strictly "user" or "model" as required by the SDK
    history = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: msg.parts || [{ text: msg.text || '' }]
    }));
    
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
  
      const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) throw new Error("Missing API Key");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const prompt = `
          You are the helpful, warm, and celebratory AI assistant for Tylar and Timothy's wedding (Sep 6, 2026).
          
          IMPORTANT RULE: The wedding venue is a SECRET. 
          If anyone asks about the location or venue, say: "The venue is a secret until right before the wedding! Stay tuned."
          
          Context:
          ${contextText}
          
          RSVP INSTRUCTIONS (CRITICAL):
          If the user wants to RSVP, you MUST follow these exact steps:
          1. Actively guide them through the RSVP process.
          2. Ask for missing information one by one, or multiple at once, if they haven't provided it. You need:
             - First Name
             - Last Name
             - Email Address
             - Will they be attending? (Yes/No)
             - Number of guests/plus ones bringing with them (0, 1, 2, or 3)
             - Any dietary restrictions or notes?
          3. Once you have ALL 6 pieces of information, and the user has confirmed them, you MUST output a hidden JSON block exactly matching this format anywhere in your response:
          
          :::RSVP:::
          {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "attending": "yes",
            "plusOnes": 1,
            "dietary": "None"
          }
          :::END_RSVP:::
          
          Note for JSON: attending MUST be strictly "yes" or "no". plusOnes MUST be an integer 0, 1, 2, or 3.
          DO NOT output the JSON block until all details are finalized. You can include a conversational confirmation message alongside the block like "Thank you! Your RSVP has been saved."
        `;
        
      const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash", 
          systemInstruction: {
              role: "system",
              parts: [{ text: prompt }]
          }
      });

      const chat = model.startChat({
          history: history
      });

      const result = await chat.sendMessage(question);
      let textOut = result.response.text();

      // Check for RSVP Block
      const rsvpRegex = /:::RSVP:::([\s\S]*?):::END_RSVP:::/;
      const match = textOut.match(rsvpRegex);
      
      if (match && match[1]) {
          try {
              const rsvpData = JSON.parse(match[1].trim());
              
              // Clean the block from the output
              textOut = textOut.replace(match[0], '').trim();
              
              // Save to Firestore
              await db.collection('rsvps').add({
                  ...rsvpData,
                  fullName: `${rsvpData.firstName} ${rsvpData.lastName}`,
                  createdAt: new Date(),
                  rsvpStatus: rsvpData.attending === 'yes' ? 'attending' : 'not_attending',
                  hasPlusOne: parseInt(rsvpData.plusOnes) > 0,
                  plusOneCount: parseInt(rsvpData.plusOnes) || 0,
                  order: 0,
                  source: 'ai_assistant'
              });
              
          } catch (e) {
              console.error("Failed to parse or save RSVP JSON", e);
              textOut = "I'm sorry, I couldn't save your RSVP due to a technical error. Please try again or use the RSVP page.";
          }
      }
  
      return res.status(200).send({ data: { answer: textOut } });
  
    } catch (error) {
        console.error("AI Error:", error);
        return res.status(500).send({ data: { answer: "Sorry, I'm having trouble thinking right now. Please try again." } });
    }
  });
});
