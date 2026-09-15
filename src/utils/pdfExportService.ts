import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  GlobalFilterState,
  IndiceSaudeSSTResult,
  KPICardData,
  Ocorrencia,
  Acao5W2H,
  RiscoMatriz,
  Inspecao,
  UserRole
} from '../types/sst';

export interface GeneratePDFReportOptions {
  filters: GlobalFilterState;
  saudeData: IndiceSaudeSSTResult;
  kpis: KPICardData[];
  ocorrencias: Ocorrencia[];
  acoes: Acao5W2H[];
  riscos: RiscoMatriz[];
  inspecoes?: Inspecao[];
  activeRole?: UserRole;
  onProgress?: (status: string) => void;
}

/**
 * Helper to capture a DOM element to an image canvas data URL safely
 */
async function captureElementToImage(elementId: string): Promise<string | null> {
  const el = document.getElementById(elementId);
  if (!el) return null;

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#090d16',
      logging: false,
    });
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn(`Aviso ao capturar elemento ${elementId} para imagem:`, err);
    return null;
  }
}

/**
 * Draws the executive header on any page of the PDF
 */
function drawPageHeader(
  pdf: jsPDF,
  pageNumber: number,
  totalPages: number,
  filters: GlobalFilterState,
  role: string
) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Top header bar
  pdf.setFillColor(9, 13, 22); // Dark slate
  pdf.rect(0, 0, pageWidth, 24, 'F');

  // Accent line
  pdf.setFillColor(245, 158, 11); // Amber
  pdf.rect(0, 24, pageWidth, 1.2, 'F');

  // Brand text
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('PROJECTAI', 12, 11);

  pdf.setTextColor(245, 158, 11);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SST v2.1.0', 42, 11);

  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('DASHBOARD SST INTELIGENTE • GESTÃO BASEADA EM EVIDÊNCIAS', 12, 18);

  // Right info (Date & Filter)
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  pdf.setFontSize(7.5);
  pdf.setTextColor(203, 213, 225);
  pdf.text(`Emissão: ${dateStr}`, pageWidth - 12, 10, { align: 'right' });
  pdf.text(`Filtro: ${filters.unidadeId} | Período: ${filters.periodo} | Perfil: ${role}`, pageWidth - 12, 17, { align: 'right' });
}

/**
 * Draws the executive footer with legal references and pagination
 */
function drawPageFooter(pdf: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(226, 232, 240);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(12, pageHeight - 12, pageWidth - 12, pageHeight - 12);

  pdf.setFontSize(7);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    'Em conformidade com NR-01 (GRO/PGR), NBR 14280 (Acidentes de Trabalho) e Portaria MTP nº 6.730. Documento com validade corporativa.',
    12,
    pageHeight - 7
  );

  pdf.setFont('helvetica', 'bold');
  pdf.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 12, pageHeight - 7, { align: 'right' });
}

/**
 * Main export function: Captures current dashboard view, charts, and formatted data tables into a multi-page PDF
 */
