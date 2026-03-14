"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

interface Activity {
  id: string
  politico: {
    nome: string
    foto: string | null
  }
  tipo: string
  titulo: string
  resumo_ia: string | null
  tempo: string
}

interface RecentActivitiesProps {
  initialFeed: Activity[]
}

export function RecentActivities({ initialFeed }: RecentActivitiesProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenDetails = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-slate-900 text-lg">Atividades Recentes</h3>
      
      {initialFeed.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Nenhuma atividade recente nos seus favoritos.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {initialFeed.map((item) => (
            <Card 
              key={item.id} 
              className="border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group rounded-2xl overflow-hidden"
              onClick={() => handleOpenDetails(item)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border border-slate-100 shrink-0">
                    <AvatarImage src={item.politico.foto || ""} alt={item.politico.nome} />
                    <AvatarFallback>{item.politico.nome[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {item.tipo}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {item.tempo}
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-0.5">
                      {item.politico.nome}
                    </h4>
                    
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2 italic font-medium">
                      "{item.titulo}"
                    </p>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] h-[80vh] sm:h-[60vh] px-6 pb-12">
          <SheetHeader className="text-left mb-6 pt-2">
            <div className="flex items-center gap-3 mb-4">
               <Avatar className="h-12 w-12 border-2 border-primary/10">
                 <AvatarImage src={selectedActivity?.politico.foto || ""} />
                 <AvatarFallback>{selectedActivity?.politico.nome[0]}</AvatarFallback>
               </Avatar>
               <div>
                 <SheetTitle className="text-xl font-bold text-slate-900">
                    {selectedActivity?.politico.nome}
                 </SheetTitle>
                 <span className="text-xs font-medium text-slate-500">{selectedActivity?.tipo} • {selectedActivity?.tempo}</span>
               </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {selectedActivity?.titulo}
              </p>
            </div>
          </SheetHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-250px)] pr-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
               <span className="text-lg">✨</span> Resumo da IA
            </div>
            
            {!selectedActivity?.resumo_ia ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[90%] rounded-md" />
                <Skeleton className="h-4 w-[95%] rounded-md" />
                <Skeleton className="h-4 w-[60%] rounded-md" />
              </div>
            ) : (
              <p className="text-slate-600 leading-relaxed text-sm antialiased whitespace-pre-line">
                {selectedActivity.resumo_ia}
              </p>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20" onClick={() => setIsOpen(false)}>
              Entendi
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
