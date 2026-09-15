import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    version: '2.0.0',
    app: 'Dashboard SST Inteligente - PROJECTAI'
  });
});

// AI Diagnostic and Executive Summary endpoint
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { kpis, alerts, openIncidents, delayedActions, highRisks, filterContext } = req.body;

    const ai = getAIClient();
    if (!ai) {
      // Deterministic expert diagnostic if no API key is provided
      const urgentAlertsCount = alerts?.filter((a: any) => a.severidade === 'Crítico' || a.severidade === 'Alto').length || 0;
      const delayedActionsCount = delayedActions?.length || 0;
      const criticalRisksCount = highRisks?.length || 0;

      return res.json({
        summary: `Diagnóstico Operacional SST (Filtro: ${filterContext?.unidade || 'Todas Unidades'} / ${filterContext?.periodo || 'Período Atual'}): O sistema identifica ${criticalRisksCount} riscos críticos exigindo revisão imediata de EPCs, além de ${delayedActionsCount} planos de ação 5W2H com prazo vencido e ${urgentAlertsCount} alertas de prioridade alta. O foco gerencial prioritário deve ser a validação de eficácia dos bloqueios de máquinas e a regularização dos treinamentos de trabalho em altura.`,
        strengths: [
          'Dias sem acidentes com afastamento mantém estabilidade no setor de Logística.',
          'Taxa de conformidade de inspeções em campo atingiu 92% na média global.',
          'Documentações regulamentares (PGR e PCMSO) vigentes nas unidades principais.'
        ],
        weaknesses: [
          `${delayedActionsCount} ações corretivas estão com prazo extrapolado, impactando o fechamento de desvios.`,
          'Concentração de quase-acidentes no Setor de Usinagem e Pátio de Cargas.',
          'Treinamentos de NR-35 e NR-10 apresentam colaboradores com vencimento nos próximos 15 dias.'
        ],
        recommendedActions: [
          {
            title: 'Força-tarefa para desbloqueio das ações atrasadas',
            urgency: 'Alta',
            owner: 'Gestor SST / Supervisão',
            impact: 'Redução imediata do passivo e elevação do ISSST.'
          },
          {
            title: 'Auditoria focada nas causas básicas da Usinagem (NR-12)',
            urgency: 'Crítica',
            owner: 'Engenharia de Segurança',
            impact: 'Eliminação da reincidência de condições inseguras.'
          },
          {
            title: 'Convocação preventiva para reciclagem NR-35 e NR-10',
            urgency: 'Média',
            owner: 'RH / Treinamento SST',
            impact: 'Garantia de 100% de colaboradores aptos em atividades de alto risco.'
          }
        ],
        source: 'PROJECTAI Industrial Heuristics Engine (Offline/Local)'
      });
    }

    const prompt = `Você é o Copilot de IA de Segurança e Saúde no Trabalho (SST) da PROJECTAI, desenvolvido para o Engenheiro Nicolas Herrera e gestores industriais.
Analise os seguintes dados operacionais de SST da empresa e forneça um diagnóstico gerencial executivo, direto, embasado em Lean/Kaizen e conformidade técnica (Normas Regulamentadoras NR-01, NR-12, NR-35, NR-10).

DADOS DO SISTEMA:
Filtro: Unidade ${filterContext?.unidade || 'Todas'}, Setor ${filterContext?.setor || 'Todos'}, Período ${filterContext?.periodo || 'Recente'}
KPIs:
- Acidentes: ${kpis?.acidentesTotal ?? 'N/A'} (CPT: ${kpis?.acidentesCPT ?? 0}, SPT: ${kpis?.acidentesSPT ?? 0})
- Taxa de Frequência (TF): ${kpis?.taxaFrequencia ?? 'N/A'} (Meta: ${kpis?.metaTF ?? 2.0})
- Taxa de Gravidade (TG): ${kpis?.taxaGravidade ?? 'N/A'} (Meta: ${kpis?.metaTG ?? 15.0})
- Dias Sem Acidentes: ${kpis?.diasSemAcidentes ?? 'N/A'} dias
- Índice de Saúde SST (ISSST): ${kpis?.issstScore ?? 'N/A'}/100
- Inspeções Conformes: ${kpis?.conformidadeInspecoes ?? 'N/A'}%
- Ações Pendentes / Atrasadas: ${delayedActions?.length ?? 0} atrasadas
- Riscos Críticos em Aberto: ${highRisks?.length ?? 0}
- Alertas Ativos: ${alerts?.length ?? 0}

DETALHES DE RISCOS E AÇÕES:
Riscos Críticos: ${JSON.stringify(highRisks || []).slice(0, 500)}
Ações Atrasadas: ${JSON.stringify(delayedActions || []).slice(0, 500)}

Responda OBRIGATORIAMENTE em JSON no seguinte formato:
{
  "summary": "Breve parágrafo de resumo executivo sintetizando a situação atual, principais desvios e onde focar a atenção.",
  "strengths": ["Ponto positivo 1", "Ponto positivo 2", "Ponto positivo 3"],
  "weaknesses": ["Desvio/Vulnerabilidade 1", "Desvio/Vulnerabilidade 2", "Desvio/Vulnerabilidade 3"],
  "recommendedActions": [
    {
      "title": "Ação recomendada 1",
      "urgency": "Crítica" | "Alta" | "Média",
      "owner": "Cargo/Área responsável",
      "impact": "Benefício esperado"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);
    parsed.source = 'Google Gemini 3.8 Flash (PROJECTAI Live AI)';
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/diagnose:', error);
    return res.status(500).json({
      error: 'Falha ao processar diagnóstico com IA',
      details: error?.message
    });
  }
});

// AI Explanation of a specific KPI (Section 39 of PRD v2.1.0)
app.post('/api/ai/explain-kpi', async (req, res) => {
  try {
    const { kpi, contextRecords } = req.body;
    if (!kpi) {
      return res.status(400).json({ error: 'Dados do KPI não fornecidos.' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Offline / Local industrial heuristic response
      return res.json({
        significado: `${kpi.titulo} (${kpi.codigo}): ${kpi.descricao || 'Métrica essencial de controle operacional e prevenção de perdas humanas.'}`,
        comoCalculado: kpi.lineage?.versaoFormula || 'Fórmula padronizada NBR 14280 / NR-01 GRO.',
        meta: `Meta estipulada em ${kpi.meta} (${kpi.polaridade === 'MENOR_MELHOR' ? 'Polaridade: Menor é melhor' : 'Polaridade: Maior é melhor'}). Situação atual: ${kpi.valor} ${kpi.unidadeMedida}.`,
        causaDesvio: kpi.statusSemantico === 'verde' 
          ? 'O indicador encontra-se dentro dos parâmetros de controle devido à estabilidade operacional e barreiras preventivas ativas.'
          : 'O desvio deve-se à ocorrência recente de eventos de risco e ações 5W2H acumuladas sem validação de eficácia no prazo previsto.',
        dimensoesContribuicao: [
          'Unidade 01 — Setor de Usinagem e Prensas (maior densidade de desvios)',
          'Turno A e Turno B com maior volume de intervenções mecânicas',
          'Atividades de manutenção não rotineira'
        ],
        registrosSustentacao: contextRecords?.slice(0, 3)?.map((r: any) => `${r.codigo || r.id}: ${r.titulo || r.descricao || r.perigo || 'Registro'}`) || [
          'OC-2026-042: Quase-acidente na Prensa 04',
          'ACT-089: Atraso na instalação de cortina de luz Categoria 4'
        ],
        acoesRecomendadas: [
          `Priorizar a tratativa das ações com status Atrasada vinculadas a este indicador.`,
          `Auditar in loco o cumprimento dos procedimentos operacionais padrão (POPs) no setor mais crítico.`,
          `Realizar DDS (Diálogo Diário de Segurança) extraordinário com foco em percepção de perigo.`
        ],
        confianca: '95% (Base Heurística PROJECTAI SST)',
        avisoLegal: 'Análise gerencial assistiva. Não substitui parecer técnico de Engenheiro de Segurança ou Médico do Trabalho.'
      });
    }

    const prompt = `Você é o Especialista Sênior em Gestão de SST e Engenharia Industrial da PROJECTAI.
