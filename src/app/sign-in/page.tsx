"use client"

import { SignIn } from "@clerk/nextjs"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative pb-24">
      <div className="p-4 flex items-center mb-8">
        <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
           <ChevronLeft className="h-5 w-5" />
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="mb-8 text-center max-w-sm">
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Acesse seu Eleitorado</h1>
           <p className="text-slate-600">Faça login para salvar políticos favoritos, receber alertas e acompanhar as votações importantes.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    </div>
  )
}
