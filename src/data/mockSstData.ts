import {
  Unidade,
  Setor,
  Ocorrencia,
  Inspecao,
  Acao5W2H,
  TreinamentoColaborador,
  DocumentoRegulamentar,
  RiscoMatriz,
  AlertaSST,
  IndicadorDicionario,
  SaudeSSTWeights,
  AuditoriaLog,
  DataQualityReport,
  AlertRule
} from '../types/sst';

export const INITIAL_SAUDE_WEIGHTS: SaudeSSTWeights = {
  conformidadeInspecoes: 0.20,
  controleIncidentes: 0.25,
  gestaoRiscos: 0.20,
  acoesNoPrazo: 0.15,
  treinamentosRegulares: 0.10,
  documentosVigentes: 0.10,
};

export const MOCK_UNIDADES: Unidade[] = [
  {
    id: 'UND-01',
    nome: 'Unidade 01 — Matriz São Paulo',
    cidade: 'São Bernardo do Campo',
    estado: 'SP',
    responsavelSST: 'Eng. Ricardo Mansur',
    colaboradoresTotal: 480,
    horasTrabalhadasMes: 84480,
  },
  {
    id: 'UND-02',
    nome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    cidade: 'São José dos Pinhais',
    estado: 'PR',
    responsavelSST: 'Téc. Amanda Vasconcellos',
    colaboradoresTotal: 290,
    horasTrabalhadasMes: 51040,
  },
  {
    id: 'UND-03',
    nome: 'Unidade 03 — Centro Logístico Campinas',
    cidade: 'Campinas',
    estado: 'SP',
    responsavelSST: 'Eng. Carlos Eduardo Prates',
    colaboradoresTotal: 185,
    horasTrabalhadasMes: 32560,
  },
];

export const MOCK_SETORES: Setor[] = [
  { id: 'SET-01', unidadeId: 'UND-01', nome: 'Usinagem e Prensas', grauRiscoPredominante: 3, responsavelArea: 'Marcos Silveira (Sup. Produção)' },
  { id: 'SET-02', unidadeId: 'UND-01', nome: 'Linha de Montagem Final', grauRiscoPredominante: 2, responsavelArea: 'Patrícia Prado (Sup. Montagem)' },
  { id: 'SET-03', unidadeId: 'UND-01', nome: 'Pintura Eletrostática', grauRiscoPredominante: 3, responsavelArea: 'Juliano Ramos (Químico Resp.)' },
  { id: 'SET-04', unidadeId: 'UND-01', nome: 'Manutenção Eletromecânica', grauRiscoPredominante: 4, responsavelArea: 'Cláudio Ferreira (Coord. Manutenção)' },
  { id: 'SET-05', unidadeId: 'UND-02', nome: 'Estamparia Pesada', grauRiscoPredominante: 4, responsavelArea: 'Roberto Dantas (Sup. Estamparia)' },
  { id: 'SET-06', unidadeId: 'UND-02', nome: 'Célula de Solda Robotizada', grauRiscoPredominante: 3, responsavelArea: 'Vinícius Rocha (Líder Solda)' },
  { id: 'SET-07', unidadeId: 'UND-02', nome: 'Almoxarifado Industrial', grauRiscoPredominante: 2, responsavelArea: 'Elaine Cardoso (Sup. Logística)' },
  { id: 'SET-08', unidadeId: 'UND-03', nome: 'Pátio de Carga e Descarga', grauRiscoPredominante: 3, responsavelArea: 'Rogério Lima (Sup. Pátio)' },
  { id: 'SET-09', unidadeId: 'UND-03', nome: 'Armazém Vertical de Porta-Paletes', grauRiscoPredominante: 3, responsavelArea: 'Aline Nogueira (Líder Armazém)' },
];

export const MOCK_ACOES: Acao5W2H[] = [
  {
    id: 'ACT-2026-089',
    codigo: 'ACT-089',
    titulo: 'Instalação de Cortina de Luz e Travamento Categoria 4 na Prensa Hidráulica 04',
    oQue: 'Instalar intertravamento óptico e relé de segurança de duplo canal conforme NR-12 na Prensa 04',
    porQue: 'Quase-acidente registrado por aproximação indevida da zona de prensagem durante ciclo automático',
    onde: 'Unidade 01 — Setor Usinagem e Prensas',
    quem: 'Cláudio Ferreira (Manutenção) / Fornecedor Schmersal',
    quando: '2026-03-01', // Atrasada em relação ao presente
    como: 'Aquisição de sensor biométrico/cortina ótica + adequação do painel elétrico de comando',
    quantoCusta: 'R$ 14.500,00',
    origem: 'Ocorrência',
    origemIdReferencia: 'OC-2026-042',
    prioridade: 'Crítica',
    status: 'Atrasada',
    dataCriacao: '2026-02-10',
    evidenciaConclusao: '',
    verificadoEficaz: false,
  },
  {
    id: 'ACT-2026-092',
    codigo: 'ACT-092',
    titulo: 'Substituição e Certificação da Linha de Vida do Galpão Logístico',
    oQue: 'Substituir cabo de aço de 8mm desgastado e reemitir ART de conformidade da linha de ancoragem NR-35',
    porQue: 'Detecção de oxidação e afrouxamento na inspeção trimestral de trabalho em altura',
    onde: 'Unidade 03 — Pátio de Carga e Descarga',
    quem: 'Eng. Carlos Eduardo Prates (SST) / Empresa Alpinismo Industrial',
    quando: '2026-03-20',
    como: 'Desmontagem, substituição por cabo de aço inox 10mm e teste de tração 15kN',
    quantoCusta: 'R$ 8.200,00',
    origem: 'Inspeção',
    origemIdReferencia: 'INSP-2026-108',
    prioridade: 'Alta',
    status: 'Em andamento',
    dataCriacao: '2026-02-28',
    evidenciaConclusao: '',
    verificadoEficaz: false,
  },
  {
    id: 'ACT-2026-077',
    codigo: 'ACT-077',
    titulo: 'Pintura e Demarcação Termoplástica de Faixas de Pedestre e Tráfego de Empilhadeiras',
    oQue: 'Segregação visual física entre passagem de operadores e rota de empilhadeiras no pavilhão principal',
    porQue: 'Desvio comportamental de travessia fora da faixa e cruzamento de fluxo de carga pesada',
    onde: 'Unidade 02 — Almoxarifado Industrial',
    quem: 'Téc. Amanda Vasconcellos / Equipe Predial',
    quando: '2026-02-15',
    como: 'Aplicação de tinta epóxi de alta durabilidade e instalação de barreiras de polímero flexível',
    quantoCusta: 'R$ 6.300,00',
    origem: 'Matriz de Risco',
    origemIdReferencia: 'RSK-2026-015',
    prioridade: 'Média',
    status: 'Concluída',
    dataCriacao: '2026-01-20',
    dataConclusaoReal: '2026-02-14',
    evidenciaConclusao: 'Evidência fotográfica homologada pelo comitê CIPA e laudo de entrega técnica assinado.',
    verificadoEficaz: true,
  },
  {
    id: 'ACT-2026-104',
    codigo: 'ACT-104',
    titulo: 'Treinamento de Reciclagem NR-33 para Espaço Confinado nas Estações de Tratamento',
    oQue: 'Capacitação prática com simulador de resgate para 12 colaboradores da manutenção de tubulações',
    porQue: 'Validade bienal de 5 colaboradores expirando em março de 2026',
    onde: 'Unidade 01 — Manutenção Eletromecânica',
    quem: 'Eng. Ricardo Mansur / Instrutor Credenciado Senai',
    quando: '2026-03-25',
    como: 'Curso imersivo de 16h com uso de detector multigás, tripé e máscara autônoma',
    quantoCusta: 'R$ 4.800,00',
    origem: 'Ocorrência',
    origemIdReferencia: 'OC-2026-039',
    prioridade: 'Alta',
    status: 'Em andamento',
    dataCriacao: '2026-03-02',
    evidenciaConclusao: '',
    verificadoEficaz: false,
  },
  {
    id: 'ACT-2026-065',
    codigo: 'ACT-065',
    titulo: 'Adequação dos Exaustores de Névoa na Cabine de Pintura Eletrostática',
    oQue: 'Troca de filtros HEPA e limpeza do duto de aspiração para conformidade de limite de tolerância NR-15',
    porQue: 'Medição higiênica apontou 82% do limite de tolerância para compostos orgânicos voláteis',
    onde: 'Unidade 01 — Pintura Eletrostática',
    quem: 'Juliano Ramos / Fornecedor Nederman',
    quando: '2026-02-22',
    como: 'Parada programada no fim de semana para substituição integral do leito filtrante',
    quantoCusta: 'R$ 11.000,00',
    origem: 'Inspeção',
    origemIdReferencia: 'INSP-2026-095',
    prioridade: 'Alta',
    status: 'Concluída',
    dataCriacao: '2026-01-15',
    dataConclusaoReal: '2026-02-21',
    evidenciaConclusao: 'Relatório de vazão e higrometria comprovando redução para 24% do limite de tolerância.',
    verificadoEficaz: true,
  },
  {
    id: 'ACT-2026-111',
    codigo: 'ACT-111',
    titulo: 'Instalação de Válvulas Antirretorno e Proteção nos Cilindros de Gás da Solda',
    oQue: 'Instalação de dispositivos corta-chama em 8 conjuntos de solda oxiacetileno',
    porQue: 'Inspeção de rotina constatou desgaste nos engates rápidos',
    onde: 'Unidade 02 — Célula de Solda Robotizada',
    quem: 'Vinícius Rocha (Líder Solda)',
    quando: '2026-03-05',
    como: 'Substituição das mangueiras duplas e roscas padrão ABNT',
    quantoCusta: 'R$ 2.400,00',
    origem: 'Inspeção',
    origemIdReferencia: 'INSP-2026-110',
    prioridade: 'Média',
    status: 'Atrasada',
    dataCriacao: '2026-02-20',
    evidenciaConclusao: '',
    verificadoEficaz: false,
  }
];