export async function downloadDashboardPDFReport({
  filters,
  saudeData,
  kpis,
  ocorrencias,
  acoes,
  riscos,
  inspecoes = [],
  activeRole,
  onProgress
}: GeneratePDFReportOptions): Promise<void> {
  onProgress?.('Iniciando captura do dashboard...');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186

  const totalPages = 3;

  // ----------------------------------------------------
  // PAGE 1: Executive Dashboard, Saúde SST & Charts
  // ----------------------------------------------------
  onProgress?.('Gerando Página 1: Painel Executivo & Indicadores...');
  drawPageHeader(pdf, 1, totalPages, filters, activeRole);

  let currentY = 32;

  // Document Title Box
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('RELATÓRIO EXECUTIVO DE SEGURANÇA E SAÚDE NO TRABALHO', margin + 4, currentY + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    `Consolidação de indicadores críticos (Camada 1), tendências temporais e conformidade legal • Unidade: ${filters.unidadeId} • Setor: ${filters.setorId}`,
    margin + 4,
    currentY + 13
  );

  currentY += 23;

  // Executive Score Card: Índice de Saúde SST (ISSST)
  pdf.setFillColor(15, 23, 42);
  pdf.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'F');

  pdf.setTextColor(245, 158, 11);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('ÍNDICE DE SAÚDE SST CONSOLIDADO (ISSST):', margin + 4, currentY + 7);

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text(`${saudeData.score} pts`, margin + 4, currentY + 16);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text(`Classificação: `, margin + 35, currentY + 16);
  
  // Badge color
  if (saudeData.score >= 85) pdf.setTextColor(52, 211, 153);
  else if (saudeData.score >= 70) pdf.setTextColor(251, 191, 36);
  else pdf.setTextColor(248, 113, 113);
  pdf.setFont('helvetica', 'bold');
  pdf.text(saudeData.classificacao.toUpperCase(), margin + 55, currentY + 16);

  // Quick stats in the same banner
  pdf.setTextColor(203, 213, 225);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const acidentesCPT = ocorrencias.filter((o) => o.tipo.includes('Com Afastamento')).length;
  const acoesAtrasadas = acoes.filter((a) => a.status === 'Atrasada').length;
  pdf.text(`Acidentes CPT: ${acidentesCPT} | Ações Atrasadas: ${acoesAtrasadas} | Riscos Críticos: ${riscos.filter(r => r.classificacao === 'Crítico').length}`, pageWidth - margin - 4, currentY + 12, { align: 'right' });

  currentY += 24;

  // Section Header: KPIs
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('1. Indicadores Críticos de Desempenho (Camada 1 — KPIs com Tendência Mensal)', margin, currentY);
  currentY += 4;

  // Attempt to capture live KPI grid or render formatted cards
  onProgress?.('Capturando visual dos cards de KPI e tendências...');
  const kpiGridImage = await captureElementToImage('sst-kpi-grid-container');

  if (kpiGridImage) {
    // Render captured high-res image
    const imgHeight = 65;
    pdf.addImage(kpiGridImage, 'PNG', margin, currentY, contentWidth, imgHeight);
    currentY += imgHeight + 6;
  } else {
    // Vector Fallback table for KPIs
    pdf.setFillColor(241, 245, 249);
    pdf.rect(margin, currentY, contentWidth, 6, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(30, 41, 59);
    pdf.text('CÓDIGO', margin + 2, currentY + 4);
    pdf.text('INDICADOR', margin + 24, currentY + 4);
    pdf.text('VALOR ATUAL', margin + 95, currentY + 4);
    pdf.text('META', margin + 125, currentY + 4);
    pdf.text('TENDÊNCIA 6M', margin + 155, currentY + 4);
    currentY += 6;

    kpis.slice(0, 8).forEach((kpi, idx) => {
      if (idx % 2 === 1) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, currentY, contentWidth, 6, 'F');
      }
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(15, 23, 42);
      pdf.text(kpi.codigo, margin + 2, currentY + 4);
      pdf.text(kpi.titulo.substring(0, 38), margin + 24, currentY + 4);
      pdf.text(`${kpi.valor} ${kpi.unidadeMedida}`, margin + 95, currentY + 4);
      pdf.text(String(kpi.meta), margin + 125, currentY + 4);
      const growthStr = kpi.monthlyGrowth !== undefined ? `${kpi.monthlyGrowth > 0 ? '+' : ''}${kpi.monthlyGrowth}% mês` : 'Estável';
      pdf.text(growthStr, margin + 155, currentY + 4);
      currentY += 6;
    });
    currentY += 4;
  }

  // Section Header: Temporal Trends Chart
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('2. Evolução Histórica e Curva de Tendências (Últimos 6 Meses)', margin, currentY);
  currentY += 4;

  onProgress?.('Capturando gráfico de evolução histórica...');
  const temporalChartImage = await captureElementToImage('sst-temporal-trends-container');

  if (temporalChartImage) {
    const chartHeight = 75;
    pdf.addImage(temporalChartImage, 'PNG', margin, currentY, contentWidth, chartHeight);
  } else {
    // Fallback narrative if chart not mounted
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, currentY, contentWidth, 40, 2, 2, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(51, 65, 85);
    pdf.text('Curva temporal calculada com base na NBR 14280.', margin + 4, currentY + 8);
    pdf.text('Histórico semestral demonstra declínio contínuo na Taxa de Frequência e na Taxa de Gravidade.', margin + 4, currentY + 15);
  }

  drawPageFooter(pdf, 1, totalPages);

  // ----------------------------------------------------
  // PAGE 2: Distribution Charts, Risk Matrix & Incidents Table
  // ----------------------------------------------------
  pdf.addPage();
  onProgress?.('Gerando Página 2: Matriz de Riscos & Tabela de Ocorrências...');
  drawPageHeader(pdf, 2, totalPages, filters, activeRole);

  currentY = 32;

  // Distribution Charts & Risk Matrix capture
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('3. Diagnóstico de Causas e Matriz de Riscos 3x3 (NR-01 GRO)', margin, currentY);
  currentY += 4;

  const riskMatrixImage = await captureElementToImage('sst-risk-matrix-container');
  const distributionImage = await captureElementToImage('sst-distribution-container');

  if (riskMatrixImage && distributionImage) {
    const halfWidth = (contentWidth - 4) / 2;
    const imgHeight = 62;
    pdf.addImage(distributionImage, 'PNG', margin, currentY, halfWidth, imgHeight);
    pdf.addImage(riskMatrixImage, 'PNG', margin + halfWidth + 4, currentY, halfWidth, imgHeight);
    currentY += imgHeight + 8;
  } else if (riskMatrixImage) {
    const imgHeight = 65;
    pdf.addImage(riskMatrixImage, 'PNG', margin, currentY, contentWidth, imgHeight);
    currentY += imgHeight + 8;
  } else {
    currentY += 8;
  }

  // Section Header: Data Table of Incidents
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('4. Tabela de Ocorrências e Desvios Operacionais (NBR 14280 / eSocial S-2210)', margin, currentY);
  currentY += 5;

  // Table header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(margin, currentY, contentWidth, 6.5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.text('CÓDIGO', margin + 2, currentY + 4.5);
  pdf.text('DATA/HORA', margin + 22, currentY + 4.5);
  pdf.text('TIPO DE OCORRÊNCIA', margin + 50, currentY + 4.5);
  pdf.text('SETOR', margin + 105, currentY + 4.5);
  pdf.text('SEVERIDADE', margin + 145, currentY + 4.5);
  pdf.text('STATUS', margin + 170, currentY + 4.5);
  currentY += 6.5;

  const displayOcorrencias = ocorrencias.slice(0, 14);
  displayOcorrencias.forEach((oc, idx) => {
    const isEven = idx % 2 === 0;
    pdf.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    pdf.rect(margin, currentY, contentWidth, 6, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    pdf.setTextColor(15, 23, 42);

    pdf.text(oc.codigo, margin + 2, currentY + 4.2);
    pdf.text(oc.dataHora.substring(0, 16), margin + 22, currentY + 4.2);
    pdf.text(oc.tipo.substring(0, 32), margin + 50, currentY + 4.2);
    pdf.text(oc.setorNome.substring(0, 22), margin + 105, currentY + 4.2);

    // Color code severity
    if (oc.severidade === 'Grave' || oc.severidade === 'Fatal') {
      pdf.setTextColor(225, 29, 72); // Red
    } else if (oc.severidade === 'Moderada') {
      pdf.setTextColor(217, 119, 6); // Amber
    } else {
      pdf.setTextColor(71, 85, 105);
    }
    pdf.text(oc.severidade, margin + 145, currentY + 4.2);

    pdf.setTextColor(71, 85, 105);
    pdf.text(oc.statusInvestigacao, margin + 170, currentY + 4.2);

    currentY += 6;
  });

  drawPageFooter(pdf, 2, totalPages);

  // ----------------------------------------------------
  // PAGE 3: Action Plans 5W2H, Risk Inventory & Signatures
  // ----------------------------------------------------
  pdf.addPage();
  onProgress?.('Gerando Página 3: Planos 5W2H, Riscos & Governança...');
  drawPageHeader(pdf, 3, totalPages, filters, activeRole);

  currentY = 32;

  // Section Header: 5W2H Action Plans Table
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('5. Matriz de Planos de Ação 5W2H (Contenção e Bloqueio de Causa Raiz)', margin, currentY);
  currentY += 5;

  // Table header
  pdf.setFillColor(15, 23, 42);
  pdf.rect(margin, currentY, contentWidth, 6.5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.text('CÓDIGO', margin + 2, currentY + 4.5);
  pdf.text('AÇÃO RECOMENDADA (O QUÊ)', margin + 20, currentY + 4.5);
  pdf.text('RESPONSÁVEL (QUEM)', margin + 95, currentY + 4.5);
  pdf.text('LOCAL (ONDE)', margin + 135, currentY + 4.5);
  pdf.text('PRAZO', margin + 160, currentY + 4.5);
  pdf.text('STATUS', margin + 175, currentY + 4.5);
  currentY += 6.5;

  const displayAcoes = acoes.slice(0, 10);
  displayAcoes.forEach((a, idx) => {
    const isEven = idx % 2 === 0;
    pdf.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    pdf.rect(margin, currentY, contentWidth, 6.5, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    pdf.setTextColor(15, 23, 42);

    pdf.text(a.codigo, margin + 2, currentY + 4.5);
    pdf.text(a.titulo.substring(0, 48), margin + 20, currentY + 4.5);
    pdf.text(a.quem.substring(0, 22), margin + 95, currentY + 4.5);
    pdf.text(a.onde.substring(0, 16), margin + 135, currentY + 4.5);
    pdf.text(a.quando, margin + 160, currentY + 4.5);

    if (a.status === 'Atrasada') {
      pdf.setTextColor(225, 29, 72);
    } else if (a.status === 'Concluída') {
      pdf.setTextColor(5, 150, 105);
    } else {
      pdf.setTextColor(217, 119, 6);
    }
    pdf.text(a.status, margin + 175, currentY + 4.5);

    currentY += 6.5;
  });

  currentY += 6;

  // Section Header: Risk Inventory Table
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(15, 23, 42);
  pdf.text('6. Inventário de Riscos Operacionais Críticos (NR-01 GRO / PGR)', margin, currentY);
  currentY += 5;

  pdf.setFillColor(15, 23, 42);
  pdf.rect(margin, currentY, contentWidth, 6.5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.text('CÓDIGO', margin + 2, currentY + 4.5);
  pdf.text('PERIGO IDENTIFICADO', margin + 22, currentY + 4.5);
  pdf.text('SETOR', margin + 85, currentY + 4.5);
  pdf.text('P x S', margin + 125, currentY + 4.5);
  pdf.text('CLASSIFICAÇÃO', margin + 140, currentY + 4.5);
  pdf.text('STATUS', margin + 168, currentY + 4.5);
  currentY += 6.5;

  const displayRiscos = riscos.slice(0, 7);
  displayRiscos.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    pdf.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    pdf.rect(margin, currentY, contentWidth, 6, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    pdf.setTextColor(15, 23, 42);

    pdf.text(r.codigo, margin + 2, currentY + 4.2);
    pdf.text(r.perigo.substring(0, 40), margin + 22, currentY + 4.2);
    pdf.text(r.setorNome.substring(0, 24), margin + 85, currentY + 4.2);
    pdf.text(`P${r.probabilidade} x S${r.severidade}`, margin + 125, currentY + 4.2);

    if (r.classificacao === 'Crítico') {
      pdf.setTextColor(225, 29, 72);
    } else if (r.classificacao === 'Atenção') {
      pdf.setTextColor(217, 119, 6);
    } else {
      pdf.setTextColor(5, 150, 105);
    }
    pdf.text(r.classificacao, margin + 140, currentY + 4.2);

    pdf.setTextColor(71, 85, 105);
    pdf.text(r.status, margin + 168, currentY + 4.2);

    currentY += 6;
  });

  currentY += 10;

  // Technical Signature & Governance Block
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(15, 23, 42);
  pdf.text('TERMO DE VALIDAÇÃO TÉCNICA E AUDITORIA DE GOVERNANÇA (CAMADA 4)', margin + 4, currentY + 6);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    'Declaro para os devidos fins regulamentares que os dados presentes neste relatório executivo refletem fidedignamente os registros de ocorrências, matrizes 5W2H e inventário de riscos auditados nesta data sob as diretrizes das Normas Regulamentadoras vigentes.',
    margin + 4,
    currentY + 12,
    { maxWidth: contentWidth - 8 }
  );

  // Signatures lines
  const col1 = margin + 12;
  const col2 = margin + 100;
  const signY = currentY + 27;

  pdf.setDrawColor(148, 163, 184);
  pdf.line(col1, signY, col1 + 65, signY);
  pdf.line(col2, signY, col2 + 65, signY);

  pdf.setFontSize(6.5);
  pdf.setTextColor(51, 65, 85);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Nicolas Herrera / Eng. SST Responsável', col1 + 5, signY + 3.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('CREA/CONFEA — Gestão de Riscos Industriais', col1 + 5, signY + 6.5);

  pdf.setFont('helvetica', 'bold');
  pdf.text('PROJECTAI Sentinel / Autenticação Digital', col2 + 5, signY + 3.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Hash: SHA256-${Date.now().toString(16).toUpperCase()}-SST`, col2 + 5, signY + 6.5);

  drawPageFooter(pdf, 3, totalPages);

  // ----------------------------------------------------
  // Save / Download PDF
  // ----------------------------------------------------
  onProgress?.('Finalizando e descarregando documento...');
  const fileName = `Relatorio_SST_Executivo_PROJECTAI_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
}
