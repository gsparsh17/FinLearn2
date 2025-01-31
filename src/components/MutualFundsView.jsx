import { useState, useEffect } from "react"
import { ArrowLeft, Building2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LumpSumView from "./LumpSumView"
import SIPView from "./SIPView"
// import { getInvestments, setInvestments, calculateReturns } from "./userUtils"

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

export default function MutualFundsView({ onBack }) {
  const [activeView, setActiveView] = useState("all")
  const [investments, setInvestmentsState] = useState({})
  const [balance, setBalanceState] = useState(0) // Initialize balance state

  useEffect(() => {
    const savedInvestments = getInvestments()
    setInvestmentsState(savedInvestments)

    const initialBalance = getBalance() // Get balance from localStorage
    setBalanceState(initialBalance) // Set state
  }, [])

  const onUpdateBalance = (newBalance) => {
    setBalanceState(newBalance)
    setBalance(newBalance) // Save to localStorage
  }

  const handleDeposit = (type, amount) => {
    const newInvestment = {
      type,
      amount,
      depositDate: new Date().toISOString(),
      returns: 0,
      nav: 49.94,
      isStopped: false,
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
      const totalInvested = newInvestments.sip.reduce((total, inv) => total + inv.amount, 0)

      // Calculate total returns
      const totalReturns = newInvestments.sip.reduce((total, inv) => total + calculateReturns(inv), 0)

      // Create a new lump sum investment with the total amount and returns
      const newLumpSum = {
        type: "lumpSum",
        amount: totalReturns,
        depositDate: new Date().toISOString(),
        returns: totalReturns - totalInvested,
        nav: lastSIP.nav,
        isStopped: false,
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
    <div className="min-h-screen bg-[#00364d] text-white p-4">
      <Card className="max-w-4xl mx-auto bg-[#0078d7] border-[#ffd451] shadow-lg shadow-[#ffd451]/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-6 w-6 text-[#ffd451]" />
            </Button>
            <h1 className="text-2xl font-bold text-[#ffd451] flex items-center gap-2">
              Mutual Funds <Building2 className="h-6 w-6" />
            </h1>
            <div className="text-right">
              <p className="text-sm">Month 6 / ∞</p>
              <p className="text-xl font-bold">Balance ${balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-6 bg-[#0078d7] text-white rounded-xl border border-[#ffd451] shadow-md">
              <div className="text-4xl font-bold mb-2">${getTotalInvestment().toFixed(2)}</div>
              <div className="text-sm">Total Investment</div>
              <div className="text-lg font-semibold mt-2">${getTotalReturns().toFixed(2)}</div>
              <div className="text-sm">Total Returns</div>
            </Card>
            <Card className="p-6 bg-[#0078d7] text-white rounded-xl border border-[#ffd451] shadow-md">
              <div className="text-xl font-semibold mb-4">Your Deposits</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg">${getCurrentDeposit("lumpSum").toFixed(2)}</p>
                  <Button variant="outline" onClick={() => setActiveView("lumpSum")}>View</Button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg">${getCurrentDeposit("sip").toFixed(2)}</p>
                  <Button variant="outline" onClick={() => setActiveView("sip")}>View</Button>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid grid-cols-3 bg-[#0078d7] border border-[#ffd451] text-white rounded-lg mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lumpSum">Lump-Sum</TabsTrigger>
              <TabsTrigger value="sip">SIP</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card className="p-6 bg-[#00364d] text-white border border-[#ffd451]">
                <h2 className="text-xl font-semibold mb-4">Learn About Mutual Funds</h2>
                <p className="mb-4">Mutual funds pool money from multiple investors into a diversified portfolio.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="w-full bg-[#ffd451] text-[#00364d] hover:bg-[#ffcc00]" onClick={() => setActiveView("lumpSum")}>Start Lump-Sum</Button>
                  <Button className="w-full bg-[#ffd451] text-[#00364d] hover:bg-[#ffcc00]" onClick={() => setActiveView("sip")}>Start SIP</Button>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="lumpSum">
              <LumpSumView balance={balance} currentDeposit={getCurrentDeposit("lumpSum")} onDeposit={handleDeposit} onWithdraw={handleWithdraw} investment={getCurrentInvestment("lumpSum")} />
            </TabsContent>
            <TabsContent value="sip">
              <SIPView balance={balance} currentDeposit={getCurrentDeposit("sip")} onDeposit={handleDeposit} onWithdraw={handleWithdraw} onStop={handleStopSIP} investment={getCurrentInvestment("sip")} />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

