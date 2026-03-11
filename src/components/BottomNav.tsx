"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LineChart, Compass, Bell, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return null;
  }

  const tabs = [
    { name: "Início", path: "/", icon: Home },
    { name: "Explorar", path: "/explorar", icon: Compass },
    { name: "Ranking", path: "/ranking", icon: LineChart },
    { name: "Alertas", path: "/alertas", icon: Bell },
    { name: "Perfil", path: "/favoritos", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
      <nav className="flex items-center justify-around p-2 md:hidden">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (pathname.startsWith(tab.path) && tab.path !== "/");
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center w-full min-h-[50px] space-y-1 ${
                isActive ? "text-primary font-medium" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px]">{tab.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
