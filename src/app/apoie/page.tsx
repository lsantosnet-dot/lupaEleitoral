"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle2, Heart } from "lucide-react"
import { useState } from "react"

export default function ApoiePage() {
  const pixPayload = "00020101021126330014BR.GOV.BCB.PIX0111917765626155204000053039865802BR5915LEONARDO SANTOS6007CURVELO62070503***63044036"
  const [copied, setCopied] = useState(false)

  const copyPix = () => {
    navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto min-h-[80vh] animate-in fade-in duration-500">
      <section className="text-center pt-6 pb-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-rose-50 mb-4 border border-rose-100">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500/10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apoie o projeto</h1>
        <p className="text-slate-500 text-sm mt-2 px-4">
          Ajude a manter a Lupa Eleitoral ativa e independente.
        </p>
      </section>

      <div className="bg-slate-900 text-white rounded-3xl p-6 mt-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Heart className="h-24 w-24 rotate-12" />
        </div>
        <p className="text-slate-300 text-sm leading-relaxed text-center font-medium relative z-10">
          A ética na política começa com a participação ativa de cada cidadão. Sua contribuição é fundamental para mantermos esta plataforma viva, gratuita e totalmente independente de interesses partidários. 
          <br /><br />
          Juntos, construímos uma democracia mais transparente e consciente. Sua ajuda faz a diferença!
        </p>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden rounded-3xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
          <CardTitle className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">QR Code PIX</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-8 gap-6">
          <div className="bg-white p-3 rounded-2xl border-4 border-slate-50 shadow-inner">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="QR Code PIX" 
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg"
            />
          </div>
          
          <div className="w-full space-y-3">
            <Button 
              variant="outline" 
              className={`w-full h-12 rounded-xl transition-all duration-300 font-medium ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              onClick={copyPix}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar PIX Copia e Cola
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-auto pb-8 text-center">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          Transparência & Democracia • v1.0.18
        </p>
      </div>
    </div>
  )
}
