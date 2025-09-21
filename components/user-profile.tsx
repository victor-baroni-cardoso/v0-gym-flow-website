"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Target, Bell, Download, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

export function UserProfile() {
  const { toast } = useToast()
  const { user, updateUserStats } = useAuth()
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    goal: "general-fitness",
    experience: "beginner",
    bio: "",
    picture: "/diverse-user-avatars.png",
  })

  useEffect(() => {
    if (user) {
      const savedProfile = localStorage.getItem(`gym-flow-profile-${user.id}`)
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile({
          ...parsedProfile,
          name: user.name, // Always use current user name
          email: user.email, // Always use current user email
        })
      } else {
        setProfile((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          picture: user.picture,
        }))
      }
    }
  }, [user])

  const handleSave = () => {
    if (user) {
      localStorage.setItem(`gym-flow-profile-${user.id}`, JSON.stringify(profile))
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      })
    }
  }

  const handlePhotoUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setProfile((prev) => ({ ...prev, picture: result }))
          toast({
            title: "Foto atualizada!",
            description: "Sua foto de perfil foi alterada com sucesso.",
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados serão enviados por email em alguns minutos.",
    })
  }

  const getExperienceLevel = () => {
    if (!user) return "Iniciante"
    if (user.totalWorkouts >= 100) return "Avançado"
    if (user.totalWorkouts >= 30) return "Intermediário"
    return "Iniciante"
  }

  const getMembershipDuration = () => {
    if (!user) return "Novo membro"
    const joinDate = new Date(user.joinDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - joinDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) return `${diffDays} dias`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`
    return `${Math.floor(diffDays / 365)} anos`
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.picture || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={handlePhotoUpload}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge variant="secondary">{getExperienceLevel()}</Badge>
                <Badge variant="outline">{user.totalWorkouts} Treinos</Badge>
                <Badge variant="outline">Membro há {getMembershipDuration()}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>Mantenha seus dados atualizados para melhor experiência</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age">Idade (opcional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Digite sua idade"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="weight">Peso em kg (opcional)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Digite seu peso"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="height">Altura em cm (opcional)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Digite sua altura"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experience">Nível de Experiência</Label>
              <Select
                value={profile.experience}
                onValueChange={(value) => setProfile({ ...profile, experience: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Biografia (opcional)</Label>
            <Textarea
              id="bio"
              placeholder="Conte um pouco sobre você e seus objetivos..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="goal">Objetivo Principal</Label>
            <Select value={profile.goal} onValueChange={(value) => setProfile({ ...profile, goal: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Perda de Peso</SelectItem>
                <SelectItem value="muscle-gain">Ganho de Massa</SelectItem>
                <SelectItem value="endurance">Resistência</SelectItem>
                <SelectItem value="strength">Força</SelectItem>
                <SelectItem value="general-fitness">Condicionamento Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notificações de Treino</h4>
              <p className="text-sm text-muted-foreground">Receba lembretes para não perder seus treinos</p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Exportar Dados</h4>
              <p className="text-sm text-muted-foreground">Baixe todos os seus dados de treino</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="w-full md:w-auto">
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
