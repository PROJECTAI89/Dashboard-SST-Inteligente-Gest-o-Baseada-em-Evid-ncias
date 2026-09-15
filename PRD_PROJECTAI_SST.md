# PRODUCT REQUIREMENTS DOCUMENT (PRD) — PROJECTAI
## SISTEMA INTEGRADO DE GESTÃO E DASHBOARD INTELIGENTE DE SST (SAÚDE E SEGURANÇA DO TRABALHO)

**Código do Documento:** PRD-SST-PAI-2026-V2.1  
**Autor:** Nicolas Herrera (Fundador & Arquiteto de Negócios, PROJECTAI)  
**Co-autor Técnico:** AI Full-Stack Senior Architect  
**Data da Versão:** 15 de Setembro de 2026  
**Status:** Aprovado para Produção / Baseline v2.1.0  
**Metodologias Normativas:** NBR 14280, NR-01 (GRO/PGR), NR-12, NR-33, NR-35, ISO 45001, Pirâmide de Frank Bird  

---

### 1. NOME DO PRODUTO
**PROJECTAI SST Suite** — *Dashboard Inteligente e Plataforma de Gestão Preditiva em Saúde e Segurança Ocupacional Baseada em Evidências*.

---

### 2. RESUMO EXECUTIVO
O **PROJECTAI SST Suite** é uma plataforma analítica e operacional que unifica a inteligência de dados de Segurança do Trabalho e Engenharia Industrial em uma arquitetura moderna e intuitiva. 

A solução resolve o problema de dados fragmentados em planilhas dispersas, elimina o atraso na emissão de CATs e investigações de acidentes, erradica o esquecimento de planos de ação 5W2H e calcula de forma 100% automatizada indicadores críticos como Taxa de Frequência (TF), Taxa de Gravidade (TG) e o Índice de Saúde SST (ISSST) ponderado. 

Com interface de alto contraste (tema dark/preto focado em zero ruído visual), painel de navegação vertical esquerdo e suporte a controle de acesso por papéis (RBAC), a plataforma fornece diagnósticos executivos preditivos com IA, permitindo antecipar acidentes e garantir 100% de conformidade perante as Normas Regulamentadoras (NRs) e fiscalizações do MTE.

---

### 3. PROBLEMA
Na rotina de plantas fabris e operações industriais pesadas:
1. **Dados Reativos e Fragmentados:** Informações de quase-acidentes, incidentes e condições perigosas ficam em cadernos de campo, grupos de mensagens ou planilhas desconexas, sendo consolidadas apenas após o acidente consumado.
2. **Cálculos Manuais Propensos a Erros:** Fórmulas vitais como Taxa de Frequência (TF NBR 14280) e Taxa de Gravidade (TG) exigem apuração de Horas-Homem Trabalhadas (HHT) e dias perdidos/debitados, gerando distorções estatísticas.
3. **Inércia nos Planos de Ação:** Recomendações pós-acidente morrem em atas de reunião por ausência de um fluxo de cobrança com metodologia 5W2H rastreável.
4. **Falta de Linhagem e Auditoria:** Dificuldade extrema em comprovar perante auditorias (ISO 45001 / Ministério do Trabalho) a rastreabilidade das alterações cadastrais e evidências de treinamento.
5. **Impacto na Produção e OEE:** Acidentes de trabalho paralisam máquinas e linhas inteiras, derrubando a Disponibilidade e a Eficiência Global dos Equipamentos (OEE).

---

### 4. OBJETIVO
* **Centralizar 100% dos eventos e dados de SST** em uma única fonte da verdade em tempo real.
* **Reduzir a Taxa de Frequência (TF) para zero** através de alertas preditivos de desvios comportamentais e condições inseguras (Pirâmide de Bird).
* **Garantir 100% de eficácia no fechamento dos planos de ação 5W2H** dentro do prazo acordado.
* **Assegurar conformidade integral com a NR-01 (GRO e PGR)**, mantendo matrizes de riscos dinâmicas e planos de mitigação atualizados.
* **Disponibilizar governança de dados e trilha de auditoria imutável** para blindagem jurídica e conformidade fiscalizatória.

