"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Apple,
  Activity,
  Heart,
  Footprints,
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdBanner } from "@/components/ad-banner"

interface HealthData {
  steps: number
  calories: number
  heartRate: number
  activeMinutes: number
  distance: number
  lastSync: string
}

interface HealthApp {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  data?: HealthData
  color: string
}

export function HealthSyncTab() {
  const { toast } = useToast()
  const [syncing, setSyncing] = useState<string | null>(null)
  const [healthApps, setHealthApps] = useState<HealthApp[]>([
    {
      id: "samsung",
      name: "Samsung Health",
      icon: <Smartphone className="h-6 w-6" />,
      connected: false,
      color: "bg-blue-500",
    },
    {
      id: "apple",
      name: "Apple Saúde",
      icon: <Apple className="h-6 w-6" />,
      connected: false,
      color: "bg-gray-800",
    },
    {
      id: "google",
      name: "Google Fit",
      icon: <Activity className="h-6 w-6" />,
      connected: false,
      color: "bg-green-500",
    },
  ])

  const connectApp = async (appId: string) => {
    setSyncing(appId)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock health data
    const mockData: HealthData = {
      steps: Math.floor(Math.random() * 10000) + 5000,
      calories: Math.floor(Math.random() * 500) + 200,
      heartRate: Math.floor(Math.random() * 40) + 60,
      activeMinutes: Math.floor(Math.random() * 60) + 30,
      distance: Math.floor(Math.random() * 5) + 2,
      lastSync: new Date().toISOString(),
    }

    setHealthApps((prev) => prev.map((app) => (app.id === appId ? { ...app, connected: true, data: mockData } : app)))

    setSyncing(null)

    toast({
      title: "Conectado com sucesso!",
      description: `${healthApps.find((app) => app.id === appId)?.name} foi conectado e sincronizado.`,
    })
  }

  const disconnectApp = (appId: string) => {
    setHealthApps((prev) => prev.map((app) => (app.id === appId ? { ...app, connected: false, data: undefined } : app)))

    toast({
      title: "Desconectado",
      description: `${healthApps.find((app) => app.id === appId)?.name} foi desconectado.`,
      variant: "destructive",
    })
  }

  const syncData = async (appId: string) => {
    setSyncing(appId)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update with new mock data
    const updatedData: HealthData = {
      steps: Math.floor(Math.random() * 10000) + 5000,
      calories: Math.floor(Math.random() * 500) + 200,
      heartRate: Math.floor(Math.random() * 40) + 60,
      activeMinutes: Math.floor(Math.random() * 60) + 30,
      distance: Math.floor(Math.random() * 5) + 2,
      lastSync: new Date().toISOString(),
    }

    setHealthApps((prev) => prev.map((app) => (app.id === appId ? { ...app, data: updatedData } : app)))

    setSyncing(null)

    toast({
      title: "Dados sincronizados!",
      description: "Seus dados de saúde foram atualizados com sucesso.",
    })
  }

  const connectedApps = healthApps.filter((app) => app.connected)
  const totalSteps = connectedApps.reduce((sum, app) => sum + (app.data?.steps || 0), 0)
  const totalCalories = connectedApps.reduce((sum, app) => sum + (app.data?.calories || 0), 0)
  const avgHeartRate =
    connectedApps.length > 0
      ? Math.round(connectedApps.reduce((sum, app) => sum + (app.data?.heartRate || 0), 0) / connectedApps.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Sincronização de Saúde</h2>
        <p className="text-muted-foreground">Conecte seus aplicativos de saúde para um acompanhamento completo</p>
      </div>

      {/* Summary Cards */}
      {connectedApps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Footprints className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSteps.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Passos Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCalories}</p>
                  <p className="text-sm text-muted-foreground">Calorias Queimadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgHeartRate}</p>
                  <p className="text-sm text-muted-foreground">BPM Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Health Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthApps.map((app) => (
          <Card key={app.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${app.color} rounded-full text-white`}>{app.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {app.connected ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Badge variant="secondary" className="text-xs">
                            Conectado
                          </Badge>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            Desconectado
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {app.connected && app.data ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Passos</span>
                      <span className="font-medium">{app.data.steps.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Calorias</span>
                      <span className="font-medium">{app.data.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Frequência Cardíaca</span>
                      <span className="font-medium">{app.data.heartRate} BPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Minutos Ativos</span>
                      <span className="font-medium">{app.data.activeMinutes} min</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Última sincronização:</span>
                    <span>{new Date(app.data.lastSync).toLocaleTimeString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncData(app.id)}
                      disabled={syncing === app.id}
                      className="flex-1"
                    >
                      {syncing === app.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Sincronizar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => disconnectApp(app.id)}>
                      Desconectar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">Conecte para sincronizar seus dados de saúde</p>
                  <Button onClick={() => connectApp(app.id)} disabled={syncing === app.id} className="w-full">
                    {syncing === app.id ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    {syncing === app.id ? "Conectando..." : "Conectar"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dicas de Sincronização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Sincronização Automática</p>
              <p className="text-sm text-muted-foreground">
                Os dados são sincronizados automaticamente a cada hora quando conectado
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Histórico Completo</p>
              <p className="text-sm text-muted-foreground">
                Mantenha um registro completo de sua atividade física e saúde
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">Privacidade Garantida</p>
              <p className="text-sm text-muted-foreground">Seus dados de saúde são criptografados e mantidos seguros</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Banner */}
      <AdBanner />
    </div>
  )
}
