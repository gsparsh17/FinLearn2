import { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function FDRDInterface({ onBack }) {
  const [activeTab, setActiveTab] = useState("RD");
  const [amount, setAmount] = useState("0");

  return (
      <div className="max-w-4xl mx-auto bg-[#0078d7] rounded-3xl text-black overflow-hidden font-cursive text-bold">

        <div className="p-6">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={onBack}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-[#0078d7]" />
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
                    activeTab === "FD"
                      ? "bg-[#00364d] text-white"
                      : "bg-[#ffd451] text-[#00364d]"
                  }`}
                >
                  FD
                </Button>
                <Button
                  onClick={() => setActiveTab("RD")}
                  className={`rounded-full px-8 py-2 text-lg ${
                    activeTab === "RD"
                      ? "bg-[#00364d] text-white"
                      : "bg-[#ffd451] text-[#00364d]"
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
                      className="flex-1 bg-[#ffd451] border-0 text-lg h-14 rounded-full text-black"
                    />
                    <Button className="bg-[#00364d] text-white rounded-2xl h-14 px-6 hover:bg-[#005bb5]">
                      All in
                    </Button>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-4">
                    <Button className="w-full bg-[#00364d] hover:bg-[#005bb5] text-white rounded-full py-6 text-lg">
                      Deposit
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full bg-[#ffd451] hover:bg-[#ffc620] text-[#00364d] rounded-full py-6 text-lg"
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
                      className="w-full bg-[#ffd451] border-0 text-lg h-14 rounded-full text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xl font-medium">Tenure</div>
                    <Select defaultValue="1year">
                      <SelectTrigger className="w-full bg-[#ffd451] border-0 text-lg h-14 rounded-full">
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
                    <Button className="w-full bg-[#00364d] hover:bg-[#005bb5] text-white rounded-full py-6 text-lg">
                      Sign Up
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full bg-[#ffd451] hover:bg-[#ffc620] text-[#00364d] rounded-full py-6 text-lg"
                    >
                      Learn RD
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Right column */}
            <div className="bg-[#0078d7] rounded-3xl p-8 text-black">
              <h2 className="text-2xl font-semibold mb-16">Your Deposits</h2>
              <p className="text-xl text-center text-[#00364d]">You Don't Have Any Deposits!</p>
            </div>
          </div>
        </div>
      </div>
  );
}
