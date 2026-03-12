"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Politico, toggleFavorite } from "@/lib/queries"
import { PoliticoCard } from "@/components/PoliticoCard"
import { Star } from "lucide-react"

interface FavoritosContentProps {
  initialFavoritos: Politico[]
}

export function FavoritosContent({ initialFavoritos }: FavoritosContentProps) {
  const { user } = useUser()
  const [favoritos, setFavoritos] = useState<Politico[]>(initialFavoritos)

  const handleToggleFavorite = async (politicoId: string) => {
    if (!user) return

    // Optimistic UI for removal
    const originalFavoritos = [...favoritos]
    setFavoritos(prev => prev.filter(p => p.id !== politicoId))

    try {
      const res = await toggleFavorite(null, user.id, politicoId)
      if (!res.success || res.action === 'added') {
        setFavoritos(originalFavoritos)
      }
    } catch (e) {
      setFavoritos(originalFavoritos)
      console.error("Erro ao remover favorito:", e)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-100 rounded-xl p-4">
        <h2 className="font-semibold text-slate-800 text-lg mb-1">
          Olá, {user?.firstName || 'Cidadão'}
        </h2>
        <p className="text-sm text-slate-600">
          Você está acompanhando <strong className="text-primary">{favoritos.length} parlamentares</strong>.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          Parlamentares Monitorados
        </h3>
        {favoritos.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed mt-2">
            <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
              Você ainda não monitora nenhum parlamentar. Vá em explorar para começar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {favoritos.map(p => (
              <PoliticoCard 
                key={p.id}
                politico={p}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
