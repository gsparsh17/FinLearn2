import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "", email: "", budget: 0 });
  const [portfolio, setPortfolio] = useState({}); // Portfolio to track stocks and their quantities

  return (
    <UserContext.Provider value={{ user, setUser, portfolio, setPortfolio }}>
      {children}
    </UserContext.Provider>
  );
};