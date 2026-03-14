"use client"

import { Share2, Smartphone, Monitor, ChevronRight, Share, MoreVertical, PlusSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompartilhePage() {
  const handleShare = async () => {
    const shareData = {
      title: 'Lupa Eleitoral 2026',
      text: 'Olá! Conheça o Lupa Eleitoral 2026, uma ferramenta incrível para fiscalizar nossos políticos e votar com consciência.\n\nPara instalar no seu celular, acesse: https://lupa-eleitoral.vercel.app/\n\nBasta abrir o link no seu navegador (Chrome ou Safari) e clicar em "Adicionar à tela inicial". É rápido e não ocupa espaço!',
      url: 'https://lupa-eleitoral.vercel.app/',
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback para cópia de link se a API de compartilhamento não estiver disponível
        await navigator.clipboard.writeText(shareData.text)
        alert('Mensagem copiada para a área de transferência!')
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-4 pb-24 max-w-lg mx-auto md:max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col gap-2 text-center mt-4">
        <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-primary/20">
          <Share2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Compartilhe a Ideia</h1>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Ajude a fortalecer a democracia convidando seus amigos para fiscalizar o poder público.
        </p>
      </div>

      {/* Share Button Section */}
      <div className="px-2">
        <Button 
          onClick={handleShare}
          className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Share2 className="h-6 w-6" />
          Enviar para amigos
        </Button>
      </div>

      {/* Installation Guide Section */}
      <section className="flex flex-col gap-4 mt-2">
        <div className="px-2">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-indigo-500" />
            Como instalar no celular
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Instale para abrir o Lupa Eleitoral como um aplicativo nativo.
          </p>
        </div>

        <Tabs defaultValue="android" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl p-1 bg-slate-100 mb-4 h-12">
            <TabsTrigger value="android" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
              Android
            </TabsTrigger>
            <TabsTrigger value="ios" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
              iPhone (iOS)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="android" className="space-y-3 px-2">
            <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-100 rounded-xl p-2.5 shrink-0">
                    <MoreVertical className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Passo 1</p>
                    <p className="text-sm text-slate-600">No topo do navegador Chrome, toque nos três pontinhos <span className="font-bold">⋮</span>.</p>
                  </div>
                </div>
                <div className="h-px bg-slate-50 w-full" />
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-100 rounded-xl p-2.5 shrink-0">
                    <Smartphone className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Passo 2</p>
                    <p className="text-sm text-slate-600">Selecione <span className="font-bold">Instalar aplicativo</span> ou <span className="font-bold">Adicionar à tela inicial</span>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ios" className="space-y-3 px-2">
            <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-100 rounded-xl p-2.5 shrink-0">
                    <Share className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Passo 1</p>
                    <p className="text-sm text-slate-600">Na barra inferior do Safari, toque no ícone de <span className="font-bold">Compartilhar</span> (quadrado com uma seta).</p>
                  </div>
                </div>
                <div className="h-px bg-slate-50 w-full" />
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-100 rounded-xl p-2.5 shrink-0">
                    <PlusSquare className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Passo 2</p>
                    <p className="text-sm text-slate-600">Role a lista e toque em <span className="font-bold">Adicionar à Tela de Início</span>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer Note */}
      <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 mt-2">
        <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
          <div className="p-1 bg-indigo-100 rounded-lg">✨</div>
          Por que instalar?
        </h3>
        <ul className="space-y-2">
          <li className="flex gap-2 text-xs text-indigo-700 font-medium">
            <ChevronRight className="h-3 w-3 shrink-0 mt-0.5" />
            Acesso rápido direto da sua tela inicial.
          </li>
          <li className="flex gap-2 text-xs text-indigo-700 font-medium">
            <ChevronRight className="h-3 w-3 shrink-0 mt-0.5" />
            Não ocupa espaço na memória do celular.
          </li>
          <li className="flex gap-2 text-xs text-indigo-700 font-medium">
            <ChevronRight className="h-3 w-3 shrink-0 mt-0.5" />
            Receba alertas de parlamentares em tempo real.
          </li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          Transparência & Democracia • v1.0.28
        </p>
      </div>
    </div>
  )
}
