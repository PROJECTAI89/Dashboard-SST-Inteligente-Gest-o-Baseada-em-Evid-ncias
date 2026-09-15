export type UserRole = 'ADMIN' | 'GESTOR_SST' | 'SUPERVISOR' | 'OPERACIONAL' | 'DIRETORIA';

export type SemanticStatus = 'verde' | 'amarelo' | 'laranja' | 'vermelho' | 'cinza';

export type AlertSeverity = 'Crítico' | 'Alto' | 'Atenção' | 'Informativo';

export interface Unidade {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  responsavelSST: string;
  colaboradoresTotal: number;
  horasTrabalhadasMes: number;
}

export interface Setor {
  id: string;
  unidadeId: string;
  nome: string;
  grauRiscoPredominante: number; // 1 a 4 conforme NR-04
  responsavelArea: string;
}

export interface GlobalFilterState {
  unidadeId: string; // 'TODAS' | specific id
  setorId: string; // 'TODOS' | specific id
  periodo: '30_DIAS' | 'MES_ATUAL' | 'TRIMESTRE' | 'ANO_ATUAL';
  turno: 'TODOS' | 'TURNO_A' | 'TURNO_B' | 'TURNO_C';
  criticidade: 'TODAS' | 'CRITICO' | 'ALTO' | 'ATENCAO' | 'ACEITAVEL';
  searchQuery: string;
}

export interface KPIDataLineage {
  fonte: string;
  quantidadeRegistros: number;
  ultimaAtualizacao: string;
  versaoFormula: string;
  dataOwner: string;
  qualidadeDado: 'Atualizado' | 'Parcial' | 'Desatualizado' | 'Inconsistente';
}

export interface KPIMonthlyTrendPoint {
  mes: string;
  valor: number;
}

export interface KPICardData {
  id: string;
  codigo: string;
  titulo: string;
  valor: number | string;
  unidadeMedida: string;
  meta: number | string;
  percentualCumprimento: number;
  variacao: number; // Ex: -12.5% em relação ao período anterior
  tendencia: 'melhora' | 'piora' | 'estavel';
  statusSemantico: SemanticStatus;
  descricao: string;
  subtexto?: string;
  category: 'acidentes' | 'frequencia' | 'gravidade' | 'inspecoes' | 'acoes' | 'treinamentos' | 'documentos' | 'riscos';
  polaridade?: 'MENOR_MELHOR' | 'MAIOR_MELHOR';
  limiteAtencao?: number | string;
  limiteCritico?: number | string;
  lineage?: KPIDataLineage;
  semDadosDisponiveis?: boolean;
  monthlyHistory?: KPIMonthlyTrendPoint[];
  monthlyGrowth?: number; // Percentual de crescimento ou declínio mensal (+12.5% ou -17.3%)
}

export interface SaudeSSTWeights {
  conformidadeInspecoes: number; // Ex: 0.20
  controleIncidentes: number;     // Ex: 0.25
  gestaoRiscos: number;           // Ex: 0.20
  acoesNoPrazo: number;           // Ex: 0.15
  treinamentosRegulares: number;  // Ex: 0.10
  documentosVigentes: number;     // Ex: 0.10
}

export interface IndiceSaudeSSTResult {
  score: number; // 0 a 100
  classificacao: 'Excelente' | 'Atenção' | 'Risco Elevado' | 'Crítico';
  statusSemantico: SemanticStatus;
  detalhes: {
    categoria: string;
    scoreParcial: number;
    peso: number;
    contribuicao: number;
  }[];
}

export interface Ocorrencia {
  id: string;
  codigo: string; // Ex: OC-2026-042
  tipo: 'Acidente com Afastamento (CPT)' | 'Acidente sem Afastamento (SPT)' | 'Incidente / Quase-Acidente' | 'Desvio Comportamental' | 'Condição Insegura';
  dataHora: string;
  unidadeId: string;
  unidadeNome: string;
  setorId: string;
  setorNome: string;
  atividade: string;
  colaboradorEnvolvido: string;
  funcaoColaborador: string;
  turno: 'TURNO_A' | 'TURNO_B' | 'TURNO_C';
  descricao: string;
  classificacao: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  severidade: 'Sem Lesão' | 'Leve' | 'Moderada' | 'Grave' | 'Fatal';
  diasPerdidos: number;
  
