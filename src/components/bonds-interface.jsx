"use client"

import { ArrowLeft, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function BondCard({ type, amount, lockIn, interest, incomeType }) {
  return (
    <Button
      variant="ghost"
      className="flex flex-col items-center bg-purple-400 hover:bg-purple-500 text-white rounded-3xl p-6 h-auto"
    >
      <div className="text-xl font-semibold mb-2">{type}</div>
      <div className="text-2xl font-bold mb-2">{amount}</div>
      <div className="text-sm mb-1">{lockIn}</div>
      <div className="text-sm mb-1">{interest}</div>
      <div className="text-sm">{incomeType}</div>
    </Button>
  )
}

export default function BondsInterface({ onBack }) {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl text-black overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="text-lg font-medium">Month 1 / 12</div>
          <div className="text-lg font-medium">Balance ₹0.00</div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={onBack}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-semibold">Bonds</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <BondCard
                  type="Municipal"
                  amount="₹2L"
                  lockIn="Lock-In 2 Yrs"
                  interest="Interest 9 % p.a"
                  incomeType="Monthly Income"
                />
                <BondCard
                  type="Corporate"
                  amount="₹15L"
                  lockIn="Lock-In 5 Yrs"
                  interest="Interest 12 % p.a"
                  incomeType="Monthly Income"
                />
                <BondCard
                  type="High Yield"
                  amount="₹50L"
                  lockIn="Lock-In 8 Yrs"
                  interest="Interest 18 % p.a"
                  incomeType="Monthly Income"
                />
                <BondCard
                  type="Municipal"
                  amount="₹2L"
                  lockIn="Lock-In 2 Yrs"
                  interest="Interest 10 % p.a"
                  incomeType="Yearly Income"
                />
                <BondCard
                  type="Corporate"
                  amount="₹15L"
                  lockIn="Lock-In 5 Yrs"
                  interest="Interest 15 % p.a"
                  incomeType="Yearly Income"
                />
                <BondCard
                  type="High Yield"
                  amount="₹50L"
                  lockIn="Lock-In 8 Yrs"
                  interest="Interest 20 % p.a"
                  incomeType="Yearly Income"
                />
              </div>

              <Button
                variant="ghost"
                className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full py-6 text-lg"
              >
                Learn
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-16">Your Bonds</h2>
              <p className="text-xl text-center text-purple-900">You Dont Have Any Bonds !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
