import { set, ref } from 'firebase/database';
import { database } from '../firebase/firebase-config';

// Save a user's profile to Firebase Realtime Database
export const saveUserProfile = (user) => {
  // Reference to the user's node
  return set(ref(database, 'users/' + user.uid), {
    fullName: user.displayName || '', // User's full name (fallback empty string)
    email: user.email, // User's email
    username: '', // Placeholder for username
    photoURL: user.photoURL || '', // User's photo URL (fallback empty string)
  });
};
