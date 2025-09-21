"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Camera, Upload, Trash2, ZoomIn, X, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdBanner } from "@/components/ad-banner"

interface Photo {
  id: number
  url: string
  date: string
  time: string
  fileName: string
}

export function TimelineTab() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const now = new Date()
        const newPhoto: Photo = {
          id: Date.now() + Math.random(),
          url: e.target?.result as string,
          date: now.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
          time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          fileName: file.name,
        }
        setPhotos((prev) => [newPhoto, ...prev])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const deletePhoto = (photoId: number) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId))
  }

  const openZoom = (photo: Photo) => {
    setSelectedPhoto(photo)
    setIsZoomOpen(true)
  }

  const groupPhotosByDate = () => {
    const grouped = photos.reduce(
      (acc, photo) => {
        const date = photo.date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(photo)
        return acc
      },
      {} as Record<string, Photo[]>,
    )

    return Object.entries(grouped).sort(([a], [b]) => {
      const dateA = new Date(a.split(" ").reverse().join("-"))
      const dateB = new Date(b.split(" ").reverse().join("-"))
      return dateB.getTime() - dateA.getTime()
    })
  }

  const groupedPhotos = groupPhotosByDate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Timeline de Fotos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none">
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{photos.length} fotos</Badge>
              <span>•</span>
              <span>Últimas fotos primeiro</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Ad Banner */}
      <AdBanner />

      {/* Photo Timeline */}
      {groupedPhotos.length > 0 ? (
        <div className="space-y-8">
          {groupedPhotos.map(([date, datePhotos]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-primary" />
                  {date}
                </div>
                <div className="flex-1 h-px bg-border"></div>
                <Badge variant="secondary">
                  {datePhotos.length} foto{datePhotos.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {datePhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-all duration-200">
                    <div className="relative aspect-square">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={`Foto do treino - ${photo.date} ${photo.time}`}
                        className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full bg-white/90 hover:bg-white text-black"
                            onClick={() => openZoom(photo)}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="rounded-full">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. A foto será permanentemente removida da sua timeline.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePhoto(photo.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{photo.time}</span>
                        </div>
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">{photo.fileName}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-16">
          <CardContent>
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-3">Nenhuma foto ainda</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comece a documentar seu progresso adicionando fotos dos seus treinos. Você pode adicionar múltiplas fotos
              de uma vez!
            </p>
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Adicionar Primeira Foto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {selectedPhoto?.date} - {selectedPhoto?.time}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsZoomOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 p-6 pt-2">
            {selectedPhoto && (
              <div className="relative w-full h-full flex items-center justify-center bg-muted/20 rounded-lg">
                <img
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={`Foto do treino - ${selectedPhoto.date} ${selectedPhoto.time}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
          <div className="p-6 pt-0 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{selectedPhoto?.fileName}</div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Foto
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. A foto será permanentemente removida da sua timeline.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (selectedPhoto) {
                            deletePhoto(selectedPhoto.id)
                            setIsZoomOpen(false)
                          }
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
