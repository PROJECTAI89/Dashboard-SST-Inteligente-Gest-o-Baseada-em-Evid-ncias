import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowRight, CheckCircle2, X, AlertOctagon, History } from 'lucide-react';
import { AuditoriaLog } from '../../types/sst';

export interface CriticalComplianceAlertData {
  id: string;
  log: AuditoriaLog;
  detectedAt: string;
  reason: string;
  severity: 'CRITICA' | 'ALTA';
}

interface ComplianceSentinelBannerProps {
  alert: CriticalComplianceAlertData | null;
  onInspect: () => void;
  onDismiss: () => void;
}

export const ComplianceSentinelBanner: React.FC<ComplianceSentinelBannerProps> = ({
  alert,
  onInspect,
  onDismiss
}) => {
  if (!alert) return null;

  return (
    <motion.div
      id="compliance-sentinel-banner"
      initial={{ opacity: 0, y: -24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-full z-30 mb-2 px-4 sm:px-6 pt-2"
    >
      <div className="bg-gradient-to-r from-red-950/90 via-zinc-950 to-amber-950/80 border-2 border-red-500/60 rounded-xl p-3.5 sm:p-4 shadow-2xl shadow-red-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Left Side: Icon & Details */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500 text-black">
                SENTINELA CAMADA 4
              </span>
              <span className="font-bold text-red-200 tracking-wide text-xs">
                Alteração Crítica de Conformidade Detectada
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {alert.detectedAt}
              </span>
            </div>

            <p className="text-zinc-200 text-xs font-semibold truncate">
              {alert.reason}
            </p>

            <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono">
              <span><strong>Entidade:</strong> {alert.log.entidade}</span>
              <span>•</span>
              <span><strong>ID:</strong> {alert.log.registroId}</span>
              <span>•</span>
              <span><strong>Operação:</strong> {alert.log.acao}</span>
              <span>•</span>
              <span><strong>Autor:</strong> {alert.log.usuario}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
          <button
            onClick={onInspect}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500 hover:bg-red-400 text-black transition-colors shadow-md shadow-red-500/20"
            title="Ir para a Camada 4 e examinar o registro de auditoria"
          >
            <History className="w-3.5 h-3.5" />
            <span>Inspecionar na Camada 4</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onDismiss}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Reconhecer e dispensar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
