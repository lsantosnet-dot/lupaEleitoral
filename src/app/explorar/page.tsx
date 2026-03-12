import { Suspense } from "react"
import { getPoliticos, getUserFavoriteIds } from "@/lib/queries"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ExplorarContent } from "./ExplorarContent"

export default async function Explorar() {
  const initialPoliticos = await getPoliticos();
  const user = await currentUser();
  const { getToken } = await auth();

  let favoriteIds: string[] = [];
  if (user) {
    try {
      const token = await getToken({ template: 'supabase' }) || '';
      favoriteIds = await getUserFavoriteIds(token, user.id);
    } catch (e) {
      console.error("Erro ao buscar favoritos no servidor:", e);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold flex-1">Explorar Parlamentares</h1>
      </div>
      
      <Suspense fallback={<div className="text-center py-10 opacity-50">Carregando parlamentares...</div>}>
         <ExplorarContent initialPoliticos={initialPoliticos} initialFavoriteIds={favoriteIds} />
      </Suspense>
    </div>
  )
}