export const MOCK_OCORRENCIAS: Ocorrencia[] = [
  {
    id: 'OC-2026-042',
    codigo: 'OC-042',
    tipo: 'Incidente / Quase-Acidente',
    dataHora: '2026-02-09 14:35',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-01',
    setorNome: 'Usinagem e Prensas',
    atividade: 'Alimentação manual de chapas metálicas na Prensa Hidráulica 04',
    colaboradorEnvolvido: 'Danilo Alcantara',
    funcaoColaborador: 'Operador de Prensa II',
    turno: 'TURNO_B',
    descricao: 'Durante a retirada de uma chapa com rebarba, a ferramenta pinça escorregou e a luva do operador aproximou-se da descida do martelo superior. O operador acionou a parada de emergência manual a tempo, sem contato físico nem lesão corporal.',
    classificacao: 'Crítica',
    severidade: 'Sem Lesão',
    diasPerdidos: 0,
    investigadorResponsavel: 'Eng. Ricardo Mansur (Coord. SST)',
    statusInvestigacao: 'Ação Definida',
    causaImediata: 'Falha no posicionamento da pinça auxiliar somada à ausência de barreira óptica intertravada contínua.',
    causaBasica: 'NR-12: Falta de redundância de segurança eletrosensitiva na zona de prensagem e procedimento operacional desatualizado para troca de matriz.',
    fatoresContribuintes: [
      'Ritmo acelerado para cumprimento de meta de produção do lote 441',
      'Pinça de manipulação com mordente desgastado',
      'Iluminação local abaixo de 300 lux no ponto de operação'
    ],
    testemunhas: ['Manoel Barbosa (Operador Prensa 03)', 'Marcos Silveira (Supervisor)'],
    evidenciasFotograficas: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
    ],
    acaoId: 'ACT-2026-089',
    acaoDescricao: 'Instalação de Cortina de Luz e Travamento Categoria 4 na Prensa Hidráulica 04',
    responsavelAcao: 'Cláudio Ferreira (Manutenção)',
    prazoAcao: '2026-03-01',
    statusAcao: 'Atrasada'
  },
  {
    id: 'OC-2026-039',
    codigo: 'OC-039',
    tipo: 'Condição Insegura',
    dataHora: '2026-02-02 09:15',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-04',
    setorNome: 'Manutenção Eletromecânica',
    atividade: 'Aferição de nível de caixa de decantação em galeria subterrânea',
    colaboradorEnvolvido: 'Lucas Menezes e Gabriel Santos',
    funcaoColaborador: 'Mecânicos de Manutenção',
    turno: 'TURNO_A',
    descricao: 'Identificada entrada de equipe de manutenção em poço de decantação sem emissão prévia de Permissão de Entrada e Trabalho (PET) e sem teste de detector multigás de oxigênio/H2S.',
    classificacao: 'Alta',
    severidade: 'Sem Lesão',
    diasPerdidos: 0,
    investigadorResponsavel: 'Eng. Ricardo Mansur',
    statusInvestigacao: 'Ação Definida',
    causaImediata: 'Descumprimento voluntário do procedimento NR-33 alegando intervenção de menos de 5 minutos.',
    causaBasica: 'Percepção distorcida de risco em atividades rotineiras e falha no controle de chaves de acesso a espaços confinados.',
    fatoresContribuintes: [
      'Detector portátil de gases estava no carregador da sala de segurança',
      'Ausência de vigia designado na boca do bueiro'
    ],
    testemunhas: ['Rogério Farias (Téc. Segurança)'],
    evidenciasFotograficas: [
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    ],
    acaoId: 'ACT-2026-104',
    acaoDescricao: 'Treinamento de Reciclagem NR-33 para Espaço Confinado nas Estações de Tratamento',
    responsavelAcao: 'Eng. Ricardo Mansur',
    prazoAcao: '2026-03-25',
    statusAcao: 'Em andamento'
  },
  {
    id: 'OC-2026-031',
    codigo: 'OC-031',
    tipo: 'Acidente sem Afastamento (SPT)',
    dataHora: '2026-01-18 16:40',
    unidadeId: 'UND-02',
    unidadeNome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    setorId: 'SET-05',
    setorNome: 'Estamparia Pesada',
    atividade: 'Rebarbação de peça estampada com lixadeira angular portátil',
    colaboradorEnvolvido: 'Jonas Silvério',
    funcaoColaborador: 'Ajudante Geral',
    turno: 'TURNO_B',
    descricao: 'Corpo estranho no olho esquerdo (fagulha metálica) durante operação com esmeril portátil. Colaborador utilizava óculos de proteção comum em vez de protetor facial acoplado conforme recomendado na APR.',
    classificacao: 'Média',
    severidade: 'Leve',
    diasPerdidos: 0,
    investigadorResponsavel: 'Téc. Amanda Vasconcellos',
    statusInvestigacao: 'Encerrado',
    causaImediata: 'Uso de EPI incompleto para operação com emissão contínua de partículas incandescentes.',
    causaBasica: 'Disponibilidade limitada de máscaras faciais no carrinho móvel de ferramentas.',
    fatoresContribuintes: [
      'Óculos de proteção com vedação lateral inadequada para o formato do rosto',
      'DDS não reforçou a obrigatoriedade da dupla proteção (óculos + viseira)'
    ],
    testemunhas: ['Thiago Queiroz (Operador)'],
    evidenciasFotograficas: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80'
    ],
    statusAcao: 'Concluída'
  },
  {
    id: 'OC-2026-018',
    codigo: 'OC-018',
    tipo: 'Acidente com Afastamento (CPT)',
    dataHora: '2025-10-24 11:20',
    unidadeId: 'UND-03',
    unidadeNome: 'Unidade 03 — Centro Logístico Campinas',
    setorId: 'SET-08',
    setorNome: 'Pátio de Carga e Descarga',
    atividade: 'Deslocamento de palete de bobinas em doca inclinada com paleteira manual',
    colaboradorEnvolvido: 'Everton Maciel',
    funcaoColaborador: 'Conferente de Carga',
    turno: 'TURNO_A',
    descricao: 'Queda de mesmo nível com entorse de tornozelo esquerdo ao pisar em mancha de óleo residual vazada de caminhão de terceiro na rampa da doca 03. Afastamento médico de 12 dias pelo INSS.',
    classificacao: 'Alta',
    severidade: 'Moderada',
    diasPerdidos: 12,
    investigadorResponsavel: 'Eng. Carlos Eduardo Prates',
    statusInvestigacao: 'Encerrado',
    causaImediata: 'Piso escorregadio com resíduo oleoso não isolado nem sinalizado de imediato.',
    causaBasica: 'Falta de kit de mitigação de vazamentos (pó de serra/turfa absorvente) na cabine da portaria de caminhões.',
    fatoresContribuintes: [
      'Caminhão transportador externo com vazamento no cárter não vistoriado no checklist de entrada',
      'Calçado de segurança do operador com solado com ranhuras desgastadas'
    ],
    testemunhas: ['Arnaldo Pires (Motorista Carreteiro)'],
    evidenciasFotograficas: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
    ],
    statusAcao: 'Concluída'
  }
];

