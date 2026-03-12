"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

interface LoadingContextType {
  startLoading: () => void
  stopLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

// Separate component for search params that needs Suspense
function NavigationHandler({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onNavigate()
  }, [pathname, searchParams, onNavigate])

  return null
}

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      <Suspense fallback={null}>
        <NavigationHandler onNavigate={stopLoading} />
      </Suspense>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-slate-600">Carregando...</p>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  )
}
