import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeaderGlobalBar
} from './components/layout/HeaderGlobalBar';
import {
  NavigationTabs,
  ActiveTab
} from './components/layout/NavigationTabs';
import {
  KPICardsGrid
} from './components/executive/KPICardsGrid';
import {
  SaudeSSTGauge
} from './components/executive/SaudeSSTGauge';
import {
  TemporalTrendsChart
} from './components/diagnostic/TemporalTrendsChart';
import {
  DistributionCharts
} from './components/diagnostic/DistributionCharts';
import {
  RiskMatrix3x3
} from './components/diagnostic/RiskMatrix3x3';
import {
  IncidentsModule
} from './components/operational/IncidentsModule';
import {
  ActionsModule
} from './components/operational/ActionsModule';
import {
  InspectionsModule
} from './components/operational/InspectionsModule';
import {
  TrainingsModule
} from './components/operational/TrainingsModule';
import {
  DocumentsModule
} from './components/operational/DocumentsModule';
import {
  AlertsCenterModal
} from './components/operational/AlertsCenterModal';
import {
  AICopilotModal
} from './components/ai/AICopilotModal';
import {
  IndicatorGovernanceModal
} from './components/modals/IndicatorGovernanceModal';
import {
  ExecutiveExportModal
} from './components/modals/ExecutiveExportModal';
import {
  NewIncidentModal
} from './components/modals/NewIncidentModal';
import {
  KPIExplainerModal
} from './components/modals/KPIExplainerModal';
import {
  DataImportModal
} from './components/modals/DataImportModal';
import {
  PRDModal
} from './components/modals/PRDModal';
import {
  GovernanceAuditoriaModule
} from './components/governance/GovernanceAuditoriaModule';
import {
  ComplianceSentinelBanner,
  CriticalComplianceAlertData
} from './components/governance/ComplianceSentinelBanner';

import {
  MOCK_UNIDADES,
  MOCK_SETORES,
  MOCK_OCORRENCIAS,
  MOCK_INSPECOES,
  MOCK_ACOES,
  MOCK_TREINAMENTOS,
  MOCK_DOCUMENTOS,
  MOCK_RISCOS,
  MOCK_ALERTAS,
  MOCK_AUDITORIA_LOGS,
  MOCK_DATA_QUALITY,
  MOCK_ALERT_RULES,
  MOCK_DICIONARIO,
  INITIAL_SAUDE_WEIGHTS
} from './data/mockSstData';
import {
  GlobalFilterState,
  UserRole,
  Ocorrencia,
  Acao5W2H,
  SaudeSSTWeights,
  KPICardData,
  AuditoriaLog,
  DataQualityReport,
  AlertRule,
  TreinamentoColaborador
} from './types/sst';
import {
  calculateIndiceSaudeSST,
  buildKPICards,
  filterEntities
} from './utils/sstCalculations';
import { downloadDashboardPDFReport } from './utils/pdfExportService';

const FILTERS_STORAGE_KEY = 'projectai_sst_global_filters_v2';

const getInitialFilters = (): GlobalFilterState => {
  try {
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        unidadeId: parsed.unidadeId || 'TODAS',
        setorId: parsed.setorId || 'TODOS',
        periodo: parsed.periodo || 'MES_ATUAL',
        turno: parsed.turno || 'TODOS',
        criticidade: parsed.criticidade || 'TODAS',
        searchQuery: parsed.searchQuery || ''
      };
    }
  } catch (err) {
    console.warn('Erro ao restaurar filtros salvos do localStorage:', err);
  }
  return {
    unidadeId: 'TODAS',
    setorId: 'TODOS',
    periodo: 'MES_ATUAL',
    turno: 'TODOS',
    criticidade: 'TODAS',
    searchQuery: '',
  };
};