  // Investigação
  investigadorResponsavel: string;
  statusInvestigacao: 'Registrado' | 'Em Investigação' | 'Ação Definida' | 'Em Validação' | 'Encerrado';
  causaImediata: string;
  causaBasica: string;
  fatoresContribuintes: string[];
  testemunhas: string[];
  evidenciasFotograficas: string[];
  
  // Ação Corretiva Vinculada
  acaoId?: string;
  acaoDescricao?: string;
  responsavelAcao?: string;
  prazoAcao?: string;
  statusAcao?: string;
}

export interface InspecaoItem {
  id: string;
  pergunta: string;
  normaReferencia: string; // ex: NR-12, NR-35
  conforme: boolean;
  observacao?: string;
  fotoUrl?: string;
}

export interface Inspecao {
  id: string;
  codigo: string; // Ex: INSP-2026-108
  titulo: string;
  tipoChecklist: 'NR-12 Proteção de Máquinas' | 'NR-35 Trabalho em Altura' | 'NR-10 Segurança Elétrica' | 'EPIs e EPCs' | 'Ordem e Limpeza (5S)';
  unidadeId: string;
  unidadeNome: string;
  setorId: string;
  setorNome: string;
  data: string;
  responsavelInspetor: string;
  itensAvaliadosTotal: number;
  itensConformesTotal: number;
  taxaConformidade: number; // %
  itensNaoConformes: InspecaoItem[];
  status: 'Concluída' | 'Com Pendências' | 'Atrasada';
  acaoIdGerada?: string;
}

export interface Acao5W2H {
  id: string;
  codigo: string; // Ex: ACT-2026-089
  titulo: string;
  oQue: string; // What
  porQue: string; // Why
  onde: string; // Where (Unidade / Setor)
  quem: string; // Who (Responsável)
  quando: string; // When (Prazo limite)
  como: string; // How
  quantoCusta?: string; // How much
  origem: 'Ocorrência' | 'Inspeção' | 'Matriz de Risco' | 'Auditoria Externa';
  origemIdReferencia: string;
  prioridade: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  status: 'Não iniciada' | 'Em andamento' | 'Atrasada' | 'Em validação' | 'Concluída' | 'Cancelada';
  dataCriacao: string;
  dataConclusaoReal?: string;
  evidenciaConclusao?: string;
  verificadoEficaz?: boolean;
}

export interface TreinamentoColaborador {
  id: string;
  colaboradorNome: string;
  matricula: string;
  funcao: string;
  unidadeId: string;
  unidadeNome: string;
  setorNome: string;
  cursoNorma: string; // Ex: 'NR-35 Trabalho em Altura', 'NR-10 Eletricidade'
  cargaHoraria: number; // horas
  dataRealizacao: string;
  dataValidade: string;
  diasParaVencer: number; // Negativo se vencido
  instrutorEntidade: string;
  certificadoNumero: string;
  status: 'Vigente' | 'Vence em 7 dias' | 'Vence em 15 dias' | 'Vence em 30 dias' | 'Vencido';
}

export interface DocumentoRegulamentar {
  id: string;
  nome: string; // Ex: 'PGR - Programa de Gerenciamento de Riscos'
  tipo: 'PGR' | 'PCMSO' | 'LTCAT' | 'Laudo Ergonômico' | 'Plano de Emergência' | 'PAE';
  unidadeId: string;
  unidadeNome: string;
  versao: string;
  responsavelTecnico: string; // Ex: 'Eng. Roberto Vasconcelos - CREA 123456'
  dataEmissao: string;
  dataValidade: string;
  diasParaVencer: number;
  status: 'Vigente' | 'Próximo do vencimento' | 'Vencido' | 'Em revisão';
  arquivoUrl?: string;
}

export interface RiscoMatriz {
  id: string;
  codigo: string; // Ex: RSK-2026-015
  perigo: string;
  risco: string;
  fonteGeradora: string;
  exposicao: string;
  unidadeId: string;
  unidadeNome: string;
  setorId: string;
  setorNome: string;
  trabalhadoresExpostos: number;
  probabilidade: 1 | 2 | 3; // 1: Baixa, 2: Média, 3: Alta
  severidade: 1 | 2 | 3;    // 1: Baixa, 2: Média, 3: Alta
  nivelRiscoScore: number;  // Prob x Sev (1 a 9)
  classificacao: 'Aceitável' | 'Atenção' | 'Crítico';
  controlesExistentes: string[];
  controlesNecessarios: string[];
  responsavel: string;
  prazoRevisao: string;
  status: 'Controlado' | 'Em Tratamento' | 'Crítico Sem Barreira';
  acaoVinculadaId?: string;
}

