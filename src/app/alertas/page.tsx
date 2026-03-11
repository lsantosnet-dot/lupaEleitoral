import { Bell } from "lucide-react"

export default function AlertasPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6 relative">
        <Bell className="h-12 w-12 text-primary" />
        <span className="absolute top-4 right-4 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Seus Alertas</h1>
      <p className="text-slate-500 max-w-sm">
        Central de notificações. Você receberá atualizações sobre os políticos que acompanha aqui.
      </p>
    </div>
  )
}
