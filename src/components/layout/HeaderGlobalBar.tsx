import React from 'react';
import {
  ShieldAlert,
  SlidersHorizontal,
  Search,
  Bell,
  Sparkles,
  FileDown,
  UploadCloud,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  Activity,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { GlobalFilterState, Unidade, Setor, UserRole, AlertaSST } from '../../types/sst';

interface HeaderGlobalBarProps {
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  unidades: Unidade[];
  setores: Setor[];
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  alerts: AlertaSST[];
  onOpenAlerts: () => void;
  onOpenAI: () => void;
  onOpenExport: () => void;
  onDownloadReport?: () => void;
  isGeneratingReport?: boolean;
  onOpenImport?: () => void;
  onOpenDictionary: () => void;
  onOpenPRD?: () => void;
  onOpenNewIncident: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; desc: string; color: string }> = {
  ADMIN: { label: 'Administrador', desc: 'Acesso pleno, configurações e metas', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  GESTOR_SST: { label: 'Gestor SST', desc: 'Visão executiva, riscos e investigações', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  SUPERVISOR: { label: 'Supervisor / Líder', desc: 'Inspeções, pendências e ações da área', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  OPERACIONAL: { label: 'Operacional', desc: 'Registros de ocorrência e DDS', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  DIRETORIA: { label: 'Diretoria Executiva', desc: 'Visão estratégica e cumprimento de metas', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

export const HeaderGlobalBar: React.FC<HeaderGlobalBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  unidades,
  setores,
  activeRole,
  onRoleChange,
  alerts,
  onOpenAlerts,
  onOpenAI,
  onOpenExport,
  onDownloadReport,
  isGeneratingReport = false,
  onOpenImport,
  onOpenDictionary,
  onOpenPRD,
  onOpenNewIncident
}) => {
  const activeAlertsCount = alerts.filter((a) => a.status === 'Ativo').length;
  const criticalAlertsCount = alerts.filter((a) => a.status === 'Ativo' && a.severidade === 'Crítico').length;

  // Filter available sectors by selected unit
  const availableSectors = filters.unidadeId === 'TODAS'
    ? setores
    : setores.filter((s) => s.unidadeId === filters.unidadeId);

  return (
    <header className="col-span-full border-b border-zinc-800/80 bg-black/95 backdrop-blur sticky top-0 z-40">
      {/* Top Banner: Brand, Role switcher, Actions */}
      <div className="w-full px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/10">
            <ShieldAlert className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                PROJECT<span className="text-amber-400">AI</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                SST v2.1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Dashboard SST Inteligente • Gestão Baseada em Evidências</p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="global-search-input"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Buscar ocorrência, risco, norma..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          {/* New Incident Button */}
          <button
            onClick={onOpenNewIncident}
            id="btn-registrar-ocorrencia"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Registrar Ocorrência</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={onOpenAI}
            id="btn-copilot-sst"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 text-cyan-300 border border-cyan-500/40 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Diagnóstico IA</span>
          </button>

          {/* Alerts Center Trigger */}
          <button
            onClick={onOpenAlerts}
            id="btn-central-alertas"
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Central de Alertas SST"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                criticalAlertsCount > 0 ? 'bg-red-500 animate-bounce' : 'bg-amber-500'
              }`}>
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Import Data (FR-009 / P0) */}
          {onOpenImport && (
            <button
              onClick={onOpenImport}
              id="btn-importar-dados-csv"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
              title="Importar Dados em Massa (CSV / Planilhas)"
            >
              <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Importar</span>
            </button>
          )}

          {/* Download Report Button (jsPDF automated capture) */}
          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              disabled={isGeneratingReport}
              id="btn-download-report"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download Report: Capturar visão atual do dashboard, gráficos e tabelas em relatório PDF formatado via jsPDF"
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Report</span>
                  <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-amber-500/30 text-amber-200 border border-amber-500/40">
                    PDF
                  </span>
                </>
              )}
            </button>
          )}

          {/* Export Report */}
          <button
            onClick={onOpenExport}
            id="btn-exportar-relatorio"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
            title="Exportar Relatório Executivo PDF / CSV"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Opções</span>
          </button>

          {/* Indicator Governance Dictionary */}
          <button
            onClick={onOpenDictionary}
            id="btn-dicionario-indicadores"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-colors"
            title="Dicionário de Indicadores SST (Governança)"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Governança</span>
          </button>



          {/* Role Switcher (RBAC) */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <UserCheck className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              id="select-user-role"
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${ROLE_LABELS[activeRole].color}`}
            >
              <option value="ADMIN" className="bg-slate-900 text-slate-100">Perfil: Administrador</option>
              <option value="GESTOR_SST" className="bg-slate-900 text-slate-100">Perfil: Gestor SST</option>
              <option value="SUPERVISOR" className="bg-slate-900 text-slate-100">Perfil: Supervisor / Líder</option>
              <option value="OPERACIONAL" className="bg-slate-900 text-slate-100">Perfil: Operacional</option>
              <option value="DIRETORIA" className="bg-slate-900 text-slate-100">Perfil: Diretoria Executiva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom Global Filters Bar */}
      <div className="bg-[#050505] border-t border-zinc-800/80 px-4 sm:px-6 py-2">
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filtros Globais:</span>
            </div>

            {/* Unidade Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-unidade"
                value={filters.unidadeId}
                onChange={(e) => onFilterChange({ unidadeId: e.target.value, setorId: 'TODOS' })}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="TODAS" className="bg-slate-900">Todas Unidades (Consolidado)</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-900">
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Setor Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-setor"
                value={filters.setorId}
                onChange={(e) => onFilterChange({ setorId: e.target.value })}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-slate-900">Todos os Setores</option>
                {availableSectors.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900">
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-periodo"
                value={filters.periodo}
                onChange={(e) => onFilterChange({ periodo: e.target.value as any })}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="30_DIAS" className="bg-slate-900">Últimos 30 dias</option>
                <option value="MES_ATUAL" className="bg-slate-900">Mês Atual (Março/2026)</option>
                <option value="TRIMESTRE" className="bg-slate-900">1º Trimestre 2026</option>
                <option value="ANO_ATUAL" className="bg-slate-900">Ano Acumulado (2026)</option>
              </select>
            </div>

            {/* Turno Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md px-2 py-1">
              <span className="text-slate-500">Turno:</span>
              <select
                id="filter-turno"
                value={filters.turno}
                onChange={(e) => onFilterChange({ turno: e.target.value as any })}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="TODOS" className="bg-slate-900">Todos os Turnos</option>
                <option value="TURNO_A" className="bg-slate-900">Turno A (06h - 14h)</option>
                <option value="TURNO_B" className="bg-slate-900">Turno B (14h - 22h)</option>
                <option value="TURNO_C" className="bg-slate-900">Turno C (22h - 06h)</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(filters.unidadeId !== 'TODAS' || filters.setorId !== 'TODOS' || filters.turno !== 'TODOS' || filters.searchQuery) && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs px-2 py-0.5 rounded transition-colors"
                title="Limpar todos os filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Sync & Quality Indicator */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Dados sincronizados • Última apuração: Hoje às 10:44 • Qualidade: 99.1%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