export const MOCK_INSPECOES: Inspecao[] = [
  {
    id: 'INSP-2026-108',
    codigo: 'INSP-108',
    titulo: 'Inspeção NR-35 — Sistemas de Proteção Coletiva e Trabalho em Altura',
    tipoChecklist: 'NR-35 Trabalho em Altura',
    unidadeId: 'UND-03',
    unidadeNome: 'Unidade 03 — Centro Logístico Campinas',
    setorId: 'SET-08',
    setorNome: 'Pátio de Carga e Descarga',
    data: '2026-02-28',
    responsavelInspetor: 'Eng. Carlos Eduardo Prates',
    itensAvaliadosTotal: 15,
    itensConformesTotal: 13,
    taxaConformidade: 86.6,
    itensNaoConformes: [
      {
        id: 'ITEM-01',
        pergunta: 'Os cabos de ancoragem e linhas de vida possuem laudo técnico e ART atualizada?',
        normaReferencia: 'NR-35.5.3',
        conforme: false,
        observacao: 'Linha de vida da doca 02 apresenta estiramento anormal e oxidação na presilha de extremidade.',
        fotoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ITEM-02',
        pergunta: 'Os talabartes e cinturões tipo paraquedista possuem CA legível e registro de inspeção pré-uso?',
        normaReferencia: 'NR-35.5.4',
        conforme: false,
        observacao: 'Dois cintos no armário 04 estavam sem a etiqueta de rastreabilidade de lote.',
        fotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80'
      }
    ],
    status: 'Com Pendências',
    acaoIdGerada: 'ACT-2026-092'
  },
  {
    id: 'INSP-2026-110',
    codigo: 'INSP-110',
    titulo: 'Auditoria de Segurança NR-10 e NR-12 nas Células de Solda',
    tipoChecklist: 'NR-10 Segurança Elétrica',
    unidadeId: 'UND-02',
    unidadeNome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    setorId: 'SET-06',
    setorNome: 'Célula de Solda Robotizada',
    data: '2026-02-20',
    responsavelInspetor: 'Téc. Amanda Vasconcellos',
    itensAvaliadosTotal: 20,
    itensConformesTotal: 18,
    taxaConformidade: 90.0,
    itensNaoConformes: [
      {
        id: 'ITEM-11',
        pergunta: 'Os painéis elétricos possuem diagramas unifilares atualizados e sinalização de advertência de risco elétrico?',
        normaReferencia: 'NR-10.2.3',
        conforme: false,
        observacao: 'Painel auxiliar de comando sem sinalização de arco elétrico e cadeado de bloqueio LOTO.',
        fotoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ITEM-12',
        pergunta: 'Os cilindros de gases comprimidos contam com válvulas corta-chama regulamentadas?',
        normaReferencia: 'NR-12 e NR-18',
        conforme: false,
        observacao: 'Válvula corta-chama do cilindro de acetileno com data de calibração vencida.',
        fotoUrl: ''
      }
    ],
    status: 'Com Pendências',
    acaoIdGerada: 'ACT-2026-111'
  },
  {
    id: 'INSP-2026-115',
    codigo: 'INSP-115',
    titulo: 'Checklist de Verificação de EPIs e EPCs na Montagem',
    tipoChecklist: 'EPIs e EPCs',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-02',
    setorNome: 'Linha de Montagem Final',
    data: '2026-03-05',
    responsavelInspetor: 'Eng. Ricardo Mansur',
    itensAvaliadosTotal: 18,
    itensConformesTotal: 18,
    taxaConformidade: 100.0,
    itensNaoConformes: [],
    status: 'Concluída'
  }
];

