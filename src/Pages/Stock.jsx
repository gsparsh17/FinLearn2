import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { useUser } from "@clerk/clerk-react"; // Ensure this imports your Firebase config
import { UserProvider } from "../context/UserContext";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import StockTradingPage from "./StockTradingPage";
import PortfolioPage from "./PortfolioPage";

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

const Stock = () => {
  const [portfolioCreated, setPortfolioCreated] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "Users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setPortfolioCreated(!!data.budget); // Portfolio exists if budget > 0
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <UserProvider>
      <Routes>
        <Route
          path="/stock"
          element={
            portfolioCreated ? (
              <StockTradingPage />
            ) : (
              <PortfolioPage onComplete={() => setPortfolioCreated(true)} />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
};

export default Stock;
