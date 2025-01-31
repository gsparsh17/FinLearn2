import React from "react";
import StocksPage from "../components/StocksPage";
import Profile from "../components/Profile";

const StockTradingPage = () => {
  return (
    <div className="bg-[#00364d] min-h-screen text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-6 text-[#e6c040]">Stock Trading Game</h1>
      <div className="w-full max-w-5xl flex">
        <StocksPage />
        <Profile />
      </div>
    </div>
  );
};

export default StockTradingPage;
