import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaNewspaper, FaWallet, FaBook, FaTasks } from "react-icons/fa";
import NewsChannel from "../Pages/NewsChannel";
import "../Styles/Nav.css";
import Wallet from "../Pages/Wallet";
import Guide from "./Guide";
import DailyTasks from "../Pages/DailyTasks";

// Firebase config
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

function Nav() {
  const { user } = useUser();
  const [timer, setTimer] = useState("00:00:00");
  const [day, setDay] = useState("Day 1");
  const [month, setMonth] = useState("1st Month");
  const [initialMoney, setInitialMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(1);
  const [isNewsPopupOpen, setIsNewsPopupOpen] = useState(false); // State for news popup
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false); // State for wallet popup
  const [isTaskSliderOpen, setIsTaskSliderOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user) return;
      const userId = user.id;
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const age = userData.age;
      let money = age < 18 ? 2000 : age < 25 ? 10000 : 30000;

      setInitialMoney(money);
      if (userDocSnap.data().status === "new") {
        await updateDoc(userDocRef, {
          status: "new",
          day: "Day 1",
          month: "1st Month",
          money,
        });
        setDay("Day 1");
        setMonth("1st Month");
      } else {
        setDay(userData.day || "Day 1");
        setMonth(userData.month || "1st Month");
        setInitialMoney(userData.money || money);
      }
    };

    fetchUserStatus().then(() => {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
        if (progress === 100) setLoading(false);
      }, 30);
    });

    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        const [h, m, s] = prevTimer.split(":").map(Number);
        const newTimer = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String((s + 1) % 60).padStart(2, "0")}`;
        return s === 59 ? `${String(h).padStart(2, "0")}:${String((m + 1) % 60).padStart(2, "0")}:00` : newTimer;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [user, day, month, progress]);

  const toggleNewsPopup = () => setIsNewsPopupOpen((prev) => !prev);
  const toggleWalletPopup = () => setIsWalletPopupOpen((prev) => !prev); // Wallet popup toggle
  const toggleTaskSlider = () => setIsTaskSliderOpen((prev) => !prev);
  const Guide1 = () => setIsGuideOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading... {progress}%</div>
      </div>
    );
  }

  return (
    <div className="navbar">
      <div className="nav-status">
        <h3 className="timer">{`${timer}, ${day}, ${month}`}</h3>
        <h3 className="money">Money: ₹{initialMoney}</h3>
      </div>

      <div className="nav-icons">
        <div className="icon-wrapper" onClick={toggleNewsPopup}>
          <FaNewspaper className="icon" />
          <span className="tooltip">Latest News</span>
        </div>
        <div className="icon-wrapper" onClick={toggleWalletPopup}>
          <FaWallet className="icon" />
          <span className="tooltip">Wallet</span>
        </div>
        <div className="icon-wrapper" onClick={Guide1}>
          <FaBook className="icon" />
          <span className="tooltip">Guide</span>
        </div>
        <div className="icon-wrapper" onClick={toggleTaskSlider}>
          <FaTasks className="icon" />
          <span className="tooltip">Tasks</span>
        </div>
      </div>

      {/* News Popup */}
      {isNewsPopupOpen && (
        <div className="popup-overlay" onClick={toggleNewsPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleNewsPopup}>
              &times;
            </button>
            <NewsChannel />
          </div>
        </div>
      )}

      {/* Wallet Popup */}
      {isWalletPopupOpen && (
        <div className="popup-overlay" onClick={toggleWalletPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleWalletPopup}>
              &times;
            </button>
            <Wallet /> {/* Wallet component */}
          </div>
        </div>
      )}

{isGuideOpen && (<Guide/>)}

{isTaskSliderOpen && (
        <div className="task-slider">
          <div className="task-slider-content">
            <button className="close-button" onClick={toggleTaskSlider}>
              &times;
            </button>
            <DailyTasks/>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
