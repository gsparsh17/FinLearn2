import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { calculateReturns } from "../utils/userUtils"

export default function SIPView({ balance, onDeposit, onWithdraw, onStop, currentDeposit, investment }) {
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mutual Funds (SIP)</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Deposit</span>
          <span className="font-semibold">${currentDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Deposited amount</span>
          <span className="font-semibold">${currentDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Return %</span>
          <span className={`font-semibold ${returnPercentage < 0 ? "text-red-500" : "text-green-500"}`}>
            {returnPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deposited On</span>
          <span className="font-semibold">
            {investment ? new Date(investment.depositDate).toLocaleDateString() : "-"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Returns</span>
          <span className={`font-semibold ${currentReturns < currentDeposit ? "text-red-500" : "text-green-500"}`}>
            ${currentReturns.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current NAV</span>
          <span className="font-semibold">${currentNAV}</span>
        </div>

        <div className="pt-4 border-t">
          {currentDeposit === 0 ? (
            <div className="flex gap-4 mb-4">
              <Input
                type="number"
                placeholder="Enter monthly amount"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
              />
              <Button
                onClick={handleStartSIP}
                disabled={
                  !monthlyAmount || Number.parseFloat(monthlyAmount) <= 0 || Number.parseFloat(monthlyAmount) > balance
                }
                className="bg-purple-500 hover:bg-purple-600"
              >
                Start SIP
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={handleStop}>
                Stop
                <span className="text-xs block">(Change to Lump-Sum)</span>
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleWithdraw}>
                Withdraw (${currentReturns.toFixed(2)})
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

