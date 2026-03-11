import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { mockData } from '@/lib/mockData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Search, Star, ThumbsUp, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function Favoritos() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const feed = mockData.feed_favoritos

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary" /> Meu Eleitorado
         </h1>
         <div className="flex gap-3 text-slate-500">
           <Search className="h-5 w-5 hover:text-slate-900 cursor-pointer" />
           <Bell className="h-5 w-5 hover:text-slate-900 cursor-pointer" />
         </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-4">
        <h2 className="font-semibold text-slate-800 text-lg mb-1">Olá, {user.firstName || 'Cidadão'}</h2>
        <p className="text-sm text-slate-600">Você está acompanhando <strong className="text-primary">12 parlamentares</strong>.</p>
      </div>

      <div className="flex gap-2 mb-2 overflow-x-auto pb-2 hide-scrollbar">
         <Button variant="default" size="sm" className="rounded-full shadow-sm text-xs h-8">Todos</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Leis</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Gastos</Button>
         <Button variant="outline" size="sm" className="rounded-full bg-white text-xs h-8 text-slate-600">Eventos</Button>
      </div>

      <div className="flex flex-col gap-5">
         {feed.map(item => {
           return (
             <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden flex flex-col pt-0">
                <div className="h-32 bg-slate-200 w-full relative group">
                   {/* Fake Banner */}
                   <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-slate-800/10 transition-colors" />
                   
                   <div className="absolute bottom-3 left-4 flex flex-col">
                      <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                           <AvatarImage src={item.politico.foto} />
                           <AvatarFallback>{item.politico.nome[0]}</AvatarFallback>
                         </Avatar>
                         <span className="text-white font-medium text-sm drop-shadow-md">{item.politico.nome}</span>
                      </div>
                   </div>
                </div>

                <CardContent className="p-4">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{item.tipo}</span>
                      <span className="text-[10px] font-medium text-slate-400">{item.tempo}</span>
                   </div>
                   
                   <p className="font-medium text-slate-800 leading-snug mb-4">{item.titulo}</p>
                   
                   <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                      <div className="flex gap-4 text-slate-500">
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                          <ThumbsUp className="h-4 w-4" /> <span className="text-xs font-medium">{item.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                          <MessageSquare className="h-4 w-4" /> <span className="text-xs font-medium">{item.comments}</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0 hover:bg-transparent" asChild>
                        <Link href="#">Ver detalhes <span className="ml-1">›</span></Link>
                      </Button>
                   </div>
                </CardContent>
             </Card>
           )
         })}

         <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 border-dashed mt-2">
           <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
           <p className="text-sm text-slate-500 mb-4 max-w-[200px] mx-auto">Fique de olho em mais atualizações dos seus políticos favoritiados.</p>
           <Button variant="outline" className="text-primary font-bold uppercase tracking-wide text-xs bg-white" asChild>
              <Link href="/explorar">Explorar Mais Parlamentares</Link>
           </Button>
         </div>
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
