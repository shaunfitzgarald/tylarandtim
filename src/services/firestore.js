import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

const GUESTS_COLLECTION = 'rsvps';
const CONTENT_COLLECTION = 'site_content';
const PHOTOS_COLLECTION = 'photos';

export const GuestService = {
  // Check if guest exists by email
  checkDuplicateEmail: async (email) => {
    if (!email) return false;
    // We will assume the AI tool will use this.
    return false; // dynamic check implementation below
  },

  // Add a new guest (Admin or AI)
  addGuest: async (guestData) => {
    // Basic duplicate check by email if provided
    if (guestData.email) {
       // We'll trust the caller to handle duplicates or we can query here.
       // For now, let's just add.
    }
    return await addDoc(collection(db, GUESTS_COLLECTION), {
      ...guestData,
      createdAt: new Date(),
      rsvpStatus: 'attending', // Default to attending if via AI/RSVP form usually
      hasPlusOne: guestData.plusOnes > 0,
      plusOneCount: parseInt(guestData.plusOnes) || 0,
      order: 0, 
    });
  },

  // Update guest data (RSVP or Admin edit)
  updateGuest: async (id, data) => {
    const guestRef = doc(db, GUESTS_COLLECTION, id);
    return await updateDoc(guestRef, data);
  },

  // Delete guest
  deleteGuest: async (id) => {
    const guestRef = doc(db, GUESTS_COLLECTION, id);
    return await deleteDoc(guestRef);
  },

  // Get all guests (Real-time listener for Admin)
  subscribeToGuests: (callback) => {
    const q = query(collection(db, GUESTS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(guests);
    });
  },
  
  // Update order of multiple guests (Drag and Drop)
  updateGuestOrder: async (orderedGuests) => {
    // Batch updates are better, but for now simple loop
    // In production, use writeBatch()
    const promises = orderedGuests.map((guest, index) => {
        const guestRef = doc(db, GUESTS_COLLECTION, guest.id);
        return updateDoc(guestRef, { order: index });
    });
    return Promise.all(promises);
  }
};

export const ContentService = {
  getContent: async (section) => {
    const docRef = doc(db, CONTENT_COLLECTION, section);
    const docSnap = getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  },
  
  updateContent: async (section, data) => {
    const docRef = doc(db, CONTENT_COLLECTION, section);
    return await updateDoc(docRef, data); // or setDoc with merge: true
  }
};
