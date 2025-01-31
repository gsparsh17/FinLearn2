import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, X } from "lucide-react"
import { Cart } from "../components/Cart"

// Add these functions at the top of the file, outside the component
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const loadFromLocalStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key)
  if (saved) {
    return JSON.parse(saved)
  }
  return defaultValue
}

// Sample product data with network images
const products = [
  {
    id: 1,
    name: "Tesla Model S",
    description: "Luxury electric sedan with advanced autopilot",
    price: 79990,
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    name: "iPhone 13 Pro",
    description: "Latest iPhone with pro camera system",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
  },
  {
    id: 3,
    name: "MacBook Pro",
    description: "Powerful laptop for professionals",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
  },
  {
    id: 4,
    name: "Sony WH-1000XM4",
    description: "Industry-leading noise cancelling headphones",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
  },
  {
    id: 5,
    name: "Samsung QLED 8K TV",
    description: "85-inch QLED 8K Smart TV with AI upscaling",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 6,
    name: "Xbox Series X",
    description: "Next-gen gaming console for immersive gameplay",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80",
  },
  {
    id: 7,
    name: "Specialized S-Works Tarmac SL7",
    description: "High-performance road bike for professional cyclists",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80",
  },
  {
    id: 8,
    name: "Rolex Daytona",
    description: "Iconic luxury chronograph watch",
    price: 29950,
    image:
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 9,
    name: "Leica M10-R",
    description: "High-resolution digital rangefinder camera",
    price: 8295,
    image:
      "https://images.unsplash.com/photo-1621522163368-e8e14b4f8686?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 10,
    name: "Hermès Birkin Bag",
    description: "Iconic luxury handbag",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1628149455678-16f37bc392f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  },
  {
    id: 11,
    name: "Bowers & Wilkins Nautilus",
    description: "High-end loudspeakers with unique design",
    price: 72000,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 12,
    name: "La Cornue Grand Palais 180",
    description: "Luxury French range cooker",
    price: 59995,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 13,
    name: "Hastens Vividus Bed",
    description: "World's most exclusive bed",
    price: 390000,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 14,
    name: "Steinway & Sons Model D Concert Grand Piano",
    description: "The pinnacle of concert grand pianos",
    price: 175000,
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 15,
    name: "Patek Philippe Grandmaster Chime",
    description: "Most complicated wristwatch ever made",
    price: 31000000,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
  },
  {
    id: 16,
    name: "Bugatti La Voiture Noire",
    description: "One-off hypercar, the most expensive new car ever sold",
    price: 18700000,
    image:
      "https://images.unsplash.com/photo-1566024164372-0281f1133aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
  },
  {
    id: 17,
    name: "Gulfstream G700",
    description: "Ultra-long-range business jet",
    price: 75000000,
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 18,
    name: "Azimut Grande Trideck",
    description: "Luxury yacht with three decks",
    price: 30000000,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 19,
    name: "Richard Mille RM 56-02 Sapphire",
    description: "Ultra-luxury sapphire crystal watch",
    price: 2000000,
    image:
      "https://images.unsplash.com/photo-1548169874-53e85f753f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1010&q=80",
  },
  {
    id: 20,
    name: "Rolls-Royce Boat Tail",
    description: "Bespoke luxury car with nautical design elements",
    price: 28000000,
    image:
      "https://images.unsplash.com/photo-1631295868223-63265b40d9cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  },
  {
    id: 21,
    name: "Graff Diamonds Hallucination Watch",
    description: "Diamond-encrusted watch with over 110 carats of rare colored diamonds",
    price: 55000000,
    image:
      "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  },
  {
    id: 22,
    name: "Bombardier Global 7500",
    description: "Ultra-long-range business jet with four living spaces",
    price: 73000000,
    image:
      "https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 23,
    name: "Koenigsegg Jesko Absolut",
    description: "Fastest Koenigsegg ever made, with a theoretical top speed of 330 mph",
    price: 3400000,
    image:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 24,
    name: "Feadship Superyacht",
    description: "Custom-built 110-meter superyacht with helipad and swimming pool",
    price: 150000000,
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 25,
    name: "Cartier Necklace",
    description: "One-of-a-kind diamond and emerald necklace",
    price: 20000000,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 26,
    name: "Antilia",
    description: "27-story skyscraper private home in Mumbai",
    price: 1000000000,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    id: 27,
    name: "Da Vinci's Salvator Mundi",
    description: "The most expensive painting ever sold",
    price: 450300000,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 28,
    name: "Tiffany & Co. Diamond Necklace",
    description: "128.54-carat yellow diamond necklace",
    price: 30000000,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 29,
    name: "Airbus ACJ350 XWB",
    description: "Ultra-long range private jet based on the A350",
    price: 317000000,
    image:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  },
  {
    id: 30,
    name: "Fabergé Egg",
    description: "Rare, jeweled egg created by the House of Fabergé",
    price: 33000000,
    image:
      "https://images.unsplash.com/photo-1619450565660-2a9d4b5a8d8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  },
  {
    id: 31,
    name: "Chopard 201-Carat Watch",
    description: "Watch adorned with 874 diamonds totaling 201 carats",
    price: 25000000,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
  },
  {
    id: 32,
    name: "Pagani Huayra Roadster BC",
    description: "Limited edition open-top hypercar",
    price: 3500000,
    image:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 33,
    name: "Baccarat Les Larmes Sacrées de Thebes",
    description: "World's most expensive perfume bottle",
    price: 6800000,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=704&q=80",
  },
  {
    id: 34,
    name: "Vacheron Constantin 57260",
    description: "Most complicated mechanical watch ever made",
    price: 8000000,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80",
  },
]

// EMI calculation function
const calculateEMI = (price, months) => {
  const interestRate = 0.1 // 10% annual interest rate
  const monthlyRate = interestRate / 12
  const emi = (price * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return emi.toFixed(2)
}

export default function EcommercePage() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [emiMonths, setEmiMonths] = useState(3)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cartItems, setCartItems] = useState(() => loadFromLocalStorage("cartItems", []))
  const [userBalance, setUserBalance] = useState(() => loadFromLocalStorage("userBalance", 1000000))
  const [insufficientFunds, setInsufficientFunds] = useState(false)

  useEffect(() => {
    // Load saved data on component mount
    setCartItems(loadFromLocalStorage("cartItems", []))
    setUserBalance(loadFromLocalStorage("userBalance", 1000000))
  }, [])

  const handleConfirmPurchase = useCallback(() => {
    if (selectedProduct && userBalance >= selectedProduct.price) {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.find((item) => item.id === selectedProduct.id)
          ? prevItems.map((item) => (item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item))
          : [
              ...prevItems,
              { id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, quantity: 1 },
            ]
        saveToLocalStorage("cartItems", updatedItems)
        return updatedItems
      })
      setUserBalance((prevBalance) => {
        const newBalance = prevBalance - selectedProduct.price
        saveToLocalStorage("userBalance", newBalance)
        return newBalance
      })
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedProduct(null)
      }, 3000)
    } else {
      setInsufficientFunds(true)
      setTimeout(() => {
        setInsufficientFunds(false)
      }, 3000)
    }
  }, [selectedProduct, userBalance])

  const handleRemoveFromCart = useCallback((id) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id)
      saveToLocalStorage("cartItems", updatedItems)
      return updatedItems
    })
  }, [])

  useEffect(() => {
    const totalSpent = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const newBalance = 1000000 - totalSpent
    setUserBalance(newBalance)
    saveToLocalStorage("userBalance", newBalance)
  }, [cartItems])

  return (
    <div className="container mx-auto p-4">
      <div className=" top-0 bg-blue z-10 py-4 mb-8 border-b">
        <h1 className="text-3xl font-bold mb-4 text-center">Luxury E-commerce Store with EMI Options</h1>
        <p className="text-xl font-semibold text-center">
          Your Balance: <span className="text-green-600">${userBalance.toLocaleString()}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
        {products.map((product) => (
           <Card
           key={product.id}
           className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-yellow-300 shadow-lg shadow-black"
         >
           <CardHeader className="p-4">
             <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
               <img
                 src={product.image || "/placeholder.svg"}
                 alt={product.name}
                 className="object-cover w-full h-full"
               />
             </div>
             <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
             <CardDescription className="line-clamp-2">{product.description}</CardDescription>
           </CardHeader>
           <CardContent className="p-4">
             <p className="text-2xl font-bold text-green-600">${product.price.toLocaleString()}</p>
           </CardContent>
           <CardFooter className="flex flex-col space-y-4">
             <Button onClick={() => setSelectedProduct(product)} className="w-full bg-blue-600 hover:bg-blue-700">
               Buy with EMI
             </Button>
             <p className="text-sm text-gray-500 text-center">EMI from ${calculateEMI(product.price, 12)}/mo</p>
           </CardFooter>
         </Card>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-[600px]"
            >
              <Card className="w-full max-w-2xl">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-xl font-bold mb-1">{selectedProduct.name}</CardTitle>
                  <CardDescription className="text-base">Choose your EMI plan</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Select onValueChange={(value) => setEmiMonths(Number.parseInt(value))} className="w-full">
                    <SelectTrigger className="w-full text-base p-3 h-12">
                      <SelectValue placeholder="Select EMI duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 6, 9, 12, 18, 24].map((months) => (
                        <SelectItem key={months} value={months.toString()} className="text-base py-2 px-3">
                          {months} months
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <p className="text-lg font-semibold mb-2">
                      Monthly EMI: <span className="text-green-600">${calculateEMI(selectedProduct.price, emiMonths)}</span>
                    </p>
                    <p className="text-base text-gray-600">
                      Total: $
                      {(Number.parseFloat(calculateEMI(selectedProduct.price, emiMonths)) * emiMonths).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 bg-gray-50 border-t gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedProduct(null)} 
                    className="text-base px-6 py-2 h-12 flex-1 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmPurchase} 
                    className="bg-green-600 hover:bg-green-700 text-base px-6 py-2 h-12 flex-1"
                  >
                    Confirm Purchase
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {insufficientFunds && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white rounded-lg p-6 shadow-2xl text-center w-[400px]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
            </motion.div>
            <h2 className="text-xl font-bold mb-3">Insufficient Funds</h2>
            <p className="text-gray-600">Sorry, you don't have enough balance to make this purchase.</p>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          >
            <div className="bg-white rounded-lg p-6 shadow-2xl text-center w-[400px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              </motion.div>
              <h2 className="text-xl font-bold mb-3">Purchase Successful!</h2>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been confirmed and added to your cart.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart items={cartItems} onRemoveItem={handleRemoveFromCart} userBalance={userBalance} />
    </div>
  )
}