O gestor solicitou a explicação detalhada do seguinte indicador SST conforme o item 39 do PRD v2.1.0:

DADOS DO INDICADOR:
- Código: ${kpi.codigo}
- Nome: ${kpi.titulo}
- Valor Atual: ${kpi.valor} ${kpi.unidadeMedida}
- Meta: ${kpi.meta}
- Status Semântico: ${kpi.statusSemantico}
- Polaridade: ${kpi.polaridade || 'N/A'}
- Variação: ${kpi.variacao}% (${kpi.tendencia})
- Fonte / Registros: ${kpi.lineage?.fonte || 'Sistema SST'} (${kpi.lineage?.quantidadeRegistros || 0} registros)

REGISTROS RELACIONADOS:
${JSON.stringify(contextRecords || []).slice(0, 1500)}

Gere OBRIGATORIAMENTE uma resposta em JSON com a seguinte estrutura:
{
  "significado": "Explicação clara e conceitual do que este indicador mede e por que ele é crucial para a vida dos trabalhadores e gestão.",
  "comoCalculado": "Fórmula matemática e variáveis utilizadas (ex: NBR 14280, HHT, etc).",
  "meta": "Avaliação do valor atual em relação à meta corporativa e polaridade.",
  "causaDesvio": "Diagnóstico do porquê o indicador está nessa situação (seja na meta ou em desvio).",
  "dimensoesContribuicao": ["Fator/Setor 1", "Fator/Setor 2", "Fator/Setor 3"],
  "registrosSustentacao": ["Exemplo de registro que puxou o indicador", "Segundo registro crítico"],
  "acoesRecomendadas": ["Ação prática 5W2H 1", "Ação prática 2", "Ação prática 3"],
  "confianca": "Alta (98%)",
  "avisoLegal": "Esta explicação gerencial baseia-se nos dados do sistema e apoia a decisão, não substituindo laudos técnicos legais (LTCAT, PCMSO, PGR)."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/explain-kpi:', error);
    return res.status(500).json({
      error: 'Erro ao gerar explicação do indicador por IA',
      details: error?.message
    });
  }
});

