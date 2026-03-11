import { Suspense } from "react"
import { getPoliticos } from "@/lib/queries"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ExplorarContent } from "./ExplorarContent"

export default async function Explorar() {
  const initialPoliticos = await getPoliticos();

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold flex-1">Explorar Parlamentares</h1>
      </div>
      
      <Suspense fallback={<div className="text-center py-10 opacity-50">Carregando parlamentares...</div>}>
         <ExplorarContent initialPoliticos={initialPoliticos} />
      </Suspense>
    </div>
  )
}