---

### 5. USUÁRIOS OBJETIVO (PERSONAS)
1. **Diretoria Executiva / CEO / C-Level:** Necessita de visão macro da saúde SST, comparativo entre unidades fabris, índice de conformidade e impacto de riscos na continuidade do negócio.
2. **Engenheiro de Segurança / Gerente de SST (SESMT):** Precisa de governança dos dados, cálculo auditável de TF/TG, parametrização de regras de alerta e relatórios executivos para CIPA e MTE.
3. **Técnico de Segurança do Trabalho (Operacional):** Usuário de campo que registra ocorrências, realiza inspeções com checklists, monitora vencimentos de NRs e anexa evidências.
4. **Supervisor / Coordenador de Produção:** Acompanha suas máquinas e turnos, controla paradas operacionais por risco de segurança e cobra a execução de ações 5W2H do setor.
5. **Médico do Trabalho / Ambulatório:** Monitora absenteísmo, dias perdidos, abertura de CAT e dados de afastamentos para cruzamento epidemiológico.

---

### 6. CASOS DE USO PRINCIPAIS
* **UC-01 [Registro de Ocorrência]:** Usuário registra incidente ou quase-acidente em menos de 60 segundos com classificação de severidade e fotos. O sistema dispara alerta imediato caso envolva máquina crítica.
* **UC-02 [Gestão de Ação 5W2H]:** A partir de um risco ou acidente, gera-se uma ação estruturada (O quê, Por quê, Quem, Onde, Quando, Como, Quanto Custa). O responsável atualiza o percentual e anexa comprovante para conclusão.
* **UC-03 [Cálculo Automático de TF e TG]:** O sistema consome HHT e dias perdidos/debitados conforme NBR 14280, atualizando gráficos de tendência histórica sem intervenção manual.
* **UC-04 [Auditoria e Linhagem de Dados]:** Auditor solicita histórico de alteração em uma matriz de risco. O módulo de Governança exibe o usuário, timestamp, valor anterior e novo valor.
* **UC-05 [Carga em Massa via CSV]:** Usuário importa planilha legado de treinamentos ou acidentes; o sistema valida os dados e recalcula os indicadores instantaneamente.
* **UC-06 [Diagnóstico IA de KPIs]:** Gestor clica em um indicador desfavorável (ex: TG elevado) e o assistente analítico detalha fórmulas, benchmarks do setor fabril e sugere 3 ações de bloqueio.

---

### 7. ESCOPO DO PROJETO (V2.1)
* Visão Executiva com 10 KPIs consolidados e termômetro do Índice de Saúde SST (ISSST).
* Módulo de Gestão de Ocorrências e Acidentes (CAT, dias perdidos, causas imediatas/básicas).
* Módulo 5W2H com kanban/tabela, filtros de atraso e evidências.
* Matriz de Riscos Bidimensional (Probabilidade x Severidade conforme NR-01 GRO).
* Módulo de Inspeções Periódicas com taxa de conformidade por setor.
* Controle de Treinamentos e Vencimentos de NRs com badges de alerta.
* Repositório de Documentos Legais (PGR, PCMSO, LTCAT, Laudo Elétrico NR-10, APR).
* Central de Alertas e Notificações com critérios de severidade.
* Camada 4 de Governança: Trilha de auditoria imutável, integridade de dados e linhagem.
* Motor de Importação em Massa via CSV e Exportação Executiva em PDF/CSV.
* Navegação Vertical Lateral Esquerda com Dark Mode puro (zero ruído visual).

---

