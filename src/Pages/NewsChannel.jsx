import React, { useState, useEffect } from 'react';
import '../Styles/NewsChannel.css';
import NewsCard from '../Components/NewsCard.jsx';

function NewsChannel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); // State for selected news

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=f942fde3e317463ebe9c21b6f12f2d2b'
        );
        const data = await response.json();
        setNews(data.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCardClick = (article) => {
    setSelectedArticle(article); // Set the selected article for the popup
  };

  const closePopup = () => {
    setSelectedArticle(null); // Close the popup
  };

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
            <NewsCard key={index} article={article} onClick={() => handleCardClick(article)} />
          ))
        )}
      </div>

      {selectedArticle && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>
              &times;
            </button>
            <img src={selectedArticle.urlToImage} alt="News" className="popup-image" />
            <h2>{selectedArticle.title}</h2>
            <p>{selectedArticle.description}</p>
            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2025 Dynamic News Page</p>
      </footer>
    </div>
  );
}

export default NewsChannel;
