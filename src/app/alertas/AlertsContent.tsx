"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CheckCheck, Trash2, BellOff } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/queries"
import { useLoading } from "@/components/LoadingProvider"

interface Notification {
  id: string
  lido: string
  data: string
  proyecto_id: string
  titulo: string
  resumo_ia: string | null
  politico_nome: string
  politico_foto: string | null
}

interface AlertsContentProps {
  userId: string
  initialNotifications: Notification[]
}

export function AlertsContent({ userId, initialNotifications }: AlertsContentProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { startLoading } = useLoading()

  const unreadNotifications = notifications.filter(n => n.lido === 'N')

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const success = await markNotificationAsRead(id)
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead(userId)
    if (success) {
      setNotifications([])
    }
  }

  const handleOpenDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsSheetOpen(true)
  }

  if (unreadNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 rounded-3xl border border-slate-100 mt-4 text-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
          <BellOff className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Tudo limpo por aqui!</h3>
        <p className="text-sm text-slate-500 max-w-[200px]">
          Nenhuma nova atualização dos seus parlamentares favoritos.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end px-1">
        <button 
          onClick={handleMarkAllAsRead}
          className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Marcar todas como lidas
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {unreadNotifications.map((item) => (
          <Card 
            key={item.id} 
            className="border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group rounded-2xl overflow-hidden"
            onClick={() => handleOpenDetails(item)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-slate-100 shrink-0">
                  <AvatarImage src={item.politico_foto || ""} alt={item.politico_nome} />
                  <AvatarFallback>{item.politico_nome[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Projeto de Lei
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-0.5">
                    {item.politico_nome}
                  </h4>
                  
                  <p className="text-xs text-slate-600 leading-snug line-clamp-2 italic font-medium">
                    "{item.titulo}"
                  </p>
                </div>

                <div className="flex flex-col gap-2 self-center">
                  <button 
                    onClick={(e) => handleMarkAsRead(item.id, e)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-primary transition-colors"
                    title="Marcar como lido"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] h-[80vh] sm:h-[60vh] px-6 pb-12">
          <SheetHeader className="text-left mb-6 pt-2">
            <div className="flex items-center gap-3 mb-4">
               <Avatar className="h-12 w-12 border-2 border-primary/10">
                 <AvatarImage src={selectedNotification?.politico_foto || ""} />
                 <AvatarFallback>{selectedNotification?.politico_nome[0]}</AvatarFallback>
               </Avatar>
               <div>
                 <SheetTitle className="text-xl font-bold text-slate-900">
                    {selectedNotification?.politico_nome}
                 </SheetTitle>
                 <span className="text-xs font-medium text-slate-500">
                   Projeto de Lei • {selectedNotification && new Date(selectedNotification.data).toLocaleDateString('pt-BR')}
                 </span>
               </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {selectedNotification?.titulo}
              </p>
            </div>
          </SheetHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-250px)] pr-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
               <span className="text-lg">✨</span> Resumo da IA
            </div>
            
            <p className="text-slate-600 leading-relaxed text-sm antialiased whitespace-pre-line">
              {selectedNotification?.resumo_ia || "Resumo não disponível."}
            </p>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex gap-3">
            <Button 
              className="flex-1 h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20" 
              onClick={() => setIsSheetOpen(false)}
            >
              Entendi
            </Button>
            <Button 
              variant="outline"
              className="px-4 h-12 rounded-xl" 
              onClick={() => {
                if (selectedNotification) handleMarkAsRead(selectedNotification.id)
                setIsSheetOpen(false)
              }}
            >
              <CheckCheck className="h-5 w-5" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
