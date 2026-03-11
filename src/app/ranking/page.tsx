import { LineChart } from "lucide-react"

export default function RankingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <LineChart className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Ranking de Políticos</h1>
      <p className="text-slate-500 max-w-sm">
        Esta funcionalidade está em desenvolvimento. Em breve você poderá ver o ranking dos representantes melhor avaliados.
      </p>
    </div>
  )
}
