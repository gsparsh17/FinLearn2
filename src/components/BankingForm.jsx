import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BankingForm = ({ onBack }) => {
  const { user } = useUser(); // ✅ Get authenticated user
  const [formData, setFormData] = useState({
    name: "",
    maidenName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    noOfDependents: "",
    nameOfRelative: "",
    relationshipWithGuardian: "",
    nationality: "In-Indian",
    citizenship: "",
    occupationType: "",
    placeOfPosting: "",
    businessType: "",
    annualIncome: "",
    netWorth: "",
    sourceFunds: "",
    religion: "",
    category: "",
    hasDisability: "",
    educationalQualification: "",
    isExposedPolitically: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      alert("User not logged in.");
      return;
    }
  
    try {
      const userRef = doc(db, "Users", user.id);
      const userSnap = await getDoc(userRef);
      onBack();
      if (userSnap.exists()) {
        // If the document exists, update it
        await updateDoc(userRef, {
          status: arrayUnion("Bank Account Created"),
        });
      } else {
        // If the document doesn't exist, create it first
        await setDoc(userRef, {
          status: ["Bank Account Created"],
        });
      }
  
      console.log("Bank account created status added!");
      alert("Bank account created successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Try again!");
    }
  };
  

  return (
    <div className="bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 w-500px p-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-8xl mx-auto bg-white/80 rounded-2xl p-8 shadow-lg overflow-auto h-[600px]"
      >
        <h2 className="text-center text-3xl text-purple-900 font-cursive mb-6">
          Account Opening Form
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg text-purple-800 font-cursive"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="maidenName"
              className="block text-lg text-purple-800 font-cursive"
            >
              Maiden Name:
            </label>
            <input
              type="text"
              id="maidenName"
              name="maidenName"
              value={formData.maidenName}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Enter maiden name"
            />
          </div>
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-lg text-purple-800 font-cursive"
            >
              Date of Birth:
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div>
            <label
              htmlFor="gender"
              className="block text-lg text-purple-800 font-cursive"
            >
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="ThirdGender">Third Gender</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="maritalStatus"
              className="block text-lg text-purple-800 font-cursive"
            >
              Marital Status:
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select Marital Status</option>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="noOfDependents"
              className="block text-lg text-purple-800 font-cursive"
            >
              No. of Dependents:
            </label>
            <input
              type="number"
              id="noOfDependents"
              name="noOfDependents"
              value={formData.noOfDependents}
              onChange={handleChange}
              className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Number of dependents"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="nameOfRelative" className="block text-lg text-purple-800 font-cursive">Name of Relative:</label>
          <input
            type="text"
            id="nameOfRelative"
            name="nameOfRelative"
            value={formData.nameOfRelative}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="relationshipWithGuardian" className="block text-lg text-purple-800 font-cursive">Relationship with Guardian:</label>
          <input
            type="text"
            id="relationshipWithGuardian"
            name="relationshipWithGuardian"
            value={formData.relationshipWithGuardian}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="nationality" className="block text-lg text-purple-800 font-cursive">Nationality:</label>
          <select
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="In-Indian">In-Indian</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {formData.nationality === 'Others' && (
        <div className="mt-4">
          <label htmlFor="citizenship" className="block text-lg text-purple-800 font-cursive">Country Name:</label>
          <input
            type="text"
            id="citizenship"
            name="citizenship"
            value={formData.citizenship}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="occupationType" className="block text-lg text-purple-800 font-cursive">Occupation Type:</label>
          <select
            id="occupationType"
            name="occupationType"
            value={formData.occupationType}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select Occupation Type</option>
            <option value="StateGovt">State Govt.</option>
            <option value="CentralGovt">Central Govt.</option>
            <option value="PublicSector">Public Sector Undertaking</option>
            <option value="Defence">Defence</option>
            <option value="PvtSector">Private Sector</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="placeOfPosting" className="block text-lg text-purple-800 font-cursive">Place of Posting:</label>
          <input
            type="text"
            id="placeOfPosting"
            name="placeOfPosting"
            value={formData.placeOfPosting}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="businessType" className="block text-lg text-purple-800 font-cursive">Business Type:</label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select Business Type</option>
            <option value="Industrialist">Industrialist</option>
            <option value="TradeSect">Trade Sect.</option>
            <option value="ServSect">Serv. Sect</option>
            <option value="MigrantLabour">Migrant Labour</option>
            <option value="Contractor">Contractor</option>
            <option value="JewellerBullionTrader">Jeweller / Bullion Trader</option>
            <option value="PawnShop">Pawn Shop</option>
            <option value="ImportExportCustomer">Import/Export Customer</option>
            <option value="OtherSelfEmployed">Other Self Employed</option>
            <option value="MedicalProf">Medical Prof.</option>
            <option value="LegalProf">Legal Prof.</option>
            <option value="CAICWATaxationFinance">CA/ICWA/Taxation/Finance</option>
            <option value="EngArchitectTechConsultant">Eng./Architect/Tech. Consultant</option>
            <option value="Retired">Retired</option>
            <option value="Journalist">Journalist</option>
            <option value="Housewife">Housewife</option>
            <option value="Student">Student</option>
            <option value="ShareAndStockBroker">Share and Stock Broker</option>
            <option value="OthProfessional">Oth. Professional</option>
            <option value="Agriculture">Agriculture</option>
            <option value="PoliticalSocialWorker">Political/Social Worker</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="annualIncome" className="block text-lg text-purple-800 font-cursive">Annual Income* Rs.:</label>
          <input
            type="number"
            id="annualIncome"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="netWorth" className="block text-lg text-purple-800 font-cursive">Net Worth (approx value) Rs.:</label>
          <input
            type="number"
            id="netWorth"
            name="netWorth"
            value={formData.netWorth}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label htmlFor="sourceFunds" className="block text-lg text-purple-800 font-cursive">Source of Funds:</label>
          <select
            id="sourceFunds"
            name="sourceFunds"
            value={formData.sourceFunds}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select Source of Funds</option>
            <option value="Salary">Salary</option>
            <option value="BusinessIncome">Business Income</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Investment">Investment</option>
            <option value="Pension">Pension</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="religion" className="block text-lg text-purple-800 font-cursive">Religion:</label>
          <select
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select Religion</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Sikh">Sikh</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-lg text-purple-800 font-cursive">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>
        <div>
          <label htmlFor="hasDisability" className="block text-lg text-purple-800 font-cursive">Person with disability:</label>
          <select
            id="hasDisability"
            name="hasDisability"
            value={formData.hasDisability}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="educationalQualification" className="block text-lg text-purple-800 font-cursive">Educational Qualification:</label>
          <select
            id="educationalQualification"
            name="educationalQualification"
            value={formData.educationalQualification}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="upto9thClasspassed">upto 9th Class passed</option>
            <option value="10thClasspassed">10th Class passed</option>
            <option value="GraduateGen">Graduate (Gen.)</option>
            <option value="PostGraduateGen">Post Graduate(Gen.)</option>
            <option value="MedGraduatePostGraduate">Med. Graduate/Post Graduate</option>
            <option value="EngGraduatePostGraduate">Eng. Graduate/Post Graduate</option>
            <option value="LawGraduatePostGraduate">Law Graduate/Post Graduate</option>
            <option value="CAICWAMBACFA">CA/ICWA/MBA/CFA</option>
            <option value="ComputerDegreeDiplomaMCA">Computer Degree/Diploma/MCA</option>
            <option value="OtherProfessionalDegreeDiploma">Other Professional Degree/Diploma</option>
            <option value="Illiterate">Illiterate (if yes : Identification Marks:)</option>
          </select>
        </div>
        <div>
          <label htmlFor="isExposedPolitically" className="block text-lg text-purple-800 font-cursive">
            Person (Politically exposed Person Related to politically Exposed Person)
          </label>
          <select
            id="isExposedPolitically"
            name="isExposedPolitically"
            value={formData.isExposedPolitically}
            onChange={handleChange}
            className="w-full border-2 border-purple-500 rounded-lg p-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Select</option>
            <option value="PoliticallyexposedPerson">Politically exposed Person</option>
            <option value="RelatedtopoliticallyExposedPerson">
              Related to politically Exposed Person
            </option>
            <option value="None">None</option>
          </select>
        </div>
      </div>
        <div className="mt-10 text-center">
          <button
            type="submit"
            className="bg-[#ffd451] text-[#00364d] font-cursive text-lg px-6 py-3 rounded-full shadow-md hover:bg-[#0078d7] transition duration-300 ease-in-out"
            onClick={handleSubmit}
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankingForm;
