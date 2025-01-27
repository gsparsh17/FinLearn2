import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import World from "../components/World";
import Nav from "../components/Nav";
import Guide from "../components/Guide"; // Import Guide component
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase

function Game() {
  const [userStatus, setUserStatus] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserStatus = async () => {
      const db = getFirestore();
      const userId = user.id; // Replace with logic to get the current user's ID
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserStatus(userDocSnap.data().status || "existing");
      } else {
        setUserStatus("new");
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <div>
      <Nav />
      <World />
      {userStatus && <Guide userStatus={userStatus} />}
    </div>
  );
}

export default Game;
