import { useState, useEffect } from "react"
import { ArrowLeft, Building2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LumpSumView from "./LumpSumView"
import SIPView from "./SIPView"
import { getInvestments, setInvestments, calculateReturns } from "../utils/userUtils"

export default function MutualFundsView({ balance, onClose, onUpdateBalance }) {
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
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Mutual Funds</h1>
                <Building2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Month 6 / ∞</p>
              <p className="text-xl font-bold">Balance ${balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-6 bg-purple-100">
              <div className="text-4xl font-bold text-purple-700 mb-2">${getTotalInvestment().toFixed(2)}</div>
              <div className="text-sm text-purple-600">Total Investment</div>
              <div className="text-lg font-semibold text-purple-700 mt-2">${getTotalReturns().toFixed(2)}</div>
              <div className="text-sm text-purple-600">Total Returns</div>
            </Card>
            <Card className="p-6 bg-purple-100">
              <div className="text-xl font-semibold text-purple-700 mb-4">Your Deposits</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-700">${getCurrentDeposit("lumpSum").toFixed(2)}</p>
                    <p className="text-sm text-purple-600">Lump-Sum</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView("lumpSum")}>
                    View
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-700">${getCurrentDeposit("sip").toFixed(2)}</p>
                    <p className="text-sm text-purple-600">SIP</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView("sip")}>
                    View
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lumpSum">Lump-Sum</TabsTrigger>
              <TabsTrigger value="sip">SIP</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Learn About Mutual Funds</h2>
                <p className="text-gray-600 mb-4">
                  Mutual funds pool money from multiple investors to invest in a diversified portfolio of stocks, bonds,
                  or other securities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={() => setActiveView("lumpSum")}>
                    Start Lump-Sum Investment
                  </Button>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={() => setActiveView("sip")}>
                    Start SIP Investment
                  </Button>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="lumpSum">
              <LumpSumView
                balance={balance}
                onDeposit={(amount) => handleDeposit("lumpSum", amount)}
                onWithdraw={(amount) => handleWithdraw("lumpSum", amount)}
                currentDeposit={getCurrentDeposit("lumpSum")}
                investment={getCurrentInvestment("lumpSum")}
              />
            </TabsContent>
            <TabsContent value="sip">
              <SIPView
                balance={balance}
                onDeposit={(amount) => handleDeposit("sip", amount)}
                onWithdraw={(amount) => handleWithdraw("sip", amount)}
                onStop={handleStopSIP}
                currentDeposit={getCurrentDeposit("sip")}
                investment={getCurrentInvestment("sip")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

