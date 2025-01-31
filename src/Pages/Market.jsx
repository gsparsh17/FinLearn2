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
      "https://leica-camera.com/sites/default/files/styles/r_media_medium_desktop_4_3/public/pm-33544-20002__M10-R_black.jpg?itok=QGiDGmax",
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
    name: "Bowers & Wilkins Nautilus Spekers",
    description: "High-end loudspeakers with unique design",
    price: 72000,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 12,
    name: "Grand Palais 180 Cooker",
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
    name: "Bugatti",
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
    name: "Rolls-Royce",
    description: "Bespoke luxury car with nautical design elements",
    price: 28000000,
    image:
      "data:image/jpeg;base64,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",
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
      "data:image/jpeg;base64,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",
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
            className="flex flex-col justify-between duration-300 bg-[#ffd451] shadow-lg shadow-black"
          >
            <CardHeader>
              <div className="relative w-full h-48 mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">${product.price.toLocaleString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button onClick={() => setSelectedProduct(product)} className="bg-blue-600 hover:bg-blue-700">
                Buy with EMI
              </Button>
              <p className="text-sm text-gray-500">EMI starts at ${calculateEMI(product.price, 12)}/mo</p>
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
