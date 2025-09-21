"use client"

import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AdBannerProps {
  className?: string
}

export function AdBanner({ className = "" }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 ${className}`}
    >
      <div className="relative p-4 flex items-center justify-center min-h-[120px]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-center w-full">
          <img
            src="/ad-banner-horizontal.png"
            alt="Espaço publicitário - Seu Anuncio Aqui!"
            className="max-w-full h-auto max-h-[100px] object-contain"
          />
        </div>
      </div>
    </Card>
  )
}
