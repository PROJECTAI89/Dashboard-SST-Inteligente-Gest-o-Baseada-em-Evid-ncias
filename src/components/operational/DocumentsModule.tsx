import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Building2,
  ShieldCheck,
  Search
} from 'lucide-react';
import { DocumentoRegulamentar } from '../../types/sst';

interface DocumentsModuleProps {
  documentos: DocumentoRegulamentar[];
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({ documentos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalVigentes = documentos.filter((d) => d.status === 'Vigente').length;
  const totalVencidos = documentos.filter((d) => d.status === 'Vencido').length;
  const totalProx = documentos.filter((d) => d.status === 'Próximo do vencimento').length;

  const filtered = documentos.filter((d) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.titulo.toLowerCase().includes(q) ||
        d.tipo.toLowerCase().includes(q) ||
        d.responsavelTecnico.toLowerCase().includes(q) ||
        d.normaRegulamentadora.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Laudos e Programas Vigentes</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{totalVigentes}</div>
            <span className="text-[10px] text-slate-400">Em plena conformidade legal</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Próximos do Vencimento (&lt; 30 dias)</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{totalProx}</div>
            <span className="text-[10px] text-slate-400">Em processo de renovação técnica</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Documentos Vencidos</span>
            <div className={`text-2xl font-extrabold mt-0.5 ${totalVencidos > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalVencidos}
            </div>
            <span className="text-[10px] text-slate-400">Risco iminente de autuação eSocial</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por PGR, PCMSO, laudo, responsável..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {doc.codigo}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{doc.titulo}</h3>
                <p className="text-xs text-slate-400">{doc.unidadeNome}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                doc.status === 'Vigente'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : doc.status === 'Próximo do vencimento'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
              <div>
                <span className="text-slate-500 block">Norma Legal:</span>
                <strong>{doc.normaRegulamentadora}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Responsável Técnico:</span>
                <strong>{doc.responsavelTecnico}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Emissão:</span>
                <span>{doc.dataEmissao}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Validade:</span>
                <strong className={doc.status === 'Vencido' ? 'text-rose-400' : 'text-slate-200'}>
                  {doc.dataValidade}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                Hash: {doc.arquivoUrl.split('/').pop()}
              </span>
              <button
                onClick={() => alert(`Iniciando download do laudo homologado ${doc.titulo} em PDF...`)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Laudo (PDF)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
