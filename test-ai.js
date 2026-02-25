const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');

const firebaseConfig = {
  projectId: "tylarandtim"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, 'us-central1');
const askAi = httpsCallable(functions, 'weddingAssistant');

async function test() {
  try {
    const result = await askAi({ question: "Hello" });
    console.log("Success:", result.data);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
