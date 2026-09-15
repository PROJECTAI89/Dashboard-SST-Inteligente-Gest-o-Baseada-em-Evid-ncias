import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BellRing,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  Filter
} from 'lucide-react';
import { AlertaSST } from '../../types/sst';

interface AlertsCenterModalProps {
  alerts: AlertaSST[];
  onClose: () => void;
  onNavigateTo: (categoria: string, refId: string) => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

export const AlertsCenterModal: React.FC<AlertsCenterModalProps> = ({
  alerts,
  onClose,
  onNavigateTo,
  onAcknowledgeAlert
}) => {
  const [filterSev, setFilterSev] = useState<string>('TODOS');

  const filtered = alerts.filter((a) => {
    if (filterSev !== 'TODOS' && a.severidade !== filterSev) return false;
    return true;
  });

  const getSeveridadeIcon = (sev: AlertaSST['severidade']) => {
    switch (sev) {
      case 'Crítico':
        return <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'Alto':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'Atenção':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'Informativo':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeveridadeBadge = (sev: AlertaSST['severidade']) => {
    switch (sev) {
      case 'Crítico':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'Alto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Atenção':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Informativo':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

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
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <BellRing className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Central de Alertas SST — Gestão por Exceção</h3>
              <p className="text-[11px] text-slate-400">Priorização automática de desvios, prazos expirados e riscos operacionais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Filter Tabs */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-slate-800">
          {(['TODOS', 'Crítico', 'Alto', 'Atenção', 'Informativo'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSev(sev)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterSev === sev
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
              }`}
            >
              {sev === 'TODOS' ? 'Todos os Alertas' : sev}
              <span className="ml-1.5 opacity-70">
                ({sev === 'TODOS' ? alerts.length : alerts.filter((a) => a.severidade === sev).length})
              </span>
            </button>
          ))}
        </div>

        {/* List of Alerts */}
        <div className="py-3 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Nenhum alerta ativo nesta categoria.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border bg-slate-950 transition-all ${
                  item.severidade === 'Crítico'
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="pt-0.5">{getSeveridadeIcon(item.severidade)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeveridadeBadge(item.severidade)}`}>
                          {item.severidade}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">Ref: {item.origemId}</span>
                        <span className="text-[10px] text-slate-400">{item.dataHora}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{item.titulo}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{item.descricao}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => onNavigateTo(item.categoria, item.origemId)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      <span>Tratar</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    {item.status === 'Ativo' && (
                      <button
                        onClick={() => onAcknowledgeAlert(item.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Reconhecer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
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
