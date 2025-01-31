import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Building2,
  WavesIcon as FaMoneyBillWave,
  FileLineChartIcon as FaChartLine,
  FileCodeIcon as FaFileContract,
} from "lucide-react"

// Utility functions
const isFirstTimeUser = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRegistered") !== "true"
  }
  return true
}

const setUserRegistered = () => {
  localStorage.setItem("userRegistered", "true")
}

const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

const setUserData = (data) => {
  localStorage.setItem("userData", JSON.stringify(data))
}

const getBalance = () => {
  if (typeof window !== "undefined") {
    const balance = localStorage.getItem("balance")
    return balance ? Number.parseFloat(balance) : 100000
  }
  return 100000
}

const setBalance = (balance) => {
  localStorage.setItem("balance", balance.toString())
}

const getInvestments = () => {
  if (typeof window !== "undefined") {
    const investments = localStorage.getItem("investments")
    return investments ? JSON.parse(investments) : {}
  }
  return {}
}

const setInvestments = (investments) => {
  localStorage.setItem("investments", JSON.stringify(investments))
}

const calculateReturns = (investment) => {
  const monthsDiff = Math.floor(
    (new Date().getTime() - new Date(investment.depositDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
  )
  const returnRate = -2.4 // Annual return rate
  const monthlyRate = returnRate / 12 / 100

  if (investment.type === "lumpSum") {
    return investment.amount * (1 + monthlyRate * monthsDiff)
  } else {
    // For SIP, calculate returns for each monthly investment
    let totalReturns = 0
    for (let i = 0; i < investment.installments; i++) {
      totalReturns += investment.amount * (1 + monthlyRate * (monthsDiff - i))
    }
    return totalReturns
  }
}

// Components
const RegistrationForm = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    maidenName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    guardianName: "",
    guardianRelationship: "",
    nationality: "",
    citizenship: "",
    occupationType: "",
    occupationDetails: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setUserRegistered()
    setUserData(formData)
    onRegistrationComplete(formData)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Bank Account Opening Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="maidenName" className="block mb-1">
            Maiden Name
          </label>
          <input
            type="text"
            id="maidenName"
            name="maidenName"
            value={formData.maidenName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="maritalStatus" className="block mb-1">
            Marital Status
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label htmlFor="guardianName" className="block mb-1">
            Guardian Name (if applicable)
          </label>
          <input
            type="text"
            id="guardianName"
            name="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="guardianRelationship" className="block mb-1">
            Relationship with Guardian
          </label>
          <input
            type="text"
            id="guardianRelationship"
            name="guardianRelationship"
            value={formData.guardianRelationship}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="nationality" className="block mb-1">
            Nationality
          </label>
          <select
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Nationality</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.nationality === "Other" && (
          <div>
            <label htmlFor="citizenship" className="block mb-1">
              Citizenship
            </label>
            <input
              type="text"
              id="citizenship"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
        <div>
          <label htmlFor="occupationType" className="block mb-1">
            Occupation Type
          </label>
          <select
            id="occupationType"
            name="occupationType"
            value={formData.occupationType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Occupation Type</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Business">Business</option>
            <option value="Student">Student</option>
            <option value="Retired">Retired</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {formData.occupationType === "Salaried" && (
          <div>
            <label htmlFor="occupationDetails" className="block mb-1">
              Employment Sector
            </label>
            <select
              id="occupationDetails"
              name="occupationDetails"
              value={formData.occupationDetails}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select Sector</option>
              <option value="Government">Government</option>
              <option value="Public Sector">Public Sector</option>
              <option value="Private Sector">Private Sector</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

const LumpSumView = ({ balance, onDeposit, onWithdraw, currentDeposit, investment }) => {
  const [amount, setAmount] = useState("")
  const returnPercentage = -2.4
  const currentReturns = investment ? calculateReturns(investment) : 0
  const currentNAV = 49.94

  const handleDeposit = () => {
    const depositAmount = Number.parseFloat(amount)
    if (depositAmount > 0 && depositAmount <= balance) {
      onDeposit(depositAmount)
      setAmount("")
    }
  }

  const handleWithdraw = () => {
    if (currentDeposit > 0) {
      onWithdraw(currentReturns)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">Mutual Funds (Lump Sum)</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Initial Amount</span>
          <span className="font-semibold text-black">${currentDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Return %</span>
          <span className={`font-semibold ${returnPercentage < 0 ? "text-red-500" : "text-green-500"}`}>
            {returnPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deposited On</span>
          <span className="font-semibold text-black">
            {investment ? new Date(investment.depositDate).toLocaleDateString() : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Value</span>
          <span className={`font-semibold ${currentReturns < currentDeposit ? "text-red-500" : "text-green-500"}`}>
            ${currentReturns.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current NAV</span>
          <span className="font-semibold text-black">${currentNAV}</span>
        </div>

        <div className="pt-4 border-t">
          {currentDeposit === 0 ? (
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
                className="flex-1 px-3 py-2 border rounded-md text-black"
              />
              <button
                onClick={handleDeposit}
                disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > balance}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Deposit
              </button>
            </div>
          ) : (
            <button
              onClick={handleWithdraw}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Withdraw (${currentReturns.toFixed(2)})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const SIPView = ({ balance, onDeposit, onWithdraw, onStop, currentDeposit, investment }) => {
  const [monthlyAmount, setMonthlyAmount] = useState("")
  const returnPercentage = -2.4
  const currentReturns = investment ? calculateReturns(investment) : 0
  const currentNAV = 49.94

  const handleStartSIP = () => {
    const depositAmount = Number.parseFloat(monthlyAmount)
    if (depositAmount > 0 && depositAmount <= balance) {
      onDeposit(depositAmount)
      setMonthlyAmount("")
    }
  }

  const handleWithdraw = () => {
    if (currentDeposit > 0) {
      onWithdraw(currentReturns)
    }
  }

  const handleStop = () => {
    onStop()
  }

  return (
    <div className="p-6 bg-blue rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">Mutual Funds (SIP)</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-black">Monthly Deposit</span>
          <span className="font-semibold text-black">${currentDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black">Total Deposited Amount</span>
          <span className="font-semibold text-black">
            ${(currentDeposit * (investment ? investment.installments : 0)).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black">Return %</span>
          <span className={`font-semibold ${returnPercentage < 0 ? "text-red-500" : "text-green-500"}`}>
            {returnPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black">Started On</span>
          <span className="font-semibold text-black">
            {investment ? new Date(investment.depositDate).toLocaleDateString() : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black">Current Value</span>
          <span className={`font-semibold ${currentReturns < currentDeposit ? "text-red-500" : "text-green-500"}`}>
            ${currentReturns.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black">Current NAV</span>
          <span className="font-semibold text-black">${currentNAV}</span>
        </div>

        <div className="pt-4 border-t">
          {currentDeposit === 0 ? (
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                placeholder="Enter monthly amount"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
                className="flex-1 px-3 py-2 border rounded-md text-black"
              />
              <button
                onClick={handleStartSIP}
                disabled={
                  !monthlyAmount || Number.parseFloat(monthlyAmount) <= 0 || Number.parseFloat(monthlyAmount) > balance
                }
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
              >
                Start SIP
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleStop}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Stop
                <span className="text-xs block">(Change to Lump-Sum)</span>
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Withdraw (${currentReturns.toFixed(2)})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MutualFundsView = ({ balance, onClose, onUpdateBalance }) => {
  const [activeView, setActiveView] = useState("all")
  const [investments, setInvestmentsState] = useState({})

  useEffect(() => {
    const savedInvestments = getInvestments()
    setInvestmentsState(savedInvestments)
  }, [])

  const handleDeposit = (type, amount) => {
    const newInvestment = {
      type,
      amount,
      depositDate: new Date().toISOString(),
      returns: 0,
      nav: 49.94,
      isStopped: false,
      installments: 1, // Added installments property for SIP
    }

    const newInvestments = {
      ...investments,
      [type]: [...(investments[type] || []), newInvestment],
    }

    setInvestments(newInvestments)
    setInvestmentsState(newInvestments)
    onUpdateBalance(balance - amount)
  }

  const handleWithdraw = (type, amount) => {
    const newInvestments = { ...investments }
    newInvestments[type] = []

    setInvestments(newInvestments)
    setInvestmentsState(newInvestments)
    onUpdateBalance(balance + amount)
  }

  const handleStopSIP = () => {
    if (investments.sip && investments.sip.length > 0) {
      const newInvestments = { ...investments }
      const lastSIP = newInvestments.sip[newInvestments.sip.length - 1]

      // Calculate total amount invested in SIP
      const totalInvested = newInvestments.sip.reduce((total, inv) => total + inv.amount * inv.installments, 0)

      // Calculate total returns
      const totalReturns = newInvestments.sip.reduce((total, inv) => total + calculateReturns(inv), 0)

      // Create a new lump sum investment with the total amount and returns
      const newLumpSum = {
        type: "lumpSum",
        amount: totalReturns,
        depositDate: new Date().toISOString(),
        returns: totalReturns - totalInvested,
        nav: lastSIP.nav,
      }

      // Add the new lump sum investment and clear SIP investments
      newInvestments.lumpSum = [...(newInvestments.lumpSum || []), newLumpSum]
      newInvestments.sip = []

      setInvestments(newInvestments)
      setInvestmentsState(newInvestments)
      setActiveView("lumpSum") // Switch to lump sum view after stopping SIP
    }
  }

  const getCurrentInvestment = (type) => {
    return investments[type]?.[investments[type]?.length - 1]
  }

  const getCurrentDeposit = (type) => {
    return investments[type]?.reduce((total, inv) => total + inv.amount, 0) || 0
  }

  const getTotalInvestment = () => {
    const lumpSumTotal = getCurrentDeposit("lumpSum")
    const sipTotal = getCurrentDeposit("sip")
    return lumpSumTotal + sipTotal
  }

  const getTotalReturns = () => {
    const lumpSumReturns = investments.lumpSum?.reduce((total, inv) => total + calculateReturns(inv), 0) || 0
    const sipReturns = investments.sip?.reduce((total, inv) => total + calculateReturns(inv), 0) || 0
    return lumpSumReturns + sipReturns
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <ArrowLeft className="h-6 w-6 text-gray-800" />
              </button>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">Mutual Funds</h1>
                <Building2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Month 6 / ∞</p>
              <p className="text-xl font-bold text-gray-800">Balance ${balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-6 bg-purple-100 rounded-lg">
              <div className="text-4xl font-bold text-purple-700 mb-2">${getTotalInvestment().toFixed(2)}</div>
              <div className="text-sm text-purple-600">Total Investment</div>
              <div className="text-lg font-semibold text-purple-700 mt-2">${getTotalReturns().toFixed(2)}</div>
              <div className="text-sm text-purple-600">Total Returns</div>
            </div>
            <div className="p-6 bg-purple-100 rounded-lg">
              <div className="text-xl font-semibold text-purple-700 mb-4">Your Deposits</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-700">${getCurrentDeposit("lumpSum").toFixed(2)}</p>
                    <p className="text-sm text-purple-600">Lump-Sum</p>
                  </div>
                  <button
                    onClick={() => setActiveView("lumpSum")}
                    className="px-3 py-1 bg-white text-purple-700 rounded-md hover:bg-purple-200"
                  >
                    View
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-700">${getCurrentDeposit("sip").toFixed(2)}</p>
                    <p className="text-sm text-purple-600">SIP</p>
                  </div>
                  <button
                    onClick={() => setActiveView("sip")}
                    className="px-3 py-1 bg-white text-purple-700 rounded-md hover:bg-purple-200"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex mb-4">
              <button
                onClick={() => setActiveView("all")}
                className={`flex-1 py-2 ${activeView === "all" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"} rounded-l-md`}
              >
                All
              </button>
              <button
                onClick={() => setActiveView("lumpSum")}
                className={`flex-1 py-2 ${activeView === "lumpSum" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                Lump-Sum
              </button>
              <button
                onClick={() => setActiveView("sip")}
                className={`flex-1 py-2 ${activeView === "sip" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"} rounded-r-md`}
              >
                SIP
              </button>
            </div>
            {activeView === "all" && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Learn About Mutual Funds</h2>
                <p className="text-gray-600 mb-4">
                  Mutual funds pool money from multiple investors to invest in a diversified portfolio of stocks, bonds,
                  or other securities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveView("lumpSum")}
                    className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Start Lump-Sum Investment
                  </button>
                  <button
                    onClick={() => setActiveView("sip")}
                    className="w-full py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Start SIP Investment
                  </button>
                </div>
              </div>
            )}
            {activeView === "lumpSum" && (
              <LumpSumView
                balance={balance}
                onDeposit={(amount) => handleDeposit("lumpSum", amount)}
                onWithdraw={(amount) => handleWithdraw("lumpSum", amount)}
                currentDeposit={getCurrentDeposit("lumpSum")}
                investment={getCurrentInvestment("lumpSum")}
              />
            )}
            {activeView === "sip" && (
              <SIPView
                balance={balance}
                onDeposit={(amount) => {
                  const newInvestment = {
                    ...getCurrentInvestment("sip"),
                    installments: (getCurrentInvestment("sip")?.installments || 0) + 1,
                  }
                  handleDeposit("sip", amount, newInvestment)
                }}
                onWithdraw={(amount) => handleWithdraw("sip", amount)}
                onStop={handleStopSIP}
                currentDeposit={getCurrentDeposit("sip")}
                investment={getCurrentInvestment("sip")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Dashboard = ({ userData }) => {
  const [balance, setBalance] = useState(getBalance())
  const [selectedView, setSelectedView] = useState(null)

  const handleUpdateBalance = (newBalance) => {
    setBalance(newBalance)
    setBalance(newBalance)
  }

  if (!userData) {
    return <div className="text-gray-800">Loading user data...</div>
  }

  return (
    <>
      {selectedView === "MutualFunds" ? (
        <MutualFundsView
          balance={balance}
          onClose={() => setSelectedView(null)}
          onUpdateBalance={handleUpdateBalance}
        />
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-blue-800 border-b pb-4">Welcome, {userData.name}!</h1>
          
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <Building2 className="h-6 w-6 text-blue-600" />
              </span>
              Your Account Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Name:</span> {userData.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Date of Birth:</span> {userData.dateOfBirth}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Gender:</span> {userData.gender}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Marital Status:</span> {userData.maritalStatus}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Nationality:</span> {userData.nationality}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Occupation:</span> {userData.occupationType}
                </p>
                {userData.occupationType === "Service" && (
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Service Type:</span> {userData.occupationDetails}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-blue-900">Current Balance</h2>
            <p className="text-4xl font-bold text-green-700">${balance.toFixed(2)}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Investment Options</h2>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => setSelectedView("FD/RD")}
                className="p-6 border rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all transform hover:scale-105 flex flex-col items-center shadow-sm hover:shadow-md"
              >
                <FaMoneyBillWave className="text-5xl mb-4 text-yellow-600" />
                <span className="text-yellow-900 font-medium text-center">Fixed Deposit / Recurring Deposit</span>
              </button>
              <button
                onClick={() => setSelectedView("MutualFunds")}
                className="p-6 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-all transform hover:scale-105 flex flex-col items-center shadow-sm hover:shadow-md"
              >
                <FaChartLine className="text-5xl mb-4 text-blue-600" />
                <span className="text-blue-900 font-medium">Mutual Funds</span>
              </button>
              <button
                onClick={() => setSelectedView("Bonds")}
                className="p-6 border rounded-lg bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 flex flex-col items-center shadow-sm hover:shadow-md"
              >
                <FaFileContract className="text-5xl mb-4 text-green-600" />
                <span className="text-green-900 font-medium">Bonds</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const App = () => {
  const [isNewUser, setIsNewUser] = useState(true)
  const [userData, setUserDataState] = useState(null)

  useEffect(() => {
    const checkUserStatus = () => {
      const isNew = isFirstTimeUser()
      setIsNewUser(isNew)
      if (!isNew) {
        const data = getUserData()
        setUserDataState(data)
      }
    }

    checkUserStatus()
  }, [])

  const handleRegistrationComplete = (formData) => {
    setUserData(formData)
    setUserDataState(formData)
    setIsNewUser(false)
    setBalance(100000) // Set initial balance
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      {isNewUser ? (
        <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
      ) : (
        <Dashboard userData={userData} />
      )}
    </main>
  )
}

export default App
