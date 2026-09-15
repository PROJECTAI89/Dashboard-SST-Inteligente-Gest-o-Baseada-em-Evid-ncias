import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  Calendar,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Inspecao } from '../../types/sst';

interface InspectionsModuleProps {
  inspecoes: Inspecao[];
  onOpenAction?: (actionId: string) => void;
}

export const InspectionsModule: React.FC<InspectionsModuleProps> = ({
  inspecoes,
  onOpenAction
}) => {
  const [selectedInspecao, setSelectedInspecao] = useState<Inspecao | null>(null);

  const totalAvaliados = inspecoes.reduce((acc, i) => acc + i.itensAvaliadosTotal, 0);
  const totalConformes = inspecoes.reduce((acc, i) => acc + i.itensConformesTotal, 0);
  const taxaMedia = totalAvaliados > 0 ? Number(((totalConformes / totalAvaliados) * 100).toFixed(1)) : 100;

  return (
    <div className="space-y-4">
      {/* Top Banner with Conformity KPI */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            Inspeções Técnicas e Auditorias de Campo
          </h2>
          <p className="text-xs text-slate-400">
            Monitoramento preventivo de checklists regulamentares (NR-10, NR-12, NR-35 e EPIs)
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Taxa de Conformidade Geral</span>
            <div className="text-2xl font-extrabold text-emerald-400 leading-tight">
              {taxaMedia}%
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-4 text-xs text-slate-400">
            <div><strong>{totalConformes}</strong> itens conformes</div>
            <div>de <strong>{totalAvaliados}</strong> auditados</div>
          </div>
        </div>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inspecoes.map((inspecao) => {
          const isHighConformity = inspecao.taxaConformidade >= 95;
          const isMediumConformity = inspecao.taxaConformidade >= 85;

          return (
            <div
              key={inspecao.id}
              onClick={() => setSelectedInspecao(inspecao)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                    {inspecao.codigo}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{inspecao.titulo}</h3>
                  <p className="text-xs text-slate-400">{inspecao.unidadeNome} • {inspecao.setorNome}</p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-extrabold ${
                    isHighConformity ? 'text-emerald-400' : isMediumConformity ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {inspecao.taxaConformidade}%
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">Conformidade</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHighConformity ? 'bg-emerald-500' : isMediumConformity ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${inspecao.taxaConformidade}%` }}
                />
              </div>

              {/* Auditor & Date */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Auditor: <strong className="text-slate-200">{inspecao.auditor}</strong></span>
                <span>Data: {inspecao.data}</span>
              </div>

              {/* Non-conformities count */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{inspecao.itensNaoConformes.length} Não Conformidade(s) registrada(s)</span>
                </div>
                <span className="text-amber-400 text-xs font-semibold hover:underline">Ver Checklist →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspection Details Modal */}
      {selectedInspecao && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  {selectedInspecao.codigo}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedInspecao.titulo}</h3>
                <p className="text-xs text-slate-400">
                  Local: {selectedInspecao.unidadeNome} — {selectedInspecao.setorNome} • Auditor: {selectedInspecao.auditor} ({selectedInspecao.data})
                </p>
              </div>
              <button
                onClick={() => setSelectedInspecao(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Resultado da Auditoria:</span>
                  <div className="text-xl font-bold text-emerald-400">{selectedInspecao.taxaConformidade}% Conforme</div>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <div><strong className="text-emerald-400">{selectedInspecao.itensConformesTotal}</strong> itens atendidos</div>
                  <div><strong className="text-rose-400">{selectedInspecao.itensAvaliadosTotal - selectedInspecao.itensConformesTotal}</strong> itens reprovados</div>
                </div>
              </div>

              {/* List of Non conformities */}
              <div className="space-y-3">
                <h4 className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Apuração de Não Conformidades e Ações Requeridas:
                </h4>

                {selectedInspecao.itensNaoConformes.map((nc, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-slate-100 text-xs">{nc.item}</strong>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        nc.criticidade === 'Crítica'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {nc.criticidade}
                      </span>
                    </div>

                    <p className="text-slate-300">{nc.desvio}</p>

                    {nc.fotoEvidencia && (
                      <div className="pt-1">
                        <img
                          src={nc.fotoEvidencia}
                          alt="Evidência não conformidade"
                          className="w-36 h-24 object-cover rounded-lg border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {nc.acaoGeradaId && (
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-amber-400">
                        <span>Ação Corretiva Gerada: <strong>{nc.acaoGeradaId}</strong></span>
                        {onOpenAction && (
                          <button
                            onClick={() => {
                              setSelectedInspecao(null);
                              onOpenAction(nc.acaoGeradaId!);
                            }}
                            className="text-xs underline hover:text-amber-300 flex items-center gap-1"
                          >
                            <span>Abrir no Plano 5W2H</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedInspecao(null)}
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