export const MOCK_TREINAMENTOS: TreinamentoColaborador[] = [
  {
    id: 'TRN-01',
    colaboradorNome: 'Danilo Alcantara',
    matricula: 'BR-1049',
    funcao: 'Operador de Prensa II',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorNome: 'Usinagem e Prensas',
    cursoNorma: 'NR-12 Segurança no Trabalho em Máquinas e Equipamentos',
    cargaHoraria: 16,
    dataRealizacao: '2024-03-10',
    dataValidade: '2026-03-10',
    diasParaVencer: -5, // Vencido
    instrutorEntidade: 'Eng. Mecânico Valdir Cruz - CREA SP',
    certificadoNumero: 'CERT-NR12-2024-883',
    status: 'Vencido'
  },
  {
    id: 'TRN-02',
    colaboradorNome: 'Gabriel Santos',
    matricula: 'BR-1182',
    funcao: 'Mecânico de Manutenção',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorNome: 'Manutenção Eletromecânica',
    cursoNorma: 'NR-33 Segurança e Saúde nos Trabalhos em Espaços Confinados',
    cargaHoraria: 16,
    dataRealizacao: '2025-03-22',
    dataValidade: '2026-03-22',
    diasParaVencer: 7, // Vence em 7 dias
    instrutorEntidade: 'Fundacentro / Prof. Laerte',
    certificadoNumero: 'CERT-NR33-2025-014',
    status: 'Vence em 7 dias'
  },
  {
    id: 'TRN-03',
    colaboradorNome: 'Lucas Menezes',
    matricula: 'BR-1175',
    funcao: 'Mecânico de Manutenção',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorNome: 'Manutenção Eletromecânica',
    cursoNorma: 'NR-35 Trabalho em Altura',
    cargaHoraria: 8,
    dataRealizacao: '2024-03-30',
    dataValidade: '2026-03-30',
    diasParaVencer: 15, // Vence em 15 dias
    instrutorEntidade: 'Senai Alviverde',
    certificadoNumero: 'CERT-NR35-2024-441',
    status: 'Vence em 15 dias'
  },
  {
    id: 'TRN-04',
    colaboradorNome: 'Rodrigo Fontana',
    matricula: 'BR-2091',
    funcao: 'Eletricista de Força e Controle',
    unidadeId: 'UND-02',
    unidadeNome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    setorNome: 'Célula de Solda Robotizada',
    cursoNorma: 'NR-10 Segurança em Instalações e Serviços em Eletricidade',
    cargaHoraria: 40,
    dataRealizacao: '2024-04-12',
    dataValidade: '2026-04-12',
    diasParaVencer: 28, // Vence em 30 dias
    instrutorEntidade: 'Eng. Eletricista Marcelo Souza',
    certificadoNumero: 'CERT-NR10-2024-119',
    status: 'Vence em 30 dias'
  },
  {
    id: 'TRN-05',
    colaboradorNome: 'Manoel Barbosa',
    matricula: 'BR-1011',
    funcao: 'Operador de Prensa III',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorNome: 'Usinagem e Prensas',
    cursoNorma: 'NR-12 Operação Segura de Prensas Excêntricas',
    cargaHoraria: 24,
    dataRealizacao: '2025-06-15',
    dataValidade: '2027-06-15',
    diasParaVencer: 456,
    instrutorEntidade: 'Eng. Ricardo Mansur',
    certificadoNumero: 'CERT-NR12-2025-901',
    status: 'Vigente'
  },
  {
    id: 'TRN-06',
    colaboradorNome: 'Arnaldo Pires',
    matricula: 'BR-3055',
    funcao: 'Operador de Empilhadeira',
    unidadeId: 'UND-03',
    unidadeNome: 'Unidade 03 — Centro Logístico Campinas',
    setorNome: 'Pátio de Carga e Descarga',
    cursoNorma: 'NR-11 Transporte, Movimentação e Armazenagem de Materiais',
    cargaHoraria: 16,
    dataRealizacao: '2025-08-10',
    dataValidade: '2026-08-10',
    diasParaVencer: 147,
    instrutorEntidade: 'Sest Senat Campinas',
    certificadoNumero: 'CERT-NR11-2025-332',
    status: 'Vigente'
  }
];

export const MOCK_DOCUMENTOS: DocumentoRegulamentar[] = [
  {
    id: 'DOC-01',
    nome: 'PGR — Programa de Gerenciamento de Riscos (NR-01)',
    tipo: 'PGR',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    versao: 'v4.2 - Ciclo 2025/2026',
    responsavelTecnico: 'Eng. Ricardo Mansur (CREA SP 506922)',
    dataEmissao: '2025-04-01',
    dataValidade: '2027-04-01',
    diasParaVencer: 381,
    status: 'Vigente',
    arquivoUrl: '#'
  },
  {
    id: 'DOC-02',
    nome: 'PCMSO — Programa de Controle Médico de Saúde Ocupacional (NR-07)',
    tipo: 'PCMSO',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    versao: 'v3.0 - Anual',
    responsavelTecnico: 'Dra. Helena Brandão (CRM SP 98451 / RQE Medicina do Trabalho)',
    dataEmissao: '2025-03-15',
    dataValidade: '2026-03-15',
    diasParaVencer: 0, // Vencendo hoje / amanha
    status: 'Próximo do vencimento',
    arquivoUrl: '#'
  },
  {
    id: 'DOC-03',
    nome: 'LTCAT — Laudo Técnico das Condições Ambientais de Trabalho',
    tipo: 'LTCAT',
    unidadeId: 'UND-02',
    unidadeNome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    versao: 'v2.1',
    responsavelTecnico: 'Eng. Fernando Camargo (CREA PR 44921)',
    dataEmissao: '2024-02-10',
    dataValidade: '2026-02-10',
    diasParaVencer: -34, // Vencido
    status: 'Vencido',
    arquivoUrl: '#'
  },
  {
    id: 'DOC-04',
    nome: 'Laudo Ergonômico dos Postos de Montagem (NR-17)',
    tipo: 'Laudo Ergonômico',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    versao: 'v2.0',
    responsavelTecnico: 'Fisioterapeuta Dra. Renata Paiva (Crefito 3/8892)',
    dataEmissao: '2025-09-01',
    dataValidade: '2027-09-01',
    diasParaVencer: 534,
    status: 'Vigente',
    arquivoUrl: '#'
  },
  {
    id: 'DOC-05',
    nome: 'PAE — Plano de Ação de Emergência e Combate a Incêndio (AVCB)',
    tipo: 'Plano de Emergência',
    unidadeId: 'UND-03',
    unidadeNome: 'Unidade 03 — Centro Logístico Campinas',
    versao: 'v1.4',
    responsavelTecnico: 'Capitão da Reserva Bombeiros / Eng. Carlos Prates',
    dataEmissao: '2025-07-20',
    dataValidade: '2026-07-20',
    diasParaVencer: 126,
    status: 'Vigente',
    arquivoUrl: '#'
  }
];

