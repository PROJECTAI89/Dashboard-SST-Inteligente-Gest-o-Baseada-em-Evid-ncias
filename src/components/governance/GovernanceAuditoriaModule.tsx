import React, { useState, useMemo } from 'react';
import {
  Shield,
  FileCheck2,
  Database,
  Sliders,
  BellRing,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  History,
  Info,
  Layers,
  ArrowUpDown,
  Lock,
  ExternalLink,
  Plus,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';
import {
  AuditoriaLog,
  DataQualityReport,
  AlertRule,
  IndicadorDicionario
} from '../../types/sst';

export const isCriticalComplianceLog = (log: AuditoriaLog): boolean => {
  const d = log.detalhes.toLowerCase();
  return (
    log.acao === 'EXCLUSAO' ||
    (log.entidade === 'Sistema' && (d.includes('desativada') || d.includes('inativa') || log.novoValor === 'Inativa')) ||
    d.includes('crítico') ||
    d.includes('critico') ||
    d.includes('cat') ||
    d.includes('grave') ||
    d.includes('fatal') ||
    (log.entidade === 'Ocorrência' && log.acao === 'CRIACAO' && d.includes('afastamento'))
  );
};

interface GovernanceAuditoriaModuleProps {
  auditLogs: AuditoriaLog[];
  dataQuality: DataQualityReport;
  alertRules: AlertRule[];
  indicadores: IndicadorDicionario[];
  onUpdateAlertRule?: (ruleId: string, active: boolean) => void;
  onExportAuditLogs?: () => void;
  onOpenGovernanceDictionary?: () => void;
  onTriggerSimulatedCriticalEvent?: () => void;
  criticalAlertActive?: boolean;
}

export const GovernanceAuditoriaModule: React.FC<GovernanceAuditoriaModuleProps> = ({
  auditLogs,
  dataQuality,
  alertRules,
  indicadores,
  onUpdateAlertRule,
  onExportAuditLogs,
  onOpenGovernanceDictionary,
  onTriggerSimulatedCriticalEvent,
  criticalAlertActive
}) => {
  const [activeTab, setActiveTab] = useState<'AUDITORIA' | 'QUALIDADE' | 'DICIONARIO' | 'REGRAS'>('AUDITORIA');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('TODAS');
  const [rulesState, setRulesState] = useState<AlertRule[]>(alertRules);
  const [isRevalidatingQuality, setIsRevalidatingQuality] = useState(false);

  // Critical compliance logs count
  const criticalLogsCount = useMemo(() => {
    return auditLogs.filter(isCriticalComplianceLog).length;
  }, [auditLogs]);

  // Filter audit logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        searchQuery === '' ||
        log.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.detalhes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.registroId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entidade.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterAction === 'CRITICAS') {
        return matchSearch && isCriticalComplianceLog(log);
      }

      const matchAction = filterAction === 'TODAS' || log.acao === filterAction;

      return matchSearch && matchAction;
    });
  }, [auditLogs, searchQuery, filterAction]);

  const handleToggleRule = (id: string) => {
    setRulesState((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ativo: !r.ativo } : r))
    );
    if (onUpdateAlertRule) {
      const rule = rulesState.find((r) => r.id === id);
      if (rule) onUpdateAlertRule(id, !rule.ativo);
    }
  };

  const handleRecheckQuality = () => {
    setIsRevalidatingQuality(true);
    setTimeout(() => {
      setIsRevalidatingQuality(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">CAMADA 4</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium border border-slate-700">
                Governança, Linhagem & Trilha de Auditoria
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">
              Governança de Dados & Conformidade Regulatória
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Rastreabilidade de ponta a ponta (data lineage), registro imutável de alterações e motor de regras de negócio.
            </p>
          </div>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2">
          {onExportAuditLogs && (
            <button
              onClick={onExportAuditLogs}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Exportar Logs (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('AUDITORIA')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'AUDITORIA'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Trilha de Auditoria ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('QUALIDADE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'QUALIDADE'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Qualidade & Linhagem ({dataQuality.scoreGeral}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('DICIONARIO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'DICIONARIO'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Dicionário & Fórmulas ({indicadores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REGRAS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'REGRAS'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Motor de Regras ({rulesState.filter(r => r.ativo).length} ativas)</span>
        </button>
      </div>

      {/* TAB 1: TRILHA DE AUDITORIA */}
      {activeTab === 'AUDITORIA' && (
        <div className="space-y-4">
          {/* Sentinela de Monitoramento Contínuo em Tempo Real */}
          <div className="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 border border-slate-800 rounded-xl p-4 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${criticalAlertActive ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Sentinela de Monitoramento de Auditoria (Camada 4)
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Monitor Ativo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vigilância algorítmica constante: detecta exclusões regulatórias, desativação de regras, alterações em CAT e perigos iminentes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Total de Logs</span>
                  <strong className="text-slate-100 font-mono text-xs">{auditLogs.length}</strong>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Eventos Críticos</span>
                  <strong className={`font-mono text-xs ${criticalLogsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {criticalLogsCount}
                  </strong>
                </div>
              </div>

              {onTriggerSimulatedCriticalEvent && (
                <button
                  onClick={onTriggerSimulatedCriticalEvent}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  title="Simular uma alteração crítica de conformidade para testar o sistema de alerta visual"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simular Alteração Crítica</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por usuário, entidade, ID ou detalhe de alteração..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
              >
                <option value="TODAS">Todas as Operações ({auditLogs.length})</option>
                <option value="CRITICAS">⚠️ Alterações Críticas de Conformidade ({criticalLogsCount})</option>
                <option value="CRIACAO">Criação</option>
                <option value="EDICAO">Edição</option>
                <option value="STATUS_ACAO">Mudança de Status (5W2H)</option>
                <option value="IMPORTACAO">Importação de Dados</option>
                <option value="EXPORTACAO">Exportação de Relatório</option>
                <option value="ALTERACAO_KPI">Alteração de KPI / Meta</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Data / Hora</th>
                    <th className="py-3 px-4">Usuário & Cargo</th>
                    <th className="py-3 px-4">Ação</th>
                    <th className="py-3 px-4">Entidade / ID</th>
                    <th className="py-3 px-4">Transição (De → Para)</th>
                    <th className="py-3 px-4">Detalhes</th>
                    <th className="py-3 px-4">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500">
                        Nenhum registro de auditoria encontrado para os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isCritical = isCriticalComplianceLog(log);
                      const actionBadge =
                        log.acao === 'EXCLUSAO' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        log.acao === 'CRIACAO' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        log.acao === 'EDICAO' ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                        log.acao === 'STATUS_ACAO' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        log.acao === 'IMPORTACAO' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                        log.acao === 'EXPORTACAO' ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' :
                        'bg-slate-800 text-slate-300 border-slate-700';

                      return (
                        <tr
                          key={log.id}
                          className={`transition-colors ${isCritical ? 'bg-red-950/20 border-l-4 border-l-red-500 hover:bg-red-950/30' : 'hover:bg-slate-850/50'}`}
                        >
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                            {log.dataHora}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{log.usuario}</div>
                            <div className="text-[10px] text-slate-500">{log.cargo}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold whitespace-nowrap ${actionBadge}`}>
                                {log.acao}
                              </span>
                              {isCritical && (
                                <span className="px-1.5 py-0.2 rounded font-mono text-[9px] font-bold bg-red-900/60 text-red-300 border border-red-700/60 whitespace-nowrap">
                                  CRÍTICO NR-01
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-300">{log.entidade}</div>
                            <div className="font-mono text-[10px] text-amber-400/90">{log.registroId}</div>
                          </td>
                          <td className="py-3 px-4">
                            {log.valorAnterior || log.novoValor ? (
                              <div className="text-[11px] space-y-0.5">
                                {log.valorAnterior && (
                                  <div className="text-slate-400 line-through text-[10px]">
                                    {log.valorAnterior}
                                  </div>
                                )}
                                {log.novoValor && (
                                  <div className="text-emerald-400 font-medium">
                                    {log.novoValor}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-xs">
                            {log.detalhes}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                            {log.ipOrigem}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUALIDADE DOS DADOS & LINHAGEM */}
      {activeTab === 'QUALIDADE' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                Score Geral de Qualidade
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">{dataQuality.scoreGeral}%</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {dataQuality.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {dataQuality.registrosCompletos} de {dataQuality.totalRegistrosAvaliados} registros validados
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                Campos Obrigatórios Vazios
              </span>
              <div className="text-3xl font-extrabold text-slate-100">
                {dataQuality.camposObrigatoriosVazios}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero pendências críticas de preenchimento</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                Duplicidades Detectadas
              </span>
              <div className="text-3xl font-extrabold text-amber-400">
                {dataQuality.duplicidadesDetectadas}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sob análise de expurgo no módulo de ocorrências
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">
                  Última Auditoria Automática
                </span>
                <div className="text-sm font-bold text-slate-200 font-mono">
                  {dataQuality.ultimaVerificacao}
                </div>
              </div>
              <button
                onClick={handleRecheckQuality}
                disabled={isRevalidatingQuality}
                className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20 text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRevalidatingQuality ? 'animate-spin' : ''}`} />
                <span>{isRevalidatingQuality ? 'Auditando...' : 'Revalidar Qualidade'}</span>
              </button>
            </div>
          </div>

          {/* Sources and Data Lineage Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Linhagem de Dados: Fontes Auditadas e Sincronização
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Padrão eSocial & GRO NR-01
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Fonte de Dados</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Volume de Registros</th>
                    <th className="py-3 px-4">Última Sincronização</th>
                    <th className="py-3 px-4">Nível de Confiança</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {dataQuality.fontesAuditadas.map((fonte, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/40">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {fonte.nome}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {fonte.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {fonte.registros.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {fonte.ultimaSincronizacao}
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-semibold">
                        99.8% (Alta)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DICIONÁRIO DE INDICADORES & FÓRMULAS */}
      {activeTab === 'DICIONARIO' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Catálogo Oficial de Governança de Indicadores SST
              </h3>
              <p className="text-xs text-slate-400">
                Regras formais de cálculo, periodicidade, metas corporativas e enquadramento normativo legal.
              </p>
            </div>
            {onOpenGovernanceDictionary && (
              <button
                onClick={onOpenGovernanceDictionary}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
              >
                Abrir Modal de Governança
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicadores.map((ind) => (
              <div key={ind.codigo} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{ind.codigo}</span>
                    <h4 className="text-sm font-bold text-slate-100">{ind.nome}</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Versão {ind.versao}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {ind.definicao}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-sky-400">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold mb-0.5">Fórmula Oficial</span>
                  {ind.formula}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Meta Corporativa:</span>
                    <strong className="text-emerald-400 font-semibold">{ind.meta}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Limite Crítico:</span>
                    <strong className="text-rose-400 font-semibold">{ind.limiteCritico}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Data Owner:</span>
                    <span className="text-slate-300">{ind.dataOwner}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Periodicidade:</span>
                    <span className="text-slate-300">{ind.periodicidade}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MOTOR DE REGRAS DE ALERTA */}
      {activeTab === 'REGRAS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Motor de Regras de Alertas & Gatilhos Paramétricos (Seção 25)
              </h3>
              <p className="text-xs text-slate-400">
                Disparos automáticos com base em limiares regulamentares, prazos de ações 5W2H e severidade.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {rulesState.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  rule.ativo
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{rule.id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          rule.severidade === 'Crítico'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : rule.severidade === 'Alto'
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        Severidade: {rule.severidade}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        {rule.frequencia}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{rule.nome}</h4>
                    <p className="text-xs font-mono text-amber-300/90 bg-slate-950/80 px-2.5 py-1 rounded inline-block border border-slate-800">
                      Condição: {rule.condicao}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors border border-slate-700"
                    >
                      {rule.ativo ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Ativa</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-400">Inativa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500 font-medium block">Destinatários Notificados:</span>
                    <span className="text-slate-300">{rule.destinatario}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Ação Pré-Cadastrada Recomendada:</span>
                    <span className="text-slate-300">{rule.acaoSugerida}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
