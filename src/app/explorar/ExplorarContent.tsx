"use client"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, X, Check, FilterX } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Politico } from "@/lib/queries"
import { cn } from "@/lib/utils"

interface ExplorarContentProps {
  initialPoliticos: Politico[]
}

export function ExplorarContent({ initialPoliticos }: ExplorarContentProps) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('cargo') === 'senador' ? 'senadores' : 'deputados'

  const [tab, setTab] = useState(defaultTab)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUFs, setSelectedUFs] = useState<string[]>([])
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("nome") // nome, assiduidade, gastos

  // State for dropdowns open
  const [openUF, setOpenUF] = useState(false)
  const [openPartido, setOpenPartido] = useState(false)

  // Extrair opções únicas para os filtros
  const ufs = useMemo(() => [...new Set(initialPoliticos.map(p => p.uf).filter(Boolean))].sort() as string[], [initialPoliticos])
  const partidos = useMemo(() => [...new Set(initialPoliticos.map(p => p.partido_atual).filter(Boolean))].sort() as string[], [initialPoliticos])

  const toggleUF = (uf: string) => {
    setSelectedUFs(prev => 
      prev.includes(uf) ? prev.filter(i => i !== uf) : [...prev, uf]
    )
  }

  const togglePartido = (partido: string) => {
    setSelectedPartidos(prev => 
      prev.includes(partido) ? prev.filter(i => i !== partido) : [...prev, partido]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedUFs([])
    setSelectedPartidos([])
    setSortBy("nome")
  }

  const getFilteredAndSortedPoliticos = (cargoFilter: string) => {
    let filtered = initialPoliticos.filter((p) => {
      const matchesCargo = p.cargo_atual.toLowerCase() === cargoFilter;
      const matchesSearch = p.nome_urna.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.partido_atual || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUF = selectedUFs.length === 0 || selectedUFs.includes(p.uf || "");
      const matchesPartido = selectedPartidos.length === 0 || selectedPartidos.includes(p.partido_atual || "");

      return matchesCargo && matchesSearch && matchesUF && matchesPartido;
    });

    // Ordenação
    return filtered.sort((a, b) => {
      if (sortBy === "assiduidade") {
        return (b.presenca_pct || 0) - (a.presenca_pct || 0);
      }
      if (sortBy === "gastos") {
        return (b.despesas_mes || 0) - (a.despesas_mes || 0);
      }
      // Default: nome
      return a.nome_urna.localeCompare(b.nome_urna);
    });
  }

  const deputados = getFilteredAndSortedPoliticos("deputado")
  const senadores = getFilteredAndSortedPoliticos("senador")

  const renderList = (list: Politico[]) => {
    if (list.length === 0) {
      return <div className="text-center py-10 text-slate-500">Nenhum parlamentar encontrado para estes filtros.</div>
    }

    return (
      <div className="flex flex-col gap-4 mt-4">
        {list.map((p) => {
          return (
            <Card key={p.id} className="border-slate-200 shadow-sm overflow-hidden flex flex-col pt-0">
              <CardContent className="p-4 flex gap-4 relative">
                <button className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>

                <Avatar className="h-14 w-14 border border-slate-100 shadow-sm">
                  <AvatarImage src={p.foto_url || ''} />
                  <AvatarFallback>{p.nome_urna[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Link href={`/perfil/${p.id}`} className="block group">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-base">{p.nome_urna}</h3>
                    <p className="text-xs text-slate-500 mb-2">{p.partido_atual} - {p.uf}</p>
                  </Link>

                  <div className="flex gap-4 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Assiduidade</span>
                      <span className={`text-sm font-medium ${(p.presenca_pct || 0) >= 90 ? 'text-emerald-600' : (p.presenca_pct || 0) >= 80 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {p.presenca_pct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Gastos Mensais</span>
                      <span className="text-sm font-medium text-slate-900">
                        R$ {((p.despesas_mes || 0) / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link href={`/perfil/${p.id}`}>Ver Perfil Completo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const hasAnyFilter = searchTerm !== "" || selectedUFs.length > 0 || selectedPartidos.length > 0 || sortBy !== "nome"

  return (
    <div className="w-full">
      <Tabs defaultValue={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100">
          <TabsTrigger value="deputados" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Deputados</TabsTrigger>
          <TabsTrigger value="senadores" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Senadores</TabsTrigger>
        </TabsList>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            className="pl-9 bg-white border-slate-200 shadow-sm pr-10"
            placeholder="Buscar por nome ou partido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          {/* UF Filter */}
          <div className="relative flex-1 min-w-[100px]">
            <button
              onClick={() => { setOpenUF(!openUF); setOpenPartido(false); }}
              className={cn(
                "w-full flex items-center justify-between bg-white border border-slate-200 rounded-md py-1.5 px-3 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20",
                selectedUFs.length > 0 && "border-primary text-primary bg-primary/5"
              )}
            >
              <span className="truncate">{selectedUFs.length > 0 ? `${selectedUFs.length} UF(s)` : "UF"}</span>
              <span className="text-[8px] text-slate-400 ml-1">▼</span>
            </button>
            
            {openUF && (
              <div className="absolute z-50 mt-1 w-48 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg p-1">
                {ufs.map(uf => (
                  <div 
                    key={uf} 
                    onClick={() => toggleUF(uf)}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer text-xs rounded-sm"
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 border border-slate-300 rounded-sm flex items-center justify-center transition-colors",
                      selectedUFs.includes(uf) && "bg-primary border-primary"
                    )}>
                      {selectedUFs.includes(uf) && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {uf}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Partido Filter */}
          <div className="relative flex-1 min-w-[100px]">
            <button
              onClick={() => { setOpenPartido(!openPartido); setOpenUF(false); }}
              className={cn(
                "w-full flex items-center justify-between bg-white border border-slate-200 rounded-md py-1.5 px-3 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20",
                selectedPartidos.length > 0 && "border-primary text-primary bg-primary/5"
              )}
            >
              <span className="truncate">{selectedPartidos.length > 0 ? `${selectedPartidos.length} Sigla(s)` : "Sigla"}</span>
              <span className="text-[8px] text-slate-400 ml-1">▼</span>
            </button>

            {openPartido && (
              <div className="absolute z-50 mt-1 w-48 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg p-1">
                {partidos.map(p => (
                  <div 
                    key={p} 
                    onClick={() => togglePartido(p)}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer text-xs rounded-sm"
                  >
                    <div className={cn(
                      "w-3.5 h-3.5 border border-slate-300 rounded-sm flex items-center justify-center transition-colors",
                      selectedPartidos.includes(p) && "bg-primary border-primary"
                    )}>
                      {selectedPartidos.includes(p) && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sorting */}
          <div className="relative flex-1 min-w-[100px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              <option disabled>Ordenação</option>
              <option value="nome">Ordem</option>
              <option value="assiduidade">Mais Assíduos</option>
              <option value="gastos">Maiores Gastos</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="text-[8px] text-slate-400">▼</span>
            </div>
          </div>

          {/* Clear Button */}
          {hasAnyFilter && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-xs gap-1"
            >
              <FilterX className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>

        {/* Tags Section */}
        {(selectedUFs.length > 0 || selectedPartidos.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
            {selectedUFs.map(uf => (
              <Badge key={`uf-${uf}`} variant="secondary" className="pl-2 pr-1 py-0 gap-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 group">
                {uf}
                <button 
                  onClick={() => toggleUF(uf)}
                  className="p-0.5 rounded-full hover:bg-slate-300 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedPartidos.map(p => (
              <Badge key={`partido-${p}`} variant="secondary" className="pl-2 pr-1 py-0 gap-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 group">
                {p}
                <button 
                  onClick={() => togglePartido(p)}
                  className="p-0.5 rounded-full hover:bg-slate-300 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {tab === "deputados" && renderList(deputados)}
        {tab === "senadores" && renderList(senadores)}
      </Tabs>
      
      {/* Click outside to close dropdowns */}
      {(openUF || openPartido) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setOpenUF(false); setOpenPartido(false); }} 
        />
      )}
    </div>
  )
}
