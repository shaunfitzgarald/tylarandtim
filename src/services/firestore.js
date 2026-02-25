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
    const q = query(collection(db, GUESTS_COLLECTION), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  // Add a new guest (Admin or AI)
  addGuest: async (guestData) => {
    // Basic duplicate check by email if provided
    if (guestData.email) {
       const isDuplicate = await GuestService.checkDuplicateEmail(guestData.email);
       if (isDuplicate) {
          throw new Error("This email has already been used to RSVP.");
       }
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
  subscribeToGuests: (callback, onError) => {
    const q = query(collection(db, GUESTS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(guests);
    }, (error) => {
      if (onError) onError(error);
      else console.error("Firestore Subscribe Error:", error);
    });
  },

  // Get total guest count (real-time listener)
  subscribeToGuestCount: (callback, onError) => {
    const q = query(
      collection(db, GUESTS_COLLECTION),
      where('attending', '==', 'yes')
    );
    return onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        total += 1; // The guest themselves
        if (data.plusOnes) {
          total += parseInt(data.plusOnes) || 0;
        }
      });
      callback(total);
    }, (error) => {
      if (onError) onError(error);
      else console.error("Guest Count Subscribe Error:", error);
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
    const docSnap = await getDoc(docRef);
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