export interface AlertaSST {
  id: string;
  tipo: string;
  severidade: AlertSeverity;
  titulo: string;
  descricao: string;
  data: string;
  origem: string;
  origemTipo: 'RISCO' | 'ACAO' | 'TREINAMENTO' | 'DOCUMENTO' | 'INDICADOR' | 'OCORRENCIA';
  origemId?: string;
  indicadorRelacionado: string;
  responsavel: string;
  acaoRecomendada: string;
  status: 'Ativo' | 'Reconhecido' | 'Em Tratamento' | 'Resolvido';
}

export interface IndicadorDicionario {
  codigo: string;
  nome: string;
  definicao: string;
  formula: string;
  unidade: string;
  fonte: string;
  periodicidade: string;
  meta: string;
  limiteCritico: string;
  dataOwner: string;
  ultimaAtualizacao: string;
  versao: string;
  polaridade?: 'MENOR_MELHOR' | 'MAIOR_MELHOR';
  limiteAtencao?: string;
  ativo?: boolean;
}

export interface AuditoriaLog {
  id: string;
  usuario: string;
  cargo: string;
  dataHora: string;
  acao: 'LOGIN' | 'CRIACAO' | 'EDICAO' | 'EXCLUSAO' | 'STATUS_ACAO' | 'ALTERACAO_META' | 'ALTERACAO_KPI' | 'IMPORTACAO' | 'EXPORTACAO';
  entidade: 'Ocorrência' | 'Ação 5W2H' | 'Risco' | 'Inspeção' | 'Treinamento' | 'Documento' | 'Indicador' | 'Sistema';
  registroId: string;
  valorAnterior?: string;
  novoValor?: string;
  detalhes: string;
  ipOrigem: string;
}

export interface DataQualityReport {
  scoreGeral: number; // 0 a 100
  status: 'Atualizado' | 'Parcial' | 'Desatualizado' | 'Inconsistente';
  totalRegistrosAvaliados: number;
  registrosCompletos: number;
  camposObrigatoriosVazios: number;
  duplicidadesDetectadas: number;
  datasInconsistentes: number;
  valoresForaIntervalo: number;
  ultimaVerificacao: string;
  fontesAuditadas: Array<{
    nome: string;
    status: 'Atualizado' | 'Desatualizado' | 'Inconsistente';
    registros: number;
    ultimaSincronizacao: string;
  }>;
}

export interface AlertRule {
  id: string;
  nome: string;
  condicao: string;
  operador: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contem';
  threshold: string;
  severidade: AlertSeverity;
  destinatario: string;
  acaoSugerida: string;
  frequencia: 'Tempo Real' | 'Diária' | 'Semanal';
  ativo: boolean;
  dataCriacao: string;
  versao: string;
}

// Modelagem PRD v2.2.0-PROD: Evidências, Normas e Conformidade
export interface Evidencia {
  id: string;
  tipo: 'Foto' | 'Laudo Técnico' | 'ART' | 'Checklist Assinado' | 'Certificado Treinamento' | 'Ordem de Serviço';
  nome: string;
  descricao: string;
  source: string;
  fileReference?: string;
  hash: string; // SHA-256 de integridade da evidência
  capturedAt: string;
  capturedBy: string;
  createdAt: string;
}

export interface NormaRegra {
  id: string;
  codigo: string; // Ex: 'NR-01.GRO', 'NR-12.DISPOSITIVOS', 'NBR-14280.TF'
  titulo: string;
  versao: string;
  vigenciaInicio: string;
  vigenciaFim?: string;
  fonte: string;
  regra: string;
  evidenciaRequerida: string;
}

export interface ComplianceItem {
  id: string;
  normaCodigo: string;
  requisito: string;
  status: 'Conforme' | 'Não conforme' | 'Parcial' | 'Não avaliado' | 'Sem evidência';
  evidenciaId?: string;
  responsavel: string;
  ultimaAuditoria: string;
  observacoes?: string;
}

