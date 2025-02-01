import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const PortfolioForm = ({ onComplete }) => {
  const { user, setUser } = useContext(UserContext);
  console.log(user)
  

  // Initialize form data with user's email and budget
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    budget: user?.budget || 0,
  });
  console.log(formData)

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(parseFloat(value))

    // Restrict budget increase
    if (name === "budget" && parseFloat(value) > user.budget) {
      alert("You cannot increase the budget beyond available money.");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newBudget = parseFloat(formData.budget) || 0; // Default to 0 if empty
    const remainingMoney = (user.budget ?? 0) - newBudget; // Prevent NaN issues
  
    if (remainingMoney < 0) {
      alert("Insufficient funds! You cannot set a budget greater than available money.");
      return;
    }
  
    // Update user state and Firebase
    await setUser({
      name: formData.name,
      email: formData.email,
      money: remainingMoney, // Deduct from available money
      budget: newBudget, // Store new budget
    });
  
    onComplete(); // Navigate to the next page
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#00364d] text-white rounded-lg shadow-lg p-8 max-w-md mx-auto mt-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#ffd451]">
        Create Your Portfolio
      </h2>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-[#00364d] focus:outline-none focus:ring-2 focus:ring-[#0078d7]"
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full px-4 py-2 border rounded-lg bg-gray-200 text-[#00364d] focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="budget" className="block text-sm font-medium mb-2">
          Budget (Available: Rs.{user.budget}):
        </label>
        <input
          id="budget"
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-[#00364d] focus:outline-none focus:ring-2 focus:ring-[#0078d7]"
          placeholder="Enter your budget"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-[#0078d7] hover:bg-[#005a9e] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
      >
        Create Portfolio
      </button>
    </form>
  );
};

export default PortfolioForm;
