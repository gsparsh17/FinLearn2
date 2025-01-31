import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaNewspaper, FaWallet, FaBook, FaTasks } from "react-icons/fa";
import axios from "axios";
import NewsChannel from "../Pages/NewsChannel";
import "../Styles/Nav.css";
import Wallet from "../Pages/Wallet";
import Guide from "./Guide";
import DailyTasks from "../Pages/DailyTasks";

const API_URL = "https://web-finance-advisor.onrender.com/query";

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
  const [isNewsPopupOpen, setIsNewsPopupOpen] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [isTaskSliderOpen, setIsTaskSliderOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // Chatbot states
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setError] = useState(null);

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

  const handleQuerySubmit = async () => {
    if (!query) {
      setError("Please enter a query.");
      return;
    }
    setChatLoading(true);
    setError(null);
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: query }]);
    
    try {
      const res = await axios.get(`${API_URL}?query=${encodeURIComponent(query)}`);
      // Add bot message
      setMessages(prev => [...prev, { type: 'bot', text: res.data.summary }]);
      setQuery('');
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setChatLoading(false);
  };

  const toggleNewsPopup = () => setIsNewsPopupOpen((prev) => !prev);
  const toggleWalletPopup = () => setIsWalletPopupOpen((prev) => !prev);
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
          <span className="tooltip">ChatBot</span>
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
            <Wallet />
          </div>
        </div>
      )}

      {/* Guide/Chatbot Popup */}
      {isGuideOpen && (
        <div className="popup-overlay" onClick={Guide1}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={Guide1}>
              &times;
            </button>
            <div className="flex flex-col h-[600px] w-[400px] bg-gray-100">
              {/* Chat Header */}
              <div className="bg-blue-500 p-4 flex items-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                  alt="Bot Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h1 className="text-xl text-white font-semibold">Finance Advisor</h1>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    {message.type === 'bot' && (
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                        alt="Bot Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Type your message..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                  />
                  <button
                    className="bg-blue-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    onClick={handleQuerySubmit}
                    disabled={chatLoading}
                  >
                    ➤
                  </button>
                </div>
                {chatError && <p className="text-red-500 mt-2 text-sm">{chatError}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

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
