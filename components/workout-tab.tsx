"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  CheckCircle2,
  Plus,
  Play,
  Trash2,
  Heart,
  HeartOff,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
} from "lucide-react"
import { WorkoutCreator } from "@/components/workout-creator"
import { WorkoutSession } from "@/components/workout-session"
import { WorkoutCalendar } from "@/components/workout-calendar"
import { AdBanner } from "@/components/ad-banner"
import { useToast } from "@/hooks/use-toast"

interface Workout {
  id: number
  name: string
  date: string
  duration: string
  exercises: any[]
  isFavorite?: boolean
  completed?: boolean
  completedAt?: string
}

export function WorkoutTab() {
  const { toast } = useToast()
  const [weekProgress, setWeekProgress] = useState([
    { day: "Segunda", completed: false },
    { day: "Terça", completed: false },
    { day: "Quarta", completed: false },
    { day: "Quinta", completed: false },
    { day: "Sexta", completed: false },
    { day: "Sábado", completed: false },
    { day: "Domingo", completed: false },
  ])

  const [currentView, setCurrentView] = useState<"overview" | "create" | "session" | "edit">("overview")
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([])
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [importText, setImportText] = useState("")
  const [exportText, setExportText] = useState("")
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("gym-flow-completed-workouts")
    if (saved) {
      const completed = JSON.parse(saved)
      setCompletedWorkouts(completed)
      updateWeekProgress(completed)
      updateRecentWorkouts(completed)
    }

    const savedWorkouts = localStorage.getItem("gym-flow-workouts")
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gym-flow-workouts", JSON.stringify(workouts))
  }, [workouts])

  const updateWeekProgress = (completed: Workout[]) => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))

    const newProgress = weekProgress.map((day, index) => {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + index)

      const hasWorkout = completed.some((workout) => {
        if (!workout.completedAt) return false
        const workoutDate = new Date(workout.completedAt)
        return workoutDate.toDateString() === dayDate.toDateString()
      })

      return { ...day, completed: hasWorkout }
    })

    setWeekProgress(newProgress)
  }

  const updateRecentWorkouts = (completed: Workout[]) => {
    const recent = completed
      .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
      .slice(0, 10)
    setRecentWorkouts(recent)
  }

  const handleWorkoutComplete = (workout: Workout) => {
    const completedWorkout = {
      ...workout,
      completed: true,
      completedAt: new Date().toISOString(),
    }

    const newCompleted = [...completedWorkouts, completedWorkout]
    setCompletedWorkouts(newCompleted)
    localStorage.setItem("gym-flow-completed-workouts", JSON.stringify(newCompleted))
    updateWeekProgress(newCompleted)
    updateRecentWorkouts(newCompleted)

    toast({
      title: "Treino finalizado!",
      description: "Parabéns! Seu progresso foi salvo.",
    })

    setCurrentView("overview")
  }

  const toggleFavorite = (workoutId: number) => {
    setWorkouts(workouts.map((w) => (w.id === workoutId ? { ...w, isFavorite: !w.isFavorite } : w)))
  }

  const deleteWorkout = (workoutId: number) => {
    setWorkouts(workouts.filter((w) => w.id !== workoutId))
    toast({
      title: "Treino excluído",
      description: "O treino foi removido da sua lista.",
    })
  }

  const editWorkout = (workout: Workout) => {
    setEditingWorkout(workout)
    setCurrentView("edit")
  }

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout)
    setCurrentView("session")
  }

  const exportWorkouts = () => {
    const exportData = {
      workouts: workouts,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }
    const exportString = JSON.stringify(exportData, null, 2)
    setExportText(exportString)
    setIsExportOpen(true)
  }

  const importWorkouts = () => {
    try {
      const importData = JSON.parse(importText)

      if (!importData.workouts || !Array.isArray(importData.workouts)) {
        throw new Error("Formato inválido")
      }

      const importedWorkouts = importData.workouts.map((workout: any) => ({
        ...workout,
        id: Date.now() + Math.random(), // Generate new ID to avoid conflicts
        isFavorite: false, // Reset favorite status
      }))

      setWorkouts([...workouts, ...importedWorkouts])
      setImportText("")
      setIsImportOpen(false)

      toast({
        title: "Treinos importados!",
        description: `${importedWorkouts.length} treino(s) foram adicionados à sua lista.`,
      })
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Verifique se o formato dos dados está correto.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Dados copiados para a área de transferência.",
      })
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar os dados.",
        variant: "destructive",
      })
    }
  }

  if (currentView === "create") {
    return (
      <WorkoutCreator
        onBack={() => setCurrentView("overview")}
        onSave={(workout) => {
          setWorkouts([...workouts, { ...workout, id: Date.now(), isFavorite: false }])
          setCurrentView("overview")
          toast({
            title: "Treino criado!",
            description: "Seu novo treino foi salvo com sucesso.",
          })
        }}
      />
    )
  }

  if (currentView === "edit" && editingWorkout) {
    return (
      <WorkoutCreator
        onBack={() => setCurrentView("overview")}
        initialWorkout={editingWorkout}
        onSave={(workout) => {
          setWorkouts(
            workouts.map((w) =>
              w.id === editingWorkout.id
                ? { ...workout, id: editingWorkout.id, isFavorite: editingWorkout.isFavorite }
                : w,
            ),
          )
          setCurrentView("overview")
          toast({
            title: "Treino atualizado!",
            description: "Suas alterações foram salvas com sucesso.",
          })
        }}
      />
    )
  }

  if (currentView === "session" && selectedWorkout) {
    return (
      <WorkoutSession
        onBack={() => setCurrentView("overview")}
        workout={selectedWorkout}
        onComplete={() => handleWorkoutComplete(selectedWorkout)}
      />
    )
  }

  const completedThisWeek = weekProgress.filter((day) => day.completed).length
  const progressPercentage = Math.round((completedThisWeek / 7) * 100)

  const favoriteWorkouts = workouts.filter((w) => w.isFavorite)
  const displayWorkouts = [...favoriteWorkouts, ...recentWorkouts.slice(0, 10 - favoriteWorkouts.length)]

  return (
    <div className="space-y-6">
      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Progresso da Semana
          </CardTitle>
          <CardDescription>Acompanhe seus treinos semanais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all touch-manipulation ${
                    day.completed
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {day.completed ? (
                    <CheckCircle2 className="h-6 w-6 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm sm:text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{day.day}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{completedThisWeek} de 7 treinos concluídos</span>
            <Badge variant="default" className="bg-primary text-primary-foreground">
              {progressPercentage}% completo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ad Banner */}
      <AdBanner />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-all hover:border-secondary/50 touch-manipulation"
          onClick={() => setCurrentView("create")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-secondary" />
              Criar Treino
            </CardTitle>
            <CardDescription>Monte seu treino personalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base"
              variant="default"
            >
              Novo Treino
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 touch-manipulation">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Play className="h-5 w-5 text-primary" />
              Escolher Treino
            </CardTitle>
            <CardDescription>Selecione um treino para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base"
              disabled={workouts.length === 0}
              onClick={() => {
                if (workouts.length > 0) {
                  startWorkout(workouts[0])
                }
              }}
            >
              {workouts.length > 0 ? "Escolher Treino" : "Crie um treino primeiro"}
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 touch-manipulation">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-primary" />
              Importar Treinos
            </CardTitle>
            <CardDescription>Adicione treinos de outros usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-base"
                  variant="outline"
                >
                  Importar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Importar Treinos
                  </DialogTitle>
                  <DialogDescription>Cole os dados de treino compartilhados por outro usuário</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="import-data">Dados do Treino</Label>
                    <Textarea
                      id="import-data"
                      placeholder="Cole aqui os dados do treino exportado..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsImportOpen(false)} className="h-12">
                      Cancelar
                    </Button>
                    <Button onClick={importWorkouts} disabled={!importText.trim()} className="h-12">
                      Importar Treinos
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all hover:border-secondary/50 touch-manipulation">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-secondary" />
              Exportar Treinos
            </CardTitle>
            <CardDescription>Compartilhe seus treinos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full h-12 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent text-base"
              variant="outline"
              onClick={exportWorkouts}
              disabled={workouts.length === 0}
            >
              {workouts.length > 0 ? "Exportar" : "Nenhum treino"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Workouts */}
      {displayWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Meus Treinos
            </CardTitle>
            <CardDescription>Treinos favoritos e últimos 10 treinos usados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{workout.name}</h4>
                      {workout.isFavorite && <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />}
                      {recentWorkouts.some((r) => r.id === workout.id) && !workout.isFavorite && (
                        <Badge variant="outline" className="text-xs">
                          Recente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{workout.exercises?.length || 0} exercícios</p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(workout.id)}
                      className="hover:text-red-500 h-10 w-10 p-0 touch-manipulation"
                    >
                      {workout.isFavorite ? <HeartOff className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editWorkout(workout)}
                      className="hover:text-primary h-10 w-10 p-0 touch-manipulation"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => startWorkout(workout)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-3 touch-manipulation"
                    >
                      <Play className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Iniciar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteWorkout(workout.id)}
                      className="hover:text-destructive h-10 w-10 p-0 touch-manipulation"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Exportar Treinos
            </DialogTitle>
            <DialogDescription>Compartilhe seus treinos copiando os dados abaixo</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="export-data">Dados para Compartilhar</Label>
              <Textarea id="export-data" value={exportText} readOnly className="min-h-[200px] font-mono text-sm" />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExportOpen(false)} className="h-12">
                Fechar
              </Button>
              <Button onClick={() => copyToClipboard(exportText)} className="h-12">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Dados
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WorkoutCalendar workouts={completedWorkouts} />
    </div>
  )
}
