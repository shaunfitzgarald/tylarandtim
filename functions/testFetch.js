const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

async function checkRsvp() {
  const snapshot = await db.collection('rsvps').where('email', '==', 'john@example.com').get();
  if (snapshot.empty) {
    console.log("No matching RSVP found.");
    return;
  }
  snapshot.forEach(doc => {
    console.log("RSVP found:", doc.id, "=>", doc.data());
  });
}

checkRsvp();