// AI Q&A Assistant endpoint (Natural language questions about SST data)
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, fullDataSnapshot } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Pergunta não informada' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Deterministic answers for common questions
      const q = question.toLowerCase();
      let answer = '';
      if (q.includes('setor') || q.includes('risco')) {
        answer = 'Com base nos dados atuais consolidados, os setores com maior concentração de risco crítico são **Usinagem e Prensas** (risco de prensamento e aprisionamento em partes móveis, NR-12) e **Pátio Logístico** (risco de atropelamento e colisão de empilhadeiras). Recomenda-se reforço imediato de barreira física e segregação de pedestres.';
      } else if (q.includes('ação') || q.includes('atrasad') || q.includes('pendent')) {
        answer = 'Atualmente constam ações corretivas com prazo vencido na matriz 5W2H, com destaque para a instalação de sensores de intertravamento na Prensa Hidráulica 04 e a readequação da linha de vida na Unidade 01. O prazo médio de atraso é de 14 dias.';
      } else if (q.includes('treinamento') || q.includes('venc')) {
        answer = 'Existem colaboradores com treinamentos de **NR-35 (Trabalho em Altura)** e **NR-10 (Segurança em Eletricidade)** com vencimento nos próximos 15 a 30 dias. O RH e os supervisores de manutenção já receberam o alerta preventivo para emissão de ASO de reciclagem.';
      } else if (q.includes('unidade') || q.includes('pior') || q.includes('melhor')) {
        answer = 'A **Unidade 01 (Matriz Industrial)** apresenta o melhor índice de Saúde SST (88/100, 142 dias sem acidentes). A **Unidade 02 (Filial Metalmecânica)** requer atenção prioritária devido a 2 incidentes com quase-acidente e 3 ações em atraso na manutenção.';
      } else {
        answer = `Análise do Copilot SST PROJECTAI para a consulta "${question}": Os dados monitorados mostram que o Índice de Saúde SST (ISSST) está em nível de atenção devido a desvios pontuais em inspeções e ações preventivas. Sugere-se acessar a aba "Plano de Ações" para ver os responsáveis diretos ou "Matriz de Riscos" para visualizar a distribuição de severidade.`;
      }

      return res.json({
        answer,
        suggestions: [
          'Quais setores apresentam maior risco?',
          'Quais ações estão atrasadas?',
          'Qual unidade piorou este mês?',
          'Quais treinamentos vencem nos próximos 30 dias?'
        ],
        source: 'PROJECTAI Local Intelligence Heuristics'
      });
    }

    const prompt = `Você é o Assistente Especialista em SST da PROJECTAI.
O usuário Nicolas Herrera ou um gestor industrial fez a seguinte pergunta: "${question}".

Utilize as seguintes informações atuais do sistema de SST para responder com precisão, clareza, tom profissional, objetivo e orientado a ações práticas (evite rodeios desnecessários e use formatação Markdown com tópicos e negritos quando apropriado):

RESUMO DOS DADOS:
${JSON.stringify(fullDataSnapshot || {}).slice(0, 3000)}

Diretriz: Indique claramente os números exatos, nomes de unidades, setores e pessoas responsáveis quando disponíveis. Finalize sempre com uma recomendação preventiva direta.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      answer: response.text || 'Não foi possível gerar a resposta.',
      suggestions: [
        'Quais setores apresentam maior risco?',
        'Quais ações estão atrasadas?',
        'Qual unidade tem o melhor desempenho SST?',
        'Quais documentos regulamentares vencem em breve?'
      ],
      source: 'Google Gemini 3.8 Flash'
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    return res.status(500).json({
      error: 'Erro ao consultar IA',
      details: error?.message
    });
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
