import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase/firebase-config';

// Function to get the current user's Firebase ID token
export const getToken = async () => {
  const user = auth.currentUser; // Get currently signed-in user

  if (!user) return null; // Return null if no user is signed in

  // Force refresh and return the ID token
  return await getIdToken(user, true);
};
