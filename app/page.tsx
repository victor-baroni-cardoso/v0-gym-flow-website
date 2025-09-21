"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dumbbell, Camera, CreditCard, BarChart3, User, LogOut, Utensils, Bot, Sun, Moon, Activity } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { WorkoutTab } from "@/components/workout-tab"
import { TimelineTab } from "@/components/timeline-tab"
import { PlansTab } from "@/components/plans-tab"
import { StatsDashboard } from "@/components/stats-dashboard"
import { UserProfile } from "@/components/user-profile"
import { DietTab } from "@/components/diet-tab"
import { HealthSyncTab } from "@/components/health-sync-tab"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { LoginScreen } from "@/components/login-screen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function GymFlowApp() {
  const { theme, setTheme } = useTheme()
  const { user, logout, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("treino")

  useEffect(() => {
    // Removed Google Sign-In script as we're using simple auth
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Gym Flow Logo" width={40} height={40} className="object-contain animate-pulse" />
          <span className="text-lg font-medium">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  const isPremium = user.plan === "premium"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Gym Flow Logo" width={40} height={40} className="object-contain" />
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-foreground">Gym Flow</h1>
            </div>

            {/* User Menu and Theme Toggle */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="h-10 w-10"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("perfil")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <TabsList className={`grid w-full mb-6 bg-muted p-1 rounded-lg ${isPremium ? "grid-cols-8" : "grid-cols-5"}`}>
            <TabsTrigger
              value="treino"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Treino</span>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger
              value="planos"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>

            {isPremium && (
              <>
                <TabsTrigger
                  value="dieta"
                  className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
                >
                  <Utensils className="h-4 w-4" />
                  <span className="hidden sm:inline">Dieta</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saude"
                  className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
                >
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Saúde</span>
                </TabsTrigger>
                <TabsTrigger
                  value="fitia"
                  className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
                >
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">FitIA</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="treino" className="mt-0">
            <WorkoutTab />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <TimelineTab />
          </TabsContent>

          <TabsContent value="stats" className="mt-0">
            <StatsDashboard />
          </TabsContent>

          <TabsContent value="perfil" className="mt-0">
            <UserProfile />
          </TabsContent>

          <TabsContent value="planos" className="mt-0">
            <PlansTab />
          </TabsContent>

          {isPremium && (
            <>
              <TabsContent value="dieta" className="mt-0">
                <DietTab />
              </TabsContent>
              <TabsContent value="saude" className="mt-0">
                <HealthSyncTab />
              </TabsContent>
              <TabsContent value="fitia" className="mt-0">
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-secondary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">FitIA Mentor</h3>
                  <p className="text-muted-foreground mb-6">Seu assistente de IA personalizado para fitness</p>
                  <Button
                    onClick={() => window.open("https://gemini.google.com/share/9be81ae9f470", "_blank")}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    Abrir FitIA Mentor
                  </Button>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <GymFlowApp />
    </AuthProvider>
  )
}
