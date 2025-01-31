import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { user, portfolio } = useContext(UserContext);

  return (
    <div style={{ position: "fixed", top: "10px", right: "10px", border: "1px solid black", padding: "10px" }}>
      <h4>Profile</h4>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>
        Budget: $
        {typeof user.budget === "number" ? user.budget.toFixed(2) : "0.00"}
      </p>
      <h5>Portfolio:</h5>
      <ul>
        {Object.keys(portfolio).length > 0 ? (
          Object.entries(portfolio).map(([stock, quantity]) => (
            <li key={stock}>
              {stock}: {quantity}
            </li>
          ))
        ) : (
          <p>No stocks owned yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;