export default function App() {
  // Global Filters State with localStorage persistence
  const [filters, setFilters] = useState<GlobalFilterState>(getInitialFilters);

  // Sync global filters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (err) {
      console.warn('Erro ao salvar filtros no localStorage:', err);
    }
  }, [filters]);

  // Role Based Access Control State
  const [activeRole, setActiveRole] = useState<UserRole>('GESTOR_SST');

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Operational state
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(MOCK_OCORRENCIAS);
  const [acoes, setAcoes] = useState<Acao5W2H[]>(MOCK_ACOES);
  const [treinamentos, setTreinamentos] = useState<TreinamentoColaborador[]>(MOCK_TREINAMENTOS);
  const [saudeWeights, setSaudeWeights] = useState<SaudeSSTWeights>(INITIAL_SAUDE_WEIGHTS);
  const [alerts, setAlerts] = useState(MOCK_ALERTAS);

  // Camada 4: Governança, Linhagem & Trilha de Auditoria State
  const [auditLogs, setAuditLogs] = useState<AuditoriaLog[]>(MOCK_AUDITORIA_LOGS);
  const [dataQuality, setDataQuality] = useState<DataQualityReport>(MOCK_DATA_QUALITY);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(MOCK_ALERT_RULES);

  // Modals visibility & Active KPI for explanation
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPRDModal, setShowPRDModal] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [kpiForExplanation, setKpiForExplanation] = useState<KPICardData | null>(null);

  // PDF Report Generation State
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState<string | null>(null);

  // Camada 4: Critical Compliance Alert Sentinel State
  const [criticalComplianceAlert, setCriticalComplianceAlert] = useState<CriticalComplianceAlertData | null>(null);

  // Target action for cross-module drilldown
  const [targetActionId, setTargetActionId] = useState<string | null>(null);

  // Success toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Real-time compliance check for Camada 4
  const checkAndTriggerComplianceAlert = (
    acao: AuditoriaLog['acao'],
    entidade: AuditoriaLog['entidade'],
    registroId: string,
    detalhes: string,
    novoValor: string | undefined,
    logObj: AuditoriaLog
  ) => {
    const d = detalhes.toLowerCase();
    let isCritical = false;
    let reason = '';

    if (acao === 'EXCLUSAO') {
      isCritical = true;
      reason = `Exclusão regulatória de registro na entidade "${entidade}" (ID: ${registroId}). Risco severo de ruptura da trilha legal (NR-01/GRO).`;
    } else if (entidade === 'Sistema' && (d.includes('desativada') || d.includes('inativa') || novoValor === 'Inativa')) {
      isCritical = true;
      reason = `Desativação de regra de segurança ou barreira de controle na Camada 4 (${registroId}).`;
    } else if (d.includes('cat') || d.includes('fatal') || d.includes('grave')) {
      isCritical = true;
      reason = `Evento regulatório com lesão crítica ou emissão de CAT detectado na Camada 4 (${registroId}).`;
    } else if (entidade === 'Ocorrência' && acao === 'CRIACAO' && d.includes('afastamento')) {
      isCritical = true;
      reason = `Novo registro de acidente com afastamento (CPT) registrado (${registroId}).`;
    }

    if (isCritical) {
      const alertData: CriticalComplianceAlertData = {
        id: `COMP-ALERT-${Date.now()}`,
        log: logObj,
        detectedAt: new Date().toLocaleTimeString('pt-BR'),
        reason,
        severity: 'CRITICA'
      };
      setCriticalComplianceAlert(alertData);
    }
  };

  // Helper to record immutable audit trail entries (Camada 4)
  const appendAuditLog = (
    acao: AuditoriaLog['acao'],
    entidade: AuditoriaLog['entidade'],
    registroId: string,
    valorAnterior?: string,
    novoValor?: string,
    detalhes: string = ''
  ) => {
    const newLog: AuditoriaLog = {
      id: `AUD-${Date.now()}`,
      usuario: activeRole === 'ADMIN' ? 'Nicolas Herrera (Admin)' : `${activeRole} (Sessão Atual)`,
      cargo: activeRole,
      dataHora: new Date().toISOString().replace('T', ' ').substring(0, 19),
      acao,
      entidade,
      registroId,
      valorAnterior,
      novoValor,
      detalhes,
      ipOrigem: '192.168.1.10 (Local)'
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Active surveillance: check if operation violates critical compliance threshold
    checkAndTriggerComplianceAlert(acao, entidade, registroId, detalhes, novoValor, newLog);
  };

  // Handlers for Compliance Sentinel
  const handleTriggerSimulatedCriticalEvent = () => {
    appendAuditLog(
      'EXCLUSAO',
      'Ocorrência',
      'OC-2026-099',
      'Registro de Acidente com Afastamento (Prensa)',
      undefined,
      'Tentativa de exclusão não autorizada de evidência de acidente grave com emissão de CAT pendente (Infração NR-01/NBR 14280).'
    );
    showNotification('⚠️ Sentinela Camada 4: Alteração crítica de conformidade detectada e alertada!');
  };

  const handleInspectComplianceAlert = () => {
    setActiveTab('governanca');
    showNotification('Visualizando Trilha de Auditoria & Conformidade na Camada 4.');
  };

  const handleDismissComplianceAlert = () => {
    if (criticalComplianceAlert) {
      appendAuditLog(
        'EDICAO',
        'Sistema',
        criticalComplianceAlert.id,
        'Alerta Pendente',
        'Alerta Reconhecido',
        `Alerta de conformidade crítico ${criticalComplianceAlert.id} reconhecido por ${activeRole}.`
      );
    }
    setCriticalComplianceAlert(null);
    showNotification('Alerta crítico de conformidade reconhecido.');
  };

  // Filter items based on global filters
  const filteredOcorrencias = useMemo(() => {
    let list: Ocorrencia[] = filterEntities<Ocorrencia>(ocorrencias, filters);
    if (filters.turno !== 'TODOS') {
      list = list.filter((o) => o.turno === filters.turno);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.codigo.toLowerCase().includes(q) ||
          o.descricao.toLowerCase().includes(q) ||
          o.setorNome.toLowerCase().includes(q)
      );
    }
    return list;
  }, [ocorrencias, filters]);

  const filteredInspecoes = useMemo(() => {
    return filterEntities(MOCK_INSPECOES, filters);
  }, [filters]);

  const filteredAcoes = useMemo(() => {
    let list = acoes;
    if (filters.unidadeId !== 'TODAS') {
      const selectedU = MOCK_UNIDADES.find((u) => u.id === filters.unidadeId);
      if (selectedU) {
        list = list.filter((a) => a.onde.toLowerCase().includes(selectedU.nome.toLowerCase().split('—')[0].trim()));
      }
    }
    return list;
  }, [acoes, filters]);

  const filteredTreinamentos = useMemo(() => {
    return filterEntities(treinamentos, filters);
  }, [treinamentos, filters]);

  const filteredDocumentos = useMemo(() => {
    if (filters.unidadeId !== 'TODAS') {
      return MOCK_DOCUMENTOS.filter((d) => d.unidadeId === filters.unidadeId);
    }
    return MOCK_DOCUMENTOS;
  }, [filters]);

  const filteredRiscos = useMemo(() => {
    return filterEntities(MOCK_RISCOS, filters);
  }, [filters]);

  // Consolidate ISSST calculation
  const saudeResult = useMemo(() => {
    return calculateIndiceSaudeSST(
      filteredInspecoes,
      filteredOcorrencias,
      filteredRiscos,
      filteredAcoes,
      filteredTreinamentos,
      filteredDocumentos,
      saudeWeights
    );
  }, [
    filteredInspecoes,
    filteredOcorrencias,
    filteredRiscos,
    filteredAcoes,
    filteredTreinamentos,
    filteredDocumentos,
    saudeWeights
  ]);

  // KPI cards
  const kpiCards = useMemo(() => {
    return buildKPICards(
      filteredOcorrencias,
      filteredInspecoes,
      filteredAcoes,
      filteredTreinamentos,
      filteredDocumentos,
      filteredRiscos,
      550000 // Horas Homem Trabalhadas (HHT)
    );
  }, [
    filteredOcorrencias,
    filteredInspecoes,
    filteredAcoes,
    filteredTreinamentos,
    filteredDocumentos,
    filteredRiscos
  ]);

  // Badge counts for navigation tabs
  const badgeCounts = useMemo(() => {
    return {
      alertas: alerts.filter((a) => a.status === 'Ativo').length,
      acoesAtrasadas: acoes.filter((a) => a.status === 'Atrasada').length,
      treinamentosVencidos: MOCK_TREINAMENTOS.filter((t) => t.status === 'Vencido').length,
      riscosCriticos: MOCK_RISCOS.filter((r) => r.classificacao === 'Crítico').length,
    };
  }, [alerts, acoes]);

  // Filter change handler
  const handleFilterChange = (newFilters: Partial<GlobalFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    const defaultFilters: GlobalFilterState = {
      unidadeId: 'TODAS',
      setorId: 'TODOS',
      periodo: 'MES_ATUAL',
      turno: 'TODOS',
      criticidade: 'TODAS',
      searchQuery: '',
    };
    setFilters(defaultFilters);
    try {
      localStorage.removeItem(FILTERS_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showNotification('Filtros restaurados para o padrão.');
  };

  // Drill-down from KPI card to corresponding module
  const handleKPICardClick = (card: KPICardData) => {
    switch (card.category) {
      case 'acidentes':
      case 'frequencia':
      case 'gravidade':
        setActiveTab('ocorrencias');
        break;
      case 'acoes':
        setActiveTab('acoes');
        break;
      case 'inspecoes':
        setActiveTab('inspecoes');
        break;
      case 'treinamentos':
        setActiveTab('treinamentos');
        break;
      case 'documentos':
        setActiveTab('documentos');
        break;
      case 'riscos':
        setActiveTab('riscos');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  // Cross-module drill-down into an Action
  const handleOpenAction = (actionId: string) => {
    setTargetActionId(actionId);
    setActiveTab('acoes');
  };

  // Update Action status
  const handleUpdateActionStatus = (actionId: string, newStatus: Acao5W2H['status'], evidence?: string) => {
    const existing = acoes.find((a) => a.id === actionId || a.codigo === actionId);
    const oldStatus = existing ? existing.status : 'Em andamento';

    setAcoes((prev) =>
      prev.map((a) => {
        if (a.id === actionId || a.codigo === actionId) {
          return {
            ...a,
            status: newStatus,
            evidenciaConclusao: evidence || a.evidenciaConclusao,
          };
        }
        return a;
      })
    );

    // Record audit trail event
    appendAuditLog(
      'STATUS_ACAO',
      'Ação 5W2H',
      actionId,
      `Status: ${oldStatus}`,
      `Status: ${newStatus}`,
      `Transição de status operacional da ação 5W2H executada por ${activeRole}.${evidence ? ' Evidência anexada.' : ''}`
    );

    showNotification(`Status da Ação ${actionId} atualizado com sucesso para "${newStatus}".`);
  };

  // Add new Incident
  const handleAddIncident = (newIncident: Ocorrencia) => {
    setOcorrencias((prev) => [newIncident, ...prev]);

    // Automatically create an alert in the central de alertas
    setAlerts((prev) => [
      {
        id: `alt-${Date.now()}`,
        titulo: `Novo Registro: ${newIncident.tipo}`,
        descricao: `${newIncident.codigo} registrado no setor ${newIncident.setorNome}. Severidade: ${newIncident.severidade}.`,
        severidade: newIncident.severidade === 'Grave' || newIncident.severidade === 'Fatal' ? 'Crítico' : 'Alto',
        categoria: 'ocorrencia',
        origemId: newIncident.codigo,
        dataHora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Ativo',
      },
      ...prev,
    ]);

    // Record in audit log
    appendAuditLog(
      'CRIACAO',
      'Ocorrência',
      newIncident.codigo,
      undefined,
      `Tipo: ${newIncident.tipo} (${newIncident.severidade})`,
      `Registro de nova ocorrência no setor ${newIncident.setorNome}: ${newIncident.descricao.substring(0, 60)}`
    );

    showNotification(`Ocorrência ${newIncident.codigo} registrada com sucesso. Alerta emitido para o SESMT.`);
  };

  // Mass data import handlers (FR-009 / P0)
  const handleImportOcorrencias = (data: Record<string, any>[]) => {
    const newItems: Ocorrencia[] = data.map((item, idx) => ({
      id: `oc-imp-${Date.now()}-${idx}`,
      codigo: item.codigo || `OC-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
      tipo: (item.tipo as any) || 'Incidente / Quase-Acidente',
      dataHora: item.dataHora || new Date().toISOString().replace('T', ' ').substring(0, 16),
      unidadeId: item.unidadeId || 'UND-01',
      unidadeNome: 'Unidade Matriz (Importada)',
      setorId: item.setorId || 'SET-01',
      setorNome: item.setorNome || 'Setor Fabril',
      atividade: item.atividade || 'Operação e Logística',
      colaboradorEnvolvido: item.colaboradorEnvolvido || 'Colaborador Registrado',
      funcaoColaborador: item.funcaoColaborador || 'Operador',
      turno: (item.turno as any) || 'TURNO_A',
      descricao: item.descricao || 'Registro importado via planilha CSV.',
      classificacao: (item.classificacao as any) || 'Média',
      severidade: (item.severidade as any) || 'Leve',
      diasPerdidos: Number(item.diasPerdidos) || 0,
      investigadorResponsavel: item.investigadorResponsavel || 'SESMT Central',
      statusInvestigacao: 'Em Investigação',
      causaImediata: item.causaImediata || 'Sob apuração técnica',
      causaBasica: item.causaBasica || 'Sob apuração técnica',
      fatoresContribuintes: ['Importação de dados Legados'],
      testemunhas: [],
      evidenciasFotograficas: []
    }));

    setOcorrencias((prev) => [...newItems, ...prev]);

    appendAuditLog(
      'IMPORTACAO',
      'Ocorrência',
      `BATCH-OC-${Date.now()}`,
      undefined,
      `${newItems.length} registros inseridos`,
      `Carga massiva de ocorrências via CSV processada com sucesso. Recálculo imediato de TF/TG e ISSST.`
    );

    setDataQuality((prev) => ({
      ...prev,
      totalRegistrosAvaliados: prev.totalRegistrosAvaliados + newItems.length,
      registrosCompletos: prev.registrosCompletos + newItems.length,
      ultimaVerificacao: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }));

    showNotification(`${newItems.length} ocorrências importadas com recálculo automático de indicadores!`);
  };

  const handleImportAcoes = (data: Record<string, any>[]) => {
    const newItems: Acao5W2H[] = data.map((item, idx) => ({
      id: `act-imp-${Date.now()}-${idx}`,
      codigo: item.codigo || `ACT-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
      titulo: item.titulo || item.oQue || 'Ação importada via planilha',
      oQue: item.oQue || 'Ação importada via planilha',
      porQue: item.porQue || 'Atendimento a plano de melhoria contínua',
      onde: item.onde || 'Fábrica Principal',
      quem: item.quem || 'Responsável SST',
      quando: item.quando || '2026-04-30',
      como: item.como || 'Execução técnica conforme especificação',
      quantoCusta: item.quantoCusta || item.quanto || 'R$ 0,00',
      origem: (item.origem as any) || 'Ocorrência',
      origemIdReferencia: item.origemIdReferencia || 'IMPORT-CSV',
      status: (item.status as any) || 'Em andamento',
      prioridade: (item.prioridade as any) || 'Alta',
      percentualConclusao: Number(item.percentualConclusao) || 0,
      dataCriacao: new Date().toISOString().substring(0, 10),
      observacoes: 'Importada via carga CSV'
    }));

    setAcoes((prev) => [...newItems, ...prev]);

    appendAuditLog(
      'IMPORTACAO',
      'Ação 5W2H',
      `BATCH-ACT-${Date.now()}`,
      undefined,
      `${newItems.length} ações inseridas`,
      `Carga massiva de ações 5W2H processada via CSV com recálculo do ISSST.`
    );

    showNotification(`${newItems.length} ações 5W2H importadas com sucesso!`);
  };

  const handleImportTreinamentos = (data: Record<string, any>[]) => {
    const newItems: TreinamentoColaborador[] = data.map((item, idx) => ({
      id: `trn-imp-${Date.now()}-${idx}`,
      colaboradorNome: item.colaboradorNome || 'Colaborador Importado',
      matricula: item.matricula || `MAT-${Date.now().toString().slice(-4)}-${idx + 1}`,
      funcao: item.funcao || 'Operador',
      unidadeId: item.unidadeId || 'UND-01',
      unidadeNome: 'Unidade Matriz',
      setorNome: item.setorNome || 'Produção',
      cursoNorma: item.cursoNorma || item.treinamentoNome || 'NR-01 Disposições Gerais',
      cargaHoraria: Number(item.cargaHoraria || item.cargaHorariaHoras) || 8,
      dataRealizacao: item.dataRealizacao || item.dataConclusao || '2025-06-01',
      dataValidade: item.dataValidade || '2027-06-01',
      diasParaVencer: 365,
      instrutorEntidade: item.instrutorEntidade || item.entidadeTreinamento || 'SENAI / Empresa',
      certificadoNumero: `CERT-${Date.now().toString().slice(-4)}-${idx + 1}`,
      status: (item.status as any) || 'Vigente'
    }));

    setTreinamentos((prev) => [...newItems, ...prev]);

    appendAuditLog(
      'IMPORTACAO',
      'Treinamento',
      `BATCH-TRN-${Date.now()}`,
      undefined,
      `${newItems.length} treinamentos inseridos`,
      `Carga de treinamentos e capacitações processada via CSV com recálculo da cobertura de capacitação.`
    );

    showNotification(`${newItems.length} treinamentos importados com sucesso!`);
  };

  // Export audit trail to CSV
  const handleExportAuditLogs = () => {
    let csv = 'ID,DataHora,Usuario,Cargo,Acao,Entidade,RegistroID,ValorAnterior,NovoValor,Detalhes,IP\n';
    auditLogs.forEach((l) => {
      csv += `"${l.id}","${l.dataHora}","${l.usuario}","${l.cargo}","${l.acao}","${l.entidade}","${l.registroId}","${l.valorAnterior || ''}","${l.novoValor || ''}","${l.detalhes.replace(/"/g, '""')}","${l.ipOrigem}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trilha_auditoria_sst_projectai_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    appendAuditLog('EXPORTACAO', 'Sistema', 'REL-AUDIT-CSV', undefined, 'Download CSV', 'Exportação completa dos registros de auditoria em formato CSV.');
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Reconhecido' } : a))
    );
  };

  // Navigate from Alert item
  const handleNavigateFromAlert = (categoria: string, refId: string) => {
    setShowAlertsModal(false);
    if (categoria === 'ocorrencia') {
      setActiveTab('ocorrencias');
    } else if (categoria === 'acao') {
      setTargetActionId(refId);
      setActiveTab('acoes');
    } else if (categoria === 'risco') {
      setActiveTab('riscos');
    } else if (categoria === 'treinamento') {
      setActiveTab('treinamentos');
    } else if (categoria === 'documento') {
      setActiveTab('documentos');
    }
  };

  // Automated PDF Report Downloader via jsPDF & html2canvas
  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    showNotification('Iniciando captura de dados e gráficos para compilação do relatório PDF...');
    try {
      // If user is currently on another tab, momentarily switch to dashboard so charts are in the DOM
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      await downloadDashboardPDFReport({
        filters,
        saudeData: saudeResult,
        kpis: kpiCards,
        ocorrencias: filteredOcorrencias,
        acoes: filteredAcoes,
        riscos: filteredRiscos,
        inspecoes: filteredInspecoes,
        activeRole,
        onProgress: (status) => {
          setReportProgress(status);
        }
      });

      appendAuditLog(
        'EXPORTACAO',
        'Sistema',
        `PDF-DASH-${Date.now()}`,
        undefined,
        'Download Report PDF',
        'Relatório Executivo Completo de SST baixado em PDF com gráficos e indicadores em alta resolução.'
      );

      showNotification('Relatório Executivo Oficial de SST descarregado com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar relatório PDF:', err);
      showNotification('Falha ao processar relatório PDF. Tente novamente.');
    } finally {
      setIsGeneratingReport(false);
      setReportProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 grid grid-cols-1 md:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] grid-rows-[auto_1fr_auto]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Control Bar (Header) */}
      <HeaderGlobalBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        unidades={MOCK_UNIDADES}
        setores={MOCK_SETORES}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        alerts={alerts}
        onOpenAlerts={() => setShowAlertsModal(true)}
        onOpenAI={() => setShowAIModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onDownloadReport={handleDownloadReport}
        isGeneratingReport={isGeneratingReport}
        onOpenImport={() => setShowImportModal(true)}
        onOpenDictionary={() => setShowDictionaryModal(true)}
        onOpenPRD={() => setShowPRDModal(true)}
        onOpenNewIncident={() => setShowNewIncidentModal(true)}
      />

      {/* Camada 4: Sentinel Critical Compliance Visual Alert */}
      <AnimatePresence>
        {criticalComplianceAlert && (
          <ComplianceSentinelBanner
            alert={criticalComplianceAlert}
            onInspect={handleInspectComplianceAlert}
            onDismiss={handleDismissComplianceAlert}
          />
        )}
      </AnimatePresence>

      {/* Navigation Tabs (Vertical Left Sidebar) */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        badgeCounts={badgeCounts}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 min-w-0 bg-[#050608] px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-y-auto">
        {/* EXCLUSIVE PRINT REPORT HEADER (@media print) */}
        <div className="print-only mb-6 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black tracking-tight text-slate-900 font-mono">PROJECTAI</span>
                <span className="text-xs px-2 py-0.5 border border-slate-700 font-mono font-bold rounded">
                  SUITE SST v2.1 • NBR 14280 & NR-01 (GRO/PGR)
                </span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 mt-1">
                Relatório Executivo Oficial de Segurança e Saúde no Trabalho
              </h1>
              <p className="text-xs text-slate-600">
                Gestão Estratégica Baseada em Evidências, Investigação de Causalidade e Planos de Ação 5W2H
              </p>
            </div>
            <div className="text-right text-xs text-slate-700 font-mono space-y-0.5">
              <div><strong>Emissão:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</div>
              <div><strong>Unidade:</strong> {filters.unidadeId === 'TODAS' ? 'Todas as Unidades (Consolidado)' : (MOCK_UNIDADES.find(u => u.id === filters.unidadeId)?.nome || filters.unidadeId)}</div>
              <div><strong>Setor:</strong> {filters.setorId === 'TODOS' ? 'Todos os Setores' : (MOCK_SETORES.find(s => s.id === filters.setorId)?.nome || filters.setorId)}</div>
              <div><strong>Turno:</strong> {filters.turno} | <strong>Período:</strong> {filters.periodo}</div>
            </div>
          </div>
        </div>

        {/* Animated Tab Switch Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full space-y-6"
          >
            {/* TAB 1: EXECUTIVE & DIAGNOSTIC DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
            {/* Camada 1: Painel Executivo de KPIs */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                    Painel Executivo de Indicadores Críticos
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Camada 1 • Gestão por Exceção
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Métricas consolidadas em tempo real com faixas de conformidade e meta zero acidentes
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Clique em qualquer KPI para visualizar a causa e o plano 5W2H
                </span>
              </div>

              {/* Grid of 10 KPI Cards with AI Explainer and Polarity Badges */}
              <div id="sst-kpi-grid-container">
                <KPICardsGrid
                  cards={kpiCards}
                  onCardClick={handleKPICardClick}
                  onExplainKPI={(card) => setKpiForExplanation(card)}
                />
              </div>
            </section>

            {/* Índice de Saúde SST (ISSST) Consolidado */}
            <section id="sst-saude-gauge-container">
              <SaudeSSTGauge
                saudeData={saudeResult}
                weights={saudeWeights}
                onUpdateWeights={(w) => {
                  setSaudeWeights(w);
                  showNotification('Pesos ponderados do ISSST atualizados com sucesso!');
                }}
                canEditWeights={activeRole === 'ADMIN' || activeRole === 'GESTOR_SST'}
              />
            </section>

            {/* Camada 2: Diagnóstico e Tendências */}
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  Camada Diagnóstica: Análise de Causa, Tendências e Matriz P x S
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Camada 2
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Cruzamento de dados para detecção prévia de anomalias operacionais
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Temporal Evolution Chart */}
                <div id="sst-temporal-trends-container">
                  <TemporalTrendsChart />
                </div>

                {/* Occurrence Distribution by Sector, Shift and Type */}
                <div id="sst-distribution-container">
                  <DistributionCharts ocorrencias={filteredOcorrencias} />
                </div>
              </div>

              {/* Matriz de Riscos 3x3 (NR-01) */}
              <div id="sst-risk-matrix-container" className="pt-2">
                <RiskMatrix3x3
                  riscos={filteredRiscos}
                  onOpenAction={handleOpenAction}
                />
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: INCIDENTES & ACIDENTES */}
        {activeTab === 'ocorrencias' && (
          <div className="animate-in fade-in duration-300">
            <IncidentsModule
              ocorrencias={filteredOcorrencias}
              onOpenNewIncident={() => setShowNewIncidentModal(true)}
              onOpenAction={handleOpenAction}
            />
          </div>
        )}

        {/* TAB 3: PLANO DE AÇÕES 5W2H */}
        {activeTab === 'acoes' && (
          <div className="animate-in fade-in duration-300">
            <ActionsModule
              acoes={filteredAcoes}
              onUpdateActionStatus={handleUpdateActionStatus}
              targetActionId={targetActionId}
            />
          </div>
        )}

        {/* TAB 4: MATRIZ DE RISCOS */}
        {activeTab === 'riscos' && (
          <div className="animate-in fade-in duration-300">
            <RiskMatrix3x3
              riscos={filteredRiscos}
              onOpenAction={handleOpenAction}
            />
          </div>
        )}

        {/* TAB 5: INSPEÇÕES & CHECKLISTS */}
        {activeTab === 'inspecoes' && (
          <div className="animate-in fade-in duration-300">
            <InspectionsModule
              inspecoes={filteredInspecoes}
              onOpenAction={handleOpenAction}
            />
          </div>
        )}

        {/* TAB 6: TREINAMENTOS & NRs */}
        {activeTab === 'treinamentos' && (
          <div className="animate-in fade-in duration-300">
            <TrainingsModule treinamentos={filteredTreinamentos} />
          </div>
        )}

        {/* TAB 7: DOCUMENTOS REGULAMENTARES */}
        {activeTab === 'documentos' && (
          <div className="animate-in fade-in duration-300">
            <DocumentsModule documentos={filteredDocumentos} />
          </div>
        )}

        {/* TAB 8: CENTRAL DE ALERTAS */}
        {activeTab === 'alertas' && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <h2 className="text-base font-bold text-white">Central Operacional de Alertas</h2>
              <p className="text-xs text-slate-400">Gestão por exceção e tratamento imediato de inconformidades</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {alerts.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border bg-slate-900/80 flex items-start justify-between gap-4 ${
                    item.severidade === 'Crítico' ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.severidade === 'Crítico'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.severidade}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{item.dataHora}</span>
                      <span className="text-xs text-slate-500 font-mono">Ref: {item.origemId}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{item.titulo}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{item.descricao}</p>
                  </div>
                  <button
                    onClick={() => handleNavigateFromAlert(item.categoria, item.origemId)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 whitespace-nowrap"
                  >
                    Tratar Ocorrência →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CAMADA 4 — GOVERNANÇA, LINHAGEM & TRILHA DE AUDITORIA */}
        {activeTab === 'governanca' && (
          <div className="animate-in fade-in duration-300">
            <GovernanceAuditoriaModule
              auditLogs={auditLogs}
              dataQuality={dataQuality}
              alertRules={alertRules}
              indicadores={MOCK_DICIONARIO}
              onExportAuditLogs={handleExportAuditLogs}
              onOpenGovernanceDictionary={() => setShowDictionaryModal(true)}
              onTriggerSimulatedCriticalEvent={handleTriggerSimulatedCriticalEvent}
              criticalAlertActive={criticalComplianceAlert !== null}
              onUpdateAlertRule={(ruleId, active) => {
                setAlertRules((prev) =>
                  prev.map((r) => (r.id === ruleId ? { ...r, ativo: active } : r))
                );
                appendAuditLog(
                  'EDICAO',
                  'Sistema',
                  ruleId,
                  undefined,
                  active ? 'Ativa' : 'Inativa',
                  `Parametrização da regra de alerta ${ruleId} alterada por ${activeRole}.`
                );
                showNotification(`Regra ${ruleId} ${active ? 'ativada' : 'desativada'} com sucesso.`);
              }}
            />
          </div>
        )}
          </motion.div>
        </AnimatePresence>

        {/* EXCLUSIVE PRINT REPORT FOOTER */}
        <div className="print-only mt-8 pt-4 border-t border-slate-400 text-xs text-slate-600 flex justify-between items-center font-mono">
          <span>PROJECTAI SST • Documento gerado com trilha de auditoria digital e integridade de dados (Camada 4).</span>
          <span>Página 1 / Relatório Oficial Conforme NBR 14280</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="col-span-full border-t border-zinc-900 bg-black py-3.5 text-center text-xs text-zinc-500">
        <div className="w-full px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">PROJECTAI</span>
            <span>• Dashboard SST Inteligente v2.1.0</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            Metodologia: NBR 14280 • NR-01 (GRO/PGR) • NR-12 • NR-35 • Pirâmide de Frank Bird
          </div>
        </div>
      </footer>

      {/* Modals with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {showAlertsModal && (
          <AlertsCenterModal
            alerts={alerts}
            onClose={() => setShowAlertsModal(false)}
            onNavigateTo={handleNavigateFromAlert}
            onAcknowledgeAlert={handleAcknowledgeAlert}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIModal && (
          <AICopilotModal
            onClose={() => setShowAIModal(false)}
            saudeData={saudeResult}
            kpis={kpiCards}
            filters={filters}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExportModal && (
          <ExecutiveExportModal
            onClose={() => setShowExportModal(false)}
            saudeData={saudeResult}
            kpis={kpiCards}
            filters={filters}
            ocorrencias={filteredOcorrencias}
            acoes={filteredAcoes}
            riscos={filteredRiscos}
            activeRole={activeRole}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDictionaryModal && (
          <IndicatorGovernanceModal
            onClose={() => setShowDictionaryModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewIncidentModal && (
          <NewIncidentModal
            onClose={() => setShowNewIncidentModal(false)}
            unidades={MOCK_UNIDADES}
            setores={MOCK_SETORES}
            onAddIncident={handleAddIncident}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {kpiForExplanation && (
          <KPIExplainerModal
            isOpen={kpiForExplanation !== null}
            onClose={() => setKpiForExplanation(null)}
            kpi={kpiForExplanation}
            onNavigateToAction={handleOpenAction}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImportModal && (
          <DataImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImportOcorrencias={handleImportOcorrencias}
            onImportAcoes={handleImportAcoes}
            onImportTreinamentos={handleImportTreinamentos}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPRDModal && (
          <PRDModal
            isOpen={showPRDModal}
            onClose={() => setShowPRDModal(false)}
            onNotification={showNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
