import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  X,
  ShieldCheck,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

interface PRDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotification?: (msg: string) => void;
}

export const PRDModal: React.FC<PRDModalProps> = ({ isOpen, onClose, onNotification }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const downloadMarkdownFile = () => {
    // Fetch directly from public or create blob
    const link = document.createElement('a');
    link.href = '/PRD_PROJECTAI_SST.md';
    link.download = 'PRD_SST_PROJECTAI_OFICIAL_v2.1.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onNotification) {
      onNotification('Download do PRD em Markdown (.md) iniciado!');
    }
  };

  const copyToClipboard = () => {
    fetch('/PRD_PROJECTAI_SST.md')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        if (onNotification) {
          onNotification('Conteúdo integral do PRD copiado para a área de transferência!');
        }
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        if (onNotification) {
          onNotification('Erro ao copiar PRD.');
        }
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const prdHighlights = [
    { num: '01', title: 'Nome do Produto', desc: 'PROJECTAI SST Suite v2.1.0' },
    { num: '02', title: 'Resumo Executivo', desc: 'Plataforma analítica e preditiva de SST baseada em evidências' },
    { num: '03', title: 'Problema & Dores', desc: 'Dados fragmentados, demora em investigações e inércia em 5W2H' },
    { num: '04', title: 'Objetivos & Metas', desc: 'Zero acidentes, 100% conformidade NR-01 GRO/PGR e NBR 14280' },
    { num: '07', title: 'Escopo Baseline', desc: '9 Módulos operacionais, Camada 4 de Auditoria, Carga CSV e IA' },
    { num: '15', title: 'Modelo de Dados', desc: 'Entidades relacionais: Ocorrencia, Acao5W2H, AuditoriaLog, Risco' },
    { num: '17', title: 'Fórmulas e KPIs', desc: 'TF (NBR 14280), TG, ISSST ponderado e vínculo com OEE Industrial' },
    { num: '18', title: 'Matriz RBAC', desc: '5 Perfis de segurança: Admin, Gestor SST, Supervisor, Operador, Diretoria' },
    { num: '25', title: 'MVP Entregue', desc: 'Solução moderna, responsiva, tema dark/preto puro e zero ruído' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] text-zinc-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Product Requirements Document (PRD) Oficial
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400">
                  PROJECTAI v2.1
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Especificação técnica completa com os 27 pontos normativos, arquitetura e fórmulas industriais
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="py-3 px-1 border-b border-zinc-900 flex flex-wrap items-center justify-between gap-3 bg-black/40">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Documento Validado • NBR 14280 & NR-01 GRO/PGR</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-colors"
              title="Copiar texto do PRD"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-colors"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={downloadMarkdownFile}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-sm shadow-amber-500/10"
              title="Baixar arquivo Markdown (.md) completo"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PRD (.md)</span>
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="py-4 overflow-y-auto space-y-5 flex-1 pr-1 text-xs">
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {prdHighlights.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/70 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>SEÇÃO {h.num}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></span>
                </div>
                <strong className="text-xs text-white font-medium">{h.title}</strong>
                <p className="text-[11px] text-zinc-400 leading-snug">{h.desc}</p>
              </div>
            ))}
          </div>

          {/* Full PRD Preview Container */}
          <div className="p-4 sm:p-5 rounded-xl bg-black border border-zinc-800/80 font-mono text-[11px] leading-relaxed text-zinc-300 space-y-4 max-h-[380px] overflow-y-auto">
            <div className="text-zinc-500 border-b border-zinc-900 pb-2 flex items-center justify-between">
              <span>PRD_PROJECTAI_SST.md • Visualização Integral</span>
              <span className="text-emerald-400 font-bold">27 / 27 Seções Concluídas</span>
            </div>

            <div>
              <p className="text-amber-400 font-bold text-sm"># PRODUCT REQUIREMENTS DOCUMENT (PRD) — PROJECTAI</p>
              <p className="text-zinc-400">## SISTEMA INTEGRADO DE GESTÃO E DASHBOARD INTELIGENTE DE SST</p>
              <p className="text-zinc-500 text-[10px]">
                Código: PRD-SST-PAI-2026-V2.1 | Autor: Nicolas Herrera | Metodologias: NBR 14280, NR-01, ISO 45001
              </p>
            </div>

            <div className="space-y-3 pt-2 text-zinc-300">
              <p><strong className="text-white">1. Nome do Produto:</strong> PROJECTAI SST Suite — Dashboard Inteligente e Plataforma de Gestão Preditiva.</p>
              <p><strong className="text-white">2. Resumo Executivo:</strong> Plataforma analítica e operacional que unifica dados de SST e Engenharia Industrial em uma arquitetura moderna sem ruído visual.</p>
              <p><strong className="text-white">3. Problema:</strong> Dados dispersos, demora em investigações, fórmulas calculadas incorretamente à mão e perda de OEE industrial por paradas decorrentes de acidentes.</p>
              <p><strong className="text-white">4. Objetivo:</strong> Centralizar 100% dos eventos, zerar a taxa de frequência e garantir conformidade fiscalizatória integral (NR-01 GRO/PGR).</p>
              <p><strong className="text-white">15. Modelo de Dados:</strong> Entidades `Ocorrencia`, `Acao5W2H`, `AuditoriaLog`, `RiscoMatriz`, `TreinamentoColaborador`, `Inspecao`. Todas normalizadas e auditáveis.</p>
              <p><strong className="text-white">17. Fórmulas e KPIs Industriais:</strong></p>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-900 text-zinc-300 space-y-1">
                <div>• <strong>Taxa de Frequência (TF):</strong> (N x 1.000.000) / HHT — Padrão NBR 14280</div>
                <div>• <strong>Taxa de Gravidade (TG):</strong> ((Dias Perdidos + Dias Debitados) x 1.000.000) / HHT</div>
                <div>• <strong>Índice de Saúde SST (ISSST):</strong> Score ponderado (Acidentes 30%, Ações 25%, Inspeções 20%, Treinamento 15%, Riscos 10%)</div>
                <div>• <strong>Impacto no OEE:</strong> Redução de paradas não programadas em máquinas para preservar a Disponibilidade fabril.</div>
              </div>
              <p><strong className="text-white">18. Roles e Permissões (RBAC):</strong> Perfis segregados para Administrador, Gestor SST, Supervisor, Operacional e Diretoria.</p>
              <p><strong className="text-white">24. Critérios de Aceitação:</strong> Cálculos certificados, filtros reativos em &lt;16ms, trilha de auditoria à prova de adulteração.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            Arquivo oficial gerado em formato padrão <span className="text-zinc-300 font-mono">.md</span> (Markdown universal).
          </div>
          <button
            onClick={downloadMarkdownFile}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo Completo Agora (.md)</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
