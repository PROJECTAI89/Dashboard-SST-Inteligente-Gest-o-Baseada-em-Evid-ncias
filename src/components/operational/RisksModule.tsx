import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  Plus,
  Eye,
  Sliders
} from 'lucide-react';
import { RiscoMatriz } from '../../types/sst';

interface RisksModuleProps {
  riscos: RiscoMatriz[];
  onOpenAction?: (actionId: string) => void;
}

export const RisksModule: React.FC<RisksModuleProps> = ({ riscos, onOpenAction }) => {
  const [filterClassif, setFilterClassif] = useState<string>('TODAS');
  const [search, setSearch] = useState<string>('');
  const [selectedRisco, setSelectedRisco] = useState<RiscoMatriz | null>(null);

  const totalRiscos = riscos.length;
  const criticos = riscos.filter((r) => r.classificacao === 'Crítico').length;
  const atencao = riscos.filter((r) => r.classificacao === 'Atenção').length;
  const aceitavel = riscos.filter((r) => r.classificacao === 'Aceitável').length;

  const filtered = riscos.filter((r) => {
    if (filterClassif !== 'TODAS' && r.classificacao !== filterClassif) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.codigo.toLowerCase().includes(q) ||
        r.perigo.toLowerCase().includes(q) ||
        r.risco.toLowerCase().includes(q) ||
        r.setorNome.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Total de Riscos Mapeados</span>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">{totalRiscos}</div>
            <span className="text-[10px] text-slate-400">Inventário PGR (NR-01)</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Sliders className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Riscos Críticos (6 a 9)</span>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5">{criticos}</div>
            <span className="text-[10px] text-slate-400">Exige contenção e barreira</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Riscos em Atenção (3 a 4)</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{atencao}</div>
            <span className="text-[10px] text-slate-400">Monitoramento periódico</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Riscos Aceitáveis (1 a 2)</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{aceitavel}</div>
            <span className="text-[10px] text-slate-400">Controles estabelecidos</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar perigo, setor, fonte geradora..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filterClassif}
            onChange={(e) => setFilterClassif(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="TODAS">Todas as Classificações</option>
            <option value="Crítico">Crítico (Score 6 a 9)</option>
            <option value="Atenção">Atenção (Score 3 a 4)</option>
            <option value="Aceitável">Aceitável (Score 1 a 2)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Perigo & Risco</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3">Fonte / Expostos</th>
                <th className="px-4 py-3 text-center">P x S = Score</th>
                <th className="px-4 py-3">Classificação</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedRisco(item)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">
                    {item.codigo}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-100">{item.perigo}</div>
                    <div className="text-[11px] text-rose-300">{item.risco}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{item.unidadeNome.split('—')[1] || item.unidadeNome}</div>
                    <div className="text-[10px] text-slate-400">{item.setorNome}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{item.fonteGeradora}</div>
                    <div className="text-[10px] text-slate-400">{item.trabalhadoresExpostos} colaboradores expostos</div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">
                    <span className="font-semibold text-slate-300">P{item.probabilidade} × S{item.severidade}</span>
                    <span className="mx-1 font-bold text-amber-400">= {item.pontuacaoRisco}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.classificacao === 'Crítico'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : item.classificacao === 'Atenção'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {item.classificacao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span className={`font-semibold ${
                      item.status === 'Crítico Sem Barreira' ? 'text-rose-400 animate-pulse' : 'text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRisco(item);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
                      title="Ver Controles e Ação Vinculada"
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

      {/* Risk Details Modal */}
      {selectedRisco && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  {selectedRisco.codigo}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedRisco.perigo}</h3>
                <p className="text-xs text-slate-400">{selectedRisco.unidadeNome} — {selectedRisco.setorNome}</p>
              </div>
              <button
                onClick={() => setSelectedRisco(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Probabilidade:</span>
                  <strong className="text-slate-200">Nível {selectedRisco.probabilidade} (P{selectedRisco.probabilidade})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Severidade:</span>
                  <strong className="text-slate-200">Nível {selectedRisco.severidade} (S{selectedRisco.severidade})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Pontuação P x S:</span>
                  <strong className="text-amber-400 font-mono text-sm">{selectedRisco.pontuacaoRisco} pts ({selectedRisco.classificacao})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Expostos:</span>
                  <strong className="text-slate-200">{selectedRisco.trabalhadoresExpostos} colaboradores</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold block">Consequência / Risco Potencial:</span>
                <p className="text-rose-300 font-medium">{selectedRisco.risco}</p>
                <p className="text-slate-400 text-[11px] pt-1"><strong>Fonte Geradora:</strong> {selectedRisco.fonteGeradora}</p>
              </div>

              {/* Controles Existentes vs Necessários */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300 text-xs">Controles Existentes na Planta:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {selectedRisco.controlesExistentes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-xs">Controles Adicionais Requeridos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {selectedRisco.controlesNecessarios.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Linked Action */}
              {selectedRisco.acaoVinculadaId && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Ação Vinculada no Plano 5W2H</span>
                    <div className="font-bold text-white text-xs">{selectedRisco.acaoVinculadaId}</div>
                    <div className="text-[11px] text-slate-400">Responsável: {selectedRisco.responsavel}</div>
                  </div>
                  {onOpenAction && (
                    <button
                      onClick={() => {
                        const id = selectedRisco.acaoVinculadaId!;
                        setSelectedRisco(null);
                        onOpenAction(id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <span>Abrir no Plano 5W2H</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedRisco(null)}
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