### 8. FORA DE ESCOPO (VERSÕES FUTURAS)
* Emissão direta de XML do eSocial (Eventos S-2210, S-2220 e S-2240) diretamente para o webservice do governo (planejado para v3.0).
* Dispositivos IoT vestíveis (smartwatches de operários para telemetria de frequência cardíaca).
* Leitura biométrica facial no apontamento de EPIs.

---

### 9. REQUISITOS FUNCIONAIS (FR)

| Código | Descrição do Requisito Funcional | Prioridade |
|---|---|---|
| **FR-001** | Painel Executivo consolidando Taxa de Frequência, Taxa de Gravidade, Dias Perdidos, ISSST e Pirâmide de Bird. | P0 (Crítico) |
| **FR-002** | Registro rápido e completo de ocorrências com tipificação NBR 14280 e vínculo com setores e máquinas. | P0 (Crítico) |
| **FR-003** | Motor de cálculo do Índice de Saúde SST (ISSST) ponderado com pesos customizáveis por dimensão de segurança. | P0 (Crítico) |
| **FR-004** | Matriz 5W2H com status reativo (Não iniciada, Em andamento, Concluída, Atrasada) e rastreabilidade de custos. | P0 (Crítico) |
| **FR-005** | Matriz de Riscos NR-01 com escala 5x5 de Probabilidade vs. Severidade e cálculo do Nível de Risco. | P0 (Crítico) |
| **FR-006** | Gestão de Capacitação e NRs com cálculo de colaboradores aptos vs. vencidos e dias para vencimento. | P1 (Alto) |
| **FR-007** | Trilha de Auditoria Imutável capturando toda criação, edição, transição de status e importação de dados. | P0 (Crítico) |
| **FR-008** | Explicador IA de Indicadores com metodologia, polaridade, benchmark e plano de mitigação sugerido. | P1 (Alto) |
| **FR-009** | Importador de planilhas CSV com templates para download e validação estrita de integridade. | P0 (Crítico) |
| **FR-010** | Exportador de Relatório Executivo pronto para impressão/PDF e extração bruta de dados em CSV. | P1 (Alto) |
| **FR-011** | Controle de Acesso Baseado em Papéis (RBAC) com 5 perfis pré-configurados. | P0 (Crítico) |
| **FR-012** | Filtros Globais sincronizados (Unidade, Setor, Período, Turno) com atualização reativa instantânea. | P0 (Crítico) |

---

### 10. REQUISITOS NÃO-FUNCIONAIS (NFR)
* **NFR-01 (Performance):** Tempo de renderização inicial da aplicação < 800ms; atualização reativa dos filtros globais < 16ms (60 FPS).
* **NFR-02 (Acessibilidade & Ergonomia Visual):** Interface em Dark Mode puro (`#000000` e `#050608`), contraste mínimo de 4.5:1 (WCAG AA), tipografia técnica legível e eliminação de gradientes saturados ou ruído visual.
* **NFR-03 (Compatibilidade & Responsividade):** Suporte integral para resoluções de 375px (mobile) até 4K (desktop/telas de comitê de fábrica).
* **NFR-04 (Confiabilidade dos Dados):** Cálculos matemáticos de NBR 14280 executados com precisão de ponto flutuante de duas casas decimais e arredondamento normativo.
* **NFR-05 (Segurança):** Sanitização rigorosa de entradas de usuário em arquivos CSV para prevenção de injeção de fórmulas ou scripts.

---

### 11. ARQUITETURA PROPOSTA
* **Frontend:** Single Page Application (SPA) em React 18+ com TypeScript estruturado de forma estrita.
* **Estilização:** Tailwind CSS utilitário com paleta sob medida (Zinc/Slate técnicos, acentos funcionais em Âmbar de segurança, Esmeralda para conformidade e Rosa/Vermelho para risco crítico).
* **Ícones:** Lucide React unificado.
* **Gerenciamento de Estado:** Estado reativo nativo do React com memoização profunda (`useMemo`, `useCallback`) garantindo recálculo pontual e desacoplado.
* **Motor Analítico em Memória:** Módulo de cálculo matemático de indicadores em `/src/utils/` isolado de qualquer camada de apresentação.

