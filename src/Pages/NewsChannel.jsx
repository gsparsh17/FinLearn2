import React, { useState, useEffect } from 'react';
import '../Styles/NewsChannel.css';
import NewsCard from '../components/NewsCard.jsx';
import NewsQuizPopup from '../components/NewsQuizPopup.jsx'; // Import quiz popup

function NewsChannel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false); // State to toggle quiz popup

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://fetch-news-and-quiz.onrender.com/news');
        const data = await response.json();

        // Convert summary into an array of news items and skip the first actual news item
        const newsItems = data.news_summary
          .split('\n')
          .slice(2) // Skip the first news item and the intro text
          .map((item) => item.replace(/^\d+\.\s/, '')); // Remove numbering

        setNews(newsItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div>
      <header className="header">
        <h1>NewsPaper</h1>
      </header>

      <div className="news-container">
        {loading ? (
          <p>Loading news...</p>
        ) : (
          news.map((article, index) => (
            <NewsCard key={index} article={{ title: article }} />
          ))
        )}
      </div>

      {/* Play Quiz Button */}
      <div className="quiz-button-container">
        <button className="quiz-button" onClick={() => setShowQuiz(true)}>Play Quiz</button>
      </div>

      {/* Show Quiz Popup */}
      {showQuiz && <NewsQuizPopup onClose={() => setShowQuiz(false)} />}

      <footer className="footer">
        <p>&copy; 2025 Dynamic News Page</p>
      </footer>
    </div>
  );
}

export default NewsChannel;
