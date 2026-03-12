import { getHighlights } from "@/lib/queries"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const { assiduos, gastadores } = await getHighlights()

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl shadow-indigo-950/20 border border-slate-800/50">
        {/* Decorative Background Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col gap-4 max-w-[90%]">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 px-3 py-1 rounded-full w-fit">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Transparência Ativa</span>
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Fiscalize seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100">representantes</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Acompanhe o desempenho, gastos e projetos dos parlamentares de forma clara e objetiva.
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button size="default" className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl h-10 px-6 font-bold shadow-md transition-all active:scale-95" asChild>
              <Link href="/explorar">Começar agora</Link>
            </Button>
            <Button variant="outline" size="default" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-10 px-6 font-bold transition-all active:scale-95" asChild>
              <Link href="/ranking">Ver Ranking</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Acesso Rápido */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Acesso Rápido</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            href="/explorar?cargo=deputado" 
            className="group relative h-32 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <img 
              src="/images/camara.png" 
              alt="Câmara dos Deputados" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-white font-bold text-lg">Deputados</span>
              <span className="text-white/70 text-[10px] uppercase tracking-wider font-medium">Câmara Federal</span>
            </div>
          </Link>

          <Link 
            href="/explorar?cargo=senador" 
            className="group relative h-32 overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <img 
              src="/images/senado.png" 
              alt="Senado Federal" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
              <span className="text-white font-bold text-lg">Senadores</span>
              <span className="text-white/70 text-[10px] uppercase tracking-wider font-medium">Senado Federal</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Destaques do Mês</h2>
          <Button variant="link" size="sm" className="text-primary h-auto p-0">Ver todos</Button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
          
          <Card className="min-w-[240px] snap-center shrink-0 border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 uppercase text-[10px] tracking-wider">Desempenho</Badge>
              </div>
              <CardTitle className="text-md">Mais Assíduos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col gap-3">
              {assiduos.map(p => (
                <Link href={`/perfil/${p.id}`} key={p.id} className="flex gap-3 items-center group">
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                    <AvatarImage src={p.foto_url} />
                    <AvatarFallback>{p.nome_urna[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{p.nome_urna}</p>
                    <p className="text-xs text-slate-500">{p.presenca_pct}% Presença</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="min-w-[240px] snap-center shrink-0 border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-100 uppercase text-[10px] tracking-wider">Transparência</Badge>
              </div>
              <CardTitle className="text-md">Maiores Gastos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col gap-3">
               {gastadores.map(p => (
                <Link href={`/perfil/${p.id}`} key={p.id} className="flex gap-3 items-center group">
                  <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                    <AvatarImage src={p.foto_url} />
                    <AvatarFallback>{p.nome_urna[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{p.nome_urna}</p>
                    <p className="text-xs text-rose-600 font-medium">R$ {p.despesas_mes.toLocaleString('pt-BR')}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}
