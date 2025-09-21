"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { Dumbbell, Users, TrendingUp, Award, User, Mail } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export function LoginScreen() {
  const { login, loading } = useAuth()
  const { toast } = useToast()
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      if (!formData.email.trim()) {
        toast({
          title: "Email obrigatório",
          description: "Por favor, insira seu email para fazer login.",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!formData.name.trim() || !formData.email.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha seu nome e email.",
          variant: "destructive",
        })
        return
      }
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      })
      return
    }

    await login(formData.name, formData.email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <Image src="/logo.png" alt="Gym Flow Logo" width={60} height={60} className="object-contain" />
            <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground">Gym Flow</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Transforme seus treinos em resultados</h2>
            <p className="text-lg text-muted-foreground">
              A plataforma completa para monitorar, planejar e evoluir seus treinos na academia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border">
              <div className="p-2 bg-primary/10 rounded-full">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Treinos Personalizados</h3>
                <p className="text-xs text-muted-foreground">Crie e execute seus treinos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border">
              <div className="p-2 bg-secondary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Progresso Visual</h3>
                <p className="text-xs text-muted-foreground">Acompanhe sua evolução</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border">
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Conquistas</h3>
                <p className="text-xs text-muted-foreground">Desbloqueie medalhas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border">
              <div className="p-2 bg-secondary/10 rounded-full">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Comunidade</h3>
                <p className="text-xs text-muted-foreground">Conecte-se com outros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-2xl border-2">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl">{isLogin ? "Bem-vindo de volta!" : "Bem-vindo ao Gym Flow"}</CardTitle>
              <CardDescription className="text-base">
                {isLogin ? "Faça login para acessar sua conta" : "Crie sua conta para começar sua jornada fitness"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {loading
                    ? isLogin
                      ? "Fazendo login..."
                      : "Criando conta..."
                    : isLogin
                      ? "Fazer Login"
                      : "Criar Conta"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormData({ name: "", email: "" })
                  }}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  {isLogin ? "Não tem uma conta? Criar conta" : "Já tem uma conta? Fazer login"}
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Ao continuar, você concorda com nossos</p>
                <div className="flex justify-center gap-4 text-xs">
                  <button className="text-primary hover:underline">Termos de Uso</button>
                  <button className="text-primary hover:underline">Política de Privacidade</button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Dados Seguros</h4>
                <p className="text-xs text-muted-foreground">
                  Seus dados ficam salvos localmente no seu dispositivo e são sincronizados automaticamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