export const MOCK_RISCOS: RiscoMatriz[] = [
  {
    id: 'RSK-2026-015',
    codigo: 'RSK-015',
    perigo: 'Prensagem e esmagamento em partes móveis de maquinário pesado',
    risco: 'Amputação de membros superiores e esmagamento',
    fonteGeradora: 'Prensa Excêntrica e Hidráulica de Estamparia 150t',
    exposicao: 'Operação contínua de alimentação e retirada de peças metálicas',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-01',
    setorNome: 'Usinagem e Prensas',
    trabalhadoresExpostos: 14,
    probabilidade: 3, // Alta
    severidade: 3,    // Alta
    nivelRiscoScore: 9, // Crítico
    classificacao: 'Crítico',
    controlesExistentes: ['Comando bimanual', 'Botão de emergência tipo cogumelo', 'Luvas de vaqueta'],
    controlesNecessarios: ['Cortina de luz de segurança Categoria 4', 'Enclausuramento físico lateral', 'Sensor de intertravamento redundante'],
    responsavel: 'Eng. Ricardo Mansur / Cláudio Ferreira',
    prazoRevisao: '2026-03-01',
    status: 'Crítico Sem Barreira',
    acaoVinculadaId: 'ACT-2026-089'
  },
  {
    id: 'RSK-2026-018',
    codigo: 'RSK-018',
    perigo: 'Trabalho em altura com risco de queda em desnível superior a 2m',
    risco: 'Politraumatismo, traumatismo craniano e óbito',
    fonteGeradora: 'Manutenção de telhados, pontes rolantes e docas elevadas',
    exposicao: 'Atividades sazonais e manutenções corretivas em altura',
    unidadeId: 'UND-03',
    unidadeNome: 'Unidade 03 — Centro Logístico Campinas',
    setorId: 'SET-08',
    setorNome: 'Pátio de Carga e Descarga',
    trabalhadoresExpostos: 8,
    probabilidade: 2, // Média
    severidade: 3,    // Alta
    nivelRiscoScore: 6, // Crítico
    classificacao: 'Crítico',
    controlesExistentes: ['Cinto tipo paraquedista com talabarte duplo', 'Linha de vida em cabo de aço'],
    controlesNecessarios: ['Recertificação de 100% dos pontos de ancoragem com teste de carga e ART'],
    responsavel: 'Eng. Carlos Eduardo Prates',
    prazoRevisao: '2026-03-20',
    status: 'Em Tratamento',
    acaoVinculadaId: 'ACT-2026-092'
  },
  {
    id: 'RSK-2026-022',
    codigo: 'RSK-022',
    perigo: 'Atropelamento e colisão de veículos de movimentação interna de carga',
    risco: 'Fraturas, esmagamento e lesões osteomusculares',
    fonteGeradora: 'Empilhadeiras a gás e rebocadores elétricos em corredores estreitos',
    exposicao: 'Turno integral de carga e descarga em áreas compartilhadas',
    unidadeId: 'UND-02',
    unidadeNome: 'Unidade 02 — Filial Metalmecânica Curitiba',
    setorId: 'SET-07',
    setorNome: 'Almoxarifado Industrial',
    trabalhadoresExpostos: 22,
    probabilidade: 2, // Média
    severidade: 2,    // Média
    nivelRiscoScore: 4, // Atenção
    classificacao: 'Atenção',
    controlesExistentes: ['Sinal sonoro de ré', 'Farol blue spot de aviso no piso'],
    controlesNecessarios: ['Segregação física com guard-rails de alta absorção de impacto'],
    responsavel: 'Téc. Amanda Vasconcellos',
    prazoRevisao: '2026-04-10',
    status: 'Controlado',
    acaoVinculadaId: 'ACT-2026-077'
  },
  {
    id: 'RSK-2026-027',
    codigo: 'RSK-027',
    perigo: 'Inalação de vapores orgânicos e névoas de solvente',
    risco: 'Intoxicação aguda, cefaleia, dermatite de contato e pneumopatias',
    fonteGeradora: 'Pistolas de aspersão de tinta poliéster e primer epóxi',
    exposicao: 'Operadores na cabine de pintura',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-03',
    setorNome: 'Pintura Eletrostática',
    trabalhadoresExpostos: 6,
    probabilidade: 2, // Média
    severidade: 2,    // Média
    nivelRiscoScore: 4, // Atenção
    classificacao: 'Atenção',
    controlesExistentes: ['Cabine com exaustão por cortina de água', 'Máscara semi-facial com cartucho químico'],
    controlesNecessarios: ['Automação da dosagem de solvente e sensor de saturação de filtro'],
    responsavel: 'Juliano Ramos',
    prazoRevisao: '2026-04-30',
    status: 'Controlado'
  },
  {
    id: 'RSK-2026-031',
    codigo: 'RSK-031',
    perigo: 'Ruído contínuo superior a 85 dB(A) emitido por tornos e fresadoras',
    risco: 'PAIR — Perda Auditiva Induzida por Ruído Ocupacional',
    fonteGeradora: 'Usinagem em alta velocidade e esmerilhamento',
    exposicao: 'Todos os operadores do pavilhão de usinagem',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-01',
    setorNome: 'Usinagem e Prensas',
    trabalhadoresExpostos: 35,
    probabilidade: 2, // Média
    severidade: 1,    // Baixa
    nivelRiscoScore: 2, // Aceitável
    classificacao: 'Aceitável',
    controlesExistentes: ['Protetor auricular tipo concha e plug com atenuação de 18 dB', 'Audiometria periódica semestral'],
    controlesNecessarios: ['Barreiras acústicas nas fresas de maior rotação'],
    responsavel: 'Eng. Ricardo Mansur',
    prazoRevisao: '2026-06-15',
    status: 'Controlado'
  },
  {
    id: 'RSK-2026-035',
    codigo: 'RSK-035',
    perigo: 'Ergonomia: Movimentação repetitiva e postura forçada de tronco',
    risco: 'DORT / LER e lombalgia ocupacional',
    fonteGeradora: 'Bancadas de montagem com altura estática',
    exposicao: 'Operadoras de montagem de chicotes',
    unidadeId: 'UND-01',
    unidadeNome: 'Unidade 01 — Matriz São Paulo',
    setorId: 'SET-02',
    setorNome: 'Linha de Montagem Final',
    trabalhadoresExpostos: 28,
    probabilidade: 2, // Média
    severidade: 1,    // Baixa
    nivelRiscoScore: 2, // Aceitável
    classificacao: 'Aceitável',
    controlesExistentes: ['Ginástica laboral 2x ao dia', 'Banqueta semi-sentada ergonômica'],
    controlesNecessarios: ['Bancadas com pistão de regulagem pneumática de altura'],
    responsavel: 'Patrícia Prado',
    prazoRevisao: '2026-07-01',
    status: 'Controlado'
  }
];

