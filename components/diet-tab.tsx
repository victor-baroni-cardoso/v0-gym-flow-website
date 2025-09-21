"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Utensils, Plus, Trash2, CalendarIcon, Target, TrendingUp, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface Meal {
  id: string
  name: string
  type: "cafe" | "almoco" | "lanche" | "jantar" | "outro"
  calories: number
  description?: string
  time: string
  date: string
}

interface DayCalories {
  date: string
  totalCalories: number
  meals: Meal[]
}

const mealTypes = {
  cafe: { label: "Café da Manhã", icon: "☀️" },
  almoco: { label: "Almoço", icon: "🍽️" },
  lanche: { label: "Lanche", icon: "🥪" },
  jantar: { label: "Jantar", icon: "🌙" },
  outro: { label: "Outro", icon: "🍎" },
}

export function DietTab() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "cafe" as keyof typeof mealTypes,
    calories: "",
    description: "",
    time: "",
  })
  const { toast } = useToast()
  const { updateUserStats } = useAuth()

  useEffect(() => {
    const savedMeals = localStorage.getItem("gym-flow-meals")
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }
  }, [])

  const saveMeals = (updatedMeals: Meal[]) => {
    setMeals(updatedMeals)
    localStorage.setItem("gym-flow-meals", JSON.stringify(updatedMeals))
  }

  const todayMeals = meals.filter((meal) => meal.date === format(selectedDate, "yyyy-MM-dd"))
  const todayCalories = todayMeals.reduce((total, meal) => total + meal.calories, 0)

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories || !newMeal.time) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, calorias e horário da refeição.",
        variant: "destructive",
      })
      return
    }

    const meal: Meal = {
      id: `meal-${Date.now()}`,
      name: newMeal.name,
      type: newMeal.type,
      calories: Number.parseInt(newMeal.calories),
      description: newMeal.description,
      time: newMeal.time,
      date: format(selectedDate, "yyyy-MM-dd"),
    }

    const updatedMeals = [...meals, meal]
    saveMeals(updatedMeals)
    updateUserStats(0, meal.calories)

    setNewMeal({
      name: "",
      type: "cafe",
      calories: "",
      description: "",
      time: "",
    })
    setIsAddingMeal(false)

    toast({
      title: "Refeição adicionada!",
      description: `${meal.name} (${meal.calories} cal) foi registrada.`,
    })
  }

  const deleteMeal = (mealId: string) => {
    const mealToDelete = meals.find((m) => m.id === mealId)
    if (mealToDelete) {
      const updatedMeals = meals.filter((meal) => meal.id !== mealId)
      saveMeals(updatedMeals)
      updateUserStats(0, -mealToDelete.calories)

      toast({
        title: "Refeição removida",
        description: `${mealToDelete.name} foi removida do registro.`,
      })
    }
  }

  const getCaloriesForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    return meals.filter((meal) => meal.date === dateStr).reduce((total, meal) => total + meal.calories, 0)
  }

  const getWeeklyAverage = (): number => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return getCaloriesForDate(date)
    })
    return Math.round(last7Days.reduce((sum, cal) => sum + cal, 0) / 7)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Controle de Dieta
          </h2>
          <p className="text-muted-foreground">Registre suas refeições e acompanhe suas calorias diárias</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-full">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calorias Hoje</p>
                <p className="text-2xl font-bold text-secondary">{todayCalories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Semanal</p>
                <p className="text-2xl font-bold text-primary">{getWeeklyAverage()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Utensils className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refeições Hoje</p>
                <p className="text-2xl font-bold text-orange-500">{todayMeals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Meal Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Refeições de {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</h3>
        <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Refeição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Refeição</DialogTitle>
              <DialogDescription>Registre uma nova refeição e suas calorias</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Nome da Refeição *</Label>
                <Input
                  id="meal-name"
                  placeholder="Ex: Pão integral com ovos"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meal-type">Tipo de Refeição</Label>
                  <Select
                    value={newMeal.type}
                    onValueChange={(value: keyof typeof mealTypes) => setNewMeal({ ...newMeal, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(mealTypes).map(([key, { label, icon }]) => (
                        <SelectItem key={key} value={key}>
                          {icon} {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal-time">Horário *</Label>
                  <Input
                    id="meal-time"
                    type="time"
                    value={newMeal.time}
                    onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-calories">Calorias (aprox.) *</Label>
                <Input
                  id="meal-calories"
                  type="number"
                  placeholder="Ex: 350"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-description">Descrição (opcional)</Label>
                <Textarea
                  id="meal-description"
                  placeholder="Detalhes sobre a refeição..."
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={addMeal} className="flex-1 bg-secondary hover:bg-secondary/90">
                  Adicionar Refeição
                </Button>
                <Button variant="outline" onClick={() => setIsAddingMeal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {todayMeals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma refeição registrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece registrando suas refeições para acompanhar suas calorias diárias
              </p>
              <Button onClick={() => setIsAddingMeal(true)} className="bg-secondary hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Refeição
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {todayMeals
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((meal) => (
                <Card key={meal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {mealTypes[meal.type].icon} {mealTypes[meal.type].label}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {meal.time}
                          </div>
                        </div>
                        <h4 className="font-semibold text-lg mb-1">{meal.name}</h4>
                        <p className="text-2xl font-bold text-secondary mb-2">{meal.calories} cal</p>
                        {meal.description && <p className="text-sm text-muted-foreground">{meal.description}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMeal(meal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Daily Summary */}
      {todayMeals.length > 0 && (
        <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Resumo do Dia</h3>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-secondary">{todayCalories}</p>
                  <p className="text-sm text-muted-foreground">Total de Calorias</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-3xl font-bold text-primary">{todayMeals.length}</p>
                  <p className="text-sm text-muted-foreground">Refeições Registradas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
