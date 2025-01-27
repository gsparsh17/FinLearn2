"use client"

import { useState } from "react"
import { Building2, BookOpen, Plus, Save, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import FDRDInterface from "../components/fd-rd-interface"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(null)

  if (activeSection === "fd-rd") {
    return <FDRDInterface onBack={() => setActiveSection(null)} />
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-black/20">
        <Button variant="ghost" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save & Quit
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Gems: 0</span>
            <Button size="icon" className="bg-green-600 hover:bg-green-700 h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <BookOpen className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div>Month 1 / 12</div>
          <div>Balance ₹0.00</div>
          <Button variant="ghost" size="icon" className="text-blue-400">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Bank Building Icon */}
        <div className="flex justify-center mb-8">
          <Building2 className="h-24 w-24 text-blue-400" />
        </div>

        {/* Pass Button */}
        <div className="flex justify-center mb-8">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-full">
            PASS
            <span className="text-xs block text-gray-400">To Next Month</span>
          </Button>
        </div>

        {/* Investment Options */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-8">
          <Button
            onClick={() => setActiveSection("fd-rd")}
            className="aspect-square bg-purple-500 hover:bg-purple-600 text-white text-xl rounded-3xl p-8"
          >
            FD/RD
          </Button>
          <Button className="aspect-square bg-purple-500 hover:bg-purple-600 text-white text-xl rounded-3xl p-8">
            Mutual
            <br />
            Funds
          </Button>
          <Button className="aspect-square bg-purple-500 hover:bg-purple-600 text-white text-xl rounded-3xl p-8">
            Bonds
          </Button>
        </div>

        {/* Progress Button */}
        <div className="flex justify-center">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-3 rounded-full">Progress</Button>
        </div>
      </main>
    </div>
  )
}

