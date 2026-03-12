import { getPoliticos } from "@/lib/queries"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function RankingPage() {
  const politicos = await getPoliticos();

  // Ordenar por presença
  const ranking = [...politicos].sort((a, b) => (b.presenca_pct || 0) - (a.presenca_pct || 0));

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold flex-1">Ranking de Assiduidade</h1>
      </div>

      <div className="flex flex-col gap-4">
        {ranking.map((p, index) => (
          <Card key={p.id} className="border-slate-200 shadow-sm relative overflow-hidden">
            {index < 3 && (
              <div className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center p-1 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : 'bg-amber-600'
                } text-white rounded-bl-xl shadow-sm`}>
                <Trophy className="h-4 w-4" />
              </div>
            )}
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-lg font-bold text-slate-400 w-6">#{index + 1}</span>

              <Avatar className="h-12 w-12 border border-slate-100 shadow-sm">
                <AvatarImage src={p.foto_url || ''} />
                <AvatarFallback>{p.nome_urna[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <Link href={`/perfil/${p.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-slate-900">{p.nome_urna}</h3>
                </Link>
                <p className="text-xs text-slate-500">{p.partido_atual} - {p.uf}</p>
              </div>

              <div className="text-right">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {p.presenca_pct}%
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Presença</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {ranking.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhum dado de ranking disponível.</p>
          </div>
        )}
      </div>
    </div>
  )
}
