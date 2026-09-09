import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { saveUserProfile } from '../services/userService.js';

/**
 * Create a new user with email and password
 * Also sets display name and saves profile to backend
 */
export const doCreateUserWithEmailAndPassword = async (
  fullname,
  email,
  password
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Update display name in Firebase profile
  await updateProfile(userCredential.user, {
    displayName: fullname,
  });

  // Save user info in custom backend/service
  await saveUserProfile(userCredential.user);

  return userCredential;
};

// Sign in existing user with email and password
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out the currently logged-in user
export const doSignOut = () => {
  return auth.signOut();
};

// Send email verification to current user
export const doSendEmailVerification = () => {
  if (!auth.currentUser) throw new Error('User not authenticated');

  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`, // Redirect URL after verification
  });
};
