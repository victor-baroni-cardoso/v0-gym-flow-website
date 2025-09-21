"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Dumbbell, Heart } from "lucide-react"

interface Exercise {
  id: number
  name: string
  type: "muscular" | "cardio"
  sets?: number
  reps?: number
  weight?: number
  duration?: number
}

interface WorkoutCreatorProps {
  onBack: () => void
  onSave: (workout: { name: string; exercises: Exercise[] }) => void
  initialWorkout?: { name: string; exercises: Exercise[] }
}

export function WorkoutCreator({ onBack, onSave, initialWorkout }: WorkoutCreatorProps) {
  const [workoutName, setWorkoutName] = useState(initialWorkout?.name || "")
  const [exercises, setExercises] = useState<Exercise[]>(initialWorkout?.exercises || [])
  const [newExercise, setNewExercise] = useState({
    name: "",
    type: "muscular" as "muscular" | "cardio",
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 10,
  })

  const addExercise = () => {
    if (!newExercise.name) return

    const exercise: Exercise = {
      id: Date.now(),
      name: newExercise.name,
      type: newExercise.type,
    }

    if (newExercise.type === "muscular") {
      exercise.sets = newExercise.sets
      exercise.reps = newExercise.reps
      if (newExercise.weight > 0) exercise.weight = newExercise.weight
    } else {
      exercise.duration = newExercise.duration || 10
    }

    setExercises([...exercises, exercise])
    setNewExercise({
      name: "",
      type: "muscular",
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 10,
    })
  }

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const moveExercise = (index: number, direction: "up" | "down") => {
    const newExercises = [...exercises]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < exercises.length) {
      ;[newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]]
      setExercises(newExercises)
    }
  }

  const handleSave = () => {
    if (!workoutName || exercises.length === 0) return
    onSave({ name: workoutName, exercises })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="h-12 w-12 touch-manipulation bg-transparent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{initialWorkout ? "Editar Treino" : "Criar Novo Treino"}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {initialWorkout ? "Modifique seu treino existente" : "Monte seu treino personalizado"}
          </p>
        </div>
      </div>

      {/* Workout Name */}
      <Card>
        <CardHeader>
          <CardTitle>Nome do Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Ex: Treino de Peito e Tríceps"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="h-12 text-base"
          />
        </CardContent>
      </Card>

      {/* Add Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Exercício</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="exercise-name">Nome do Exercício</Label>
              <Input
                id="exercise-name"
                placeholder="Ex: Supino Reto"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                className="h-12 text-base"
              />
            </div>
            <div>
              <Label htmlFor="exercise-type">Tipo</Label>
              <Select
                value={newExercise.type}
                onValueChange={(value: "muscular" | "cardio") => setNewExercise({ ...newExercise, type: value })}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muscular">Muscular</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {newExercise.type === "muscular" ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sets">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: Number.parseInt(e.target.value) || 1 })}
                  className="h-12 text-base"
                />
              </div>
              <div>
                <Label htmlFor="reps">Repetições</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: Number.parseInt(e.target.value) || 1 })}
                  className="h-12 text-base"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg) - Opcional</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: Number.parseInt(e.target.value) || 0 })}
                  className="h-12 text-base"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="duration">Tempo de Cardio (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="120"
                value={newExercise.duration}
                onChange={(e) => setNewExercise({ ...newExercise, duration: Number.parseInt(e.target.value) || 1 })}
                className="h-12 text-base"
                placeholder="Ex: 30 minutos"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Este tempo será usado como meta no cronômetro durante o treino
              </p>
            </div>
          )}

          <Button onClick={addExercise} className="w-full h-12 text-base touch-manipulation">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Exercício
          </Button>
        </CardContent>
      </Card>

      {/* Exercise List */}
      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercícios do Treino ({exercises.length})</CardTitle>
            <CardDescription>Use os botões para reordenar os exercícios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveExercise(index, "up")}
                      disabled={index === 0}
                      className="h-10 w-10 p-0 touch-manipulation"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveExercise(index, "down")}
                      disabled={index === exercises.length - 1}
                      className="h-10 w-10 p-0 touch-manipulation"
                    >
                      ↓
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {exercise.type === "muscular" ? (
                        <Dumbbell className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Heart className="h-4 w-4 text-secondary flex-shrink-0" />
                      )}
                      <span className="font-medium truncate">{exercise.name}</span>
                      <Badge variant={exercise.type === "muscular" ? "default" : "secondary"} className="flex-shrink-0">
                        {exercise.type === "muscular" ? "Muscular" : "Cardio"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exercise.type === "muscular"
                        ? `${exercise.sets} séries × ${exercise.reps} reps${
                            exercise.weight ? ` × ${exercise.weight}kg` : ""
                          }`
                        : `${exercise.duration} minutos`}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exercise.id)}
                    className="h-10 w-10 p-0 touch-manipulation flex-shrink-0"
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent h-12 text-base">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={!workoutName || exercises.length === 0}
          className="flex-1 h-12 text-base"
        >
          Salvar Treino
        </Button>
      </div>
    </div>
  )
}
