"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Award, Flame, Clock } from "lucide-react"
import { PerfumeAdBanner } from "@/components/perfume-ad-banner"

interface CompletedWorkout {
  id: number
  name: string
  completedAt: string
  duration: string
  exercises: any[]
}

export function StatsDashboard() {
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([])
  const [stats, setStats] = useState({
    weeklyGoal: { current: 0, target: 5, percentage: 0 },
    monthlyWorkouts: 0,
    totalWorkouts: 0,
    streak: 0,
    avgDuration: 0,
    favoriteExercise: "Nenhum ainda",
  })
  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: "Seg", completed: false, duration: 0 },
    { day: "Ter", completed: false, duration: 0 },
    { day: "Qua", completed: false, duration: 0 },
    { day: "Qui", completed: false, duration: 0 },
    { day: "Sex", completed: false, duration: 0 },
    { day: "Sáb", completed: false, duration: 0 },
    { day: "Dom", completed: false, duration: 0 },
  ])
  const [achievements, setAchievements] = useState([
    { title: "Primeira Semana", description: "Complete 5 treinos em uma semana", earned: false },
    { title: "Consistência", description: "7 dias consecutivos de treino", earned: false },
    { title: "Maratonista", description: "Treino de 60+ minutos", earned: false },
    { title: "Dedicação", description: "30 treinos completados", earned: false },
    { title: "Iniciante", description: "Complete seu primeiro treino", earned: false },
    { title: "Perseverança", description: "10 treinos completados", earned: false },
  ])

  useEffect(() => {
    const saved = localStorage.getItem("gym-flow-completed-workouts")
    if (saved) {
      const workouts = JSON.parse(saved)
      setCompletedWorkouts(workouts)
      calculateStats(workouts)
      updateWeeklyProgress(workouts)
      updateAchievements(workouts)
    }
  }, [])

  const calculateStats = (workouts: CompletedWorkout[]) => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const thisWeekWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.completedAt)
      return workoutDate >= startOfWeek
    })

    const thisMonthWorkouts = workouts.filter((workout) => {
      const workoutDate = new Date(workout.completedAt)
      return workoutDate >= startOfMonth
    })

    const streak = calculateStreak(workouts)

    const avgDuration =
      workouts.length > 0
        ? Math.round(
            workouts.reduce((sum, workout) => {
              const duration = Number.parseInt(workout.duration) || 0
              return sum + duration
            }, 0) / workouts.length,
          )
        : 0

    const exerciseCount: { [key: string]: number } = {}
    workouts.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1
      })
    })
    const favoriteExercise =
      Object.keys(exerciseCount).length > 0
        ? Object.keys(exerciseCount).reduce((a, b) => (exerciseCount[a] > exerciseCount[b] ? a : b))
        : "Nenhum ainda"

    const weeklyPercentage = Math.round((thisWeekWorkouts.length / 5) * 100)

    setStats({
      weeklyGoal: {
        current: thisWeekWorkouts.length,
        target: 5,
        percentage: Math.min(weeklyPercentage, 100),
      },
      monthlyWorkouts: thisMonthWorkouts.length,
      totalWorkouts: workouts.length,
      streak,
      avgDuration,
      favoriteExercise,
    })
  }

  const calculateStreak = (workouts: CompletedWorkout[]) => {
    if (workouts.length === 0) return 0

    const sortedWorkouts = workouts
      .map((w) => new Date(w.completedAt).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const uniqueDates = [...new Set(sortedWorkouts)]
    let streak = 0
    const today = new Date().toDateString()
    let currentDate = new Date()

    for (let i = 0; i < uniqueDates.length; i++) {
      const workoutDate = uniqueDates[i]
      const expectedDate = currentDate.toDateString()

      if (workoutDate === expectedDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else if (i === 0 && workoutDate !== today) {
        // If the most recent workout wasn't today, check if it was yesterday
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (workoutDate === yesterday.toDateString()) {
          streak++
          currentDate = new Date(yesterday)
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      } else {
        break
      }
    }

    return streak
  }

  const updateWeeklyProgress = (workouts: CompletedWorkout[]) => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))

    const newProgress = weeklyProgress.map((day, index) => {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + index)

      const dayWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.completedAt)
        return workoutDate.toDateString() === dayDate.toDateString()
      })

      const totalDuration = dayWorkouts.reduce((sum, workout) => {
        return sum + (Number.parseInt(workout.duration) || 0)
      }, 0)

      return {
        ...day,
        completed: dayWorkouts.length > 0,
        duration: totalDuration,
      }
    })

    setWeeklyProgress(newProgress)
  }

  const updateAchievements = (workouts: CompletedWorkout[]) => {
    const newAchievements = achievements.map((achievement) => {
      let earned = false

      switch (achievement.title) {
        case "Iniciante":
          earned = workouts.length >= 1
          break
        case "Perseverança":
          earned = workouts.length >= 10
          break
        case "Dedicação":
          earned = workouts.length >= 30
          break
        case "Primeira Semana":
          // Check if user completed 5 workouts in any week
          const weeklyCount = getMaxWeeklyWorkouts(workouts)
          earned = weeklyCount >= 5
          break
        case "Consistência":
          earned = calculateStreak(workouts) >= 7
          break
        case "Maratonista":
          earned = workouts.some((workout) => Number.parseInt(workout.duration) >= 60)
          break
      }

      return { ...achievement, earned }
    })

    setAchievements(newAchievements)
  }

  const getMaxWeeklyWorkouts = (workouts: CompletedWorkout[]) => {
    const weekCounts: { [key: string]: number } = {}

    workouts.forEach((workout) => {
      const date = new Date(workout.completedAt)
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1))
      const weekKey = startOfWeek.toISOString().split("T")[0]
      weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1
    })

    return Math.max(...Object.values(weekCounts), 0)
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Meta Semanal</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {stats.weeklyGoal.current}/{stats.weeklyGoal.target}
              </div>
              <Progress value={stats.weeklyGoal.percentage} className="h-2" />
              <span className="text-xs text-muted-foreground">{stats.weeklyGoal.percentage}% completo</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Este Mês</span>
            </div>
            <div className="text-2xl font-bold">{stats.monthlyWorkouts}</div>
            <span className="text-xs text-muted-foreground">treinos realizados</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Sequência</span>
            </div>
            <div className="text-2xl font-bold">{stats.streak}</div>
            <span className="text-xs text-muted-foreground">dias consecutivos</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Duração Média</span>
            </div>
            <div className="text-2xl font-bold">{stats.avgDuration}min</div>
            <span className="text-xs text-muted-foreground">por treino</span>
          </CardContent>
        </Card>
      </div>

      {/* Ad Banner */}
      <PerfumeAdBanner />

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Visão Semanal
          </CardTitle>
          <CardDescription>Seu progresso nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium ${
                    day.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30"
                  }`}
                >
                  {day.completed ? "✓" : day.day}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">{day.day}</p>
                  {day.completed && day.duration > 0 && (
                    <p className="text-xs text-muted-foreground">{day.duration}min</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            Conquistas
          </CardTitle>
          <CardDescription>
            {achievements.filter((a) => a.earned).length} de {achievements.length} conquistadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  achievement.earned
                    ? "bg-secondary/10 border-secondary/20 shadow-sm"
                    : "bg-muted/50 border-muted opacity-60"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    achievement.earned ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && <Badge variant="secondary">Conquistado</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      {stats.totalWorkouts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas Gerais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.totalWorkouts}</div>
                <p className="text-sm text-muted-foreground">Total de Treinos</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{stats.avgDuration}min</div>
                <p className="text-sm text-muted-foreground">Duração Média</p>
              </div>
              <div>
                <div className="text-lg font-bold text-muted-foreground truncate">{stats.favoriteExercise}</div>
                <p className="text-sm text-muted-foreground">Exercício Favorito</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