export const MOCK_ALERTAS: AlertaSST[] = [
  {
    id: 'ALT-001',
    tipo: 'Ação Vencida',
    severidade: 'Crítico',
    titulo: 'Ação Crítica ACT-089 está com prazo extrapolado em 14 dias',
    descricao: 'Instalação de Cortina de Luz na Prensa Hidráulica 04 (NR-12) deveria ter sido concluída até 01/03/2026. A máquina segue em operação com procedimento paliativo.',
    data: '2026-03-02',
    origem: 'Plano de Ações (5W2H)',
    origemTipo: 'ACAO',
    origemId: 'ACT-2026-089',
    indicadorRelacionado: 'Taxa de Ações no Prazo (IND-AP-05)',
    responsavel: 'Cláudio Ferreira (Manutenção)',
    acaoRecomendada: 'Convocar reunião emergencial com gerência fabril e interditar máquina até emissão do laudo elétrico.',
    status: 'Ativo'
  },
  {
    id: 'ALT-002',
    tipo: 'Risco Crítico',
    severidade: 'Crítico',
    titulo: 'Risco RSK-015 classificado como Prensagem em Nível 9 sem barreira definitiva',
    descricao: 'Matriz de risco aponta probabilidade alta x severidade alta na alimentação manual de chapas.',
    data: '2026-02-15',
    origem: 'Matriz de Riscos (NR-01)',
    origemTipo: 'RISCO',
    origemId: 'RSK-2026-015',
    indicadorRelacionado: 'Riscos Críticos Ativos (IND-RC-08)',
    responsavel: 'Eng. Ricardo Mansur',
    acaoRecomendada: 'Validar barreira física enclausurada imediata e rodar análise preliminar de risco diária.',
    status: 'Ativo'
  },
  {
    id: 'ALT-003',
    tipo: 'Documento Expirado',
    severidade: 'Alto',
    titulo: 'LTCAT da Unidade 02 Curitiba está vencido há mais de 30 dias',
    descricao: 'Laudo Ambiental perdeu a validade legal em 10/02/2026. Risco de não conformidade no eSocial (eventos S-2240).',
    data: '2026-02-11',
    origem: 'Módulo de Documentos SST',
    origemTipo: 'DOCUMENTO',
    origemId: 'DOC-03',
    indicadorRelacionado: 'Conformidade Documental (IND-DOC-07)',
    responsavel: 'Téc. Amanda Vasconcellos',
    acaoRecomendada: 'Contratar consultoria homologada para medições ambientais de ruído e agentes químicos.',
    status: 'Ativo'
  },
  {
    id: 'ALT-004',
    tipo: 'Treinamento Vencido',
    severidade: 'Alto',
    titulo: 'Colaborador com certificação NR-12 vencida na Prensa 04',
    descricao: 'Danilo Alcantara (Matrícula BR-1049) está operando maquinário sem renovação do curso bienal de NR-12.',
    data: '2026-03-11',
    origem: 'Módulo de Treinamentos',
    origemTipo: 'TREINAMENTO',
    origemId: 'TRN-01',
    indicadorRelacionado: 'Cobertura de Treinamento (IND-TR-06)',
    responsavel: 'Marcos Silveira (Sup. Produção)',
    acaoRecomendada: 'Remanejar operador temporariamente para montagem e agendar turma de reciclagem imediata.',
    status: 'Ativo'
  },
  {
    id: 'ALT-005',
    tipo: 'Treinamento Próximo do Vencimento',
    severidade: 'Atenção',
    titulo: 'Dois mecânicos com reciclagem NR-33 e NR-35 vencendo em menos de 15 dias',
    descricao: 'Lucas Menezes e Gabriel Santos necessitam de renovação para manter aptidão no ASO periódico.',
    data: '2026-03-14',
    origem: 'Módulo de Treinamentos',
    origemTipo: 'TREINAMENTO',
    origemId: 'TRN-02',
    indicadorRelacionado: 'Cobertura de Treinamento (IND-TR-06)',
    responsavel: 'RH / Treinamento SST',
    acaoRecomendada: 'Confirmar inscrições na turma Senai da próxima semana.',
    status: 'Reconhecido'
  },
  {
    id: 'ALT-006',
    tipo: 'Inspeção com Pendência',
    severidade: 'Atenção',
    titulo: 'Inspeção INSP-108 de Trabalho em Altura reprovou cabo de ancoragem',
    descricao: 'Taxa de conformidade de 86.6% ficou abaixo da meta mínima de 95% estipulada para áreas de risco.',
    data: '2026-02-28',
    origem: 'Módulo de Inspeções',
    origemTipo: 'INDICADOR',
    origemId: 'INSP-2026-108',
    indicadorRelacionado: 'Taxa de Conformidade de Inspeções (IND-CONF-04)',
    responsavel: 'Eng. Carlos Eduardo Prates',
    acaoRecomendada: 'Acompanhar conclusão da ação ACT-092 até 20/03/2026.',
    status: 'Em Tratamento'
  }
];

