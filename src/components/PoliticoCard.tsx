"use client"

import { Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Politico } from "@/lib/queries"
import { cn } from "@/lib/utils"

interface PoliticoCardProps {
  politico: Politico
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function PoliticoCard({ politico, isFavorite, onToggleFavorite }: PoliticoCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col pt-0">
      <CardContent className="p-4 flex gap-4 relative">
        <button 
          onClick={() => onToggleFavorite(politico.id)}
          className={cn(
            "absolute top-4 right-4 transition-colors p-1 rounded-full hover:bg-slate-50",
            isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-400"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>

        <Avatar className="h-14 w-14 border border-slate-100 shadow-sm">
          <AvatarImage src={politico.foto_url || ''} />
          <AvatarFallback>{politico.nome_urna[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Link href={`/perfil/${politico.id}`} className="block group">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-base">{politico.nome_urna}</h3>
            <p className="text-xs text-slate-500 mb-2">{politico.partido_atual} - {politico.uf}</p>
          </Link>

          <div className="flex gap-4 mb-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Assiduidade</span>
              <span className={`text-sm font-medium ${(politico.presenca_pct || 0) >= 90 ? 'text-emerald-600' : (politico.presenca_pct || 0) >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>
                {politico.presenca_pct}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Gastos Mensais</span>
              <span className="text-sm font-medium text-slate-900">
                R$ {((politico.despesas_mes || 0) / 1000).toFixed(1)}k
              </span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full text-xs" asChild>
            <Link href={`/perfil/${politico.id}`}>Ver Perfil Completo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
