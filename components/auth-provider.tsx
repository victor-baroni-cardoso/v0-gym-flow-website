"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  picture: string
  joinDate: string
  plan: "basic" | "premium"
  totalWorkouts: number
  totalCalories: number
}

interface AuthContextType {
  user: User | null
  login: (name: string, email: string) => Promise<void>
  logout: () => void
  loading: boolean
  upgradeToPremium: () => void
  downgradeToBasic: () => void
  updateUserStats: (workouts?: number, calories?: number) => void
  syncToCloud: () => Promise<void>
  syncFromCloud: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CLOUD_STORAGE_KEY = "gym-flow-cloud-data"

const cloudStorage = {
  async save(userId: string, data: any): Promise<void> {
    const cloudData = JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}")
    cloudData[userId] = {
      ...data,
      lastSync: new Date().toISOString(),
      deviceId: navigator.userAgent, // Track device for debugging
    }
    localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(cloudData))
    console.log("[v0] Saved to cloud for user:", userId, data)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },

  async load(userId: string): Promise<any> {
    // Simulate cloud storage retrieval
    await new Promise((resolve) => setTimeout(resolve, 800))
    const cloudData = JSON.parse(localStorage.getItem(CLOUD_STORAGE_KEY) || "{}")
    const userData = cloudData[userId] || null
    console.log("[v0] Loaded from cloud for user:", userId, userData)
    return userData
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("gym-flow-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user && !loading) {
      const autoSync = async () => {
        await syncToCloud()
      }
      autoSync()
    }
  }, [user]) // Updated to use the entire user object

  const login = async (name: string, email: string) => {
    try {
      setLoading(true)

      console.log("[v0] Checking cloud for user:", email)
      const existingCloudUser = await cloudStorage.load(email)

      let newUser: User

      if (existingCloudUser && existingCloudUser.user) {
        console.log("[v0] Restoring user from cloud:", existingCloudUser.user)
        newUser = existingCloudUser.user

        if (existingCloudUser.workouts) {
          localStorage.setItem("gym-flow-workouts", JSON.stringify(existingCloudUser.workouts))
          console.log("[v0] Restored workouts:", existingCloudUser.workouts.length)
        }
        if (existingCloudUser.photos) {
          localStorage.setItem("gym-flow-photos", JSON.stringify(existingCloudUser.photos))
          console.log("[v0] Restored photos:", existingCloudUser.photos.length)
        }
        if (existingCloudUser.meals) {
          localStorage.setItem("gym-flow-meals", JSON.stringify(existingCloudUser.meals))
          console.log("[v0] Restored meals:", existingCloudUser.meals.length)
        }
        if (existingCloudUser.completedWorkouts) {
          localStorage.setItem("gym-flow-completed-workouts", JSON.stringify(existingCloudUser.completedWorkouts))
          console.log("[v0] Restored completed workouts:", existingCloudUser.completedWorkouts.length)
        }
      } else {
        const localUsers = JSON.parse(localStorage.getItem("gym-flow-local-users") || "{}")

        if (localUsers[email]) {
          // User exists locally, use local data and sync to cloud
          newUser = localUsers[email]
          console.log("[v0] Found existing local user, syncing to cloud")
        } else {
          // Completely new user
          newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            picture: "/diverse-user-avatars.png",
            joinDate: new Date().toISOString(),
            plan: "basic",
            totalWorkouts: 0,
            totalCalories: 0,
          }
          console.log("[v0] Created new user:", newUser)

          localUsers[email] = newUser
          localStorage.setItem("gym-flow-local-users", JSON.stringify(localUsers))
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setUser(newUser)
      localStorage.setItem("gym-flow-user", JSON.stringify(newUser))

      setTimeout(() => {
        syncToCloud()
      }, 2000)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("gym-flow-user")
    // localStorage.removeItem("gym-flow-workouts")
    // localStorage.removeItem("gym-flow-photos")
    // localStorage.removeItem("gym-flow-meals")
  }

  const upgradeToPremium = async () => {
    if (user) {
      const updatedUser = { ...user, plan: "premium" as const }
      setUser(updatedUser)
      localStorage.setItem("gym-flow-user", JSON.stringify(updatedUser))

      const localUsers = JSON.parse(localStorage.getItem("gym-flow-local-users") || "{}")
      localUsers[user.email] = updatedUser
      localStorage.setItem("gym-flow-local-users", JSON.stringify(localUsers))

      // Auto-sync to cloud when plan changes
      await syncToCloud()
    }
  }

  const downgradeToBasic = async () => {
    if (user) {
      const updatedUser = { ...user, plan: "basic" as const }
      setUser(updatedUser)
      localStorage.setItem("gym-flow-user", JSON.stringify(updatedUser))

      const localUsers = JSON.parse(localStorage.getItem("gym-flow-local-users") || "{}")
      localUsers[user.email] = updatedUser
      localStorage.setItem("gym-flow-local-users", JSON.stringify(localUsers))

      // Auto-sync to cloud when plan changes
      await syncToCloud()
    }
  }

  const updateUserStats = (workouts?: number, calories?: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        totalWorkouts: workouts !== undefined ? user.totalWorkouts + workouts : user.totalWorkouts,
        totalCalories: calories !== undefined ? user.totalCalories + calories : user.totalCalories,
      }
      setUser(updatedUser)
      localStorage.setItem("gym-flow-user", JSON.stringify(updatedUser))

      const localUsers = JSON.parse(localStorage.getItem("gym-flow-local-users") || "{}")
      localUsers[user.email] = updatedUser
      localStorage.setItem("gym-flow-local-users", JSON.stringify(localUsers))
    }
  }

  const syncToCloud = async () => {
    if (!user) return

    try {
      console.log("[v0] Syncing to cloud for user:", user.email)
      const userData = {
        user,
        workouts: JSON.parse(localStorage.getItem("gym-flow-workouts") || "[]"),
        photos: JSON.parse(localStorage.getItem("gym-flow-photos") || "[]"),
        meals: JSON.parse(localStorage.getItem("gym-flow-meals") || "[]"),
        completedWorkouts: JSON.parse(localStorage.getItem("gym-flow-completed-workouts") || "[]"),
      }

      await cloudStorage.save(user.email, userData)
      console.log("[v0] Successfully synced to cloud")
    } catch (error) {
      console.error("Sync to cloud failed:", error)
    }
  }

  const syncFromCloud = async () => {
    if (!user) return

    try {
      console.log("[v0] Syncing from cloud for user:", user.email)
      const cloudData = await cloudStorage.load(user.email)

      if (cloudData && cloudData.user) {
        // Update user data
        setUser(cloudData.user)
        localStorage.setItem("gym-flow-user", JSON.stringify(cloudData.user))

        const localUsers = JSON.parse(localStorage.getItem("gym-flow-local-users") || "{}")
        localUsers[user.email] = cloudData.user
        localStorage.setItem("gym-flow-local-users", JSON.stringify(localUsers))

        // Update all app data
        if (cloudData.workouts) {
          localStorage.setItem("gym-flow-workouts", JSON.stringify(cloudData.workouts))
        }
        if (cloudData.photos) {
          localStorage.setItem("gym-flow-photos", JSON.stringify(cloudData.photos))
        }
        if (cloudData.meals) {
          localStorage.setItem("gym-flow-meals", JSON.stringify(cloudData.meals))
        }
        if (cloudData.completedWorkouts) {
          localStorage.setItem("gym-flow-completed-workouts", JSON.stringify(cloudData.completedWorkouts))
        }

        console.log("[v0] Successfully synced from cloud")
      }
    } catch (error) {
      console.error("Sync from cloud failed:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        upgradeToPremium,
        downgradeToBasic,
        updateUserStats,
        syncToCloud,
        syncFromCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
