import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileDown, Printer, FileSpreadsheet, CheckCircle2, ShieldAlert, X, Loader2 } from 'lucide-react';
import { IndiceSaudeSSTResult, KPICardData, GlobalFilterState, Ocorrencia, Acao5W2H, RiscoMatriz, UserRole } from '../../types/sst';
import { downloadDashboardPDFReport } from '../../utils/pdfExportService';

interface ExecutiveExportModalProps {
  onClose: () => void;
  saudeData: IndiceSaudeSSTResult;
  kpis: KPICardData[];
  filters: GlobalFilterState;
  ocorrencias: Ocorrencia[];
  acoes: Acao5W2H[];
  riscos: RiscoMatriz[];
  activeRole?: UserRole;
}

export const ExecutiveExportModal: React.FC<ExecutiveExportModalProps> = ({
  onClose,
  saudeData,
  kpis,
  filters,
  ocorrencias,
  acoes,
  riscos,
  activeRole = 'GESTOR_SST' as UserRole
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleGenerateJSPDF = async () => {
    setIsGenerating(true);
    setStatusMsg('Renderizando e compilando relatório PDF com gráficos...');
    try {
      await downloadDashboardPDFReport({
        filters,
        saudeData,
        kpis,
        ocorrencias,
        acoes,
        riscos,
        activeRole,
        onProgress: (st) => setStatusMsg(st)
      });
      setStatusMsg('Relatório PDF descarregado com sucesso!');
      setTimeout(() => {
        setStatusMsg(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Generate CSV data for occurrences and actions
    const csvContent = [
      ['TIPO', 'CODIGO', 'TITULO_OU_DESCRICAO', 'SETOR', 'STATUS', 'PRAZO_OU_DATA'].join(';'),
      ...ocorrencias.map(o => ['OCORRENCIA', o.codigo, `"${o.tipo}"`, `"${o.setorNome}"`, o.statusInvestigacao, o.dataHora].join(';')),
      ...acoes.map(a => ['ACAO_5W2H', a.codigo, `"${a.titulo}"`, `"${a.onde}"`, a.status, a.quando].join(';')),
      ...riscos.map(r => ['RISCO', r.codigo, `"${r.perigo}"`, `"${r.setorNome}"`, r.classificacao, `P${r.probabilidade}xS${r.severidade}`].join(';')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_sst_projectai_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <FileDown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Exportação de Relatório Executivo SST</h3>
              <p className="text-[11px] text-slate-400">Consolidação de indicadores, desvios e planos 5W2H para comitês e diretoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview Document */}
        <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-slate-200">
            {/* Report Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  PROJECT<span className="text-amber-400">AI</span>
                </span>
                <span className="text-xs text-slate-400 block">SISTEMA INTEGRADO DE GESTÃO SST • NBR 14280 & NR-01</span>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div>Data de Emissão: <strong>15/03/2026</strong></div>
                <div>Filtro: <strong>{filters.unidadeId} • {filters.periodo}</strong></div>
              </div>
            </div>

            {/* Score Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Índice de Saúde SST</span>
                <strong className="text-xl font-bold text-amber-400">{saudeData.score} pts ({saudeData.classificacao})</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Acidentes com Afastamento</span>
                <strong className="text-xl font-bold text-emerald-400">0 CPT</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Taxa de Frequência (TF)</span>
                <strong className="text-xl font-bold text-slate-100">1.82</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Ações 5W2H Atrasadas</span>
                <strong className="text-xl font-bold text-rose-400">1 Ação</strong>
              </div>
            </div>

            {/* Executive Summary Narrative */}
            <div className="space-y-1">
              <h5 className="font-bold text-white text-xs">1. Resumo Executivo da Gestão:</h5>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                No período analisado, as unidades fabris mantiveram conformidade regulamentar média de 94.2%. A ocorrência crítica identificada na Prensa Mecânica P-04 do Setor de Estamparia gerou plano de ação emergencial 5W2H com interdição técnica e reforço de redundância eletrônica de categoria 4. As taxas de gravidade e frequência encontram-se rigorosamente dentro dos padrões da Portaria 6.730 e NBR 14280.
              </p>
            </div>

            {/* Critical actions list */}
            <div className="space-y-1">
              <h5 className="font-bold text-white text-xs">2. Ações 5W2H Prioritárias em Aberto:</h5>
              <div className="space-y-1.5 text-[11px]">
                {acoes.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                    <div>
                      <strong className="text-amber-400">{a.codigo}:</strong> {a.titulo}
                      <span className="text-slate-400 block">Resp: {a.quem} • Onde: {a.onde}</span>
                    </div>
                    <span className="font-mono text-slate-300">{a.quando} ({a.status})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {statusMsg ? (
              <span className="text-amber-400 font-semibold animate-pulse">{statusMsg}</span>
            ) : (
              <span>Formato executivo pronto para auditorias e reuniões de diretoria</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Dados (CSV)</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Imprimir via diálogo do navegador"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleGenerateJSPDF}
              disabled={isGenerating}
              id="btn-modal-gerar-pdf"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-md shadow-amber-500/20 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-slate-950 font-bold" />
                  <span>Baixar Relatório PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
