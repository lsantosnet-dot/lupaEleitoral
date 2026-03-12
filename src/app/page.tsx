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
      <section className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 w-3/4">
          <h1 className="text-2xl font-bold mb-2">Fiscalize seus representantes</h1>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Transparência total sobre o desempenho e gastos dos políticos brasileiros.
          </p>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/explorar">Começar agora</Link>
          </Button>
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
