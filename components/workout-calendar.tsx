"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Calendar, Clock, Dumbbell, Heart, X } from "lucide-react"

interface CompletedWorkout {
  id: number
  name: string
  completedAt: string
  duration: string
  exercises: any[]
}

interface WorkoutCalendarProps {
  workouts: CompletedWorkout[]
}

export function WorkoutCalendar({ workouts }: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getWorkoutsForDay = (day: number) => {
    if (!day) return []

    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.completedAt)
      return workoutDate.toDateString() === targetDate.toDateString()
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (day: number) => {
    const dayWorkouts = getWorkoutsForDay(day)
    if (dayWorkouts.length > 0) {
      setSelectedDay(day)
      setIsModalOpen(true)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const days = getDaysInMonth(currentDate)
  const selectedDayWorkouts = selectedDay ? getWorkoutsForDay(selectedDay) : []

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendário de Treinos
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayWorkouts = getWorkoutsForDay(day)
              const isToday =
                day &&
                new Date().toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-[60px] p-1 border rounded-lg transition-colors ${
                    day ? "hover:bg-muted/50 cursor-pointer" : ""
                  } ${dayWorkouts.length > 0 ? "bg-primary/10 border-primary/20" : ""} ${
                    isToday ? "ring-2 ring-primary/50" : ""
                  }`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                      {dayWorkouts.slice(0, 2).map((workout, workoutIndex) => (
                        <Badge key={workoutIndex} variant="secondary" className="text-xs mb-1 block truncate">
                          {workout.name}
                        </Badge>
                      ))}
                      {dayWorkouts.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{dayWorkouts.length - 2} mais
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {workouts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum treino completado ainda</p>
              <p className="text-sm">Complete treinos para vê-los no calendário</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Treinos do dia {selectedDay} de {monthNames[currentDate.getMonth()]}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDayWorkouts.map((workout, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(workout.completedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        {workout.duration}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Exercícios realizados:</h4>
                    <div className="grid gap-2">
                      {workout.exercises?.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            {exercise.type === "muscular" ? (
                              <Dumbbell className="h-4 w-4 text-primary" />
                            ) : (
                              <Heart className="h-4 w-4 text-secondary" />
                            )}
                            <span className="font-medium">{exercise.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.type === "muscular" ? (
                              <span>
                                {exercise.sets}x{exercise.reps}
                                {exercise.weight && ` × ${exercise.weight}kg`}
                              </span>
                            ) : (
                              <span>{exercise.duration} min</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
