import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Target,
  Sparkles,
  Database
} from 'lucide-react';
import { KPICardData, SemanticStatus } from '../../types/sst';
import { KPITrendLineChart } from './KPITrendLineChart';

interface KPICardsGridProps {
  cards: KPICardData[];
  onCardClick: (card: KPICardData) => void;
  onExplainAI?: (card: KPICardData) => void;
  onExplainKPI?: (card: KPICardData) => void;
}

const STATUS_CONFIG: Record<SemanticStatus, { border: string; bg: string; badge: string; text: string; label: string }> = {
  verde: {
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    bg: 'bg-emerald-950/20',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    text: 'text-emerald-400',
    label: 'Na Meta'
  },
  amarelo: {
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'bg-amber-950/20',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    text: 'text-amber-400',
    label: 'Atenção'
  },
  laranja: {
    border: 'border-orange-500/30 hover:border-orange-500/60',
    bg: 'bg-orange-950/20',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    text: 'text-orange-400',
    label: 'Risco Elevado'
  },
  vermelho: {
    border: 'border-rose-500/40 hover:border-rose-500/70',
    bg: 'bg-rose-950/25',
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse',
    text: 'text-rose-400',
    label: 'Crítico'
  },
  cinza: {
    border: 'border-slate-700/50 hover:border-slate-600',
    bg: 'bg-slate-900/40',
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
    text: 'text-slate-400',
    label: 'Sem Dados'
  }
};

export const KPICardsGrid: React.FC<KPICardsGridProps> = ({ cards, onCardClick, onExplainAI, onExplainKPI }) => {
  const handleExplain = onExplainAI || onExplainKPI;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const config = STATUS_CONFIG[card.statusSemantico];

        return (
          <div
            key={card.id}
            id={`kpi-card-${card.id}`}
            className={`group relative rounded-xl p-4 transition-all duration-200 border ${config.border} ${config.bg} bg-slate-900/60 hover:shadow-lg hover:shadow-slate-950/50 hover:-translate-y-0.5 flex flex-col justify-between`}
          >
            {/* Top row: Code, Polarity, Status badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {card.codigo}
                  </span>
                  {card.polaridade && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                      {card.polaridade === 'MENOR_MELHOR' ? '↓ Menor' : '↑ Maior'}
                    </span>
                  )}
                </div>
                <h3
                  onClick={() => onCardClick(card)}
                  className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {card.titulo}
                </h3>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${config.badge}`}>
                {config.label}
              </span>
            </div>

            {/* Main Value & Unit */}
            <div className="my-2 cursor-pointer" onClick={() => onCardClick(card)}>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${config.text}`}>
                  {card.valor}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {card.unidadeMedida}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {card.descricao}
              </p>
            </div>

            {/* Monthly Trend Line Chart (Growth/Decline Visualization) */}
            {card.monthlyHistory && card.monthlyHistory.length > 0 && (
              <KPITrendLineChart
                history={card.monthlyHistory}
                monthlyGrowth={card.monthlyGrowth}
                polaridade={card.polaridade}
                statusColor={config.text}
                unidadeMedida={card.unidadeMedida}
                kpiId={card.id}
              />
            )}

            {/* Bottom row: Meta & Actions (Explain with AI / Drill-down) */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Target className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">Meta: <strong className="text-slate-300 font-medium">{card.meta}</strong></span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {handleExplain && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplain(card);
                    }}
                    title="Explique este indicador com Inteligência Artificial (Seção 39)"
                    className="p-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/20 transition-colors flex items-center gap-1 text-[10px] font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span className="hidden xl:inline">Explicar</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onCardClick(card)}
                  className="flex items-center gap-0.5 text-slate-400 group-hover:text-amber-300 font-medium text-[10px]"
                >
                  <span>Drill-down</span>
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
