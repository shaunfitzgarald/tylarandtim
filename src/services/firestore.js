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
      tableId: null // default to no table
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
  },

  // Update a guest's assigned table
  updateGuestTable: async (guestId, tableId) => {
    const guestRef = doc(db, GUESTS_COLLECTION, guestId);
    return await updateDoc(guestRef, { tableId: tableId });
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

const REGISTRY_COLLECTION = 'registry_items';

export const RegistryService = {
  // Subscribe to the global registry config (enabled/disabled)
  subscribeToConfig: (callback, onError) => {
    const docRef = doc(db, CONTENT_COLLECTION, 'registry_config');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback({ enabled: false }); // Default if missing
      }
    }, (error) => {
      if (onError) onError(error);
      else console.error("Registry Config Subscribe Error:", error);
    });
  },

  // Update global registry config
  updateConfig: async (enabled) => {
    const docRef = doc(db, CONTENT_COLLECTION, 'registry_config');
    // Using updateDoc might fail if it doesn't exist, but since ContentService 
    // is used similarly, we assume it's created or we can use setDoc. 
    // We'll use ContentService.updateContent but handle creation if needed.
    // Wait, updateDoc fails if the document doesn't exist. Let's use setDoc if necessary,
    // but importing setDoc might be needed. For now, we'll assume it exists or use setDoc.
    // Let's import setDoc at the top.
    const { setDoc } = await import('firebase/firestore');
    return await setDoc(docRef, { enabled }, { merge: true });
  },

  // Subscribe to registry items
  subscribeToItems: (callback, onError) => {
    const q = query(collection(db, REGISTRY_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
      if (onError) onError(error);
      else console.error("Registry Items Subscribe Error:", error);
    });
  },

  // Add a new registry item
  addItem: async (itemData) => {
    return await addDoc(collection(db, REGISTRY_COLLECTION), {
      ...itemData,
      createdAt: new Date(),
    });
  },

  // Delete a registry item
  deleteItem: async (id) => {
    const itemRef = doc(db, REGISTRY_COLLECTION, id);
    return await deleteDoc(itemRef);
  },

  // Mark an item as purchased
  markItemPurchased: async (id, buyerName) => {
    const itemRef = doc(db, REGISTRY_COLLECTION, id);
    return await updateDoc(itemRef, {
      purchased: true,
      purchasedBy: buyerName || 'Anonymous',
      purchasedAt: new Date()
    });
  },

  // Unmark an item as purchased (Admin)
  unmarkItemPurchased: async (id) => {
    const itemRef = doc(db, REGISTRY_COLLECTION, id);
    return await updateDoc(itemRef, {
      purchased: false,
      purchasedBy: null,
      purchasedAt: null
    });
  }
};
