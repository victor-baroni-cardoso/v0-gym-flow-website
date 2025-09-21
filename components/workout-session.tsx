"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, Check, Dumbbell, Heart, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Exercise {
  id: number
  name: string
  type: "muscular" | "cardio"
  sets?: number
  reps?: number
  weight?: number
  duration?: number
}

interface WorkoutSessionProps {
  onBack: () => void
  workout: { name: string; exercises: Exercise[] }
  onComplete?: () => void
}

export function WorkoutSession({ onBack, workout, onComplete }: WorkoutSessionProps) {
  const { toast } = useToast()
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [cardioTimer, setCardioTimer] = useState(0)
  const [isCardioRunning, setIsCardioRunning] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0)
  const [workoutStarted, setWorkoutStarted] = useState(false)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1
  const allExercisesCompleted = completedExercises.length === workout.exercises.length

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (workoutStarted && !allExercisesCompleted) {
      interval = setInterval(() => {
        setTotalWorkoutTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [workoutStarted, allExercisesCompleted])

  useEffect(() => {
    if (!workoutStarted && (isTimerRunning || isCardioRunning)) {
      setWorkoutStarted(true)
    }
  }, [isTimerRunning, isCardioRunning, workoutStarted])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCardioRunning && currentExercise?.type === "cardio") {
      interval = setInterval(() => {
        setCardioTimer((prev) => {
          const targetTime = (currentExercise.duration || 0) * 60
          if (prev + 1 >= targetTime) {
            setIsCardioRunning(false)
            toast({
              title: "Cardio finalizado!",
              description: `Você completou ${currentExercise.duration} minutos de ${currentExercise.name}`,
            })
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Cardio finalizado!", {
                body: `${currentExercise.name} - ${currentExercise.duration} minutos completados`,
                icon: "/logo.png",
              })
            }
            return targetTime
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCardioRunning, currentExercise, toast])

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const completeSet = () => {
    if (currentExercise.type === "muscular") {
      const newCompletedSets = [...completedSets, currentSet]
      setCompletedSets(newCompletedSets)

      if (currentSet < (currentExercise.sets || 1)) {
        setCurrentSet(currentSet + 1)
        setTimer(0)
        setIsTimerRunning(true)
      } else {
        setCompletedExercises((prev) => [...prev, currentExerciseIndex])
        nextExercise()
      }
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setCompletedSets([])
      setTimer(0)
      setIsTimerRunning(false)
      setCardioTimer(0)
      setIsCardioRunning(false)
    }
  }

  const startCardio = () => {
    setCardioTimer(0)
    setIsCardioRunning(true)
  }

  const pauseCardio = () => {
    setIsCardioRunning(false)
  }

  const resetCardio = () => {
    setCardioTimer(0)
    setIsCardioRunning(false)
  }

  const completeCardio = () => {
    setIsCardioRunning(false)
    setCompletedExercises((prev) => [...prev, currentExerciseIndex])
    nextExercise()
  }

  const finishWorkout = () => {
    if (onComplete) {
      onComplete()
    }
    toast({
      title: "Treino finalizado!",
      description: `Parabéns! Você completou todo o treino em ${formatTime(totalWorkoutTime)}.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{workout.name}</h2>
          <p className="text-muted-foreground">
            Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Tempo Total</span>
          </div>
          <div className="text-lg font-bold text-primary">{formatTime(totalWorkoutTime)}</div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do Treino</span>
              <span>{Math.round((completedExercises.length / workout.exercises.length) * 100)}%</span>
            </div>
            <Progress value={(completedExercises.length / workout.exercises.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {allExercisesCompleted ? (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-2xl font-bold text-primary">🎉 Treino Completo!</div>
            <p className="text-muted-foreground">
              Parabéns! Você completou todos os exercícios do treino em {formatTime(totalWorkoutTime)}.
            </p>
            <Button onClick={finishWorkout} size="lg" className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Finalizar Treino
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Current Exercise */
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentExercise.type === "muscular" ? (
                <Dumbbell className="h-5 w-5 text-primary" />
              ) : (
                <Heart className="h-5 w-5 text-secondary" />
              )}
              <CardTitle>{currentExercise.name}</CardTitle>
              <Badge variant={currentExercise.type === "muscular" ? "default" : "secondary"}>
                {currentExercise.type === "muscular" ? "Muscular" : "Cardio"}
              </Badge>
              {completedExercises.includes(currentExerciseIndex) && (
                <Badge variant="outline" className="text-primary border-primary">
                  <Check className="h-3 w-3 mr-1" />
                  Completo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentExercise.type === "muscular" ? (
              <>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">
                    Série {currentSet} de {currentExercise.sets}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {currentExercise.reps} repetições
                    {currentExercise.weight && ` × ${currentExercise.weight}kg`}
                  </div>
                </div>

                {/* Set Progress */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: currentExercise.sets || 1 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-8 rounded flex items-center justify-center text-sm font-medium ${
                        completedSets.includes(index + 1)
                          ? "bg-primary text-primary-foreground"
                          : index + 1 === currentSet
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {completedSets.includes(index + 1) ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                  ))}
                </div>

                <Button onClick={completeSet} className="w-full" size="lg">
                  <Check className="h-4 w-4 mr-2" />
                  Série Completa
                </Button>

                {/* Rest Timer */}
                {isTimerRunning && (
                  <Card className="bg-muted">
                    <CardContent className="pt-4 text-center">
                      <div className="text-2xl font-bold mb-2">{formatTime(timer)}</div>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" onClick={() => setIsTimerRunning(false)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setTimer(0)}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{formatTime(cardioTimer)}</div>
                  <div className="text-lg text-muted-foreground">Meta: {currentExercise.duration} minutos</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((cardioTimer / ((currentExercise.duration || 1) * 60)) * 100)}% completo
                  </div>
                </div>

                <Progress value={(cardioTimer / ((currentExercise.duration || 1) * 60)) * 100} className="h-2" />

                <div className="flex gap-2">
                  {!isCardioRunning ? (
                    <Button onClick={startCardio} className="flex-1" size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>
                  ) : (
                    <Button onClick={pauseCardio} variant="outline" className="flex-1 bg-transparent" size="lg">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  )}
                  <Button onClick={resetCardio} variant="outline" size="lg">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={completeCardio} className="w-full bg-transparent" size="lg" variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Exercício
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!allExercisesCompleted && (
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const prevIndex = Math.max(0, currentExerciseIndex - 1)
              setCurrentExerciseIndex(prevIndex)
              setCurrentSet(1)
              setCompletedSets([])
              setTimer(0)
              setIsTimerRunning(false)
              setCardioTimer(0)
              setIsCardioRunning(false)
            }}
            disabled={currentExerciseIndex === 0}
            className="flex-1"
          >
            Anterior
          </Button>
          <Button onClick={nextExercise} disabled={isLastExercise} className="flex-1">
            Próximo
          </Button>
          <Button onClick={finishWorkout} variant="outline" className="flex-1 bg-transparent">
            Finalizar Treino
          </Button>
        </div>
      )}
    </div>
  )
}
