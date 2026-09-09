import { useEffect, useState, createContext } from 'react';
import { auth, database } from '@/firebase/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, child, get } from 'firebase/database';

// Context to share authentication state across the app
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State for current user and related info
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set up Firebase auth listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      initializeUser(user); // Initialize user state when auth changes
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Initialize user data from Firebase auth and database
  async function initializeUser(user) {
    if (user) {
      setCurrentUser(user);

      const isEmail = user.providerData.some(
        (provider) => provider.providerId === 'password'
      );

      setIsEmailUser(isEmail);
      setUserLoggedIn(true);
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${user.uid}`));

        if (snapshot.exists()) {
          setUserData(snapshot.val()); // Set user profile data
        } else {
          console.log('No user profile data found.');
          setUserData(null);
        }

        setUserLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      }
    } else {
      // Reset state if no user is logged in
      setCurrentUser(null);
      setUserData(null);
      setUserLoggedIn(false);
      setIsEmailUser(false);
    }
    setLoading(false); // Finished loading
  }

  return (
    <AuthContext
      value={{
        currentUser,
        setCurrentUser,
        userLoggedIn,
        isEmailUser,
        userData,
        setUserData,
        loading,
      }}
    >
      {!loading && children} {/* Render children only after loading */}
    </AuthContext>
  );
};
