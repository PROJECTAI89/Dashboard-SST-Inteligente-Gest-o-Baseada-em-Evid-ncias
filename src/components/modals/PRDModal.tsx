import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
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
    { num: '01', title: 'Propósito do PRD', desc: 'Fonte da verdade única para produto, dados e conformidade' },
    { num: '02', title: 'Cadeia de Valor', desc: 'Perigo → Risco → Controle → Desvio → Ação → Evidência' },
    { num: '07', title: 'Princípios de Design', desc: 'Evidence First, Human in the Loop, Explainability e Auditability' },
    { num: '12', title: 'Modelo de Dados', desc: 'Entidades: Ocorrencia, Risco, Acao5W2H, Inspecao, Evidencia' },
    { num: '14', title: 'Fórmulas e KPIs', desc: 'TF (NBR 14280), TG, ISSST ponderado e regra de dados faltantes' },
    { num: '17', title: 'Regras de Negócio', desc: 'RN01 (Afastamento 5W2H), RN03 (Risco sem barreira), RN05 (Evidência)' },
    { num: '18', title: 'Motor de Compliance', desc: 'Separação entre fato, cálculo e conclusão de conformidade' },
    { num: '21', title: 'Governança & Audit', desc: 'Trilha de auditoria criptográfica e linhagem ponta a ponta' },
    { num: '33', title: 'Decisões de Produto', desc: 'PWA Web React+TypeScript, P0 a P3 e roadmap IoT/eSocial' }
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-amber-500/40 text-amber-400 font-bold">
                  PROJECTAI v2.2.0-PROD
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Especificação técnica consolidada para MVP/V1: Evidências, Trazabilidade, Governança e Regras de Negócio
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
              <span className="text-emerald-400 font-bold">35 / 35 Seções Consolidadas (v2.2.0-PROD)</span>
            </div>

            <div>
              <p className="text-amber-400 font-bold text-sm"># PRODUCT REQUIREMENTS DOCUMENT (PRD) — PROJECTAI</p>
              <p className="text-zinc-400">## PLATAFORMA INTELIGENTE DE SEGURANÇA E SAÚDE NO TRABALHO, GESTÃO DE RISCOS E CUMPRIMENTO BASEADO EM EVIDÊNCIAS</p>
              <p className="text-zinc-500 text-[10px]">
                Código: PRD-SST-PAI-2026-V2.2-PROD | Autor: Nicolas Herrera | Metodologias: NBR 14280, NR-01, ISO 45001, Evidence-First
              </p>
            </div>

            <div className="space-y-3 pt-2 text-zinc-300">
              <p><strong className="text-white">1. Propósito do Documento:</strong> Fonte da verdade para UX/UI, desenvolvimento, cálculo de indicadores, regras de negócio e rastreabilidade auditável.</p>
              <p><strong className="text-white">2. Visão do Produto & Cadeia de Valor:</strong> Perigo → Risco → Controle → Desvio → Ocorrência → Ação 5W2H → Evidência → Verificação de Eficácia.</p>
              <p><strong className="text-white">3. Problema:</strong> Dados fragmentados, cálculos manuais com risco de inconsistência, baixa rastreabilidade e falta de evidências auditáveis.</p>
              <p><strong className="text-white">7. Princípios de Design:</strong> Evidence First, Human in the Loop, Explainability, Auditability, Separation of Facts and Inference.</p>
              <p><strong className="text-white">12. Modelo de Dados Core:</strong> Entidades `Unidade`, `Setor`, `Ocorrencia`, `Risco`, `Acao5W2H`, `Inspecao`, `Treinamento`, `Documento`, `Evidencia`, `AuditEvent`, `NormaRegra`.</p>
              <p><strong className="text-white">14. Fórmulas e KPIs Normativos:</strong></p>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-900 text-zinc-300 space-y-1">
                <div>• <strong>Taxa de Frequência (TF):</strong> (N x 1.000.000) / HHT — NBR 14280 com HHT auditada</div>
                <div>• <strong>Taxa de Gravidade (TG):</strong> ((Dias Perdidos + Debitados) x 1.000.000) / HHT</div>
                <div>• <strong>Índice de Saúde SST (ISSST):</strong> 0.35S + 0.25A + 0.20I + 0.10T + 0.10D (Normalizado 0-100)</div>
                <div>• <strong>Regra de Dados Faltantes:</strong> Indicador marcado como INDETERMINADO sem conversão automática a zero.</div>
              </div>
              <p><strong className="text-white">17. Regras de Negócio Fundamentais:</strong> RN01 (Afastamento ativa 5W2H), RN02 (CAT/eSocial controlado), RN03 (Risco crítico sem barreira gera alerta), RN05 (Ação concluída exige nota de evidência obrigatória).</p>
              <p><strong className="text-white">21. Governança e Auditoria:</strong> Audit trail criptográfico encadeado (Hash SHA-256), data lineage completo e dicionário de métricas.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            Documento técnico em conformidade com as diretrizes e padrões de projeto PROJECTAI.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
