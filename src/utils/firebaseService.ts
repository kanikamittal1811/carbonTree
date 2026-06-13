import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface SavedFootprint {
  id?: string;
  userId: string;
  totalCO2: number;
  treesCut: number;
  averageComparison: number;
  breakdown: {
    energy: number;
    transport: number;
    food: number;
    lifestyle: number;
  };
  timestamp: Timestamp | Date;
}

/**
 * Saves a footprint result to Firestore for the given user.
 */
export const saveFootprintResult = async (
  userId: string,
  totalCO2: number,
  treesCut: number,
  averageComparison: number,
  breakdown: SavedFootprint['breakdown']
): Promise<string | null> => {
  if (!isFirebaseConfigured || !db) {
    console.error('Firebase is not configured. Cannot save results.');
    return null;
  }

  try {
    const docData: Omit<SavedFootprint, 'id'> = {
      userId,
      totalCO2,
      treesCut,
      averageComparison,
      breakdown,
      timestamp: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'footprints'), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving carbon footprint to Firestore: ', error);
    throw error;
  }
};

/**
 * Fetches the footprint calculation history for the given user, sorted by date (newest first).
 */
export const getFootprintHistory = async (userId: string): Promise<SavedFootprint[]> => {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase is not configured. Returning empty history.');
    return [];
  }

  try {
    const q = query(
      collection(db, 'footprints'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const history: SavedFootprint[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<SavedFootprint, 'id'>;
      history.push({
        id: doc.id,
        ...data,
      });
    });

    // Sort client-side by timestamp descending (newest first)
    // This avoids requiring a composite index in Firestore for userId and timestamp
    history.sort((a, b) => {
      const getMillis = (ts: any) => {
        if (!ts) return 0;
        if (typeof ts.toMillis === 'function') return ts.toMillis();
        if (typeof ts.toDate === 'function') return ts.toDate().getTime();
        return new Date(ts).getTime();
      };
      return getMillis(b.timestamp) - getMillis(a.timestamp);
    });

    return history;
  } catch (error) {
    console.error('Error fetching footprint history: ', error);
    throw error;
  }
};
