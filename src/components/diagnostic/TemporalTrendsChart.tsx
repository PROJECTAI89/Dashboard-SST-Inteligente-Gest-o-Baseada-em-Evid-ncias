import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { MOCK_TEMPORAL_DATA } from '../../data/mockSstData';

export const TemporalTrendsChart: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'taxas' | 'ocorrencias' | 'acoes' | 'inspecoes'>('taxas');

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg flex flex-col justify-between">
      {/* Header with metric toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Evolução Histórica e Tendências SST</h3>
          </div>
          <p className="text-[11px] text-slate-400">Acompanhamento temporal de taxas e desvios operacionais (Últimos 6 meses)</p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMetric('taxas')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'taxas' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TF e TG (NBR 14280)
          </button>
          <button
            onClick={() => setActiveMetric('ocorrencias')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'ocorrencias' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Acidentes vs Quase-Acidentes
          </button>
          <button
            onClick={() => setActiveMetric('acoes')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'acoes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ações (Prazo vs Atraso)
          </button>
          <button
            onClick={() => setActiveMetric('inspecoes')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeMetric === 'inspecoes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conformidade Inspeções (%)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'taxas' ? (
            <LineChart data={MOCK_TEMPORAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="taxaFrequencia" name="Taxa de Frequência (TF)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="taxaGravidade" name="Taxa de Gravidade (TG)" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            </LineChart>
          ) : activeMetric === 'ocorrencias' ? (
            <AreaChart data={MOCK_TEMPORAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQuase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAcid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="quaseAcidentes" name="Quase-Acidentes (Bird)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorQuase)" />
              <Area type="monotone" dataKey="acidentes" name="Acidentes Típicos" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAcid)" />
            </AreaChart>
          ) : activeMetric === 'acoes' ? (
            <LineChart data={MOCK_TEMPORAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="acoesConcluidas" name="Ações Concluídas no Prazo" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="acoesAtrasadas" name="Ações Atrasadas" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <LineChart data={MOCK_TEMPORAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="mes" stroke="#64748b" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="inspecoesConformidade" name="Conformidade de Checklists (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
