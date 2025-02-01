import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { FaNewspaper, FaWallet, FaBook, FaTasks, FaInfoCircle, FaChartLine } from "react-icons/fa";
import axios from "axios";
import NewsChannel from "../Pages/NewsChannel";
import "../Styles/Nav.css";
import Wallet from "../Pages/Wallet";
import Guide from "./Guide";
import DailyTasks from "../Pages/DailyTasks";
import Stock from "../Pages/stock";
import StockTradingPage from "@/Pages/StockTradingPage";

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
  const [isMarketPopupOpen, setIsMarketPopupOpen] = useState(false);
  const [isTaskSliderOpen, setIsTaskSliderOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isGuideMentorOpen, setIsGuideMentorOpen] = useState(false);
  
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
  const GuideMentor = () => setIsGuideMentorOpen((prev) => !prev);
  const StockMarket = () => setIsMarketPopupOpen((prev) => !prev);

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
      <div className="icon-wrapper group" onClick={toggleNewsPopup}>
    <FaNewspaper className="icon text-blue-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
    <span className="tooltip">📰 Latest News</span>
  </div>
  
  <div className="icon-wrapper group" onClick={toggleWalletPopup}>
    <FaWallet className="icon text-green-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
    <span className="tooltip">💳 Wallet</span>
  </div>
  
  <div className="icon-wrapper group" onClick={Guide1}>
    <FaBook className="icon text-yellow-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
    <span className="tooltip">🤖 ChatBot</span>
  </div>
  
  <div className="icon-wrapper group" onClick={toggleTaskSlider}>
    <FaTasks className="icon text-purple-500 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
    <span className="tooltip">✅ Tasks</span>
  </div>
        <div className="guide-button blink" onClick={GuideMentor}>
  <FaInfoCircle className="icon2" />
</div>
<div className="market-button" onClick={StockMarket}>
  <FaChartLine className="icon3" />
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

      {isMarketPopupOpen && (
        <div className="popup-overlay" onClick={StockMarket}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={StockMarket}>
              &times;
            </button>
            <StockTradingPage/>
          </div>
        </div>
      )}


    {isGuideMentorOpen && (
      <div className="absolute z-20 text-2xl" onClick={(e) => e.stopPropagation()}>
      <Guide />
    </div>
      )}

      {/* Guide/Chatbot Popup */}
      {isGuideOpen && (
        <div className="popup-overlay" onClick={Guide1}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={Guide1}>
              &times;
            </button>
            <div className="flex flex-row h-[600px] w-[800px]">
              {/* Image Section */}
              <div className="w-1/2 p-4 flex flex-col items-center justify-center">
                <img
                  src="/4.png"
                  alt="Guide Image" 
                  className="h-full w-full object-contain mb-4"
                />
                <p className="text-center text-gray-400 font-semibold">
                  Welcome to our support chatbot. You can ask any question, and we are here to assist you professionally.
                </p>
              </div>

              {/* Chat Section */}
              <div className="w-1/2 flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden font-cursive">
                {/* Chat Header */}
                <div className="p-4 flex items-center bg-blue-700">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                    alt="Bot Avatar"
                    className="w-12 h-12 rounded-full mr-3 border-2 border-white"
                  />
                  <h1 className="text-2xl font-bold text-white">Finance Advisor</h1>
                </div>

                {/* Chat Messages */}
                <div 
                  className="flex-1 p-4 overflow-y-auto bg-gray-900 scroll-smooth"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4B5563 #1F2937',
                  }}
                >
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
                      >
                        {message.type === 'bot' && (
                          <img 
                            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                            alt="Bot Avatar"
                            className="w-8 h-8 rounded-full mr-2 border-2 border-blue-500 hover:scale-110 transition-transform"
                          />
                        )}
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg shadow-md hover:shadow-xl transition-shadow ${
                            message.type === 'user' 
                              ? 'bg-yellow-500 bg-opacity-70 text-white rounded-br-none hover:bg-opacity-80'
                              : 'bg-blue-600 bg-opacity-30 text-white rounded-bl-none hover:bg-opacity-40'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 p-4 bg-gray-800">
                  <input
                    type="text"
                    className="flex-1 border-2 border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 bg-gray-700 text-white transition-all"
                    placeholder="Type your message..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                  />
                  <button
                    className="bg-blue-500 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 active:bg-blue-700 transform hover:scale-105 active:scale-95 transition duration-300"
                    onClick={handleQuerySubmit}
                    disabled={chatLoading}
                  >
                    ➤
                  </button>
                </div>
                {chatError && <p className="text-red-500 mt-2 text-sm text-center animate-pulse">{chatError}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
