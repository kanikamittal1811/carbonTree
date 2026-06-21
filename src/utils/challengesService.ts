import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { CHALLENGES } from '../data/challengesData';
import { CATEGORY_IDS } from './constants';

export interface UserChallengeProgress {
  challengeId: string;
  subscribedAt: string; // ISO date string
  completedDays: number[]; // Array of indices (0-6) representing days checked off
  isCompleted: boolean;
  completedAt?: string; // ISO date string
}

export interface ChallengesState {
  active: { [categoryId: string]: UserChallengeProgress }; // At most 1 active challenge per category
  completed: string[]; // List of completed challenge IDs
  discoveryIds: string[]; // Currently shuffled available challenge IDs in the discovery pool
}

// Initial state template
export const getInitialChallengesState = (): ChallengesState => {
  // Select one random challenge per category to seed initial discovery
  const initialDiscovery: string[] = [];
  
  CATEGORY_IDS.forEach(cat => {
    const catChallenges = CHALLENGES.filter(c => c.categoryId === cat);
    if (catChallenges.length > 0) {
      const randomChallenge = catChallenges[Math.floor(Math.random() * catChallenges.length)];
      initialDiscovery.push(randomChallenge.id);
    }
  });

  return {
    active: {},
    completed: [],
    discoveryIds: initialDiscovery,
  };
};

/**
 * Fetch the user's weekly challenge subscriptions and progress.
 * If user is null, returns default empty state (guests are read-only).
 */
export const getChallengesState = async (userId: string | null): Promise<ChallengesState> => {
  if (!userId || !isFirebaseConfigured || !db) {
    return getInitialChallengesState();
  }

  try {
    const userDocRef = doc(db, 'users_challenges', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as ChallengesState;
      // Ensure all fields exist
      return {
        active: data.active || {},
        completed: data.completed || [],
        discoveryIds: data.discoveryIds || [],
      };
    } else {
      // Document doesn't exist, create it with initial state
      const initialState = getInitialChallengesState();
      await setDoc(userDocRef, initialState);
      return initialState;
    }
  } catch (error) {
    console.error('Error fetching challenges state:', error);
    // Return initial state as safe fallback
    return getInitialChallengesState();
  }
};

/**
 * Save user's challenges state to Firestore.
 */
export const saveChallengesState = async (userId: string | null, state: ChallengesState): Promise<void> => {
  if (!userId || !isFirebaseConfigured || !db) {
    return;
  }

  try {
    const userDocRef = doc(db, 'users_challenges', userId);
    await setDoc(userDocRef, state);
  } catch (error) {
    console.error('Error saving challenges state:', error);
    throw error;
  }
};

/**
 * Gets the current follower counts for all challenges.
 * Merges Firestore-stored counts with the base defaults.
 */
export const getFollowerCounts = async (): Promise<{ [challengeId: string]: number }> => {
  const counts: { [challengeId: string]: number } = {};
  
  // Seed with base counts from the challenge definition
  CHALLENGES.forEach(c => {
    counts[c.id] = c.baseFollowers;
  });

  if (!isFirebaseConfigured || !db) {
    return counts;
  }

  try {
    const statsDocRef = doc(db, 'challenge_stats', 'follower_counts');
    const docSnap = await getDoc(statsDocRef);

    if (docSnap.exists()) {
      const firestoreCounts = docSnap.data() as { [challengeId: string]: number };
      Object.keys(firestoreCounts).forEach(id => {
        counts[id] = firestoreCounts[id];
      });
    } else {
      // Initialize the stats doc with base values if empty
      const initialCounts: { [challengeId: string]: number } = {};
      CHALLENGES.forEach(c => {
        initialCounts[c.id] = c.baseFollowers;
      });
      await setDoc(statsDocRef, initialCounts);
    }
  } catch (error) {
    console.error('Error fetching follower counts from Firestore:', error);
  }

  return counts;
};

/**
 * Increments the follower count of a specific challenge in Firestore.
 */
export const incrementFollowers = async (challengeId: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const statsDocRef = doc(db, 'challenge_stats', 'follower_counts');
    await updateDoc(statsDocRef, {
      [challengeId]: increment(1)
    });
  } catch (error) {
    console.error(`Error incrementing followers for ${challengeId}:`, error);
  }
};

/**
 * Decrements the follower count of a specific challenge in Firestore.
 */
export const decrementFollowers = async (challengeId: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const statsDocRef = doc(db, 'challenge_stats', 'follower_counts');
    await updateDoc(statsDocRef, {
      [challengeId]: increment(-1)
    });
  } catch (error) {
    console.error(`Error decrementing followers for ${challengeId}:`, error);
  }
};
