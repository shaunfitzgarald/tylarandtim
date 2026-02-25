import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const PHOTOS_COLLECTION = 'photos';
const storage = getStorage();

export const PhotoService = {
  // Upload photo to Storage and save metadata to Firestore
  uploadPhoto: async (file, caption = '') => {
    // 1. Upload to Storage
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 2. Save to Firestore
    return await addDoc(collection(db, PHOTOS_COLLECTION), {
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      caption,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      order: Date.now(), // Default order
      createdAt: new Date()
    });
  },

  deletePhoto: async (photoId, storagePath) => {
    // 1. Delete from Firestore
    await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
    
    // 2. Delete from Storage
    if (storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef).catch(err => console.error("Storage delete error", err));
    }
  },

  updatePhotoOrder: async (orderedPhotos) => {
      const promises = orderedPhotos.map((photo, index) => {
          const photoRef = doc(db, PHOTOS_COLLECTION, photo.id);
          return updateDoc(photoRef, { order: index });
      });
      return Promise.all(promises);
  },

  subscribeToPhotos: (callback) => {
    const q = query(collection(db, PHOTOS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(photos);
    });
  }
};
