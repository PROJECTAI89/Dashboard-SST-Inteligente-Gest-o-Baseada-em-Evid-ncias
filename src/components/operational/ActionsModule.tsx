import React, { useState } from 'react';
import {
  ListTodo,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  User,
  Calendar,
  DollarSign,
  FileCheck,
  Plus,
  X
} from 'lucide-react';
import { Acao5W2H } from '../../types/sst';

interface ActionsModuleProps {
  acoes: Acao5W2H[];
  onUpdateActionStatus: (actionId: string, newStatus: Acao5W2H['status'], evidence?: string) => void;
  targetActionId?: string | null;
}

export const ActionsModule: React.FC<ActionsModuleProps> = ({
  acoes,
  onUpdateActionStatus,
  targetActionId
}) => {
  const [filterStatus, setFilterStatus] = useState<string>(targetActionId ? 'TODOS' : 'TODOS');
  const [filterPriority, setFilterPriority] = useState<string>('TODAS');
  const [search, setSearch] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<Acao5W2H | null>(
    targetActionId ? acoes.find((a) => a.id === targetActionId || a.codigo === targetActionId) || null : null
  );
  const [evidenceText, setEvidenceText] = useState<string>('');

  // Calculations (Section 12 PRD)
  const totalAcoes = acoes.length;
  const acoesConcluidas = acoes.filter((a) => a.status === 'Concluída').length;
  const acoesAtivas = acoes.filter((a) => a.status !== 'Cancelada');
  const acoesAtrasadas = acoes.filter((a) => a.status === 'Atrasada').length;

  const taxaConclusao = totalAcoes > 0 ? Number(((acoesConcluidas / totalAcoes) * 100).toFixed(1)) : 0;
  const taxaAtraso = acoesAtivas.length > 0 ? Number(((acoesAtrasadas / acoesAtivas.length) * 100).toFixed(1)) : 0;

  const filtered = acoes.filter((a) => {
    if (filterStatus !== 'TODOS' && a.status !== filterStatus) return false;
    if (filterPriority !== 'TODAS' && a.prioridade !== filterPriority) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.codigo.toLowerCase().includes(q) ||
        a.titulo.toLowerCase().includes(q) ||
        a.quem.toLowerCase().includes(q) ||
        a.onde.toLowerCase().includes(q) ||
        a.origemIdReferencia.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Taxa de Conclusão 5W2H</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{taxaConclusao}%</div>
            <span className="text-[10px] text-slate-400">{acoesConcluidas} de {totalAcoes} ações finalizadas</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Taxa de Atraso de Ações</span>
            <div className={`text-2xl font-extrabold mt-0.5 ${taxaAtraso > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {taxaAtraso}%
            </div>
            <span className="text-[10px] text-slate-400">{acoesAtrasadas} ações ativas fora do prazo</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Ações em Andamento</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">
              {acoes.filter((a) => a.status === 'Em andamento').length}
            </div>
            <span className="text-[10px] text-slate-400">Em execução nos setores</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Prioridade Crítica</span>
            <div className="text-2xl font-extrabold text-purple-400 mt-0.5">
              {acoes.filter((a) => a.prioridade === 'Crítica').length}
            </div>
            <span className="text-[10px] text-slate-400">Impacto direto na vida</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por responsável, código, título..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Atrasada">Atrasada</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Em validação">Em validação</option>
            <option value="Não iniciada">Não iniciada</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="TODAS">Todas as Prioridades</option>
            <option value="Crítica">Prioridade Crítica</option>
            <option value="Alta">Prioridade Alta</option>
            <option value="Média">Prioridade Média</option>
            <option value="Baixa">Prioridade Baixa</option>
          </select>
        </div>
      </div>

      {/* Action Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            id={`action-card-${item.id}`}
            onClick={() => setSelectedAction(item)}
            className={`p-4 rounded-xl border bg-slate-900/80 hover:bg-slate-900 transition-all cursor-pointer space-y-3 ${
              item.status === 'Atrasada'
                ? 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20 shadow-md'
                : item.status === 'Concluída'
                ? 'border-emerald-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {item.codigo}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  item.prioridade === 'Crítica'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : item.prioridade === 'Alta'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {item.prioridade}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Ref: {item.origemIdReferencia}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                item.status === 'Atrasada'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                  : item.status === 'Concluída'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-sm font-bold text-white leading-snug">
              {item.titulo}
            </h4>

            {/* 5W2H Quick Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">QUEM (Responsável):</span>
                <strong className="text-slate-200">{item.quem}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">QUANDO (Prazo Limite):</span>
                <strong className={item.status === 'Atrasada' ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                  {item.quando}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ONDE (Local):</span>
                <span className="text-slate-300 line-clamp-1">{item.onde}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">INVESTIMENTO (Quanto):</span>
                <span className="text-amber-400 font-mono">{item.quantoCusta || 'N/A'}</span>
              </div>
            </div>

            {/* Evidence pill if completed */}
            {item.evidenciaConclusao && (
              <div className="text-[11px] text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 rounded p-2 line-clamp-2">
                <strong>Evidência Homologada:</strong> {item.evidenciaConclusao}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Detail & Update Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    {selectedAction.codigo}
                  </span>
                  <span className="text-sm font-bold text-white">{selectedAction.titulo}</span>
                </div>
                <p className="text-xs text-slate-400">Origem: {selectedAction.origem} ({selectedAction.origemIdReferencia})</p>
              </div>
              <button
                onClick={() => setSelectedAction(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Full 5W2H Matrix */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Detalhamento 5W2H</h4>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-slate-400 block font-semibold">1. WHAT (O que será feito):</span>
                    <p className="text-slate-200 mt-0.5">{selectedAction.oQue}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">2. WHY (Por que / Justificativa de Segurança):</span>
                    <p className="text-slate-200 mt-0.5">{selectedAction.porQue}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">3. WHERE (Onde):</span>
                    <p className="text-slate-200 mt-0.5">{selectedAction.onde}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">4. WHO (Quem é o responsável):</span>
                    <p className="text-slate-200 mt-0.5">{selectedAction.quem}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">5. WHEN (Prazo limite acordado):</span>
                    <p className={`mt-0.5 font-semibold ${selectedAction.status === 'Atrasada' ? 'text-rose-400' : 'text-slate-200'}`}>
                      {selectedAction.quando} {selectedAction.status === 'Atrasada' && '(VENCIDO - REQUER CONTENÇÃO)'}
                    </p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">6. HOW (Como será executado):</span>
                    <p className="text-slate-200 mt-0.5">{selectedAction.como}</p>
                  </div>
                  <div className="border-t border-slate-900 pt-1.5">
                    <span className="text-slate-400 block font-semibold">7. HOW MUCH (Custo estimado):</span>
                    <p className="text-amber-400 font-mono mt-0.5">{selectedAction.quantoCusta || 'Sem custo extra estimado'}</p>
                  </div>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs">Atualizar Status & Registrar Evidência</h4>
                <div className="flex flex-wrap gap-2">
                  {(['Não iniciada', 'Em andamento', 'Atrasada', 'Em validação', 'Concluída'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateActionStatus(selectedAction.id, st, evidenceText)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedAction.status === st
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-slate-400 block font-medium">Nota de Evidência / Laudo de Conclusão Técnica:</label>
                  <textarea
                    rows={2}
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    placeholder="Descreva a evidência de conclusão (ex: ART emitida pelo CREA, homologação pelo comitê CIPA, foto anexada)..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
