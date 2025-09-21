"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

export function PerfumeAdBanner() {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20 border-green-200 dark:border-green-800 my-0 py-0.5">
      <div className="relative">
        <Image
          src="/perfume-ad.png"
          alt="ESSENZA - O Aroma que te Transforma"
          width={1200}
          height={300}
          className="w-full h-auto object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-900/10" />
      </div>
    </Card>
  )
}
