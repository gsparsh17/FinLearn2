import React, { createContext, useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react"; // Get the logged-in user
import { initializeApp } from "firebase/app";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Create Context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useUser(); // Get the authenticated user
  const [userData, setUserData] = useState({ name: "", email: "", budget: 0 });
  const [portfolio, setPortfolio] = useState({}); // Portfolio to track stocks

  // Fetch user details from Firestore when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "Users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || "",
            email: data.email || user.email,
            budget: data.money || 0,
          });
          setPortfolio(data.portfolio || {});  // Load portfolio if exists
        } else {
          setUserData({ name: "", email: user.email, budget: 0 });
        }
      }
    };

    fetchUserData();
  }, [user]); // Runs whenever user changes

  // Function to update user data in Firestore
  const updateUserInFirestore = async (updatedUser) => {
    if (user) {
      const userRef = doc(db, "Users", user.id);
      try {
        await setDoc(
          userRef,
          {
            name: updatedUser.name,
            email: updatedUser.email,
            budget: updatedUser.budget, // Save remaining budget
            portfolio: portfolio, // Save the stock portfolio
            status: "Portfolio Updated",
          },
          { merge: true }
        );
        setUserData(updatedUser); // Update local userData immediately
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      user: userData, 
      setUser: updateUserInFirestore, // Update user data in Firestore
      portfolio, 
      setPortfolio 
    }}>
      {children}
    </UserContext.Provider>
  );
};
