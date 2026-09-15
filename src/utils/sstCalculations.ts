import {
  Ocorrencia,
  Inspecao,
  Acao5W2H,
  TreinamentoColaborador,
  DocumentoRegulamentar,
  RiscoMatriz,
  GlobalFilterState,
  KPICardData,
  IndiceSaudeSSTResult,
  SaudeSSTWeights,
  SemanticStatus
} from '../types/sst';

export function filterEntities<T extends { unidadeId?: string; setorId?: string }>(
  items: T[],
  filters: GlobalFilterState
): T[] {
  return items.filter((item) => {
    if (filters.unidadeId !== 'TODAS' && item.unidadeId && item.unidadeId !== filters.unidadeId) {
      return false;
    }
    if (filters.setorId !== 'TODOS' && item.setorId && item.setorId !== filters.setorId) {
      return false;
    }
    return true;
  });
}

export function calculateDaysWithoutAccidents(ocorrencias: Ocorrencia[]): number {
  const acidentesComAfastamento = ocorrencias.filter(
    (o) => o.tipo === 'Acidente com Afastamento (CPT)'
  );
  if (acidentesComAfastamento.length === 0) {
    return 142; // Dias estáveis da planta
  }

  const sorted = [...acidentesComAfastamento].sort(
    (a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
  );
  const lastDate = new Date(sorted[0].dataHora);
  const now = new Date('2026-03-15T10:00:00'); // Data base operacional
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTaxaFrequencia(acidentesCount: number, horasHomem: number): number {
  if (horasHomem <= 0) return 0;
  return Number(((acidentesCount * 1000000) / horasHomem).toFixed(2));
}

export function calculateTaxaGravidade(diasPerdidos: number, horasHomem: number): number {
  if (horasHomem <= 0) return 0;
  return Number(((diasPerdidos * 1000000) / horasHomem).toFixed(2));
}

export function calculateIndiceSaudeSST(
  inspecoes: Inspecao[],
  ocorrencias: Ocorrencia[],
  riscos: RiscoMatriz[],
  acoes: Acao5W2H[],
  treinamentos: TreinamentoColaborador[],
  documentos: DocumentoRegulamentar[],
  weights: SaudeSSTWeights
): IndiceSaudeSSTResult {
  // 1. Conformidade Inspeções (0-100)
  const totalItens = inspecoes.reduce((acc, curr) => acc + curr.itensAvaliadosTotal, 0);
  const totalConformes = inspecoes.reduce((acc, curr) => acc + curr.itensConformesTotal, 0);
  const scoreInspecoes = totalItens > 0 ? (totalConformes / totalItens) * 100 : 90;

  // 2. Controle de Incidentes (100 se 0 acidentes, penaliza CPT severamente)
  const cptCount = ocorrencias.filter((o) => o.tipo === 'Acidente com Afastamento (CPT)').length;
  const sptCount = ocorrencias.filter((o) => o.tipo === 'Acidente sem Afastamento (SPT)').length;
  const quaseCount = ocorrencias.filter((o) => o.tipo === 'Incidente / Quase-Acidente').length;
  const scoreIncidentes = Math.max(0, 100 - (cptCount * 40 + sptCount * 15 + quaseCount * 4));

  // 3. Gestão de Riscos (Penaliza riscos críticos sem barreira)
  const criticosSemBarreira = riscos.filter((r) => r.status === 'Crítico Sem Barreira').length;
  const emTratamento = riscos.filter((r) => r.status === 'Em Tratamento').length;
  const scoreRiscos = Math.max(0, 100 - (criticosSemBarreira * 35 + emTratamento * 12));

  // 4. Ações no Prazo
  const acoesAtivas = acoes.filter((a) => a.status !== 'Cancelada');
  const acoesAtrasadas = acoesAtivas.filter((a) => a.status === 'Atrasada').length;
  const acoesConcluidas = acoesAtivas.filter((a) => a.status === 'Concluída').length;
  const scoreAcoes = acoesAtivas.length > 0
    ? Math.max(0, 100 - (acoesAtrasadas / acoesAtivas.length) * 100)
    : 100;

  // 5. Treinamentos Regulares
  const treinamentosVencidos = treinamentos.filter((t) => t.status === 'Vencido').length;
  const treinamentosVencendo = treinamentos.filter((t) => t.status === 'Vence em 7 dias' || t.status === 'Vence em 15 dias').length;
  const scoreTreinamentos = treinamentos.length > 0
    ? Math.max(0, 100 - ((treinamentosVencidos * 25 + treinamentosVencendo * 10) / treinamentos.length) * 100)
    : 100;

  // 6. Documentos Vigentes
  const docsVencidos = documentos.filter((d) => d.status === 'Vencido').length;
  const docsProxVenc = documentos.filter((d) => d.status === 'Próximo do vencimento').length;
  const scoreDocumentos = documentos.length > 0
    ? Math.max(0, 100 - (docsVencidos * 50 + docsProxVenc * 20))
    : 100;

  // Weighted sum: ISSST = SUM(wi * Si)
  const sumWeights =
    weights.conformidadeInspecoes +
    weights.controleIncidentes +
    weights.gestaoRiscos +
    weights.acoesNoPrazo +
    weights.treinamentosRegulares +
    weights.documentosVigentes;

  const rawScore =
    scoreInspecoes * weights.conformidadeInspecoes +
    scoreIncidentes * weights.controleIncidentes +
    scoreRiscos * weights.gestaoRiscos +
    scoreAcoes * weights.acoesNoPrazo +
    scoreTreinamentos * weights.treinamentosRegulares +
    scoreDocumentos * weights.documentosVigentes;

  const score = Number((rawScore / (sumWeights || 1)).toFixed(1));

  let classificacao: 'Excelente' | 'Atenção' | 'Risco Elevado' | 'Crítico' = 'Excelente';
  let statusSemantico: SemanticStatus = 'verde';

  if (score >= 85) {
    classificacao = 'Excelente';
    statusSemantico = 'verde';
  } else if (score >= 70) {
    classificacao = 'Atenção';
    statusSemantico = 'amarelo';
  } else if (score >= 50) {
    classificacao = 'Risco Elevado';
    statusSemantico = 'laranja';
  } else {
    classificacao = 'Crítico';
    statusSemantico = 'vermelho';
  }

  return {
    score,
    classificacao,
    statusSemantico,
    detalhes: [
      { categoria: 'Conformidade de Inspeções', scoreParcial: Number(scoreInspecoes.toFixed(1)), peso: weights.conformidadeInspecoes, contribuicao: Number((scoreInspecoes * weights.conformidadeInspecoes).toFixed(1)) },
      { categoria: 'Controle de Incidentes e Acidentes', scoreParcial: Number(scoreIncidentes.toFixed(1)), peso: weights.controleIncidentes, contribuicao: Number((scoreIncidentes * weights.controleIncidentes).toFixed(1)) },
      { categoria: 'Gestão de Riscos (Matriz 3x3)', scoreParcial: Number(scoreRiscos.toFixed(1)), peso: weights.gestaoRiscos, contribuicao: Number((scoreRiscos * weights.gestaoRiscos).toFixed(1)) },
      { categoria: 'Execução de Ações no Prazo', scoreParcial: Number(scoreAcoes.toFixed(1)), peso: weights.acoesNoPrazo, contribuicao: Number((scoreAcoes * weights.acoesNoPrazo).toFixed(1)) },
      { categoria: 'Capacitação e Treinamentos (NRs)', scoreParcial: Number(scoreTreinamentos.toFixed(1)), peso: weights.treinamentosRegulares, contribuicao: Number((scoreTreinamentos * weights.treinamentosRegulares).toFixed(1)) },
      { categoria: 'Vigência Documental Legal', scoreParcial: Number(scoreDocumentos.toFixed(1)), peso: weights.documentosVigentes, contribuicao: Number((scoreDocumentos * weights.documentosVigentes).toFixed(1)) },
    ]
  };
}

export function buildKPICards(
  ocorrencias: Ocorrencia[],
  inspecoes: Inspecao[],
  acoes: Acao5W2H[],
  treinamentos: TreinamentoColaborador[],
  documentos: DocumentoRegulamentar[],
  riscos: RiscoMatriz[],
  horasHomemTrabalhadas: number
): KPICardData[] {
  // Acidentes
  const hasOcorrenciasData = ocorrencias !== undefined;
  const acidentesCPT = ocorrencias.filter((o) => o.tipo === 'Acidente com Afastamento (CPT)').length;
  const acidentesSPT = ocorrencias.filter((o) => o.tipo === 'Acidente sem Afastamento (SPT)').length;
  const totalAcidentes = acidentesCPT + acidentesSPT;
  const totalQuaseAcidentes = ocorrencias.filter((o) => o.tipo === 'Incidente / Quase-Acidente').length;

  const totalDiasPerdidos = ocorrencias.reduce((acc, curr) => acc + (curr.diasPerdidos || 0), 0);
  const tf = calculateTaxaFrequencia(acidentesCPT, horasHomemTrabalhadas);
  const tg = calculateTaxaGravidade(totalDiasPerdidos, horasHomemTrabalhadas);
  const diasSemAcidentes = calculateDaysWithoutAccidents(ocorrencias);

  // Inspeções
  const hasInspecoesData = inspecoes && inspecoes.length > 0;
  const totalItens = inspecoes.reduce((acc, curr) => acc + curr.itensAvaliadosTotal, 0);
  const conformesItens = inspecoes.reduce((acc, curr) => acc + curr.itensConformesTotal, 0);
  const taxaConformidade = totalItens > 0 ? Number(((conformesItens / totalItens) * 100).toFixed(1)) : 100;

  // Ações
  const hasAcoesData = acoes !== undefined;
  const acoesAtrasadas = acoes.filter((a) => a.status === 'Atrasada').length;
  const acoesPendentes = acoes.filter((a) => a.status === 'Em andamento' || a.status === 'Não iniciada').length;

  // Treinamentos & Documentos
  const hasTreinamentosData = treinamentos && treinamentos.length > 0;
  const treinamentosVencidos = treinamentos.filter((t) => t.status === 'Vencido').length;
  
  const hasDocumentosData = documentos && documentos.length > 0;
  const docsVencidos = documentos.filter((d) => d.status === 'Vencido').length;

  // Riscos Críticos
  const hasRiscosData = riscos && riscos.length > 0;
  const riscosCriticos = riscos.filter((r) => r.classificacao === 'Crítico').length;

  const calcGrowth = (prev: number, curr: number): number => {
    if (prev === 0) return curr === 0 ? 0 : 100;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  const tfCurrent = typeof tf === 'number' ? tf : 1.82;
  const tgCurrent = typeof tg === 'number' ? tg : 12.4;
  const dsaCurrent = diasSemAcidentes || 192;
  const confCurrent = taxaConformidade || 94.5;

  return [
    {
      id: 'kpi-acidentes',
      codigo: 'IND-AC-01',
      titulo: 'Acidentes de Trabalho (CPT e SPT)',
      valor: hasOcorrenciasData ? totalAcidentes : 'N/A',
      unidadeMedida: 'ocorrências',
      meta: '0 CPT / máx 1 SPT',
      percentualCumprimento: totalAcidentes === 0 ? 100 : 75,
      variacao: -50.0,
      tendencia: 'melhora',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: '1 SPT',
      limiteCritico: '> 0 CPT ou > 2 SPT',
      statusSemantico: !hasOcorrenciasData ? 'cinza' : totalAcidentes === 0 ? 'verde' : acidentesCPT > 0 ? 'vermelho' : 'amarelo',
      descricao: `${acidentesCPT} com afastamento (CPT) e ${acidentesSPT} sem afastamento (SPT)`,
      subtexto: 'Meta Zero Acidentes',
      category: 'acidentes',
      monthlyHistory: [
        { mes: 'Out', valor: 2 },
        { mes: 'Nov', valor: 1 },
        { mes: 'Dez', valor: 1 },
        { mes: 'Jan', valor: 2 },
        { mes: 'Fev', valor: 1 },
        { mes: 'Mar', valor: totalAcidentes }
      ],
      monthlyGrowth: calcGrowth(1, totalAcidentes),
      lineage: {
        fonte: 'Sistema Integrado SST — Registro CAT e Investigação Interna',
        quantidadeRegistros: ocorrencias.length,
        ultimaAtualizacao: '2026-03-15 11:15',
        versaoFormula: 'v2.1 (NBR 14280 / Fundacentro)',
        dataOwner: 'Coordenação Geral de SST (Eng. Ricardo Mansur)',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-incidentes',
      codigo: 'IND-INC-01',
      titulo: 'Incidentes / Quase-Acidentes',
      valor: hasOcorrenciasData ? totalQuaseAcidentes : 'N/A',
      unidadeMedida: 'registros',
      meta: 'Investigação 100%',
      percentualCumprimento: 100,
      variacao: +25.0,
      tendencia: 'melhora',
      polaridade: 'MAIOR_MELHOR', // Maior relato voluntário demonstra cultura madura
      limiteAtencao: '< 3 relatos/mês',
      limiteCritico: '0 relatos (subnotificação)',
      statusSemantico: !hasOcorrenciasData ? 'cinza' : 'amarelo',
      descricao: 'Desvios comunicados preventivamente antes da lesão',
      subtexto: 'Pirâmide de Bird / Heinrich',
      category: 'acidentes',
      monthlyHistory: [
        { mes: 'Out', valor: 8 },
        { mes: 'Nov', valor: 10 },
        { mes: 'Dez', valor: 9 },
        { mes: 'Jan', valor: 12 },
        { mes: 'Fev', valor: 14 },
        { mes: 'Mar', valor: totalQuaseAcidentes > 0 ? totalQuaseAcidentes : 16 }
      ],
      monthlyGrowth: calcGrowth(14, totalQuaseAcidentes > 0 ? totalQuaseAcidentes : 16),
      lineage: {
        fonte: 'Relato Rápido de Quase-Acidente / QR Code de Chão de Fábrica',
        quantidadeRegistros: totalQuaseAcidentes,
        ultimaAtualizacao: '2026-03-15 10:40',
        versaoFormula: 'v2.1 (Pirâmide de Bird)',
        dataOwner: 'Comitê CIPA e Supervisores',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-tf',
      codigo: 'IND-TF-02',
      titulo: 'Taxa de Frequência (TF)',
      valor: horasHomemTrabalhadas > 0 ? tf : 'N/A',
      unidadeMedida: '/ milhão HHT',
      meta: '<= 2.0',
      percentualCumprimento: tf <= 2.0 ? 100 : 65,
      variacao: -15.2,
      tendencia: 'melhora',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: 'TF <= 2.5',
      limiteCritico: 'TF > 5.0',
      statusSemantico: horasHomemTrabalhadas <= 0 ? 'cinza' : tf === 0 ? 'verde' : tf <= 2.0 ? 'amarelo' : 'vermelho',
      descricao: `Norma NBR 14280 (${horasHomemTrabalhadas.toLocaleString()} HHT no período)`,
      subtexto: 'Benchmark indústria: 2.8',
      category: 'frequencia',
      monthlyHistory: [
        { mes: 'Out', valor: 4.8 },
        { mes: 'Nov', valor: 3.9 },
        { mes: 'Dez', valor: 3.2 },
        { mes: 'Jan', valor: 2.8 },
        { mes: 'Fev', valor: 2.2 },
        { mes: 'Mar', valor: tfCurrent }
      ],
      monthlyGrowth: calcGrowth(2.2, tfCurrent),
      lineage: {
        fonte: 'Ponto Eletrônico (HHT) + Registro de Acidentes CPT',
        quantidadeRegistros: acidentesCPT,
        ultimaAtualizacao: '2026-03-15 08:00',
        versaoFormula: 'v2.1 (NBR 14280: TF = Nacidentes * 1.000.000 / HHT)',
        dataOwner: 'Engenharia de Segurança do Trabalho',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-tg',
      codigo: 'IND-TG-03',
      titulo: 'Taxa de Gravidade (TG)',
      valor: horasHomemTrabalhadas > 0 ? tg : 'N/A',
      unidadeMedida: '/ milhão HHT',
      meta: '<= 15.0',
      percentualCumprimento: tg <= 15.0 ? 100 : 50,
      variacao: -35.0,
      tendencia: 'melhora',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: 'TG <= 25.0',
      limiteCritico: 'TG > 40.0',
      statusSemantico: horasHomemTrabalhadas <= 0 ? 'cinza' : tg === 0 ? 'verde' : tg <= 15.0 ? 'amarelo' : 'vermelho',
      descricao: `${totalDiasPerdidos} dias perdidos / debitados acumulados`,
      subtexto: 'Controle de severidade',
      category: 'gravidade',
      monthlyHistory: [
        { mes: 'Out', valor: 38.0 },
        { mes: 'Nov', valor: 29.5 },
        { mes: 'Dez', valor: 22.0 },
        { mes: 'Jan', valor: 18.2 },
        { mes: 'Fev', valor: 15.0 },
        { mes: 'Mar', valor: tgCurrent }
      ],
      monthlyGrowth: calcGrowth(15.0, tgCurrent),
      lineage: {
        fonte: 'Serviço Médico Ocupacional (Atestados) + Ponto Eletrônico HHT',
        quantidadeRegistros: totalDiasPerdidos,
        ultimaAtualizacao: '2026-03-15 08:00',
        versaoFormula: 'v2.1 (NBR 14280: TG = Dias Perdidos * 1.000.000 / HHT)',
        dataOwner: 'Médico Coordenador do PCMSO / Eng. SST',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-dias-sem-acidente',
      codigo: 'IND-DSA-04',
      titulo: 'Dias Sem Acidentes (CPT)',
      valor: diasSemAcidentes,
      unidadeMedida: 'dias corridos',
      meta: '>= 180 dias',
      percentualCumprimento: Number(Math.min(100, (diasSemAcidentes / 180) * 100).toFixed(0)),
      variacao: +12.0,
      tendencia: 'melhora',
      polaridade: 'MAIOR_MELHOR',
      limiteAtencao: '< 180 dias',
      limiteCritico: '< 30 dias',
      statusSemantico: diasSemAcidentes >= 180 ? 'verde' : diasSemAcidentes >= 90 ? 'amarelo' : 'laranja',
      descricao: `Recorde histórico da organização: 248 dias`,
      subtexto: 'Cultura de Segurança Ativa',
      category: 'acidentes',
      monthlyHistory: [
        { mes: 'Out', valor: 45 },
        { mes: 'Nov', valor: 75 },
        { mes: 'Dez', valor: 105 },
        { mes: 'Jan', valor: 135 },
        { mes: 'Fev', valor: 163 },
        { mes: 'Mar', valor: dsaCurrent }
      ],
      monthlyGrowth: calcGrowth(163, dsaCurrent),
      lineage: {
        fonte: 'Histórico de Ocorrências CPT / Banco Central SST',
        quantidadeRegistros: 1,
        ultimaAtualizacao: '2026-03-15 00:00',
        versaoFormula: 'v2.1 (Data Atual - Data Último CPT)',
        dataOwner: 'SESMT Corporativo',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-inspecoes',
      codigo: 'IND-CONF-06',
      titulo: 'Conformidade de Inspeções',
      valor: hasInspecoesData ? `${taxaConformidade}%` : 'N/A',
      unidadeMedida: 'taxa de conformidade',
      meta: '>= 95.0%',
      percentualCumprimento: Number(((taxaConformidade / 95) * 100).toFixed(0)),
      variacao: +2.1,
      tendencia: 'melhora',
      polaridade: 'MAIOR_MELHOR',
      limiteAtencao: '< 95.0%',
      limiteCritico: '< 85.0%',
      statusSemantico: !hasInspecoesData ? 'cinza' : taxaConformidade >= 95 ? 'verde' : taxaConformidade >= 88 ? 'amarelo' : 'vermelho',
      descricao: `${conformesItens} itens conformes de ${totalItens} inspecionados`,
      subtexto: `${inspecoes.length} checklists auditados`,
      category: 'inspecoes',
      monthlyHistory: [
        { mes: 'Out', valor: 88.5 },
        { mes: 'Nov', valor: 90.2 },
        { mes: 'Dez', valor: 91.8 },
        { mes: 'Jan', valor: 93.0 },
        { mes: 'Fev', valor: 91.5 },
        { mes: 'Mar', valor: confCurrent }
      ],
      monthlyGrowth: calcGrowth(91.5, confCurrent),
      lineage: {
        fonte: 'Checklists de Inspeção Móvel (NR-10, NR-12, NR-35)',
        quantidadeRegistros: totalItens,
        ultimaAtualizacao: '2026-03-15 10:20',
        versaoFormula: 'v2.1 (TC = Itens Conformes / Total Itens * 100)',
        dataOwner: 'Auditores Líderes de Campo SST',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-acoes',
      codigo: 'IND-AP-07',
      titulo: 'Ações 5W2H Atrasadas',
      valor: hasAcoesData ? acoesAtrasadas : 'N/A',
      unidadeMedida: 'ações fora do prazo',
      meta: '0 ações atrasadas',
      percentualCumprimento: acoesAtrasadas === 0 ? 100 : 60,
      variacao: +1.0,
      tendencia: 'piora',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: '<= 2 ações atrasadas',
      limiteCritico: '> 2 ações atrasadas',
      statusSemantico: !hasAcoesData ? 'cinza' : acoesAtrasadas === 0 ? 'verde' : acoesAtrasadas <= 2 ? 'laranja' : 'vermelho',
      descricao: `${acoesPendentes} em andamento e ${acoesAtrasadas} com prazo extrapolado`,
      subtexto: 'Eficiência de contenção',
      category: 'acoes',
      monthlyHistory: [
        { mes: 'Out', valor: 6 },
        { mes: 'Nov', valor: 5 },
        { mes: 'Dez', valor: 4 },
        { mes: 'Jan', valor: 3 },
        { mes: 'Fev', valor: 2 },
        { mes: 'Mar', valor: acoesAtrasadas }
      ],
      monthlyGrowth: calcGrowth(2, acoesAtrasadas),
      lineage: {
        fonte: 'Plano de Ação 5W2H Centralizado',
        quantidadeRegistros: acoes.length,
        ultimaAtualizacao: '2026-03-15 11:00',
        versaoFormula: 'v2.1 (Contagem de Ações onde Status == "Atrasada")',
        dataOwner: 'Gestor SST e Coordenadores de Área',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-treinamentos-vencidos',
      codigo: 'IND-TR-08',
      titulo: 'Treinamentos Vencidos',
      valor: hasTreinamentosData ? treinamentosVencidos : 'N/A',
      unidadeMedida: 'colaboradores',
      meta: '0 vencidos',
      percentualCumprimento: treinamentosVencidos === 0 ? 100 : 70,
      variacao: 0,
      tendencia: 'estavel',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: '<= 3 vencendo',
      limiteCritico: '> 0 vencidos',
      statusSemantico: !hasTreinamentosData ? 'cinza' : treinamentosVencidos === 0 ? 'verde' : 'vermelho',
      descricao: `${treinamentos.filter(t => t.status.includes('Vence')).length} certificações vencendo em até 30 dias`,
      subtexto: 'Conformidade legal NRs',
      category: 'treinamentos',
      monthlyHistory: [
        { mes: 'Out', valor: 8 },
        { mes: 'Nov', valor: 6 },
        { mes: 'Dez', valor: 5 },
        { mes: 'Jan', valor: 3 },
        { mes: 'Fev', valor: 1 },
        { mes: 'Mar', valor: treinamentosVencidos }
      ],
      monthlyGrowth: calcGrowth(1, treinamentosVencidos),
      lineage: {
        fonte: 'Matriz de Treinamentos SST / RH Integrado',
        quantidadeRegistros: treinamentos.length,
        ultimaAtualizacao: '2026-03-14 06:00',
        versaoFormula: 'v2.1 (Validade < Data Atual)',
        dataOwner: 'RH & Treinamento Técnico SST',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-documentos-vencidos',
      codigo: 'IND-DOC-09',
      titulo: 'Documentos Regulamentares Vencidos',
      valor: hasDocumentosData ? docsVencidos : 'N/A',
      unidadeMedida: 'laudos / programas',
      meta: '0 laudos vencidos',
      percentualCumprimento: docsVencidos === 0 ? 100 : 65,
      variacao: 0,
      tendencia: 'estavel',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: '1 laudo a vencer em 30d',
      limiteCritico: '> 0 laudos vencidos',
      statusSemantico: !hasDocumentosData ? 'cinza' : docsVencidos === 0 ? 'verde' : 'vermelho',
      descricao: `${documentos.filter(d => d.status === 'Próximo do vencimento').length} laudo com vencimento no mês`,
      subtexto: 'Risco de não conformidade eSocial',
      category: 'documentos',
      monthlyHistory: [
        { mes: 'Out', valor: 3 },
        { mes: 'Nov', valor: 2 },
        { mes: 'Dez', valor: 2 },
        { mes: 'Jan', valor: 1 },
        { mes: 'Fev', valor: 1 },
        { mes: 'Mar', valor: docsVencidos }
      ],
      monthlyGrowth: calcGrowth(1, docsVencidos),
      lineage: {
        fonte: 'Repositório Central de Documentos Regulamentares',
        quantidadeRegistros: documentos.length,
        ultimaAtualizacao: '2026-03-10 14:00',
        versaoFormula: 'v2.1 (Data Validade < Hoje)',
        dataOwner: 'Engenheiro de Segurança Responsável Técnico',
        qualidadeDado: 'Atualizado'
      }
    },
    {
      id: 'kpi-riscos-criticos',
      codigo: 'IND-RC-10',
      titulo: 'Riscos Críticos Ativos',
      valor: hasRiscosData ? riscosCriticos : 'N/A',
      unidadeMedida: 'pontos de risco PxS',
      meta: '0 sem barreira',
      percentualCumprimento: riscosCriticos <= 1 ? 85 : 50,
      variacao: 0,
      tendencia: 'estavel',
      polaridade: 'MENOR_MELHOR',
      limiteAtencao: '<= 1 em tratamento',
      limiteCritico: '> 0 sem barreira',
      statusSemantico: !hasRiscosData ? 'cinza' : riscosCriticos === 0 ? 'verde' : riscosCriticos <= 2 ? 'laranja' : 'vermelho',
      descricao: 'Concentrados em Prensas (NR-12) e Altura (NR-35)',
      subtexto: 'Prioridade máxima de controle',
      category: 'riscos',
      monthlyHistory: [
        { mes: 'Out', valor: 5 },
        { mes: 'Nov', valor: 4 },
        { mes: 'Dez', valor: 3 },
        { mes: 'Jan', valor: 3 },
        { mes: 'Fev', valor: 2 },
        { mes: 'Mar', valor: riscosCriticos }
      ],
      monthlyGrowth: calcGrowth(2, riscosCriticos),
      lineage: {
        fonte: 'Matriz de Riscos Operacionais NR-01 (Inventário GRO)',
        quantidadeRegistros: riscos.length,
        ultimaAtualizacao: '2026-03-15 10:00',
        versaoFormula: 'v2.1 (Nível de Risco >= 6)',
        dataOwner: 'Comitê Central de Gestão de Riscos',
        qualidadeDado: 'Atualizado'
      }
    }
  ];
}
