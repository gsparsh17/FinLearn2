import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import World from "../components/World";
import Nav from "../components/Nav";
import Guide from "../components/Guide"; // Import Guide component
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase

function Game() {
  const [userStatus, setUserStatus] = useState(null);
  const { user } = useUser();
  const [showGuide, setShowGuide] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const db = getFirestore();
      const userId = user.id; // Replace with logic to get the current user's ID
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.data().status === "new") {
        setShowGuide(true)
      } else {
        setShowGuide(false)
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <div>
      <Nav />
      <World />
      {showGuide && <Guide userStatus={userStatus} />}
    </div>
  );
}

export default Game;
