"use client"

import { useState, useEffect } from "react"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { useUser } from "@clerk/clerk-react"

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

function NewsQuizPopup({ onClose }) {
  const [quizData, setQuizData] = useState([])
  const [userQuestions, setUserQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [scorecard, setScorecard] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch("https://fetch-news-and-quiz.onrender.com/quiz")
        const data = await response.json()
        const formattedQuiz = parseQuizData(data.quiz)
        setQuizData(formattedQuiz)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [])

  const parseQuizData = (quizText) => {
    const questions = quizText.split("\n\n**Question")
    questions.shift()

    const parsedQuestions = questions.map((q, index) => {
      const lines = q.split("\n")
      const questionText = lines[0].replace(/\*\*/, "").trim()
      // Filter out empty options and only take valid ones
      const options = lines.slice(1, 6)
        .map((opt) => opt.replace(/^[A-D]\) /, "").trim())
        .filter(opt => opt && opt.length > 0) // Remove empty/blank options
      const correctAnswer = options[0] // First non-empty option is correct

      return {
        id: index + 1,
        question: questionText,
        options: shuffleArray(options),
        correctAnswer: correctAnswer,
      }
    })

    setUserQuestions(parsedQuestions)
    return parsedQuestions
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const handleAnswerSelect = (option) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: option,
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    let attemptedCount = 0

    quizData.forEach((question, index) => {
      if (userAnswers[index]) {
        attemptedCount++
        if (userAnswers[index] === question.correctAnswer) {
          correctCount++
        }
      }
    })

    return {
      totalQuestions: quizData.length,
      attemptedQuestions: attemptedCount,
      correctAnswers: correctCount,
    }
  }

  const submitQuiz = async () => {
    const userId = user?.id
    if (!userId) {
      alert("You need to log in to submit the quiz.")
      return
    }

    try {
      const score = calculateScore()
      await setDoc(doc(db, `Users/${userId}/quizzes`, "latestQuiz"), {
        questions: userQuestions,
        responses: userAnswers,
        score: score,
        timestamp: new Date(),
      })
      setScorecard(score)
      setQuizSubmitted(true)
    } catch (error) {
      console.error("Error storing quiz data:", error)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-8 rounded-lg">
          <p className="text-xl font-semibold">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (quizSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-blue-500 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 hover:scrollbar-thumb-blue-800 scrollbar-track-blue-300 hover:scrollbar-track-blue-400 transition-colors duration-200">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Your Scorecard</h3>
            <ul className="mb-4">
              <li>Total Questions: {scorecard.totalQuestions}</li>
              <li>Questions Attempted: {scorecard.attemptedQuestions}</li>
              <li>Correct Answers: {scorecard.correctAnswers}</li>
            </ul>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(scorecard.correctAnswers / scorecard.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Question Review</h3>
            {quizData.map((question, index) => (
              <div key={index} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="font-semibold mb-2">{question.question}</p>
                <p className="mb-1">
                  Your answer:{" "}
                  <span
                    className={
                      userAnswers[index] === question.correctAnswer
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {userAnswers[index] || "Not answered"}
                  </span>
                </p>
                <p className="text-green-800">
                  Correct answer: <span className="font-semibold">{question.correctAnswer}</span>
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] mt-6 font-semibold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-blue-500 p-8 rounded-lg max-w-2xl w-full relative shadow-xl">
        <h2 className="text-2xl font-bold mb-4">News Quiz</h2>
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-all duration-200" 
          onClick={onClose}
        >
          ×
        </button>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
          ></div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {currentQuestionIndex + 1}/{quizData.length} - {quizData[currentQuestionIndex].question}
          </h3>
          <div className="space-y-3">
            {quizData[currentQuestionIndex].options.map((option, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-blue-600 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01]">
                <input
                  type="radio"
                  name="quiz-option"
                  value={option}
                  checked={userAnswers[currentQuestionIndex] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3 h-4 w-4 cursor-pointer"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-semibold shadow-md"
          >
            Previous
          </button>
          {currentQuestionIndex === quizData.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] font-semibold shadow-md"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] font-semibold shadow-md"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewsQuizPopup
