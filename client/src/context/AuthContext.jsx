import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import anonProfile from "../images/anon_profile.png";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileDocRef = doc(db, "profiles", currentUser.uid);
        const profileDoc = await getDoc(profileDocRef);
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          const profileImageUrl = profileData.profileImageUrl || anonProfile;
          setProfileImage(profileImageUrl);
        } else {
          setProfileImage(anonProfile);
        }
      } else {
        setProfileImage(anonProfile);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profileImage, logout }}>
      {children}
    </AuthContext.Provider>
  );
};