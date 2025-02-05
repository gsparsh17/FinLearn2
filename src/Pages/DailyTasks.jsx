import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, DollarSign, PiggyBank, CreditCard, Wallet, BarChart } from "lucide-react"
import { motion } from "framer-motion"

const taskIcons = {
  saving: <PiggyBank className="w-5 h-5 text-green-500" />,
  spending: <Wallet className="w-5 h-5 text-red-500" />,
  investing: <BarChart className="w-5 h-5 text-blue-500" />,
  budgeting: <DollarSign className="w-5 h-5 text-yellow-500" />,
  credit: <CreditCard className="w-5 h-5 text-purple-500" />,
}

const DailyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completedTasks, setCompletedTasks] = useState([])

  useEffect(() => {
    fetch("https://task-assigner-p9hf.onrender.com/suggest_financial_tasks/user_2rwCNB4KuUXy9CtYMzCL5my01s8")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        return response.json()
      })
      .then((data) => {
        const parsedTasks = data.suggested_tasks.split("\n\n").map((task) => {
          const [title, ...descriptionParts] = task.split(": ")
          const description = descriptionParts.join(": ").trim()
          const type = title.toLowerCase().match(/saving|spending|investing|budgeting|credit/)?.[0] || "general"
          return { title, description, type }
        })
        setTasks(parsedTasks)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  const toggleTask = (index) => {
    setCompletedTasks((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-5">Error: {error}</div>
  }

  const progress = (completedTasks.length / tasks.length) * 100

  return (
    <div className="h-full bg-[#00364D] p-10 font-cursive">
      <h2 className="text-xl font-bold text-center mb-4 text-[#ffd451]">Daily Financial Quests</h2>
      <Progress value={progress} className="mb-4" />
      <p className="text-center mb-4 text-[#ffd451] font-medium">
        {completedTasks.length} / {tasks.length} tasks completed
      </p>
      <div className="flex flex-col gap-4 h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="shadow-md border-2 border-indigo-200 bg-[#00364D] backdrop-blur hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {taskIcons[task.type]}
                    <h3 className="text-lg font-semibold text-[#ffd451]">{task.title}</h3>
                  </div>
                  <Checkbox checked={completedTasks.includes(index)} onCheckedChange={() => toggleTask(index)} />
                </div>
                <p className="text-sm text-gray-600">{task.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DailyTasks