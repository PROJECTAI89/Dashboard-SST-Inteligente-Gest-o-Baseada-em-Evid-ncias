import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  ArrowRight,
  RefreshCw,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Ocorrencia, Acao5W2H, TreinamentoColaborador } from '../../types/sst';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportOcorrencias: (data: Record<string, any>[]) => void;
  onImportAcoes: (data: Record<string, any>[]) => void;
  onImportTreinamentos: (data: Record<string, any>[]) => void;
}

type ImportType = 'OCORRENCIAS' | 'ACOES' | 'TREINAMENTOS';

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onImportOcorrencias,
  onImportAcoes,
  onImportTreinamentos
}) => {
  const [importType, setImportType] = useState<ImportType>('OCORRENCIAS');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    let csvContent = '';
    let filename = '';

    if (importType === 'OCORRENCIAS') {
      filename = 'template_ocorrencias_sst_projectai.csv';
      csvContent = 'codigo,tipo,descricao,dataHora,unidadeId,setorId,setorNome,classificacao,severidade,diasPerdidos\n' +
        'OC-2026-101,Incidente / Quase-Acidente,Queda de ferramenta sem lesão em andaime,2026-03-15 09:30,UND-01,SET-01,Usinagem,Média,Leve,0\n' +
        'OC-2026-102,Acidente sem Afastamento (SPT),Pequeno corte no dedo durante rebarbação com luva danificada,2026-03-14 14:15,UND-01,SET-02,Montagem,Baixa,Leve,0';
    } else if (importType === 'ACOES') {
      filename = 'template_acoes_5w2h_projectai.csv';
      csvContent = 'codigo,titulo,oQue,porQue,onde,quem,quando,como,quantoCusta,status,prioridade\n' +
        'ACT-201,Instalar barreira física,Instalar barreira física de proteção,Evitar contato acidental com partes móveis,Usinagem - Torno CNC 02,Eng. Ricardo Mansur,2026-04-10,Instalação de policarbonato 6mm,R$ 3.500,Em andamento,Alta\n' +
        'ACT-202,Substituir cabo de aço da talha,Substituir cabo de aço,Desgaste detectado em inspeção periódica,Pátio de Carga,Marcio Silva,2026-03-25,Troca por cabo galvanizado com ART,R$ 1.800,Não iniciada,Crítica';
    } else {
      filename = 'template_treinamentos_sst_projectai.csv';
      csvContent = 'colaboradorNome,matricula,funcao,setorNome,cursoNorma,cargaHoraria,dataRealizacao,dataValidade,instrutorEntidade,status\n' +
        'Lucas Pinheiro Mendes,MAT-4412,Montador Industrial,Montagem,NR-35 Trabalho em Altura,8,2024-04-10,2026-04-10,SENAI Industrial,Vigente\n' +
        'Juliana Paes Ferreira,MAT-5590,Eletricista de Manutenção,Manutenção,NR-10 Segurança Elétrica,40,2025-05-20,2027-05-20,Fundacentro Cert,Vigente';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setValidationErrors(['O arquivo enviado está vazio ou não possui linhas de dados além do cabeçalho.']);
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    const errors: string[] = [];

    // Check minimum required headers
    if (importType === 'OCORRENCIAS' && (!headers.includes('tipo') || !headers.includes('descricao'))) {
      errors.push('Cabeçalho inválido para Ocorrências: "tipo" e "descricao" são colunas obrigatórias.');
    } else if (importType === 'ACOES' && (!headers.includes('oQue') || !headers.includes('quem'))) {
      errors.push('Cabeçalho inválido para Ações 5W2H: "oQue" e "quem" são colunas obrigatórias.');
    } else if (importType === 'TREINAMENTOS' && (!headers.includes('colaboradorNome') || !headers.includes('cursoNorma'))) {
      errors.push('Cabeçalho inválido para Treinamentos: "colaboradorNome" e "cursoNorma" são obrigatórios.');
    }

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const rowObj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      rows.push(rowObj);
    }

    setValidationErrors(errors);
    setParsedRows(rows);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSuccessMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSuccessMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0 || validationErrors.length > 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      if (importType === 'OCORRENCIAS') {
        onImportOcorrencias(parsedRows);
      } else if (importType === 'ACOES') {
        onImportAcoes(parsedRows);
      } else {
        onImportTreinamentos(parsedRows);
      }

      setIsProcessing(false);
      setSuccessMessage(`Sucesso! ${parsedRows.length} registros importados com recálculo automático de indicadores.`);
      setSelectedFile(null);
      setParsedRows([]);
    }, 600);
  };

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
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-amber-400">FR-009 / P0</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                  Seção 33 — PRD v2.1
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100">
                Importação Estruturada de Dados SST (CSV / Planilhas)
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-300">
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-slate-400 font-semibold mb-2 text-xs uppercase tracking-wider">
              1. Selecione o Tipo de Entidade para Carga
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'OCORRENCIAS' as ImportType, label: 'Ocorrências / Quase-Acidentes', desc: 'Acidentes CPT, SPT e incidentes' },
                { type: 'ACOES' as ImportType, label: 'Plano de Ações 5W2H', desc: 'Contramedidas, prazos e custos' },
                { type: 'TREINAMENTOS' as ImportType, label: 'Treinamentos NR', desc: 'Capacitações e reciclagens' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setImportType(item.type);
                    setSelectedFile(null);
                    setParsedRows([]);
                    setValidationErrors([]);
                    setSuccessMessage(null);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    importType === item.type
                      ? 'bg-amber-500/15 border-amber-500/40 text-slate-100 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <strong className="block text-xs font-semibold text-slate-200 mb-0.5">{item.label}</strong>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download Sample Template Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Precisa da planilha modelo padronizada com cabeçalhos válidos?</span>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Modelo CSV</span>
            </button>
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="p-3 rounded-full bg-slate-800 text-amber-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-xs">
                {selectedFile ? selectedFile.name : 'Arraste e solte o arquivo CSV aqui ou clique para selecionar'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Tamanho máximo 15MB • Formato delimitado por vírgula (CSV)
              </span>
            </div>
          </div>

          {/* Validation Feedback */}
          {validationErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Inconsistências encontradas na pré-validação:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-rose-300/90 pl-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Table Preview */}
          {parsedRows.length > 0 && validationErrors.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">
                  Prévia da Carga: <strong className="text-amber-400">{parsedRows.length}</strong> registros válidos
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pronto para processamento</span>
                </span>
              </div>
              <div className="max-h-40 overflow-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-900 text-slate-400 sticky top-0">
                    <tr>
                      {Object.keys(parsedRows[0]).slice(0, 5).map((col) => (
                        <th key={col} className="p-2 border-b border-slate-800 uppercase font-mono text-[9px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {parsedRows.slice(0, 4).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 5).map((val: any, vIdx) => (
                          <td key={vIdx} className="p-2 truncate max-w-[140px]">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedRows.length === 0 || validationErrors.length > 0 || isProcessing}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando Carga...</span>
              </>
            ) : (
              <>
                <span>Confirmar Importação</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
