import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import StockChart from "./StockChart";

const StocksPage = () => {
  const { user, setUser, portfolio, setPortfolio } = useContext(UserContext);
  const [stocks, setStocks] = useState([]);

  // Generate random stock prices
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

  // Generate new stock prices
  const handlePass = () => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => ({
        ...stock,
        price: Math.floor(Math.random() * 500) + 50,
        history: [...stock.history, Math.floor(Math.random() * 500) + 50],
      }))
    );
  };

  // Buy stock
  const handleBuy = (stock) => {
    if (user.budget >= stock.price) {
      const updatedBudget = user.budget - stock.price;
      const updatedPortfolio = {
        ...portfolio,
        [stock.name]: (portfolio[stock.name] || 0) + 1,
      };

      // Update Firestore
      setUser({ ...user, budget: updatedBudget });
      setPortfolio(updatedPortfolio);
    } else {
      alert("Insufficient budget to buy this stock.");
    }
  };

  // Sell stock
  const handleSell = (stock) => {
    if (portfolio[stock.name] > 0) {
      const updatedBudget = user.budget + stock.price;
      const updatedPortfolio = {
        ...portfolio,
        [stock.name]: portfolio[stock.name] - 1,
      };

      // If stock count is zero, remove it from the portfolio
      if (updatedPortfolio[stock.name] === 0) {
        delete updatedPortfolio[stock.name];
      }

      // Update Firestore
      setUser({ ...user, budget: updatedBudget });
      setPortfolio(updatedPortfolio);
    } else {
      alert("You do not own this stock to sell.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-6">
      <h2 className="text-2xl font-bold text-[#ffd451] mb-5">Stock Market</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-4/5">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-[#00364d] p-4 rounded-lg shadow-lg text-white flex flex-col items-center border border-[#0078d7]"
          >
            <h4 className="text-lg font-semibold">{stock.name}</h4>
            <p className="text-xl font-bold text-[#ffd451]">${stock.price}</p>
            <StockChart history={stock.history} />
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleBuy(stock)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Buy
              </button>
              <button
                onClick={() => handleSell(stock)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handlePass}
        className="mt-6 bg-[#ffd451] hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg"
      >
        Next Round
      </button>
    </div>
  );
};

export default StocksPage;