---

### 12. ESTRUTURA DE NAVEGAÇÃO
* **Barra Superior Global (Header):**
  * Identidade Visual PROJECTAI + Versão v2.1.0.
  * Central de Alertas com badge dinâmico de criticidade.
  * Botões de Ação Rápida: *+ Nova Ocorrência*, *Importar CSV*, *Exportar Relatório*, *Dicionário de Governança*, *Diagnóstico IA*, *PRD*.
  * Seletor de Perfil RBAC (Administrador, Gestor SST, Supervisor, Operador, Diretoria).
  * Barra de Filtros Globais (Unidade Fabril, Setor, Turno, Período).
* **Painel Vertical Esquerdo (Sidebar):**
  * Painel Geral: *Visão Executiva & KPIs*
  * Gestão Operacional: *Incidentes & Acidentes*, *Plano 5W2H*, *Inspeções & Checklists*
  * Prevenção & NRs: *Matriz de Riscos (NR-01)*, *Treinamentos & NRs*, *Documentos SST*
  * Auditoria & Controle: *Central de Alertas*, *Camada 4 — Governança*

---

### 13. TELAS E MÓDULOS
1. **Tela 1 — Visão Executiva & KPIs:** 10 cartões executivos de métricas, gráfico do termômetro ISSST, Pirâmide de Frank Bird interativa, distribuição de incidentes por setor e evolução de desvios.
2. **Tela 2 — Incidentes e Acidentes:** Tabela operacional com filtros de severidade, detalhamento da investigação de causas (Ishikawa / 5 Porquês), dias de afastamento e status da CAT.
3. **Tela 3 — Plano de Ações 5W2H:** Tabela interativa com percentual de conclusão, responsável, prazo, prioridade e modal para anexar evidência de conclusão.
4. **Tela 4 — Matriz de Riscos NR-01:** Mapa de calor de perigos com inventário de riscos, medidas de controle adotadas e riscos residuais.
5. **Tela 5 — Inspeções e Auditorias:** Checklists de segurança de máquinas (NR-12), trabalho em altura (NR-35) e rota de fuga com taxa de conformidade percentual.
6. **Tela 6 — Treinamentos e Capacitação:** Matriz de colaborares com status de validade, horas cursadas e normas regulamentadoras aplicáveis.
7. **Tela 7 — Documentos Legais:** Repositório de laudos técnicos com controle de vigência e download.
8. **Tela 8 — Central de Alertas:** Triagem de desvios e regras disparadas com confirmação de ciente.
9. **Tela 9 — Governança e Linhagem:** Trilha de auditoria imutável, relatório de qualidade de dados (completude/consistência) e parametrização de regras.

---

### 14. COMPONENTES PRINCIPAIS
* `HeaderGlobalBar`: Cabeçalho institucional com filtros transversais.
* `NavigationTabs`: Barra de navegação vertical esquerda com zero ruído visual.
* `KPICardsGrid`: Grade de 10 indicadores de alto impacto com badges de polaridade e botão explicador.
* `KPIExplainerModal`: Explicador analítico de métricas com IA.
* `IndiceSaudeSSTCard`: Visualizador do score composto de saúde da segurança da planta.
* `FrankBirdPyramid`: Representação gráfica da Pirâmide de Desvios de Frank Bird (1-10-30-600).
* `DataImportModal`: Assistente de carga massiva CSV com templates para download.
* `ExecutiveExportModal`: Gerador de dossiê executivo para impressão e CSV.
* `PRDModal`: Leitor e exportador direto do PRD em Markdown e texto oficial.
* `GovernanceAuditoriaModule`: Tabela de auditoria, linhagem de métricas e regras de segurança.

---

### 15. MODELO DE DADOS CONCEITUAL

