import React from 'react';
import '../Styles/NewsCard.css';

function NewsCard({ article, onClick }) {
  return (
    <div className="news-card" onClick={onClick}>
      {/* <img src={article.urlToImage} alt="News" className="news-image" /> */}
      <div className="news-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </div>
    </div>
  );
}

export default NewsCard;
