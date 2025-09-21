"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { CloudDownload, CloudUpload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SyncButton() {
  const { syncToCloud, syncFromCloud } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()

  const handleSyncToCloud = async () => {
    setSyncing(true)
    try {
      await syncToCloud()
      toast({
        title: "Sincronizado com sucesso!",
        description: "Seus dados foram salvos na nuvem.",
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível salvar os dados na nuvem.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncFromCloud = async () => {
    setSyncing(true)
    try {
      await syncFromCloud()
      toast({
        title: "Dados restaurados!",
        description: "Seus dados foram baixados da nuvem.",
      })
    } catch (error) {
      toast({
        title: "Erro na restauração",
        description: "Não foi possível baixar os dados da nuvem.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSyncToCloud}
        disabled={syncing}
        className="flex items-center gap-2 bg-transparent"
      >
        {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
        Salvar na Nuvem
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSyncFromCloud}
        disabled={syncing}
        className="flex items-center gap-2 bg-transparent"
      >
        {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudDownload className="h-4 w-4" />}
        Restaurar da Nuvem
      </Button>
    </div>
  )
}
