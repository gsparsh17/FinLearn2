export const isFirstTimeUser = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRegistered") !== "true"
  }
  return true
}

export const setUserRegistered = () => {
  localStorage.setItem("userRegistered", "true")
}

export const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setUserData = (data) => {
  localStorage.setItem("userData", JSON.stringify(data))
}

export const getBalance = () => {
  if (typeof window !== "undefined") {
    const balance = localStorage.getItem("balance")
    return balance ? Number.parseFloat(balance) : 100000
  }
  return 100000
}

export const setBalance = (balance) => {
  localStorage.setItem("balance", balance.toString())
}

export const getInvestments = () => {
  if (typeof window !== "undefined") {
    const investments = localStorage.getItem("investments")
    return investments ? JSON.parse(investments) : {}
  }
  return {}
}

export const setInvestments = (investments) => {
  localStorage.setItem("investments", JSON.stringify(investments))
}

export const calculateReturns = (investment) => {
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
    for (let i = 0; i < monthsDiff; i++) {
      totalReturns += investment.amount * (1 + monthlyRate * (monthsDiff - i))
    }
    return totalReturns
  }
}

