"use client"

import { use } from "react"
import { mockData } from "@/lib/mockData"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Share2, AlertTriangle, FileText, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function Perfil({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const politico = mockData.politicos.find(p => p.id === resolvedParams.id)
  
  if (!politico) return notFound()

  const projetos = mockData.projetos_recentes.filter(p => p.autor_id === politico.id)

  const maxGastoCasa = 45000 // Fake teto
  const mediaCasa = 38000 // Fake media
  const gastoPctTeto = (politico.despesas_mes / maxGastoCasa) * 100
  
  const gastoColor = politico.despesas_mes > mediaCasa ? 'bg-rose-500' : 'bg-emerald-500'

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* Header Area */}
      <div className="flex items-center justify-between">
         <Link href="/explorar" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
           <ChevronLeft className="h-5 w-5" />
         </Link>
         <h1 className="font-semibold text-sm text-slate-500 uppercase tracking-widest">Perfil Parlamentar</h1>
         <button className="p-2 -mr-2 text-slate-500 hover:text-slate-900">
           <Share2 className="h-5 w-5" />
         </button>
      </div>

      {/* Hero Profile */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4 inline-block">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src={politico.foto_url} />
            <AvatarFallback className="text-3xl">{politico.nome_urna[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white rounded-full p-1 shadow-sm">
             <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{politico.nome_urna}</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4 mt-1">
          <Badge variant="outline" className="font-medium bg-white">{politico.partido}-{politico.uf}</Badge>
          <span>Mandato 2023-2026</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
           {politico.tags_ia.map(tag => (
             <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs px-3 py-1 font-medium items-center gap-1.5">
               <span className="text-base leading-none pr-0.5">✨</span> {tag}
             </Badge>
           ))}
        </div>
      </div>

      {/* Alerta Serenata */}
      {politico.despesas_mes > mediaCasa && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-4 items-start shadow-sm mt-2">
           <AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
           <div className="flex-1">
             <h4 className="font-semibold text-rose-900 text-sm">2 despesas sob investigação</h4>
             <p className="text-xs text-rose-700/80 mt-1 mb-2">Identificado pela Operação Serenata de Amor</p>
             <Button variant="destructive" size="sm" className="h-7 text-xs bg-rose-600">Ver detalhes</Button>
           </div>
        </div>
      )}

      {/* Termômetro */}
      <Card className="border-slate-200 shadow-sm mt-2">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💸</span>
            <CardTitle className="text-base font-semibold">Termômetro de Gastos</CardTitle>
          </div>
          <span className="text-xs text-slate-400 font-medium">CEAP 2024</span>
        </CardHeader>
        <CardContent className="p-4 pt-2">
           <div className="flex justify-between items-end mb-2">
             <span className="text-sm text-slate-500 font-medium">Gasto Acumulado</span>
             <span className="text-xl font-bold text-slate-900">R$ {politico.despesas_mes.toLocaleString('pt-BR')}</span>
           </div>
           
           <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mt-3 relative">
              <div 
                className={`h-full ${gastoColor} transition-all duration-1000 ease-out`} 
                style={{ width: `${Math.min(gastoPctTeto, 100)}%` }} 
              />
              <div className="absolute top-0 bottom-0 left-[60%] border-l-2 border-dashed border-slate-400/50 w-px" />
           </div>
           
           <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2 tracking-wider">
             <span>MIN: R$ 0</span>
             <span className="ml-[20%]">MÉDIA: R$ 38K</span>
             <span>TETO: R$ 45K</span>
           </div>
        </CardContent>
      </Card>

      {/* Grid Dados Secundários */}
      <div className="grid grid-cols-2 gap-4">
        {/* Assiduidade Simplificada (Donut estático MVP) */}
        <Card className="border-slate-200 shadow-sm text-center">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Assiduidade</h4>
            <div className="relative h-20 w-20 flex items-center justify-center mb-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 drop-shadow-sm"
                  strokeDasharray={`${politico.presenca_pct}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-lg font-bold text-slate-900">{politico.presenca_pct}%</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Presença</span>
          </CardContent>
        </Card>

        {/* Patrimônio Simplificado (Gráfico Barras estático MVP) */}
        <Card className="border-slate-200 shadow-sm text-center flex flex-col justify-between">
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Patrimônio</h4>
            
            <div className="flex items-end justify-center gap-2 h-16 w-full mb-3 px-2">
               <div className="w-1/3 bg-slate-200 rounded-t-sm h-[30%]" />
               <div className="w-1/3 bg-slate-300 rounded-t-sm h-[60%]" />
               <div className="w-1/3 bg-primary rounded-t-sm h-[90%] shadow-sm relative group">
                  <div className="absolute -top-3 -right-1 w-2 h-2 rounded-full bg-primary" />
               </div>
            </div>
            
            <div className="flex justify-between w-full text-[8px] text-slate-400 font-medium px-1">
              <span>2018</span>
              <span>2022</span>
              <span className="text-primary font-bold">2026</span>
            </div>
            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 py-0.5 px-2 rounded mt-2 inline-block">
              +32% crescimento
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Projetos Recentes */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-lg text-slate-900">Últimos Projetos</h3>
          <Button variant="link" size="sm" className="text-primary h-auto p-0">Ver todos</Button>
        </div>

        <div className="flex flex-col gap-3">
          {projetos.map(proj => (
            <Card key={proj.id} className="border-slate-200 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                 <div className="flex justify-between items-start mb-2">
                   <Badge variant="outline" className="text-[10px] font-bold text-slate-500 bg-slate-50">{proj.numero}</Badge>
                   <span className="text-xs text-slate-400 font-medium">Há {proj.dias_atras} dias</span>
                 </div>
                 <h4 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{proj.titulo}</h4>
                 <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-sm relative">
                    <span className="absolute -top-2.5 -left-1 text-base">✨</span>
                    <p className="text-slate-700 leading-snug"><strong className="text-amber-800">Resumo IA:</strong> {proj.resumo_ia}</p>
                 </div>
              </CardContent>
            </Card>
          ))}
          {projetos.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-4">Nenhum projeto recente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
