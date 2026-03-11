import Link from "next/link"
import { Bell, Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-16 items-center px-4 justify-between max-w-lg mx-auto md:max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
            <Search className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Lupa <span className="text-secondary-foreground">Eleitoral</span><span className="text-primary text-sm ml-1">2026</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="text-slate-500 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
