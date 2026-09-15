import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { MOCK_DICIONARIO } from '../../data/mockSstData';
import { IndicadorDicionario } from '../../types/sst';

interface IndicatorGovernanceModalProps {
  onClose: () => void;
}

export const IndicatorGovernanceModal: React.FC<IndicatorGovernanceModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Dicionário de Governança de Indicadores SST</h3>
              <p className="text-[11px] text-slate-400">Padronização matemática, metas, responsáveis e faixas semânticas auditáveis (NBR 14280 & NR-01)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List / Table */}
        <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {MOCK_DICIONARIO.map((ind: IndicadorDicionario) => (
            <div key={ind.codigo} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {ind.codigo}
                    </span>
                    <h4 className="text-sm font-bold text-white">{ind.nome}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">v{ind.versao}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{ind.definicao}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Meta Corporativa</span>
                  <span className="text-xs font-bold text-amber-400">{ind.meta}</span>
                </div>
              </div>

              {/* Formula & Calculation */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Fórmula Algorítmica:</span>
                  <span className="font-mono text-xs font-semibold text-cyan-300">{ind.formula}</span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Unidade: <strong className="text-slate-200">{ind.unidade}</strong></div>
                  <div>Periodicidade: <strong className="text-slate-200">{ind.periodicidade}</strong></div>
                </div>
              </div>

              {/* Semantic limits and data source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-emerald-400 font-semibold">Fonte de Dados Primária:</strong>
                  {ind.fonte}
                </div>
                <div className="p-2 rounded bg-rose-950/20 border border-rose-500/20 text-rose-300">
                  <strong className="block text-rose-400 font-semibold">Gatilho de Risco Crítico:</strong>
                  {ind.limiteCritico}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
                <span>Data Owner: <strong className="text-slate-200">{ind.dataOwner}</strong></span>
                <span>Última Homologação: <strong>{ind.ultimaAtualizacao}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