export const MOCK_DICIONARIO: IndicadorDicionario[] = [
  {
    codigo: 'IND-AC-01',
    nome: 'Acidentes de Trabalho (CPT e SPT)',
    definicao: 'Contabilização do número absoluto de acidentes típicos ou de trajeto ocorridos no período, segregados entre com perda de tempo (CPT) e sem perda de tempo (SPT).',
    formula: 'Total = CPT + SPT',
    unidade: 'Ocorrências (nº)',
    fonte: 'Sistema Integrado SST — Registro CAT e Investigação Interna',
    periodicidade: 'Contínua / Mensal',
    meta: '0 acidentes CPT / máx. 1 SPT',
    limiteCritico: '> 0 CPT ou > 2 SPT',
    dataOwner: 'Coordenação Geral de SST (Eng. Ricardo Mansur)',
    ultimaAtualizacao: '2026-03-15 08:30',
    versao: '2.0'
  },
  {
    codigo: 'IND-TF-02',
    nome: 'Taxa de Frequência de Acidentes (TF)',
    definicao: 'Número de acidentes com afastamento (ou com e sem afastamento, conforme critério NBR 14280) por milhão de horas-homem de exposição ao risco.',
    formula: 'TF = (Nº de Acidentes * 1.000.000) / Horas-Homem Trabalhadas (HHT)',
    unidade: 'Acidentes / 1M HHT',
    fonte: 'Folha de Pagamento (Ponto Eletrônico HHT) + Registros de Ocorrências',
    periodicidade: 'Mensal consolidada',
    meta: 'TF <= 2.0',
    limiteCritico: 'TF > 5.0',
    dataOwner: 'Engenharia de Segurança do Trabalho',
    ultimaAtualizacao: '2026-03-15 08:30',
    versao: '2.0'
  },
  {
    codigo: 'IND-TG-03',
    nome: 'Taxa de Gravidade (TG)',
    definicao: 'Número de dias perdidos e dias debitados resultantes de acidentes por milhão de horas-homem de exposição ao risco (NBR 14280).',
    formula: 'TG = (Dias Perdidos e Debitados * 1.000.000) / HHT',
    unidade: 'Dias Perdidos / 1M HHT',
    fonte: 'Serviço Médico Ocupacional (Atestados) + HHT',
    periodicidade: 'Mensal consolidada',
    meta: 'TG <= 15.0',
    limiteCritico: 'TG > 40.0',
    dataOwner: 'Médico Coordenador do PCMSO / Eng. SST',
    ultimaAtualizacao: '2026-03-15 08:30',
    versao: '2.0'
  },
  {
    codigo: 'IND-DSA-04',
    nome: 'Dias Sem Acidentes com Afastamento',
    definicao: 'Contagem sequencial de dias corridos transcorridos desde o último acidente que acarretou incapacidade temporária ou permanente para o trabalho.',
    formula: 'Dias Corridos desde a data do último CPT registrado',
    unidade: 'Dias',
    fonte: 'Banco Central de Ocorrências SST',
    periodicidade: 'Diária automática',
    meta: '>= 180 dias contínuos',
    limiteCritico: '< 30 dias',
    dataOwner: 'Comitê CIPA e Gestor SST',
    ultimaAtualizacao: '2026-03-15 00:01',
    versao: '1.2'
  },
  {
    codigo: 'IND-ISSST-05',
    nome: 'Índice de Saúde SST (ISSST)',
    definicao: 'Indicador estratégico composto multidimensional que quantifica a maturidade preventiva e a conformidade legal do sistema de gestão.',
    formula: 'ISSST = Σ (wi * Si) normalizado na escala 0 a 100',
    unidade: 'Pontos (0 a 100)',
    fonte: 'Algoritmo PROJECTAI integrando 6 módulos operacionais',
    periodicidade: 'Tempo real com recálculo automático em filtro',
    meta: 'ISSST >= 85.0 (Excelente)',
    limiteCritico: 'ISSST < 60.0 (Crítico)',
    dataOwner: 'Diretoria Industrial & Gerência Executiva SST',
    ultimaAtualizacao: '2026-03-15 10:15',
    versao: '2.0.0'
  },
  {
    codigo: 'IND-CONF-06',
    nome: 'Taxa de Conformidade de Inspeções',
    definicao: 'Percentual de itens avaliados em campo que atendem integralmente aos requisitos das Normas Regulamentadoras aplicáveis.',
    formula: 'Taxa (%) = (Itens Conformes / Total de Itens Inspecionados) * 100',
    unidade: '%',
    fonte: 'Checklists Digitais de Inspeção em Campo',
    periodicidade: 'Semanal / Mensal',
    meta: '>= 95.0%',
    limiteCritico: '< 85.0%',
    dataOwner: 'Supervisores de Área e Técnicos de Segurança',
    ultimaAtualizacao: '2026-03-14 17:00',
    versao: '1.5'
  },
  {
    codigo: 'IND-AP-07',
    nome: 'Taxa de Ações no Prazo (5W2H)',
    definicao: 'Eficiência de execução dos planos de ação corretiva e preventiva dentro do cronograma acordado.',
    formula: 'Taxa (%) = (Ações Concluídas no Prazo / Total de Ações Concluídas) * 100',
    unidade: '%',
    fonte: 'Módulo de Gestão de Ações 5W2H',
    periodicidade: 'Quinzenal',
    meta: '>= 90.0%',
    limiteCritico: '< 75.0%',
    dataOwner: 'Líderes de Processo e Donos das Ações',
    ultimaAtualizacao: '2026-03-15 08:30',
    versao: '2.0'
  },
  {
    codigo: 'IND-TR-08',
    nome: 'Cobertura e Regularidade de Treinamentos',
    definicao: 'Proporção de colaboradores ativos que possuem todas as capacitações obrigatórias de NRs válidas e dentro do prazo regulamentar.',
    formula: 'Cobertura (%) = (Colaboradores com Certificados Vigentes / Colaboradores Obrigatórios) * 100',
    unidade: '%',
    fonte: 'Matriz de Treinamento SST / RH',
    periodicidade: 'Mensal',
    meta: '>= 98.0%',
    limiteCritico: '< 90.0%',
    dataOwner: 'Recursos Humanos & Treinamento Técnico',
    ultimaAtualizacao: '2026-03-15 09:00',
    versao: '1.8'
  },
  {
    codigo: 'IND-DOC-09',
    nome: 'Vigência e Conformidade Documental Legal',
    definicao: 'Percentual de laudos e programas regulamentares (PGR, PCMSO, LTCAT, Laudo Ergonômico, AVCB) com validade vigente.',
    formula: 'Conformidade (%) = (Laudos Vigentes / Total de Laudos Obrigatórios) * 100',
    unidade: '%',
    fonte: 'Repositório de Documentos Regulamentares SST',
    periodicidade: 'Mensal',
    meta: '100.0%',
    limiteCritico: '< 100.0%',
    dataOwner: 'Engenheiro de Segurança Responsável Técnico',
    ultimaAtualizacao: '2026-03-15 09:00',
    versao: '1.0'
  },
  {
    codigo: 'IND-RC-10',
    nome: 'Riscos Críticos sob Controle',
    definicao: 'Quantidade absoluta de riscos de severidade alta com probabilidade média/alta que ainda não possuem barreira física permanente instalada.',
    formula: 'Total de Riscos com Nível >= 6 em status "Crítico Sem Barreira"',
    unidade: 'Riscos Críticos (nº)',
    fonte: 'Matriz de Riscos Operacionais NR-01 (Inventário de Riscos)',
    periodicidade: 'Semanal',
    meta: '0 riscos sem barreira',
    limiteCritico: '> 0',
    dataOwner: 'Comitê Central de Gestão de Riscos',
    ultimaAtualizacao: '2026-03-15 10:00',
    versao: '2.1'
  }
];

export const MOCK_TEMPORAL_DATA = [
  { mes: 'Out/25', acidentes: 1, quaseAcidentes: 3, taxaFrequencia: 5.9, taxaGravidade: 71.0, inspecoesConformidade: 89, acoesConcluidas: 12, acoesAtrasadas: 3 },
  { mes: 'Nov/25', acidentes: 0, quaseAcidentes: 4, taxaFrequencia: 0.0, taxaGravidade: 0.0, inspecoesConformidade: 91, acoesConcluidas: 14, acoesAtrasadas: 2 },
  { mes: 'Dez/25', acidentes: 0, quaseAcidentes: 2, taxaFrequencia: 0.0, taxaGravidade: 0.0, inspecoesConformidade: 94, acoesConcluidas: 16, acoesAtrasadas: 1 },
  { mes: 'Jan/26', acidentes: 1, quaseAcidentes: 3, taxaFrequencia: 5.9, taxaGravidade: 0.0, inspecoesConformidade: 92, acoesConcluidas: 15, acoesAtrasadas: 2 },
  { mes: 'Fev/26', acidentes: 0, quaseAcidentes: 5, taxaFrequencia: 0.0, taxaGravidade: 0.0, inspecoesConformidade: 88, acoesConcluidas: 11, acoesAtrasadas: 4 },
  { mes: 'Mar/26', acidentes: 0, quaseAcidentes: 1, taxaFrequencia: 0.0, taxaGravidade: 0.0, inspecoesConformidade: 93, acoesConcluidas: 8, acoesAtrasadas: 2 },
];

