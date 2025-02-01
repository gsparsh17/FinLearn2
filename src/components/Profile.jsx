import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { user, portfolio } = useContext(UserContext);

  return (
    <div className="fixed top-5 right-5 bg-[#0078d7] z-10 text-white p-6 rounded-lg shadow-lg w-64">
      <h4 className="text-lg font-semibold">Profile</h4>
      <p className="text-sm">Name: {user.name}</p>
      <p className="text-sm">Email: {user.email}</p>
      <p className="text-lg font-bold">
        Budget: Rs.{typeof user.budget === "number" ? user.budget.toFixed(2) : "0.00"}
      </p>
      <h5 className="text-md font-semibold mt-3">Portfolio:</h5>
      <ul className="list-disc pl-4">
        {Object.keys(portfolio).length > 0 ? (
          Object.entries(portfolio).map(([stock, quantity]) => (
            <li key={stock} className="text-sm">
              {stock}: {quantity}
            </li>
          ))
        ) : (
          <p className="text-xs">No stocks owned yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;
