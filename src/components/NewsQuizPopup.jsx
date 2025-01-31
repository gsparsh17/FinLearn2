import React, { useState, useEffect } from "react";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useUser } from "@clerk/clerk-react"; 
import "../Styles/NewsQuizPopup.css";

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

function NewsQuizPopup({ onClose }) {
  const [quizData, setQuizData] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    // Fetch authenticated user ID
    

    // Fetch Quiz Data
    const fetchQuiz = async () => {
      try {
        const response = await fetch("https://fetch-news-and-quiz.onrender.com/quiz");
        const data = await response.json();
        const formattedQuiz = parseQuizData(data.quiz);
        setQuizData(formattedQuiz);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  // Parse quiz from text format
  const parseQuizData = (quizText) => {
    const questions = quizText.split("\n\n**Question");
    questions.shift(); // Remove the intro part
  
    const parsedQuestions = questions.map((q, index) => {
      const lines = q.split("\n");
      const questionText = lines[0].replace(/\*\*/, "").trim();
      const options = lines.slice(2, 5).map((opt) => opt.replace(/^[A-D]\) /, "").trim());
  
      return {
        id: index + 1,
        question: questionText,
        options: options,
      };
    });
  
    // ✅ Ensure the entire array is set once, rather than updating state in a loop
    setUserQuestions(parsedQuestions);
    return parsedQuestions;
  };
  

  // Handle Answer Selection
  const handleAnswerSelect = (option) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    });
  };

  // Go to Next Question
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Go to Previous Question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit Quiz to Firestore
  const submitQuiz = async () => {
    const userId = user.id;
    if (!userId) {
      alert("You need to log in to submit the quiz.");
      return;
    }

    try {
      await setDoc(doc(db, `Users/${userId}/quizzes`, "latestQuiz"), {
        questions: userQuestions,
        responses: userAnswers,
        timestamp: new Date(),
      });
      onClose(); // Close quiz popup
    } catch (error) {
      console.error("Error storing quiz data:", error);
    }
  };

  return (
    <div className="quiz-popup">
      <div className="quiz-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>News Quiz</h2>

        {loading ? (
          <p>Loading quiz...</p>
        ) : (
          <div className="quiz-card">
            <h3>
              {currentQuestionIndex + 1}/{quizData.length} - {quizData[currentQuestionIndex].question}
            </h3>
            {quizData[currentQuestionIndex].options.map((option, index) => (
              <label key={index} className="quiz-option">
                <input
                  type="radio"
                  name="quiz-option"
                  checked={userAnswers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerSelect(option)}
                />
                {option}
              </label>
            ))}
          </div>
        )}

        <div className="quiz-controls">
          <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          {currentQuestionIndex === quizData.length - 1 ? (
            <button className="submit-quiz-button" onClick={submitQuiz}>Submit</button>
          ) : (
            <button onClick={nextQuestion}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsQuizPopup;
