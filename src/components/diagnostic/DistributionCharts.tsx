import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { Ocorrencia } from '../../types/sst';

interface DistributionChartsProps {
  ocorrencias: Ocorrencia[];
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({ ocorrencias }) => {
  const [viewBy, setViewBy] = useState<'setor' | 'turno' | 'tipo'>('setor');

  // Sector breakdown
  const sectorCounts: Record<string, number> = {};
  ocorrencias.forEach((o) => {
    const s = o.setorNome.split(' ')[0] + ' ' + (o.setorNome.split(' ')[1] || '');
    sectorCounts[s] = (sectorCounts[s] || 0) + 1;
  });
  const sectorData = Object.entries(sectorCounts).map(([name, total]) => ({ name, total }));

  // Turno breakdown
  const turnoCounts = {
    'Turno A (Manhã)': ocorrencias.filter((o) => o.turno === 'TURNO_A').length,
    'Turno B (Tarde)': ocorrencias.filter((o) => o.turno === 'TURNO_B').length,
    'Turno C (Noite)': ocorrencias.filter((o) => o.turno === 'TURNO_C').length,
  };
  const turnoData = Object.entries(turnoCounts).map(([name, value]) => ({ name, value }));

  // Tipo breakdown
  const tipoCounts: Record<string, number> = {};
  ocorrencias.forEach((o) => {
    const t = o.tipo.split(' ')[0] + (o.tipo.includes('CPT') ? ' (CPT)' : o.tipo.includes('SPT') ? ' (SPT)' : '');
    tipoCounts[t] = (tipoCounts[t] || 0) + 1;
  });
  const tipoData = Object.entries(tipoCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ['#f59e0b', '#38bdf8', '#f43f5e', '#a855f7', '#10b981'];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Distribuição de Desvios e Ocorrências</h3>
          </div>
          <p className="text-[11px] text-slate-400">Concentração por setor fabril, turno operacional e classificação</p>
        </div>

        {/* Dimension selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewBy('setor')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewBy === 'setor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Por Setor
          </button>
          <button
            onClick={() => setViewBy('turno')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewBy === 'turno' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Por Turno
          </button>
          <button
            onClick={() => setViewBy('tipo')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewBy === 'tipo' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Por Tipologia
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewBy === 'setor' ? (
            <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Bar dataKey="total" name="Total Ocorrências" radius={[4, 4, 0, 0]}>
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : viewBy === 'turno' ? (
            <PieChart>
              <Pie
                data={turnoData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {turnoData.map((entry, index) => (
                  <Cell key={`cell-t-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
            </PieChart>
          ) : (
            <BarChart layout="vertical" data={tipoData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
              />
              <Bar dataKey="value" name="Registros" fill="#38bdf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