export const MOCK_AUDITORIA_LOGS: AuditoriaLog[] = [
  {
    id: 'AUD-2026-0982',
    usuario: 'Nicolas Herrera (Fundador / Admin)',
    cargo: 'Engenheiro Industrial / Admin',
    dataHora: '2026-03-15 11:20:14',
    acao: 'EDICAO',
    entidade: 'Indicador',
    registroId: 'IND-TF-02',
    valorAnterior: 'Meta: <= 2.5',
    novoValor: 'Meta: <= 2.0',
    detalhes: 'Revisão da meta corporativa de Taxa de Frequência para aderência ao plano Zero Acidente.',
    ipOrigem: '192.168.1.45'
  },
  {
    id: 'AUD-2026-0981',
    usuario: 'Ricardo Mansur (Gestor SST)',
    cargo: 'Engenheiro de Segurança do Trabalho',
    dataHora: '2026-03-15 10:45:00',
    acao: 'STATUS_ACAO',
    entidade: 'Ação 5W2H',
    registroId: 'ACT-089',
    valorAnterior: 'Status: Em andamento',
    novoValor: 'Status: Atrasada',
    detalhes: 'Prazo estipulado para instalação da cortina ótica na Prensa 04 extrapolado em 14 dias.',
    ipOrigem: '192.168.1.102'
  },
  {
    id: 'AUD-2026-0980',
    usuario: 'Amanda Vasconcellos (Técnica SST)',
    cargo: 'Técnica de Segurança',
    dataHora: '2026-03-14 16:30:22',
    acao: 'CRIACAO',
    entidade: 'Ocorrência',
    registroId: 'OC-2026-042',
    detalhes: 'Abertura de registro de quase-acidente na Prensa Hidráulica 04 por aproximação de zona de risco.',
    ipOrigem: '192.168.2.18'
  },
  {
    id: 'AUD-2026-0979',
    usuario: 'Sistema de Integração RH',
    cargo: 'Serviço Automático (API)',
    dataHora: '2026-03-14 06:00:00',
    acao: 'IMPORTACAO',
    entidade: 'Treinamento',
    registroId: 'BATCH-TR-202603',
    detalhes: 'Sincronização automática de 48 registros de reciclagem de NR-10 e NR-35 do módulo de RH.',
    ipOrigem: '10.0.0.15'
  },
  {
    id: 'AUD-2026-0978',
    usuario: 'Carlos Eduardo Prates',
    cargo: 'Engenheiro SST',
    dataHora: '2026-03-13 14:15:30',
    acao: 'STATUS_ACAO',
    entidade: 'Ação 5W2H',
    registroId: 'ACT-065',
    valorAnterior: 'Status: Em andamento',
    novoValor: 'Status: Concluída',
    detalhes: 'Homologação e anexo de laudo técnico de vazão comprovando adequação da cabine de pintura.',
    ipOrigem: '192.168.1.88'
  },
  {
    id: 'AUD-2026-0977',
    usuario: 'Diretoria Industrial',
    cargo: 'Diretor de Operações',
    dataHora: '2026-03-12 09:10:00',
    acao: 'EXPORTACAO',
    entidade: 'Sistema',
    registroId: 'REL-EXEC-2026Q1',
    detalhes: 'Exportação consolidada de relatório executivo em PDF para reunião do comitê de riscos.',
    ipOrigem: '192.168.0.12'
  }
];

export const MOCK_DATA_QUALITY: DataQualityReport = {
  scoreGeral: 97.4,
  status: 'Atualizado',
  totalRegistrosAvaliados: 412,
  registrosCompletos: 401,
  camposObrigatoriosVazios: 0,
  duplicidadesDetectadas: 1,
  datasInconsistentes: 2,
  valoresForaIntervalo: 0,
  ultimaVerificacao: '2026-03-15 11:30',
  fontesAuditadas: [
    {
      nome: 'Módulo de Ocorrências e CAT (Interno)',
      status: 'Atualizado',
      registros: 18,
      ultimaSincronizacao: '2026-03-15 11:15'
    },
    {
      nome: 'Ponto Eletrônico & HHT (RH Folha)',
      status: 'Atualizado',
      registros: 550000,
      ultimaSincronizacao: '2026-03-15 08:00'
    },
    {
      nome: 'Matriz de Treinamentos (SST & Senai)',
      status: 'Atualizado',
      registros: 142,
      ultimaSincronizacao: '2026-03-14 06:00'
    },
    {
      nome: 'Repositório de Laudos (PGR, PCMSO, LTCAT)',
      status: 'Atualizado',
      registros: 12,
      ultimaSincronizacao: '2026-03-10 14:00'
    },
    {
      nome: 'Checklists de Inspeção Móvel (Auditor)',
      status: 'Atualizado',
      registros: 34,
      ultimaSincronizacao: '2026-03-15 10:20'
    }
  ]
};

export const MOCK_ALERT_RULES: AlertRule[] = [
  {
    id: 'RUL-001',
    nome: 'Gatilho de Risco Crítico Sem Barreira',
    condicao: 'risco.nivel >= 6 E risco.status == "Crítico Sem Barreira"',
    operador: '>=',
    threshold: 'Nível 6',
    severidade: 'Crítico',
    destinatario: 'SESMT, Gerência da Planta e Engenheiro Responsável',
    acaoSugerida: 'Emissão imediata de PT (Permissão de Trabalho) ou interdição preventiva até contenção.',
    frequencia: 'Tempo Real',
    ativo: true,
    dataCriacao: '2026-01-10',
    versao: '2.0'
  },
  {
    id: 'RUL-002',
    nome: 'Alerta de Ação 5W2H Atrasada',
    condicao: 'acao.status == "Atrasada" E acao.prioridade in ["Alta", "Crítica"]',
    operador: '==',
    threshold: 'Dias de atraso > 0',
    severidade: 'Crítico',
    destinatario: 'Responsável pela ação e Gestor Geral SST',
    acaoSugerida: 'Convocar reunião de alinhamento com a manutenção e repactuar cronograma com validação técnica.',
    frequencia: 'Diária',
    ativo: true,
    dataCriacao: '2026-01-10',
    versao: '1.4'
  },
  {
    id: 'RUL-003',
    nome: 'Aviso Prévio de Vencimento de Treinamento Obrigatório',
    condicao: 'treinamento.diasParaVencer <= 30 E treinamento.status != "Vencido"',
    operador: '<=',
    threshold: '30 dias',
    severidade: 'Atenção',
    destinatario: 'RH, Supervisor Imediato e Colaborador',
    acaoSugerida: 'Agendar colaborador na próxima turma de reciclagem para evitar suspensão de atividade de risco.',
    frequencia: 'Semanal',
    ativo: true,
    dataCriacao: '2026-02-01',
    versao: '1.2'
  },
  {
    id: 'RUL-004',
    nome: 'Laudo ou Documento Regulamentar Vencido (PGR/PCMSO/LTCAT)',
    condicao: 'documento.diasParaVencer <= 0',
    operador: '<=',
    threshold: '0 dias',
    severidade: 'Crítico',
    destinatario: 'Coordenação SST e Diretoria Jurídica',
    acaoSugerida: 'Validar renovação emergencial de laudo técnico com emissão de ART atualizada.',
    frequencia: 'Tempo Real',
    ativo: true,
    dataCriacao: '2026-01-15',
    versao: '1.0'
  },
  {
    id: 'RUL-005',
    nome: 'Desvio de Taxa de Conformidade em Inspeções',
    condicao: 'inspecao.taxaConformidade < 90.0%',
    operador: '<',
    threshold: '90.0%',
    severidade: 'Alto',
    destinatario: 'Supervisor da Área Inspecionada e Auditor SST',
    acaoSugerida: 'Abertura de plano de ação corretivo 5W2H para todos os itens pontuados como não conformes.',
    frequencia: 'Tempo Real',
    ativo: true,
    dataCriacao: '2026-02-15',
    versao: '1.1'
  }
];

