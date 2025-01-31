import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Building2,
  BookOpen,
  Plus,
  Save,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FDRDInterface from "../components/fd-rd-interface";
import BankingForm from "@/components/BankingForm";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import MutualFundsView from "@/components/MutualFundsView";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMFPopup, setShowMFPopup] = useState(false);
  const [bankPopup, setBankPopup] = useState(false);
  const [userStatus, setUserStatus] = useState(null)
  const { user } = useUser();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user) {
        setBankPopup(true);
        return;
      }
         // Prevent fetching if user is not yet available
  
      const db = getFirestore();
      const userId = user.id; // Now this is safe
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        setUserStatus(userDocSnap.data().status || "existing");
      } else {
        setUserStatus("new");
      }
    };
  
    fetchUserStatus();
  }, [user]); // Runs only when `user` is defined
  

  // Show popup if the user is new
  useEffect(() => {
    if (userStatus === "new") {
      setBankPopup(true);
    }
  }, [userStatus]);

  return (
    <div className="min-h-screen bg-[#00364d] text-white relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-[#00364d] shadow-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="bg-[#0078d7] hover:bg-[#005fa3] text-white flex items-center gap-2"
            onClick={() => {
              window.location.href = "/game";
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            className="bg-[#ffd451] hover:bg-[#e6c040] text-black flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save & Quit
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Gems: 0</span>
            <Button
              size="icon"
              className="bg-[#ffd451] hover:bg-[#e6c040] h-8 w-8"
            >
              <Plus className="h-4 w-4 text-black" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <BookOpen className="h-6 w-6 text-[#ffd451]" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div>Month 1 / 12</div>
          <div>Balance ₹0.00</div>
          <Button variant="ghost" size="icon" className="text-[#ffd451]">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 font-cursive">
        {/* Bank Building Icon */}
        <div className="flex justify-center mb-8">
          <Building2 className="h-24 w-24 text-[#ffd451] drop-shadow-lg" />
        </div>

        {/* Pass Button */}
        <div className="flex justify-center mb-8">
          <Button className="bg-[#ffd451] hover:bg-[#005fa3] font-bold text-[#00364d] px-8 py-4 rounded-full shadow-lg">
            PASS
            <span className="text-xs block text-[#0078d7]">To Next Month</span>
          </Button>
        </div>

        {/* Investment Options */}
        <div className="flex justify-center gap-40 max-w-3xl mx-auto mb-8">
          <Button
            onClick={() => setShowPopup(true)}
            className="aspect-square bg-[#0078d7] hover:bg-[#005fa3] text-white text-xl rounded-3xl p-8 shadow-md"
          >
            FD/RD
          </Button>
          <Button
          onClick={() => setShowMFPopup(true)}
          className="aspect-square bg-[#0078d7] hover:bg-[#005fa3] text-white text-xl rounded-3xl p-8 shadow-md">
            Mutual
            <br />
            Funds
          </Button>
          <Button className="aspect-square bg-[#0078d7] hover:bg-[#005fa3] text-white text-xl rounded-3xl p-8 shadow-md">
            Bonds
          </Button>
        </div>

        {/* Progress Button */}
        <div className="flex justify-center">
          <Button className="bg-[#ffd451] hover:bg-[#005fa3] font-bold text-[#00364d] px-12 py-3 rounded-full shadow-lg">
            Progress
          </Button>
        </div>
      </main>

      {/* FD/RD Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-lg max-w-xl w-full relative">
            <FDRDInterface onBack={() => setShowPopup(false)} />
          </div>
        </div>
      )}

      {/* MF Modal */}
      {showMFPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-lg max-w-xl w-full relative">
            <MutualFundsView onBack={() => setShowMFPopup(false)} />
          </div>
        </div>
      )}

     {bankPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-lg max-w-4xl relative">
            <BankingForm onBack={() => setBankPopup(false)} />
          </div>
        </div>
      )}
    </div>
  );
}