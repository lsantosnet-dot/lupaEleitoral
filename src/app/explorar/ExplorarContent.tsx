"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Politico } from "@/lib/queries"

interface ExplorarContentProps {
  initialPoliticos: Politico[]
}

export function ExplorarContent({ initialPoliticos }: ExplorarContentProps) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('cargo') === 'senador' ? 'senadores' : 'deputados'
  
  const [tab, setTab] = useState(defaultTab)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUF, setSelectedUF] = useState("Todas")
  const [selectedPartido, setSelectedPartido] = useState("Todos")
  const [sortBy, setSortBy] = useState("nome") // nome, assiduidade, gastos

  // Extrair opções únicas para os filtros
  const ufs = ["Todas", ...new Set(initialPoliticos.map(p => p.uf).filter(Boolean))].sort() as string[]
  const partidos = ["Todos", ...new Set(initialPoliticos.map(p => p.partido_atual).filter(Boolean))].sort() as string[]

  const getFilteredAndSortedPoliticos = (cargoFilter: string) => {
    let filtered = initialPoliticos.filter((p) => {
      const matchesCargo = p.cargo_atual.toLowerCase() === cargoFilter;
      const matchesSearch = p.nome_urna.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (p.partido_atual || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUF = selectedUF === "Todas" || p.uf === selectedUF;
      const matchesPartido = selectedPartido === "Todos" || p.partido_atual === selectedPartido;
      
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

  return (
    <>
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
            className="pl-9 bg-white border-slate-200 shadow-sm"
            placeholder="Buscar por nome ou partido..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 hide-scrollbar">
           {/* UF Filter */}
           <div className="relative min-w-[100px]">
             <select 
               value={selectedUF}
               onChange={(e) => setSelectedUF(e.target.value)}
               className="w-full appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
             >
               <option disabled>UF (Estado)</option>
               {ufs.map(uf => <option key={uf} value={uf}>{uf === "Todas" ? "Todas as UFs" : uf}</option>)}
             </select>
             <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
               <span className="text-[8px] text-slate-400">▼</span>
             </div>
           </div>

           {/* Partido Filter */}
           <div className="relative min-w-[100px]">
             <select 
               value={selectedPartido}
               onChange={(e) => setSelectedPartido(e.target.value)}
               className="w-full appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
             >
               <option disabled>Partido</option>
               {partidos.map(p => <option key={p} value={p}>{p === "Todos" ? "Todos os Partidos" : p}</option>)}
             </select>
             <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
               <span className="text-[8px] text-slate-400">▼</span>
             </div>
           </div>

           {/* Sorting */}
           <div className="relative min-w-[120px]">
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="w-full appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-xs text-slate-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
             >
               <option disabled>Ordenação</option>
               <option value="nome">Nome (A-Z)</option>
               <option value="assiduidade">Mais Assíduos</option>
               <option value="gastos">Maiores Gastos</option>
             </select>
             <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
               <span className="text-[8px] text-slate-400">▼</span>
             </div>
           </div>
        </div>

        {tab === "deputados" && renderList(deputados)}
        {tab === "senadores" && renderList(senadores)}
      </Tabs>
    </>
  )
}
