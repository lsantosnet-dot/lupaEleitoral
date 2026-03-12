"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PatrimonioData {
  ano_eleicao: number
  valor_declarado: number
}

interface PatrimonioChartProps {
  data: PatrimonioData[]
}

const formatCurrencyCompact = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

const formatCurrencyFull = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function PatrimonioChart({ data }: PatrimonioChartProps) {
  // Sort data by year
  const sortedData = [...data].sort((a, b) => a.ano_eleicao - b.ano_eleicao)

  if (sortedData.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Evolução Patrimonial
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center h-40 text-slate-400 text-xs">
          Dados patrimoniais não disponíveis
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-center">
          Evolução Patrimonial
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-4">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="ano_eleicao" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 'dataMax + 100000']}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border border-slate-800 text-[10px]">
                        <p className="font-bold mb-1">{payload[0].payload.ano_eleicao}</p>
                        <p className="text-slate-300">{formatCurrencyFull(payload[0].value as number)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="valor_declarado" 
                radius={[4, 4, 0, 0]}
                barSize={32}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === sortedData.length - 1 ? '#0ea5e9' : index === sortedData.length - 2 ? '#94a3b8' : '#cbd5e1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-4 px-2">
          {sortedData.map((item) => (
            <div key={item.ano_eleicao} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-900">
                {formatCurrencyCompact(item.valor_declarado)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
