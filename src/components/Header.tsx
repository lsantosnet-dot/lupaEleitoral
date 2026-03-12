"use client"

import Link from "next/link"
import { Bell, Search, Menu, Home, Compass, LineChart, LogOut, User } from "lucide-react"
import { useUser, useClerk, SignOutButton } from "@clerk/nextjs"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { usePathname } from "next/navigation"

export function Header() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()

  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return null;
  }

  const tabs = [
    { name: "Início", path: "/", icon: Home },
    { name: "Explorar", path: "/explorar", icon: Compass },
    { name: "Ranking", path: "/ranking", icon: LineChart },
    { name: "Alertas", path: "/alertas", icon: Bell },
    { name: "Favoritos", path: "/favoritos", icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-16 items-center px-4 justify-between max-w-lg mx-auto md:max-w-7xl">
        <div className="flex items-center space-x-3">
          <Sheet>
            <SheetTrigger className="text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:max-w-sm flex flex-col h-full p-0">
              <SheetTitle className="sr-only">Menu Side Navigation</SheetTitle>
              <SheetDescription className="sr-only">Access navigation and profile settings</SheetDescription>
              {/* User Profile Area */}
              {user && (
                <div className="flex flex-col items-center justify-center py-10 px-6 border-b border-slate-100 bg-slate-50">
                  <Avatar className="h-20 w-20 mb-4 border-2 border-primary/20">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-slate-900">{user.fullName}</h3>
                  <p className="text-sm text-slate-500 mt-1">{user.primaryEmailAddress?.emailAddress}</p>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium bg-slate-100 px-2 py-0.5 rounded-full">v1.0.14</span>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {tabs.map((tab) => (
                  <SheetClose key={tab.path} nativeButton={false} render={
                    <Link
                      href={tab.path}
                      className="flex w-full items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors"
                    >
                      <tab.icon className="h-5 w-5 text-slate-500" />
                      <span className="font-medium">{tab.name}</span>
                    </Link>
                  } />
                ))}
              </nav>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 mt-auto">
                <SheetClose render={
                  <SignOutButton redirectUrl="/sign-in">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-6"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span className="font-medium">Sair da conta</span>
                    </Button>
                  </SignOutButton>
                } />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Lupa <span className="text-secondary-foreground">Eleitoral</span><span className="text-primary text-sm ml-1">2026</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-slate-500 hover:text-slate-900 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
