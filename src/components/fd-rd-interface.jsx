import { useState } from "react"
import { ArrowLeft, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function FDRDInterface() {
  const [activeTab, setActiveTab] = useState("RD")
  const [amount, setAmount] = useState("0")

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl text-black overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="text-lg font-medium">Month 1 / 12</div>
          <div className="text-lg font-medium">Balance ₹0.00</div>
        </div>

        <div className="p-6">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-semibold">FD/RD</span>
            </div>
          </div>

          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Toggle buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => setActiveTab("FD")}
                  className={`rounded-full px-8 py-2 text-lg ${
                    activeTab === "FD" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-500"
                  }`}
                >
                  FD
                </Button>
                <Button
                  onClick={() => setActiveTab("RD")}
                  className={`rounded-full px-8 py-2 text-lg ${
                    activeTab === "RD" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-500"
                  }`}
                >
                  RD
                </Button>
              </div>

              {activeTab === "FD" ? (
                <>
                  {/* Amount input with All in button */}
                  <div className="flex gap-4 items-center">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-purple-100 border-0 text-lg h-14 rounded-full"
                    />
                    <Button className="bg-purple-600 text-white rounded-2xl h-14 px-6 hover:bg-purple-700">
                      All in
                    </Button>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-4">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-6 text-lg">
                      Deposit
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full py-6 text-lg"
                    >
                      Learn FD
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* RD Content */}
                  <div className="space-y-2">
                    <div className="text-xl font-medium">Amount</div>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-full bg-purple-100 border-0 text-lg h-14 rounded-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xl font-medium">Tenure</div>
                    <Select defaultValue="1year">
                      <SelectTrigger className="w-full bg-purple-100 border-0 text-lg h-14 rounded-full">
                        <SelectValue placeholder="Select tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="3years">3 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-6 text-lg">
                      Sign Up
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full py-6 text-lg"
                    >
                      Learn RD
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right column */}
            <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-16">Your Deposits</h2>
              <p className="text-xl text-center text-purple-900">You Dont Have Any Deposits !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
