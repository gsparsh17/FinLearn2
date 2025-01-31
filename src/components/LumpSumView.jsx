import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function LumpSumView({ balance, onDeposit, onWithdraw, currentDeposit, investment }) {
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
    <Card className="p-6 bg-[#00364d] text-white rounded-2xl shadow-lg border border-[#0078d7]">
      <h2 className="text-3xl font-bold mb-6 text-[#ffd451]">Mutual Funds (Lump)</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-lg">
          <span className="text-[#ffd451]">Initial Amount</span>
          <span className="font-semibold">${currentDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-[#ffd451]">Return %</span>
          <span className={`font-semibold ${returnPercentage < 0 ? "text-red-500" : "text-green-500"}`}>
            {returnPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-[#ffd451]">Deposited On</span>
          <span className="font-semibold">
            {investment ? new Date(investment.depositDate).toLocaleDateString() : "-"}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-[#ffd451]">Current Returns</span>
          <span className={`font-semibold ${currentReturns < currentDeposit ? "text-red-500" : "text-green-500"}`}>
            ${currentReturns.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="text-[#ffd451]">Current NAV</span>
          <span className="font-semibold">${currentNAV}</span>
        </div>

        <div className="pt-4 border-t border-[#0078d7] mt-4">
          {currentDeposit === 0 ? (
            <div className="flex gap-4 mb-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
                className="bg-[#0078d7] text-white border-none p-2 rounded-lg"
              />
              <Button
                onClick={handleDeposit}
                disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > balance}
                className="bg-[#ffd451] text-[#00364d] hover:bg-[#e6c044] px-4 py-2 rounded-lg font-bold"
              >
                Deposit
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
              onClick={handleWithdraw}
            >
              Withdraw (${currentReturns.toFixed(2)})
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

