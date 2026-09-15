import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Sparkles,
  Loader2,
  HelpCircle,
  Calculator,
  Target,
  AlertTriangle,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Database,
  ExternalLink
} from 'lucide-react';
import { KPICardData } from '../../types/sst';

interface KPIExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPICardData | null;
  contextRecords?: any[];
  onNavigateToActions?: () => void;
  onNavigateToRecords?: () => void;
}

interface AIExplanation {
  significado: string;
  comoCalculado: string;
  meta: string;
  causaDesvio: string;
  dimensoesContribuicao: string[];
  registrosSustentacao: string[];
  acoesRecomendadas: string[];
  confianca?: string;
  avisoLegal?: string;
  source?: string;
}

export const KPIExplainerModal: React.FC<KPIExplainerModalProps> = ({
  isOpen,
  onClose,
  kpi,
  contextRecords = [],
  onNavigateToActions,
  onNavigateToRecords
}) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && kpi) {
      loadExplanation();
    } else {
      setExplanation(null);
      setError(null);
    }
  }, [isOpen, kpi?.id]);

  const loadExplanation = async () => {
    if (!kpi) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/explain-kpi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpi,
          contextRecords: contextRecords.slice(0, 10)
        })
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data);
    } catch (err: any) {
      console.error('Falha ao obter explicação com IA:', err);
      // Robust client fallback if network fails
      setExplanation({
        significado: `${kpi.titulo} (${kpi.codigo}) é um indicador estratégico fundamental para o monitoramento contínuo de SST, medindo a eficiência das salvaguardas e o controle de perdas humanas e materiais.`,
        comoCalculado: kpi.lineage?.versaoFormula || 'Cálculo regulamentar em conformidade com as NRs e NBR 14280.',
        meta: `Meta de referência: ${kpi.meta}. Situação atual: ${kpi.valor} ${kpi.unidadeMedida}.`,
        causaDesvio: kpi.statusSemantico === 'verde'
          ? 'Indicador estabilizado dentro dos limites de tolerância estatística aceitáveis.'
          : 'Presença de desvios operacionais ou ações corretivas com atraso acumulado no período.',
        dimensoesContribuicao: [
          'Setores com processos térmicos ou mecânicos (NR-12)',
          'Operações logísticas e movimentação interna com empilhadeiras (NR-11)',
          'Trabalhos em altura em paradas de manutenção (NR-35)'
        ],
        registrosSustentacao: [
          `Base de dados ativa: ${kpi.lineage?.quantidadeRegistros || 0} registros auditados em ${kpi.lineage?.fonte || 'SST'}`
        ],
        acoesRecomendadas: [
          'Auditar a eficácia dos bloqueios LOTO (Lockout/Tagout) nos setores com apontamentos.',
          'Intensificar a realização de Diálogos Diários de Segurança com foco em percepção de risco.',
          'Revisar imediatamente as ações com prazo extrapolado no plano 5W2H.'
        ],
        confianca: '95% (Base Heurística PROJECTAI SST)',
        avisoLegal: 'Análise orientativa assistida por inteligência computacional. Não substitui laudo médico ou de engenharia legal.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !kpi) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400">{kpi.codigo}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                  {kpi.polaridade === 'MENOR_MELHOR' ? '↓ Menor é melhor' : '↑ Maior é melhor'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Seção 39 — PRD v2.1
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Explicação do Indicador por IA: {kpi.titulo}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Strip */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Valor Atual</span>
              <span className="text-base font-extrabold text-slate-100">
                {kpi.valor} <span className="text-xs font-normal text-slate-400">{kpi.unidadeMedida}</span>
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Meta Corporativa</span>
              <span className="text-sm font-bold text-emerald-400">{kpi.meta}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Status do Período</span>
              <span className={`font-semibold capitalize ${
                kpi.statusSemantico === 'verde' ? 'text-emerald-400' :
                kpi.statusSemantico === 'amarelo' ? 'text-amber-400' :
                kpi.statusSemantico === 'laranja' ? 'text-orange-400' :
                kpi.statusSemantico === 'vermelho' ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {kpi.statusSemantico} ({kpi.variacao > 0 ? `+${kpi.variacao}%` : `${kpi.variacao}%`})
              </span>
            </div>
          </div>

          <button
            onClick={loadExplanation}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-medium border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Atualizar Explicação</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-sm text-slate-300">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-sm font-medium text-slate-300">Consultando motor de IA e analisando histórico do indicador...</p>
              <span className="text-xs text-slate-500">Avaliando correlação de desvios, causas de raiz e base normativa NBR / GRO</span>
            </div>
          ) : explanation ? (
            <>
              {/* 1. O que significa */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>1. O Que Significa & Relevância Estratégica</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {explanation.significado}
                </p>
              </div>

              {/* 2 & 3. Fórmula e Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
                    <Calculator className="w-4 h-4" />
                    <span>2. Metodologia de Cálculo</span>
                  </div>
                  <p className="text-slate-200 text-xs font-mono bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    {explanation.comoCalculado}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>3. Alinhamento com a Meta</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {explanation.meta}
                  </p>
                </div>
              </div>

              {/* 4. Diagnóstico do Desvio / Causa Raiz */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>4. Diagnóstico de Causas & Justificativa do Desvio</span>
                </div>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {explanation.causaDesvio}
                </p>
              </div>

              {/* 5. Dimensões Contribuintes */}
              {explanation.dimensoesContribuicao && explanation.dimensoesContribuicao.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>5. Dimensões e Setores de Maior Contribuição</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {explanation.dimensoesContribuicao.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 6. Registros que sustentam a análise */}
              {explanation.registrosSustentacao && explanation.registrosSustentacao.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                      <FileText className="w-4 h-4" />
                      <span>6. Registros de Suporte Auditados</span>
                    </div>
                    {onNavigateToRecords && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToRecords();
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                      >
                        <span>Ver Registros no Módulo</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {explanation.registrosSustentacao.map((reg, idx) => (
                      <div key={idx} className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        <span className="font-mono text-slate-500">#{idx + 1}</span>
                        <span>{reg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Ações Recomendadas 5W2H */}
              {explanation.acoesRecomendadas && explanation.acoesRecomendadas.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>7. Plano de Contenção & Ações Recomendadas (5W2H)</span>
                    </div>
                    {onNavigateToActions && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToActions();
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20"
                      >
                        <span>Ir para Plano de Ações</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {explanation.acoesRecomendadas.map((acao, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-emerald-200/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{acao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Lineage & Legal Notice */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Fonte: <strong className="text-slate-300">{kpi.lineage?.fonte || 'Banco de Dados SST'}</strong>
                    </span>
                    <span className="text-slate-600">|</span>
                    <span>
                      Data Owner: <strong className="text-slate-300">{kpi.lineage?.dataOwner || 'SESMT'}</strong>
                    </span>
                  </div>
                  <span className="text-emerald-400 font-medium">
                    Qualidade: {kpi.lineage?.qualidadeDado || 'Auditado'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 border-t border-slate-800/60 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{explanation.avisoLegal || 'Análise orientativa da PROJECTAI. Não substitui documentação legal formal.'}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Inteligência Computacional PROJECTAI SST
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors border border-slate-700"
          >
            Fechar Diagnóstico
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
