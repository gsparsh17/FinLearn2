import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import StockChart from "./StockChart";

const StocksPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState({}); // Track owned stocks with quantity

  // Generate random stock data
  useEffect(() => {
    const generateRandomStocks = () => {
      const stockNames = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];
      return stockNames.map((name) => ({
        name,
        price: Math.floor(Math.random() * 500) + 50,
        history: [Math.floor(Math.random() * 500) + 50],
      }));
    };
    setStocks(generateRandomStocks());
  }, []);

  const handlePass = () => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: Math.floor(Math.random() * 500) + 50,
        history: [...stock.history, Math.floor(Math.random() * 500) + 50],
      }))
    );
  };

  const handleBuy = (stock) => {
    if (user.budget >= stock.price) {
      setUser((prevUser) => ({
        ...prevUser,
        budget: prevUser.budget - stock.price,
      }));

      setPortfolio((prevPortfolio) => ({
        ...prevPortfolio,
        [stock.name]: (prevPortfolio[stock.name] || 0) + 1,
      }));
    } else {
      alert("Insufficient budget to buy this stock.");
    }
  };

  const handleSell = (stock) => {
    if (portfolio[stock.name] > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        budget: prevUser.budget + stock.price,
      }));

      setPortfolio((prevPortfolio) => ({
        ...prevPortfolio,
        [stock.name]: prevPortfolio[stock.name] - 1,
      }));
    } else {
      alert("You do not own this stock to sell.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Welcome, {user.name}</h2>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", width: "80%" }}>
        {stocks.map((stock, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
            <h4>{stock.name}</h4>
            <p>Price: ${stock.price}</p>
            <StockChart history={stock.history} />
            <button onClick={() => handleBuy(stock)}>Buy</button>
            <button onClick={() => handleSell(stock)}>Sell</button>
          </div>
        ))}
      </div>
      <button onClick={handlePass}>Pass</button>
    </div>
  );
};

export default StocksPage;