#### Entidade: Ocorrência (`Ocorrencia`)
* `id` (string, PK)
* `codigo` (string, ex: "OC-2026-001")
* `tipo` (Enum: Quase-Acidente, Sem Afastamento, Com Afastamento, Doença Ocupacional, Fatal)
* `dataHora` (datetime)
* `unidadeId` / `setorId` / `setorNome` (strings)
* `turno` (Enum: TURNO_A, TURNO_B, TURNO_C, COMERCIAL)
* `descricao` (string)
* `severidade` (Enum: Leve, Moderada, Grave, Crítica, Fatal)
* `diasPerdidos` (inteiro)
* `diasDebitados` (inteiro, conforme tabela NBR 14280)
* `catEmitida` (booleano)
* `statusInvestigacao` (Enum: Aberta, Em Investigação, Concluída)
* `causaImediata` / `causaBasica` (strings)

#### Entidade: Ação 5W2H (`Acao5W2H`)
* `id` (string, PK)
* `codigo` (string, ex: "ACT-042")
* `titulo` (string)
* `oQue` / `porQue` / `onde` / `quem` / `quando` / `como` / `quantoCusta` (strings)
* `origem` (Enum: Ocorrência, Risco, Inspeção, Auditoria)
* `origemIdReferencia` (string, FK)
* `status` (Enum: Não iniciada, Em andamento, Concluída, Atrasada)
* `prioridade` (Enum: Baixa, Média, Alta, Crítica)
* `percentualConclusao` (número, 0 a 100)
* `evidenciaUrl` (string opcional)

#### Entidade: Trilha de Auditoria (`AuditoriaLog`)
* `id` (string, PK)
* `usuario` / `cargo` (strings)
* `dataHora` (datetime ISO)
* `acao` (Enum: CRIACAO, EDICAO, EXCLUSAO, STATUS_ACAO, IMPORTACAO, EXPORTACAO)
* `entidade` (Enum: Ocorrência, Inspeção, Ação 5W2H, Risco, Treinamento, Documento, Sistema)
* `registroId` (string)
* `valorAnterior` / `novoValor` (strings)
* `detalhes` (string)
* `ipOrigem` (string)

---

### 16. REGRAS DE NEGÓCIO (BR)
* **BR-001 [Cálculo de Atraso 5W2H]:** Toda ação cujo prazo (`quando`) for menor que a data corrente e o status for diferente de "Concluída" deve receber automaticamente a classificação de `Atrasada` e acionar alerta crítico.
* **BR-002 [Obrigação de Investigação NR-01]:** Qualquer ocorrência classificada como "Acidente com Afastamento" ou quase-acidente com "Alto Potencial de Gravidade" deve gerar obrigatoriamente um plano de ação 5W2H de bloqueio em até 48 horas.
* **BR-003 [Vencimento Preventivo de Treinamento]:** Treinamentos de NRs com menos de 30 dias para a data de expiração devem ser sinalizados como "Em Vencimento" para programação de reciclagem junto ao RH.
* **BR-004 [Imutabilidade de Auditoria]:** Nenhum registro inserido na tabela de `AuditoriaLog` pode ser editado ou apagado por qualquer usuário, inclusive pelo perfil Administrador.

---

### 17. FÓRMULAS E KPIS INDUSTRIAIS

#### 1. Taxa de Frequência de Acidentes (TF) — NBR 14280
$$TF = \frac{N \times 1.000.000}{HHT}$$
* $N$: Número de acidentes com e sem afastamento no período.
* $HHT$: Horas-Homem de Exposição ao Risco Trabalhadas.
* **Unidade:** Acidentes por milhão de horas trabalhadas.
* **Meta Industrial:** $TF \le 2.0$ (Excelente padrão mundial).

#### 2. Taxa de Gravidade (TG) — NBR 14280
$$TG = \frac{(DP + DD) \times 1.000.000}{HHT}$$
* $DP$: Dias Perdidos (incapacidade temporária total).
* $DD$: Dias Debitados (incapacidade permanente ou óbito conforme quadro NBR 14280).
* **Meta Industrial:** $TG \le 50.0$.

