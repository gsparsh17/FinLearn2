import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useUser } from "@clerk/clerk-react"; // Assuming Clerk is used for authentication
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import { FaWallet } from "react-icons/fa";

const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Wallet = () => { 
  const [walletData, setWalletData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
      const fetchWalletData = async () => {
        try {
                const userId = user.id;
                const userDocRef = doc(db, "Users", userId);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            setWalletData(userSnap.data());
          }
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      };

      fetchWalletData();
    });

  return (
    <div className="flex flex-row h-[600px] w-[800px] mx-auto mt-10 shadow-lg rounded-lg bg-gray-900 text-white">
      {/* Left Section - Image */}
      <div className="w-1/2 p-4 flex flex-col items-center justify-center">
        <FaWallet/>
        <p className="text-center text-gray-400 font-semibold">
          Track your savings, expenses, and earnings all in one place.
        </p>
      </div>

      {/* Right Section - Wallet Info */}
      <div className="w-1/2 flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex items-center justify-center bg-blue-700">
          <h1 className="text-2xl font-bold text-white text-center">My Wallet</h1>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
          {walletData ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-blue-400">💰 Budget:</h2>
                <p className="text-xl font-semibold">Rs.{walletData.budget}</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-yellow-400">🛠 Money Left:</h2>
                <p className="text-xl font-semibold">Rs.{walletData.money}</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-400">📅 {walletData.age < 18 ? "Weekly Pocket Money" : "Monthly Salary"}:</h2>
                <p className="text-xl font-semibold">Rs.{walletData.salary}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">Loading wallet data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
