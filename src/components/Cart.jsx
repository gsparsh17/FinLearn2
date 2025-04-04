import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

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

export function Cart({ items, onRemoveItem, userBalance }) {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleRemoveItem = useCallback(
    (id) => {
      onRemoveItem(id)
      const updatedItems = items.filter((item) => item.id !== id)
      saveToLocalStorage("cartItems", updatedItems)
    },
    [items, onRemoveItem],
  )

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700"
        aria-label="Open Cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl text-gray-500 font-bold">Your Cart</h2>
              <p className="text-sm text-gray-500">Balance: ${userBalance.toLocaleString()}</p>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Close Cart"
                className="hover:bg-gray-300 hover:text-black text-black transition-all duration-200 ml-2"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <ScrollArea className="flex-grow p-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${item.price.toLocaleString()} x {item.quantity}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="hover:bg-red-100 hover:text-red-600 text-black transition-all duration-200 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              <p className="text-lg font-bold mb-4">Total: ${totalPrice.toLocaleString()}</p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={items.length === 0 || totalPrice > userBalance}
              >
                {totalPrice > userBalance ? "Insufficient Funds" : "Checkout"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