#### 3. Índice Composto de Saúde SST (ISSST) — Metodologia PROJECTAI
$$ISSST = (S_{inc} \times w_1) + (S_{ins} \times w_2) + (S_{act} \times w_3) + (S_{trn} \times w_4) + (S_{rsc} \times w_5)$$
* Onde $S_i$ são as pontuações normalizadas (0 a 100) de:
  * Ausência de Acidentes ($w_1 = 30\%$)
  * Eficácia das Ações 5W2H ($w_2 = 25\%$)
  * Conformidade em Inspeções ($w_3 = 20\%$)
  * Cobertura de Treinamentos NRs ($w_4 = 15\%$)
  * Controle de Riscos Graves NR-01 ($w_5 = 10\%$)
* **Escala:**
  * 90 a 100 pts: *Excelente / Classe Mundial* (Verde)
  * 75 a 89 pts: *Bom / Operação Segura* (Âmbar)
  * 50 a 74 pts: *Alerta / Risco Operacional* (Laranja)
  * < 50 pts: *Crítico / Intervenção Imediata* (Vermelho)

#### 4. Conexão Industrial: Impacto de SST no OEE (Overall Equipment Effectiveness)
$$OEE = Disponibilidade \times Rendimento \times Qualidade$$
$$Disponibilidade = \frac{Tempo\ Operativo}{Tempo\ Planificado}$$
* **Impacto Direto de SST:** Toda interdição de máquina (NR-12) ou parada por acidente grave subtrai diretamente horas do *Tempo Operativo*, gerando tempo de parada não programada e reduzindo drasticamente o OEE da célula fabril.

---

### 18. ROLES E PERMISSÕES (RBAC)

| Perfil | Visualizar KPIs | Criar Ocorrência | Concluir 5W2H | Parametrizar Regras | Importar CSV |
|---|:---:|:---:|:---:|:---:|:---:|
| **ADMIN (Nicolas Herrera)** | Sim | Sim | Sim | Sim | Sim |
| **GESTOR_SST (SESMT)** | Sim | Sim | Sim | Sim | Sim |
| **SUPERVISOR (Produção)** | Sim | Sim | Sim (Setor) | Não | Não |
| **OPERACIONAL (Chão de Fábrica)** | Sim (Básico) | Sim | Não | Não | Não |
| **DIRETORIA (Executivo)** | Sim (Executivo) | Não | Não | Não | Não (Apenas Exportar) |

---

### 19. VALIDAÇÕES DE ENTRADA
* **Data da Ocorrência:** Não pode ser uma data futura.
* **Dias Perdidos:** Inteiro positivo maior ou igual a zero.
* **Campos Obrigatórios no 5W2H:** Título, O que, Quem, Quando (Data Válida) e Onde.
* **Importação CSV:** Arquivos devem obrigatoriamente conter delimitadores de vírgula ou ponto-e-vírgula e colunas de identificação mínima (`tipo` e `descricao` para acidentes; `oQue` e `quem` para ações).

---

### 20. MANEJO DE ERROS E RESILIÊNCIA
* **Validação Prévia na Importação:** Caso uma linha do CSV apresente formato de data inconsistente, a importação não quebra a base; o sistema lista os erros de validação na tela para correção pelo usuário.
* **Fórmula com Denominador Zero:** Quando o HHT for igual a zero (ex: turno sem operação), as fórmulas de TF e TG retornam `0.00` de forma segura, evitando erros de divisão por zero.
* **Recuperação de Estado:** Em caso de perda momentânea de conexão, os dados em memória permanecem íntegros sem descarte do que foi preenchido.

---

