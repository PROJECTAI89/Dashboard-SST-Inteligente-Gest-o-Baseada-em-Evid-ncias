import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { TreinamentoColaborador } from '../../types/sst';

interface TrainingsModuleProps {
  treinamentos: TreinamentoColaborador[];
}

export const TrainingsModule: React.FC<TrainingsModuleProps> = ({ treinamentos }) => {
  const [filterNorma, setFilterNorma] = useState<string>('TODAS');
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [search, setSearch] = useState<string>('');

  const totalObrigatorios = treinamentos.length;
  const totalVigentes = treinamentos.filter((t) => t.status === 'Vigente').length;
  const totalVencidos = treinamentos.filter((t) => t.status === 'Vencido').length;
  const totalCriticos = treinamentos.filter((t) => t.status === 'Vence em 7 dias' || t.status === 'Vence em 15 dias').length;

  const cobertura = totalObrigatorios > 0 ? Number(((totalVigentes / totalObrigatorios) * 100).toFixed(1)) : 100;

  const filtered = treinamentos.filter((t) => {
    if (filterNorma !== 'TODAS' && t.norma !== filterNorma) return false;
    if (filterStatus !== 'TODOS' && t.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.colaboradorNome.toLowerCase().includes(q) ||
        t.matricula.toLowerCase().includes(q) ||
        t.cursoNome.toLowerCase().includes(q) ||
        t.setorNome.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: TreinamentoColaborador['status']) => {
    switch (status) {
      case 'Vencido':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse';
      case 'Vence em 7 dias':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30 font-bold';
      case 'Vence em 15 dias':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Vence em 30 dias':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Vigente':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Cobertura de Treinamentos</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{cobertura}%</div>
            <span className="text-[10px] text-slate-400">{totalVigentes} certificações em dia</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Certificações Vencidas</span>
            <div className={`text-2xl font-extrabold mt-0.5 ${totalVencidos > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalVencidos}
            </div>
            <span className="text-[10px] text-slate-400">Colaboradores inaptos por NR</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Vencendo em até 15 dias</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{totalCriticos}</div>
            <span className="text-[10px] text-slate-400">Necessita agendamento imediato</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Carga Horária Total</span>
            <div className="text-2xl font-extrabold text-blue-400 mt-0.5">
              {treinamentos.reduce((acc, t) => acc + t.cargaHoraria, 0)}h
            </div>
            <span className="text-[10px] text-slate-400">Capacitação registrada</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filter and search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar colaborador, matrícula..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filterNorma}
            onChange={(e) => setFilterNorma(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="TODAS">Todas as Normas (NRs)</option>
            <option value="NR-10">NR-10 (Segurança Elétrica)</option>
            <option value="NR-12">NR-12 (Segurança em Máquinas)</option>
            <option value="NR-33">NR-33 (Espaço Confinado)</option>
            <option value="NR-35">NR-35 (Trabalho em Altura)</option>
            <option value="NR-05">NR-05 (CIPA)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Vencido">Vencido</option>
            <option value="Vence em 7 dias">Vence em 7 dias</option>
            <option value="Vence em 15 dias">Vence em 15 dias</option>
            <option value="Vence em 30 dias">Vence em 30 dias</option>
            <option value="Vigente">Vigente</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Colaborador / Matrícula</th>
                <th className="px-4 py-3">Função & Setor</th>
                <th className="px-4 py-3">Norma Regulamentadora</th>
                <th className="px-4 py-3">Curso / Carga Horária</th>
                <th className="px-4 py-3">Data Realização</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3 text-right">Status de Validade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-100">{item.colaboradorNome}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.matricula}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{item.funcao}</div>
                    <div className="text-[11px] text-slate-400">{item.setorNome}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                      {item.norma}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200 font-medium">{item.cursoNome}</div>
                    <div className="text-[10px] text-slate-400">{item.cargaHoraria} horas curriculares</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.dataRealizacao}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-200">
                    {item.dataValidade}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
