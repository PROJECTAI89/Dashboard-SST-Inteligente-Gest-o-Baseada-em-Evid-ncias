import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  X,
  ChevronRight,
  Filter,
  Info,
  User,
  Shield,
  Layers,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { RiscoMatriz } from '../../types/sst';

interface RiskMatrix3x3Props {
  riscos: RiscoMatriz[];
  onOpenAction?: (actionId: string) => void;
}

export type CriticidadeFilter = 'Todos' | 'Baixo' | 'Médio' | 'Crítico';

export const RiskMatrix3x3: React.FC<RiskMatrix3x3Props> = ({ riscos, onOpenAction }) => {
  const [selectedCell, setSelectedCell] = useState<{ prob: number; sev: number; name: string } | null>(null);
  const [criticidadeFilter, setCriticidadeFilter] = useState<CriticidadeFilter>('Todos');
  const [hoveredCell, setHoveredCell] = useState<{ prob: number; sev: number } | null>(null);

  // Summary Metrics by Severity (NR-01)
  const summary = useMemo(() => {
    const total = riscos.length;
    const baixa = riscos.filter((r) => r.severidade === 1);
    const media = riscos.filter((r) => r.severidade === 2);
    const critica = riscos.filter((r) => r.severidade === 3);
    const criticosSemBarreira = riscos.filter((r) => r.status === 'Crítico Sem Barreira');

    return {
      total,
      baixaCount: baixa.length,
      baixaPct: total > 0 ? ((baixa.length / total) * 100).toFixed(0) : '0',
      mediaCount: media.length,
      mediaPct: total > 0 ? ((media.length / total) * 100).toFixed(0) : '0',
      criticaCount: critica.length,
      criticaPct: total > 0 ? ((critica.length / total) * 100).toFixed(0) : '0',
      criticosSemBarreiraCount: criticosSemBarreira.length
    };
  }, [riscos]);

  // Filtered risks according to selected criticality
  const displayedRiscos = useMemo(() => {
    if (criticidadeFilter === 'Todos') return riscos;
    if (criticidadeFilter === 'Crítico') {
      return riscos.filter((r) => r.classificacao === 'Crítico' || r.probabilidade * r.severidade >= 6);
    }
    if (criticidadeFilter === 'Médio') {
      return riscos.filter(
        (r) =>
          r.classificacao === 'Atenção' ||
          (r.probabilidade * r.severidade >= 3 && r.probabilidade * r.severidade < 6)
      );
    }
    if (criticidadeFilter === 'Baixo') {
      return riscos.filter((r) => r.classificacao === 'Aceitável' || r.probabilidade * r.severidade <= 2);
    }
    return riscos;
  }, [riscos, criticidadeFilter]);

  // Group displayed risks by (prob, sev)
  const getRisksForCell = (prob: number, sev: number) => {
    return displayedRiscos.filter((r) => r.probabilidade === prob && r.severidade === sev);
  };

  const getCellClassification = (
    prob: number,
    sev: number
  ): { score: number; label: string; bg: string; border: string; text: string; glow: string } => {
    const score = prob * sev;
    if (score >= 6) {
      return {
        score,
        label: 'Crítico',
        bg: 'bg-rose-950/40 hover:bg-rose-900/60',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        glow: 'hover:shadow-rose-950/50'
      };
    }
    if (score >= 3) {
      return {
        score,
        label: 'Atenção',
        bg: 'bg-amber-950/40 hover:bg-amber-900/60',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        glow: 'hover:shadow-amber-950/50'
      };
    }
    return {
      score,
      label: 'Aceitável',
      bg: 'bg-emerald-950/40 hover:bg-emerald-900/60',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      glow: 'hover:shadow-emerald-950/50'
    };
  };

  const activeModalRisks = selectedCell
    ? getRisksForCell(selectedCell.prob, selectedCell.sev)
    : [];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg flex flex-col justify-between space-y-4">
      {/* 1. Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Matriz de Riscos 3x3 (NR-01 / GRO)</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              P × S
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Classificação bidimensional de Probabilidade vs. Severidade • Passe o mouse para detalhes e clique para drill-down
          </p>
        </div>

        {/* Dropdown Filter by Criticality */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <label htmlFor="risk-criticidade-select" className="text-[11px] font-medium text-slate-300 whitespace-nowrap">
              Criticidade:
            </label>
            <select
              id="risk-criticidade-select"
              value={criticidadeFilter}
              onChange={(e) => setCriticidadeFilter(e.target.value as CriticidadeFilter)}
              className="bg-transparent text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="Todos" className="bg-slate-900 text-slate-100">
                Todos os Níveis ({riscos.length})
              </option>
              <option value="Crítico" className="bg-slate-900 text-rose-300">
                Crítico (P×S ≥ 6)
              </option>
              <option value="Médio" className="bg-slate-900 text-amber-300">
                Médio / Atenção (P×S 3-4)
              </option>
              <option value="Baixo" className="bg-slate-900 text-emerald-300">
                Baixo / Aceitável (P×S 1-2)
              </option>
            </select>
          </div>

          {criticidadeFilter !== 'Todos' && (
            <button
              onClick={() => setCriticidadeFilter('Todos')}
              className="px-2 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="Limpar filtro de criticidade"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* 2. Small Summary Panel: Total Active Risks by Severity Level (Baixo/Médio/Crítico) */}
      <div id="risk-matrix-summary-panel" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Active Risks */}
        <button
          type="button"
          onClick={() => setCriticidadeFilter('Todos')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            criticidadeFilter === 'Todos'
              ? 'bg-slate-800/90 border-slate-600 ring-1 ring-amber-500/40'
              : 'bg-slate-950/60 border-slate-800/90 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              Total Ativos
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              100%
            </span>
          </div>
          <div className="text-lg font-bold text-white mt-1">{summary.total}</div>
          <span className="text-[10px] text-slate-400 truncate block">Inventário Geral GRO</span>
        </button>

        {/* Severity: Baixo (S1) */}
        <button
          type="button"
          onClick={() => setCriticidadeFilter('Baixo')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            criticidadeFilter === 'Baixo'
              ? 'bg-emerald-950/50 border-emerald-500/60 ring-1 ring-emerald-500/40'
              : 'bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-950/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Baixo (S1)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
              {summary.baixaPct}%
            </span>
          </div>
          <div className="text-lg font-bold text-emerald-300 mt-1">{summary.baixaCount}</div>
          <span className="text-[10px] text-slate-400 truncate block">Leve • Aceitável</span>
        </button>

        {/* Severity: Médio (S2) */}
        <button
          type="button"
          onClick={() => setCriticidadeFilter('Médio')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            criticidadeFilter === 'Médio'
              ? 'bg-amber-950/50 border-amber-500/60 ring-1 ring-amber-500/40'
              : 'bg-amber-950/20 border-amber-500/20 hover:bg-amber-950/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Médio (S2)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
              {summary.mediaPct}%
            </span>
          </div>
          <div className="text-lg font-bold text-amber-300 mt-1">{summary.mediaCount}</div>
          <span className="text-[10px] text-slate-400 truncate block">Requer Atenção</span>
        </button>

        {/* Severity: Crítico (S3) */}
        <button
          type="button"
          onClick={() => setCriticidadeFilter('Crítico')}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            criticidadeFilter === 'Crítico'
              ? 'bg-rose-950/50 border-rose-500/60 ring-1 ring-rose-500/40'
              : 'bg-rose-950/20 border-rose-500/20 hover:bg-rose-950/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase text-rose-400 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              Crítico (S3)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-semibold">
              {summary.criticaPct}%
            </span>
          </div>
          <div className="text-lg font-bold text-rose-300 mt-1 flex items-center gap-1.5">
            {summary.criticaCount}
            {summary.criticosSemBarreiraCount > 0 && (
              <span className="text-[9px] font-mono font-normal px-1 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/40">
                {summary.criticosSemBarreiraCount} s/ barreira
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 truncate block">Prioridade Máxima</span>
        </button>
      </div>

      {/* 3. 3x3 Matrix Grid with Tooltip Trigger on Cell Hover */}
      <div className="py-1 relative">
        <div className="flex">
          {/* Y Axis Label (Probabilidade) */}
          <div className="flex flex-col justify-around pr-2.5 text-[11px] font-semibold text-slate-400 text-right w-20">
            <span className="text-rose-400">P3: Alta</span>
            <span className="text-amber-400">P2: Média</span>
            <span className="text-emerald-400">P1: Baixa</span>
          </div>

          {/* Matrix Cells 3x3 */}
          <div className="flex-1 grid grid-cols-3 gap-2.5">
            {/* Rows order: Prob 3 (Top), Prob 2 (Middle), Prob 1 (Bottom) */}
            {[3, 2, 1].map((prob) =>
              [1, 2, 3].map((sev) => {
                const cellRisks = getRisksForCell(prob, sev);
                const classif = getCellClassification(prob, sev);
                const isHovered = hoveredCell?.prob === prob && hoveredCell?.sev === sev;
                const matchesFilter =
                  criticidadeFilter === 'Todos' ||
                  (criticidadeFilter === 'Crítico' && classif.score >= 6) ||
                  (criticidadeFilter === 'Médio' && classif.score >= 3 && classif.score < 6) ||
                  (criticidadeFilter === 'Baixo' && classif.score <= 2);

                const sevLabel = sev === 1 ? 'Baixa' : sev === 2 ? 'Média' : 'Alta';
                const probLabel = prob === 1 ? 'Baixa' : prob === 2 ? 'Média' : 'Alta';

                return (
                  <div
                    key={`cell-container-${prob}-${sev}`}
                    className="relative group"
                    onMouseEnter={() => setHoveredCell({ prob, sev })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCell({
                          prob,
                          sev,
                          name: `Probabilidade ${probLabel} (P${prob}) × Severidade ${sevLabel} (S${sev})`
                        })
                      }
                      className={`w-full p-3.5 rounded-lg border ${classif.border} ${classif.bg} ${classif.glow} transition-all flex flex-col items-center justify-center cursor-pointer text-center relative ${
                        !matchesFilter ? 'opacity-35 hover:opacity-75' : 'opacity-100 shadow-sm'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        Score {classif.score}
                      </span>
                      <span className={`text-2xl font-extrabold ${classif.text} my-0.5`}>
                        {cellRisks.length}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-300">{classif.label}</span>

                      {/* Small badge indicator if any risk has no barrier */}
                      {cellRisks.some((r) => r.status === 'Crítico Sem Barreira') && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </button>

                    {/* Interactive Tooltip showing 'Controle Existente' and 'Responsável' on cell hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: prob === 3 ? 6 : -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className={`absolute z-40 w-72 sm:w-80 md:w-96 max-w-xs sm:max-w-sm pointer-events-none p-3.5 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md text-left ${
                            prob === 3 ? 'top-full mt-2' : 'bottom-full mb-2'
                          } ${
                            sev === 1
                              ? 'left-0'
                              : sev === 3
                              ? 'right-0'
                              : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          {/* Tooltip Header */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  classif.score >= 6
                                    ? 'bg-rose-500'
                                    : classif.score >= 3
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                              <h4 className="text-xs font-bold text-white">
                                P{prob} ({probLabel}) × S{sev} ({sevLabel})
                              </h4>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                classif.score >= 6
                                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                                  : classif.score >= 3
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              Score {classif.score} • {classif.label}
                            </span>
                          </div>

                          {/* Tooltip Content */}
                          <div className="text-xs space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>Riscos no quadrante:</span>
                              <strong className="text-slate-200">{cellRisks.length} ativo(s)</strong>
                            </div>

                            {cellRisks.length === 0 ? (
                              <p className="text-[11px] text-slate-500 italic py-1">
                                Nenhum perigo registrado para este quadrante com o filtro atual.
                              </p>
                            ) : (
                              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                {cellRisks.slice(0, 3).map((r) => (
                                  <div
                                    key={`tooltip-item-${r.id}`}
                                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5"
                                  >
                                    <div className="flex items-start justify-between gap-1.5">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="font-mono text-[9px] font-bold px-1 py-0.2 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                                          {r.codigo}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-200 truncate">
                                          {r.perigo}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Controle Existente */}
                                    <div className="text-[10px] leading-tight">
                                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                                        <Shield className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                        Controle Existente:
                                      </span>
                                      <p className="text-slate-300 pl-3.5 mt-0.5">
                                        {r.controlesExistentes && r.controlesExistentes.length > 0
                                          ? r.controlesExistentes.join('; ')
                                          : 'Nenhum controle formal documentado'}
                                      </p>
                                    </div>

                                    {/* Responsável e Setor */}
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                                      <span className="flex items-center gap-1 text-slate-300 truncate">
                                        <User className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                        <strong>Resp:</strong> {r.responsavel}
                                      </span>
                                      <span className="text-slate-400 shrink-0 ml-1">
                                        {r.setorNome}
                                      </span>
                                    </div>
                                  </div>
                                ))}

                                {cellRisks.length > 3 && (
                                  <p className="text-[10px] text-amber-400 text-center font-medium">
                                    + {cellRisks.length - 3} outro(s) risco(s) nesta célula
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Call to action note */}
                            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                              Clique no quadrante para abrir o inventário e plano 5W2H →
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* X Axis Labels (Severidade) */}
        <div className="flex pl-20 pt-2.5 text-[11px] font-semibold text-slate-400 text-center">
          <div className="flex-1 text-emerald-400">S1: Baixa</div>
          <div className="flex-1 text-amber-400">S2: Média</div>
          <div className="flex-1 text-rose-400">S3: Alta</div>
        </div>
      </div>

      {/* 4. Drill-down modal for clicked cell */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Riscos Operacionais ({selectedCell.name})</h3>
                  <p className="text-[11px] text-slate-400">{activeModalRisks.length} risco(s) identificados nesta categoria</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 overflow-y-auto space-y-3 flex-1">
              {activeModalRisks.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Nenhum risco cadastrado neste quadrante para o filtro selecionado.</p>
              ) : (
                activeModalRisks.map((risco) => (
                  <div key={risco.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                            {risco.codigo}
                          </span>
                          <span className="text-xs font-bold text-slate-100">{risco.perigo}</span>
                        </div>
                        <p className="text-xs text-rose-300 mt-0.5 font-medium">Risco: {risco.risco}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        risco.status === 'Crítico Sem Barreira'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {risco.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                      <div><strong>Local:</strong> {risco.unidadeNome} • {risco.setorNome}</div>
                      <div><strong>Expostos:</strong> {risco.trabalhadoresExpostos} colaboradores</div>
                      <div><strong>Fonte:</strong> {risco.fonteGeradora}</div>
                      <div><strong>Responsável:</strong> {risco.responsavel}</div>
                    </div>

                    {/* Controles Existentes & Necessários */}
                    <div className="pt-2 text-[11px] space-y-1.5">
                      <div className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1 mb-0.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Controles Existentes:
                        </span>
                        <p className="text-slate-300 text-[11px]">
                          {risco.controlesExistentes && risco.controlesExistentes.length > 0
                            ? risco.controlesExistentes.join('; ')
                            : 'Nenhum controle formal cadastrado'}
                        </p>
                      </div>

                      <div className="text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        <span className="text-amber-400 font-semibold flex items-center gap-1 mb-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Controles Necessários (PGR):
                        </span>
                        <p className="text-slate-300 text-[11px]">
                          {risco.controlesNecessarios.join('; ')}
                        </p>
                      </div>

                      {risco.acaoVinculadaId && (
                        <div className="flex items-center gap-1.5 text-amber-400 font-medium pt-1">
                          <span>Ação Vinculada: {risco.acaoVinculadaId}</span>
                          {onOpenAction && (
                            <button
                              onClick={() => {
                                setSelectedCell(null);
                                onOpenAction(risco.acaoVinculadaId!);
                              }}
                              className="text-xs underline hover:text-amber-300 ml-2 cursor-pointer"
                            >
                              Ver Plano 5W2H →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-4 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
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