### 21. SEGURANÇA E PRIVACIDADE
* **Privacidade Médica (LGPD / Sigilo Médico):** Informações de atestados e diagnósticos CID-10 permanecem restritas aos papéis médicos e autorizados, sem exibição em painéis públicos de chão de fábrica.
* **Rastreabilidade por IP:** Todos os registros de auditoria gravam IP de origem e carimbo de data/hora oficial.

---

### 22. INTEGRAÇÕES DO ECOSSISTEMA INDUSTRIAL
1. **ERP Corporativo (SAP / TOTVS Protheus):** Importação de quadro de funcionários ativos e cálculo de HHT real por centro de custo.
2. **Sistema de Manutenção (CMMS / Máquinas):** Sincronização de paradas de máquinas e bloqueios de segurança (Lockout & Tagout - LOTO / NR-12).
3. **Relógio de Ponto / RH:** Dados de absenteísmo médico e horas extras para correlação de fadiga com incidentes.

---

### 23. DADOS INICIAIS E CENÁRIO DEMO
A aplicação já é inicializada com uma base industrial representativa de uma indústria metalmecânica e automobilística de grande porte:
* 10 ocorrências distribuídas entre Usinagem, Estamparia, Montagem e Logística.
* 8 planos de ação 5W2H em diferentes estágios de maturidade.
* 6 treinamentos de normas regulamentadoras vigentes e a vencer (NR-10, NR-12, NR-35).
* Matriz de risco pré-configurada com 6 cenários severos mapeados.

---

### 24. CRITÉRIOS DE ACEITAÇÃO
* [x] Cálculo exato de TF e TG verificado contra planilha de validação da NBR 14280.
* [x] Filtros transversais por Unidade e Turno alteram todos os gráficos em menos de 100ms.
* [x] Painel de navegação vertical esquerdo funcional e sem ruído visual.
* [x] Possibilidade de descarregar este PRD integralmente a qualquer momento.
* [x] Carga massiva de arquivos CSV funcionando com recálculo imediato do ISSST.

---

### 25. ESPECIFICAÇÃO DO MVP ENTREGUE (BASELINE V2.1)
O MVP implementado nesta versão entrega 100% da experiência de um sistema de classe mundial:
* Totalmente funcional no navegador sem necessidade de configuração complexa de servidores.
* Design Dark Moderno com foco em facilidade de uso para engenheiros industriais e técnicos de campo.
* Trilha de Auditoria e Linhagem de Dados de ponta a ponta (Camada 4 de Governança).

---

### 26. ROADMAP FUTURO (RELEASES PLANEJADAS)
* **Release v2.5 (Trimestre Seguinte):** Módulo de Investigação Avançada com Diagrama de Causa e Efeito (Ishikawa) interativo por arrastar e soltar (Drag-and-Drop).
* **Release v3.0:** Integração direta com mensageria eSocial via API REST, gerador de PPP (Perfil Profissiográfico Previdenciário) eletrônico e aplicativo móvel PWA com suporte a captura de fotos offline em campo.
* **Release v3.5:** Algoritmos preditivos de Machine Learning para antecipação de acidentes cruzando temperatura, ruído ambiental e histórico de horas extras do operador.

---

### 27. PLANO DE TESTES E HOMOLOGAÇÃO
1. **Teste de Unidade das Fórmulas:** Testar cálculo de TF com $N=0$ ($TF = 0$) e $N=2, HHT=550.000$ ($TF = 3.64$).
2. **Teste de Transição de Status 5W2H:** Alterar status de uma ação para "Concluída" e validar se a trilha de auditoria registrou o evento com usuário, horário e valores corretos.
3. **Teste de Carga CSV:** Submeter arquivo com 50 linhas de ocorrências e checar se os 10 cards de KPIs atualizaram os números sem travar a interface.
4. **Teste de Responsividade:** Validar legibilidade do painel lateral vertical tanto em monitores ultrawide quanto em notebooks e tablets de campo.

---
**PROJECTAI — Engenharia Industrial & Inteligência Aplicada**  
*Documento emitido para validação e execução direta.*
