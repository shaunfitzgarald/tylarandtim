import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';

const GUESTS_COLLECTION = 'rsvps';
const CONTENT_COLLECTION = 'site_content';
const PHOTOS_COLLECTION = 'photos';

export const GuestService = {
  // Add a new guest (Admin)
  addGuest: async (guestData) => {
    return await addDoc(collection(db, GUESTS_COLLECTION), {
      ...guestData,
      createdAt: new Date(),
      rsvpStatus: 'pending', // pending, attending, declined
      hasPlusOne: false,
      plusOneCount: 0,
      order: 0, // For drag and drop
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
