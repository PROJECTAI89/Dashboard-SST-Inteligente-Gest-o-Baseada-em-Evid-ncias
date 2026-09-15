import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { IndiceSaudeSSTResult, SaudeSSTWeights } from '../../types/sst';
import { INITIAL_SAUDE_WEIGHTS } from '../../data/mockSstData';

interface SaudeSSTGaugeProps {
  saudeData: IndiceSaudeSSTResult;
  weights: SaudeSSTWeights;
  onUpdateWeights: (newWeights: SaudeSSTWeights) => void;
  canEditWeights: boolean;
}

export const SaudeSSTGauge: React.FC<SaudeSSTGaugeProps> = ({
  saudeData,
  weights,
  onUpdateWeights,
  canEditWeights,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempWeights, setTempWeights] = useState<SaudeSSTWeights>(weights);

  // SVG circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (saudeData.score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (score >= 50) return { stroke: '#f97316', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { stroke: '#f43f5e', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const scoreColor = getScoreColor(saudeData.score);

  const handleSaveWeights = () => {
    onUpdateWeights(tempWeights);
    setShowConfigModal(false);
  };

  const handleResetWeights = () => {
    setTempWeights(INITIAL_SAUDE_WEIGHTS);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-5 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Índice de Saúde SST (ISSST)
              <span className="font-mono text-[10px] font-normal text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                IND-ISSST-05
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Score consolidado ponderado de maturidade e conformidade preventiva</p>
          </div>
        </div>

        {canEditWeights && (
          <button
            onClick={() => {
              setTempWeights(weights);
              setShowConfigModal(true);
            }}
            id="btn-configurar-pesos-issst"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Configurar Pesos dos Indicadores (wi)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurar Pesos (wi)</span>
          </button>
        )}
      </div>

      {/* Main Content: Circular Gauge + Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Score Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={scoreColor.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold tracking-tight ${scoreColor.text}`}>
                {saudeData.score}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                de 100 pts
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${scoreColor.badge}`}>
              Status: {saudeData.classificacao}
            </span>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Meta Organizacional: <strong className="text-slate-200">&gt;= 85.0 (Excelente)</strong>
            </p>
          </div>
        </div>

        {/* Right: Pillars & Contribution Breakdown */}
        <div className="md:col-span-8 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
            <span>Pilares Componentes do ISSST</span>
            <span>Score Parcial | Peso (wi)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {saudeData.detalhes.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between">
                <div className="flex items-start justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium text-[11px] line-clamp-1">{item.categoria}</span>
                  <span className="font-mono text-xs font-bold text-slate-200 ml-2">
                    {item.scoreParcial} <span className="text-[10px] font-normal text-slate-400">({(item.peso * 100).toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.scoreParcial >= 85 ? 'bg-emerald-500' : item.scoreParcial >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, item.scoreParcial)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 italic pt-1">
            * Nota legal: O ISSST é um índice gerencial estratégico para auxílio à tomada de decisão e não substitui a avaliação técnica ou legal dos laudos (NR-01 e NBR 14280).
          </p>
        </div>
      </div>

      {/* Weight Customization Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Configuração de Pesos do ISSST</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <p className="text-slate-300">
                Ajuste os pesos ponderados ($w_i$) dos 6 pilares de gestão de acordo com a política corporativa. A soma total deve ser igual a 100%.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'controleIncidentes', label: 'Controle de Incidentes e Acidentes', val: tempWeights.controleIncidentes },
                  { key: 'conformidadeInspecoes', label: 'Conformidade de Inspeções e Checklists', val: tempWeights.conformidadeInspecoes },
                  { key: 'gestaoRiscos', label: 'Gestão de Riscos Operacionais (NR-01)', val: tempWeights.gestaoRiscos },
                  { key: 'acoesNoPrazo', label: 'Execução de Ações 5W2H no Prazo', val: tempWeights.acoesNoPrazo },
                  { key: 'treinamentosRegulares', label: 'Capacitação e Treinamentos Regulamentares', val: tempWeights.treinamentosRegulares },
                  { key: 'documentosVigentes', label: 'Vigência de Laudos e Programas Legais', val: tempWeights.documentosVigentes },
                ].map((row) => (
                  <div key={row.key} className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0.05"
                        max="0.50"
                        step="0.05"
                        value={row.val}
                        onChange={(e) =>
                          setTempWeights({
                            ...tempWeights,
                            [row.key]: parseFloat(e.target.value)
                          })
                        }
                        className="w-24 accent-amber-400"
                      />
                      <span className="font-mono font-bold text-slate-100 w-10 text-right">
                        {(row.val * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total weight check */}
              <div className="pt-2 border-t border-slate-800 flex justify-between font-semibold">
                <span className="text-slate-400">Soma Total dos Pesos:</span>
                <span className="font-mono text-amber-400">
                  {(
                    (Object.values(tempWeights) as number[]).reduce((a: number, b: number) => a + b, 0) * 100
                  ).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={handleResetWeights}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 py-1.5 px-2 rounded"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Padrão PROJECTAI</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveWeights}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  Salvar Pesos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
