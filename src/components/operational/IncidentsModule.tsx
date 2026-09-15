import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  FileText,
  Camera,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Ocorrencia } from '../../types/sst';

interface IncidentsModuleProps {
  ocorrencias: Ocorrencia[];
  onOpenNewIncident: () => void;
  onOpenAction?: (actionId: string) => void;
}

export const IncidentsModule: React.FC<IncidentsModuleProps> = ({
  ocorrencias,
  onOpenNewIncident,
  onOpenAction
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Ocorrencia | null>(null);
  const [filterType, setFilterType] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = ocorrencias.filter((item) => {
    if (filterType !== 'TODOS' && !item.tipo.includes(filterType)) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.codigo.toLowerCase().includes(q) ||
        item.descricao.toLowerCase().includes(q) ||
        item.setorNome.toLowerCase().includes(q) ||
        item.colaboradorEnvolvido.toLowerCase().includes(q) ||
        item.causaBasica.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Central de Ocorrências: Acidentes e Incidentes
          </h2>
          <p className="text-xs text-slate-400">
            Fluxo completo: Registro → Classificação → Investigação de Causa Básica → Ação 5W2H → Validação
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por causa, colaborador..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="TODOS">Todos os Tipos</option>
            <option value="CPT">Acidente com Afastamento (CPT)</option>
            <option value="SPT">Acidente sem Afastamento (SPT)</option>
            <option value="Quase-Acidente">Incidente / Quase-Acidente</option>
            <option value="Condição Insegura">Condição Insegura</option>
          </select>

          {/* Register Button */}
          <button
            onClick={onOpenNewIncident}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Incident List Table / Cards */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Data / Hora</th>
                <th className="px-4 py-3">Tipo & Severidade</th>
                <th className="px-4 py-3">Localização (Unidade / Setor)</th>
                <th className="px-4 py-3">Colaborador / Atividade</th>
                <th className="px-4 py-3">Status Investigação</th>
                <th className="px-4 py-3">Ação 5W2H</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedIncident(item)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">
                    {item.codigo}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.dataHora}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{item.tipo}</div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      item.severidade === 'Grave' || item.severidade === 'Fatal'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : item.severidade === 'Moderada'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.severidade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="font-medium text-slate-200">{item.unidadeNome.split('—')[1] || item.unidadeNome}</div>
                    <div className="text-[11px] text-slate-400">{item.setorNome}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200 font-medium">{item.colaboradorEnvolvido}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{item.atividade}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.statusInvestigacao === 'Encerrado'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : item.statusInvestigacao === 'Ação Definida'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.statusInvestigacao}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.acaoId ? (
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        item.statusAcao === 'Atrasada'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.acaoId} ({item.statusAcao})
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Sem ação direta</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIncident(item);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                      title="Ver Diagnóstico e Investigação Completa"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail / Investigation Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {selectedIncident.codigo}
                  </span>
                  <span className="text-sm font-bold text-white">{selectedIncident.tipo}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedIncident.statusInvestigacao}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Registrado em {selectedIncident.dataHora} • Turno: {selectedIncident.turno}
                </p>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Context bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Unidade / Setor:</span>
                  <strong className="text-slate-200">{selectedIncident.unidadeNome} - {selectedIncident.setorNome}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Colaborador Envolvido:</span>
                  <strong className="text-slate-200">{selectedIncident.colaboradorEnvolvido} ({selectedIncident.funcaoColaborador})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Severidade:</span>
                  <strong className="text-amber-400">{selectedIncident.severidade} ({selectedIncident.diasPerdidos} dias perdidos)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Investigador Responsável:</span>
                  <strong className="text-slate-200">{selectedIncident.investigadorResponsavel}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-300">Descrição Factual da Ocorrência:</h4>
                <p className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-200 leading-relaxed">
                  {selectedIncident.descricao}
                </p>
              </div>

              {/* Root cause analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Causa Imediata:
                  </h4>
                  <p className="text-slate-300">{selectedIncident.causaImediata}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Causa Básica / Raiz (Ishikawa & 5 Porquês):
                  </h4>
                  <p className="text-slate-300">{selectedIncident.causaBasica}</p>
                </div>
              </div>

              {/* Contributing factors & Witnesses */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-300">Fatores Contribuintes Identificados:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  {selectedIncident.fatoresContribuintes.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="text-slate-400 pt-1 text-[11px] border-t border-slate-900">
                  <strong>Testemunhas:</strong> {selectedIncident.testemunhas.join(', ')}
                </div>
              </div>

              {/* Photographic Evidences */}
              {selectedIncident.evidenciasFotograficas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-slate-400" />
                    Evidências Fotográficas do Local e Vestígios:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedIncident.evidenciasFotograficas.map((url, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-800 h-28 bg-slate-950">
                        <img
                          src={url}
                          alt="Evidência fotográfica de SST"
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked 5W2H Action Plan */}
              {selectedIncident.acaoId && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ação Corretiva 5W2H Gerada</span>
                    <h5 className="font-bold text-white text-xs">{selectedIncident.acaoId} — {selectedIncident.acaoDescricao}</h5>
                    <p className="text-[11px] text-slate-400">
                      Responsável: {selectedIncident.responsavelAcao} • Prazo: {selectedIncident.prazoAcao} • Status: <span className="font-bold text-amber-300">{selectedIncident.statusAcao}</span>
                    </p>
                  </div>
                  {onOpenAction && (
                    <button
                      onClick={() => {
                        const id = selectedIncident.acaoId!;
                        setSelectedIncident(null);
                        onOpenAction(id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <span>Abrir Ação</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
