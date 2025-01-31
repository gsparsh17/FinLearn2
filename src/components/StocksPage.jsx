import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import StockChart from "./StockChart";

const StocksPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState({});

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
    <div className="flex flex-col items-center w-full p-6">
      <h2 className="text-2xl font-bold text-[#e6c040] mb-5">Stock Market</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-4/5">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-[#f8f8f8] p-4 rounded-lg shadow-lg text-white flex flex-col items-center"
          >
            <h4 className="text-lg font-semibold">{stock.name}</h4>
            <p className="text-xl font-bold">${stock.price}</p>
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
        className="mt-6 bg-[#e6c040] hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg"
      >
        Next Round
      </button>
    </div>
  );
};

export default StocksPage;
