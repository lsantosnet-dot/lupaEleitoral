"use client"

import { useState, useMemo } from "react"
import { useUser } from "@clerk/nextjs"
import { Politico, toggleFavorite } from "@/lib/queries"
import { PoliticoCard } from "@/components/PoliticoCard"
import { Star, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FavoritosContentProps {
  initialFavoritos: Politico[]
}

export function FavoritosContent({ initialFavoritos }: FavoritosContentProps) {
  const { user } = useUser()
  const [favoritos, setFavoritos] = useState<Politico[]>(initialFavoritos)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

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

  const filteredFavoritos = useMemo(() => {
    if (!searchTerm.trim()) return favoritos
    
    const term = searchTerm.toLowerCase()
    return favoritos.filter(p => 
      p.nome_urna.toLowerCase().includes(term) ||
      (p.partido_atual || "").toLowerCase().includes(term) ||
      (p.uf || "").toLowerCase().includes(term)
    )
  }, [favoritos, searchTerm])

  return (
    <div className="flex flex-col gap-6">
      {/* Header com Busca */}
      <div className="flex items-center justify-between mb-2">
         {!isSearchOpen ? (
           <>
             <h1 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" /> Favoritos
             </h1>
             <div className="flex items-center text-slate-500">
               <Search 
                 className="h-5 w-5 hover:text-slate-900 cursor-pointer" 
                 onClick={() => setIsSearchOpen(true)}
               />
             </div>
           </>
         ) : (
           <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right-2 duration-200">
             <div className="relative flex-1">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input 
                 autoFocus
                 placeholder="Filtrar por nome, partido ou estado..."
                 className="pl-9 h-10 border-slate-200 focus-visible:ring-primary/20"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button 
               onClick={() => {
                 setIsSearchOpen(false)
                 setSearchTerm("")
               }}
               className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
             >
               <X className="h-5 w-5" />
             </button>
           </div>
         )}
      </div>

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
        ) : filteredFavoritos.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed mt-2">
            <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
              Nenhum parlamentar encontrado com este termo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredFavoritos.map(p => (
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
