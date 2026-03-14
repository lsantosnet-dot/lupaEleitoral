import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getFavoritesFeed, getUserFavorites } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Bell, Star } from 'lucide-react'
import Link from 'next/link'
import { FavoritosContent } from './FavoritosContent'
import { RecentActivities } from '@/components/RecentActivities'

export default async function Favoritos() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const [feed, monitorados] = await Promise.all([
    getFavoritesFeed(null, user.id),
    getUserFavorites(null, user.id)
  ])

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <FavoritosContent initialFavoritos={monitorados} />

      <div className="flex gap-2 mb-2 overflow-x-auto pb-2 hide-scrollbar">
         <Button variant="default" size="sm" className="rounded-full shadow-sm text-xs h-8">Todos</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Leis</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Gastos</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Eventos</Button>
      </div>

      <RecentActivities initialFeed={feed} />

      <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed mt-2">
        <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500 mb-4 max-w-[200px] mx-auto">Fique de olho em mais atualizações dos seus políticos favoritiados.</p>
        <Button variant="outline" className="text-primary font-bold uppercase tracking-wide text-xs bg-white" asChild>
           <Link href="/explorar">Explorar Mais Parlamentares</Link>
        </Button>
      </div>
    </div>
  )
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
