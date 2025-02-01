import React, { useContext } from "react"; 
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { user, portfolio } = useContext(UserContext);

  return (
    <div className="fixed top-5 right-5 z-10 bg-[#00364d] bg-opacity-90 text-white p-6 rounded-2xl shadow-xl w-72 backdrop-blur-lg border border-[#0078d7]">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-[#ffd451]">Profile</h4>
        <div className="w-6 h-6 bg-[#ffd451] rounded-full flex items-center justify-center text-[#00364d] font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* User Info */}
      <div className="text-sm">
        <p><span className="text-[#ffd451] font-medium">Name:</span> {user.name}</p>
        <p><span className="text-[#ffd451] font-medium">Email:</span> {user.email}</p>
      </div>

      {/* Budget */}
      <div className="mt-3 p-3 rounded-lg bg-[#0078d7] bg-opacity-20 border border-[#0078d7] text-center">
        <p className="text-sm font-semibold text-[#ffd451]">Budget</p>
        <p className="text-xl font-bold">Rs.{typeof user.budget === "number" ? user.budget.toFixed(2) : "0.00"}</p>
      </div>

      {/* Portfolio */}
      <div className="mt-4">
        <h5 className="text-md font-semibold text-[#ffd451]">Portfolio:</h5>
        <ul className="mt-2 space-y-1">
          {Object.keys(portfolio).length > 0 ? (
            Object.entries(portfolio).map(([stock, quantity]) => (
              <li 
                key={stock} 
                className="text-sm flex justify-between px-3 py-1 rounded-md bg-[#0078d7] bg-opacity-20 border border-[#0078d7]">
                <span>{stock}</span>
                <span className="font-semibold">{quantity}</span>
              </li>
            ))
          ) : (
            <p className="text-xs text-gray-300 italic">No stocks owned yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
