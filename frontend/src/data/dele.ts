// Guia DELE (Diploma de Español como Lengua Extranjera)
// Conteúdo migrado das seções "Materiais de Apoio" de A1 e A2 para
// centralizar tudo sobre o exame oficial em um só lugar.

export type DeleBlock =
  | { kind: "heading"; text: string; textEn?: string }
  | { kind: "paragraph"; text: string; textEn?: string }
  | { kind: "list"; items: string[]; itemsEn?: string[] }
  | { kind: "tip"; text: string; textEn?: string }
  | {
      kind: "table";
      headers: string[];
      headersEn?: string[];
      rows: string[][];
    };

export interface DeleSection {
  id: string;
  title: string;
  titleEn?: string;
  blocks: DeleBlock[];
}

export interface DeleCourse {
  id: string; // slug used in URLs
  level: string; // "A1" | "A2" ...
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  duration: string; // e.g. "≈ 1h 15min"
  passScore: string; // "60/100"
  sections: DeleSection[];
}

export const DELE_COURSES: DeleCourse[] = [
  {
    id: "dele-a1",
    level: "A1",
    title: "DELE A1 — Certificação oficial",
    titleEn: "DELE A1 — Official certification",
    description:
      "Guia completo da prova oficial do Instituto Cervantes para o nível A1: formato, critérios e dicas de preparação.",
    descriptionEn:
      "Complete guide for the Instituto Cervantes A1 official exam: format, criteria and preparation tips.",
    duration: "≈ 1h 45min",
    passScore: "60/100",
    sections: [
      {
        id: "a1-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE A1 (Diploma de Español como Lengua Extranjera, nível A1) é o certificado oficial do Instituto Cervantes que atesta o domínio básico do espanhol.",
            textEn:
              "The DELE A1 is the official Instituto Cervantes diploma certifying basic Spanish.",
          },
        ],
      },
      {
        id: "a1-formato",
        title: "Formato do exame (4 provas)",
        titleEn: "Exam format (4 tests)",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Conteúdo"],
            rows: [
              [
                "1. Comprensión de lectura",
                "45 min",
                "4 tarefas: cartazes, e-mails curtos, anúncios, texto pessoal",
              ],
              [
                "2. Comprensión auditiva",
                "20 min",
                "4 tarefas: diálogos curtos, mensagens, anúncios públicos",
              ],
              [
                "3. Expresión e interacción escritas",
                "25 min",
                "2 tarefas: completar formulário e escrever uma carta/mensagem (~30 palavras)",
              ],
              [
                "4. Expresión e interacción orales",
                "15 min (+15 prep.)",
                "4 tarefas: apresentação pessoal, exposição de tema, descrição de foto e diálogo com o examinador",
              ],
            ],
          },
        ],
      },
      {
        id: "a1-criterios",
        title: "Critérios de avaliação",
        titleEn: "Scoring criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação total: 100 pontos (50 por grupo: Leitura+Escrita / Audição+Oral).",
              "Mínimo para aprovação: 60/100 no total E pelo menos 30/50 em cada grupo.",
              "Resultado: APTO ou NO APTO (sem nota numérica).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
          },
        ],
      },
      {
        id: "a1-dicas",
        title: "Dicas de preparação",
        titleEn: "Preparation tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Faça pelo menos 2 simulados completos cronometrados antes do exame real.",
              "Pratique a parte oral em voz alta — grave-se e ouça depois.",
              "Para a Tarefa 4 (carta), memorize estruturas fixas: 'Hola, ¿qué tal? Te escribo para…', 'Un abrazo'.",
              "Treine ditados curtos para melhorar a compreensão auditiva.",
              "Aprenda os números, datas e horas de cor — caem em todas as edições.",
              "No dia: chegue 30 min antes, leve documento de identidade e caneta azul/preta.",
            ],
          },
          {
            kind: "tip",
            text: "O A1 é o ponto de partida da certificação oficial. Após o A1 você pode seguir para o DELE A2 e depois B1, B2, C1 e C2.",
            textEn: "A1 is the starting point of the official certification path.",
          },
        ],
      },
      {
        id: "a1-praticas",
        title: "Informações práticas",
        titleEn: "Practical info",
        blocks: [
          {
            kind: "list",
            items: [
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países.",
              "Custo aproximado: 100-130 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
              "Site oficial: examenes.cervantes.es",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dele-a2",
    level: "A2",
    title: "DELE A2 — Certificação oficial",
    titleEn: "DELE A2 — Official certification",
    description:
      "Tudo sobre o exame DELE A2: formato detalhado, critérios por seção, dicas específicas e simulado modelo da prova.",
    descriptionEn:
      "Everything about the DELE A2 exam: detailed format, section criteria, specific tips and a mock test model.",
    duration: "≈ 2h 40min",
    passScore: "60/100",
    sections: [
      {
        id: "a2-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE (Diploma de Español como Lengua Extranjera) é o certificado oficial emitido pelo Instituto Cervantes em nome do Ministério da Educação da Espanha. Tem validade internacional e vitalícia.",
            textEn:
              "DELE is the official Spanish proficiency certificate from Instituto Cervantes — internationally recognized and lifelong.",
          },
        ],
      },
      {
        id: "a2-formato",
        title: "Formato do exame DELE A2",
        titleEn: "DELE A2 exam format",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
            rows: [
              ["1. Compreensão de leitura", "60 min", "4 tarefas / 25 itens", "25"],
              ["2. Compreensão auditiva", "35 min", "4 tarefas / 25 itens", "25"],
              [
                "3. Expressão e interação escritas",
                "50 min",
                "2 tarefas (carta + texto descritivo)",
                "25",
              ],
              [
                "4. Expressão e interação orais",
                "15 min (+12 prep.)",
                "4 tarefas (monólogo, descrição de foto, diálogo simulado, conversa)",
                "25",
              ],
            ],
          },
        ],
      },
      {
        id: "a2-criterios",
        title: "Critérios de aprovação",
        titleEn: "Pass criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
            ],
          },
        ],
      },
      {
        id: "a2-secao",
        title: "Avaliação por seção — o que esperam de você",
        titleEn: "What each section evaluates",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: avisos, e-mails curtos, anúncios, notas, textos informativos breves. Estratégia: leia primeiro a pergunta, depois o texto.",
              "AUDIÇÃO: conversas curtas, mensagens, anúncios em estação/loja, monólogos. Os áudios são reproduzidos 2 vezes.",
              "ESCRITA — Tarefa 1: carta/e-mail informal (60-70 palavras). Tarefa 2: texto descritivo ou narrativo a partir de instruções (70-80 palavras). Avaliam: adequação, coerência, correção, alcance.",
              "ORAL — Tarefa 1: monólogo sobre tema cotidiano (2-3 min). Tarefa 2: descrição de fotografia (2-3 min). Tarefa 3: diálogo simulado com examinador (3-4 min). Tarefa 4: conversa sobre Tarefa 2.",
            ],
          },
        ],
      },
      {
        id: "a2-dicas",
        title: "Dicas específicas de preparação",
        titleEn: "Specific prep tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Pratique Indefinido e Imperfecto: aparecem em quase todas as tarefas escritas e orais.",
              "Domine fórmulas de carta informal: 'Hola [nombre], ¿qué tal? / Te escribo para... / Un abrazo / Hasta pronto'.",
              "Para descrever fotografias: use 'En la foto veo... / Hay... / En el primer plano... / Al fondo... / Las personas están + gerundio / Parece que...'.",
              "Aprenda fórmulas para o diálogo simulado: pedir/dar informação, fazer reservas, marcar consultas, comprar bilhetes.",
              "Vocabulário-chave: viagens, saúde, compras, trabalho, rotina, tempo livre, clima, família.",
              "Treine com simulados oficiais do Instituto Cervantes (examenes.cervantes.es) — modelos gratuitos disponíveis.",
              "Cronometre todos os simulados — o tempo é apertado, especialmente na escrita.",
              "No oral: fale com naturalidade, não decore textos longos (o examinador percebe). Use conectores básicos (porque, además, pero, entonces).",
            ],
          },
          {
            kind: "tip",
            text: "Antes do exame faça pelo menos 2 simulados completos cronometrados em condições reais. Isso reduz drasticamente o nervosismo no dia.",
            textEn: "Do at least 2 full timed mocks before the exam to reduce anxiety.",
          },
        ],
      },
      {
        id: "a2-simulado",
        title: "Simulado DELE A2 — modelo da prova",
        titleEn: "DELE A2 mock exam — test model",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (45 min)",
            textEn: "Section 1 — Reading (45 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 avisos/anúncios curtos e associar com afirmações.",
              "Exercício 2: ler texto descritivo/narrativo (150-200 palavras) e responder múltipla escolha.",
              "Exercício 3: ler correspondência (e-mail/carta) e completar formulário.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (30 min)",
            textEn: "Section 2 — Listening (30 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 conversas muito curtas e associar com imagens.",
              "Exercício 2: ouvir diálogo e marcar verdadeiro/falso/não mencionado.",
              "Exercício 3: ouvir instruções e completar tabela.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (50 min)",
            textEn: "Section 3 — Writing (50 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: preencher formulário com dados pessoais e respostas curtas.",
              "Exercício 2: escrever mensagem/e-mail (60-80 palavras) respondendo a um anúncio.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (12 min)",
            textEn: "Section 4 — Speaking (12 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: apresentar e valorizar um documento (gráfico, foto, texto curto).",
              "Tarefa 2: dar e pedir informações em situação cotidiana.",
              "Tarefa 3: dar opinião sobre um tema a partir de imagens.",
            ],
          },
        ],
      },
      {
        id: "a2-inscricao",
        title: "Onde se inscrever",
        titleEn: "How to register",
        blocks: [
          {
            kind: "list",
            items: [
              "Site oficial: examenes.cervantes.es",
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países — busque o mais próximo no site.",
              "Custo aproximado: 110-160 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dele-b1",
    level: "B1",
    title: "DELE B1 — Certificação oficial",
    titleEn: "DELE B1 — Official certification",
    description:
      "Guia completo do exame DELE B1: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível intermédio.",
    descriptionEn:
      "Complete guide for the DELE B1 exam: detailed format, section criteria, advanced tips and a mock test model for the intermediate level.",
    duration: "≈ 3h 40min",
    passScore: "60/100",
    sections: [
      {
        id: "b1-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE B1 (Diploma de Español como Lengua Extranjera, nível B1) certifica a competência intermédia em espanhol. O candidato deve ser capaz de compreender os pontos principais de textos e conversas, produzir textos simples e coerentes, e descrever experiências, eventos, sonhos e ambições.",
            textEn:
              "The DELE B1 certifies intermediate competence in Spanish. The candidate must understand main points of texts and conversations, produce simple coherent texts, and describe experiences, events, dreams and ambitions.",
          },
        ],
      },
      {
        id: "b1-formato",
        title: "Formato do exame DELE B1",
        titleEn: "DELE B1 exam format",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
            headersEn: ["Test", "Duration", "Tasks", "Points"],
            rows: [
              [
                "1. Compreensão de leitura",
                "70 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "2. Compreensão auditiva",
                "40 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "3. Expressão e interação escritas",
                "60 min",
                "2 tarefas (texto expositivo + carta formal/informal)",
                "25",
              ],
              [
                "4. Expressão e interação orais",
                "15 min (+15 prep.)",
                "4 tarefas (monólogo, diálogo, conversa, expressão de opinião)",
                "25",
              ],
            ],
          },
        ],
      },
      {
        id: "b1-criterios",
        title: "Critérios de aprovação",
        titleEn: "Pass criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
            itemsEn: [
              "Minimum score: 60/100 overall.",
              "You must score at least 30/50 in EACH group: (Reading + Writing) and (Listening + Speaking).",
              "Result: PASS or FAIL (no numerical grade on the diploma).",
              "Lifelong diploma, internationally recognized.",
            ],
          },
        ],
      },
      {
        id: "b1-secao",
        title: "Avaliação por seção — o que esperam de você",
        titleEn: "What each section evaluates",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos informativos, narrativos e opinativos (300-400 palavras). Estratégia: leia as perguntas antes, identifique conectores e referentes.",
              "AUDIÇÃO: conversas, entrevistas, mensagens e instruções. Os áudios são reproduzidos 2 vezes. Atenção aos conectores e à entonação.",
              "ESCRITA — Tarefa 1: texto expositivo/argumentativo (120-150 palavras) sobre tema geral. Tarefa 2: carta/e-mail formal ou informal (100-120 palavras) respondendo a uma situação. Avaliam: adequação, coerência, coesão, correção e alcance.",
              "ORAL — Tarefa 1: monólogo preparado sobre tema cotidiano (2-3 min). Tarefa 2: diálogo simulado com o examinador (3-4 min). Tarefa 3: conversa sobre Tarefa 2. Tarefa 4: expressão de opinião a partir de imagens ou afirmações.",
            ],
            itemsEn: [
              "READING: informative, narrative and opinion texts (300-400 words). Strategy: read questions first, identify connectors and references.",
              "LISTENING: conversations, interviews, messages and instructions. Audio is played twice. Pay attention to connectors and intonation.",
              "WRITING — Task 1: expository/argumentative text (120-150 words) on a general topic. Task 2: formal or informal letter/e-mail (100-120 words) responding to a situation. Evaluated: adequacy, coherence, cohesion, correctness and range.",
              "SPEAKING — Task 1: prepared monologue on an everyday topic (2-3 min). Task 2: simulated dialogue with the examiner (3-4 min). Task 3: conversation about Task 2. Task 4: expressing an opinion based on images or statements.",
            ],
          },
        ],
      },
      {
        id: "b1-dicas",
        title: "Dicas específicas de preparação",
        titleEn: "Specific prep tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine o Subjuntivo e o Condicional: são obrigatórios no B1 e aparecem em todas as provas.",
              "Pratique conectores avançados (sin embargo, por lo tanto, en cuanto a, a pesar de, aunque) para elevar a coesão dos seus textos.",
              "Texto argumentativo: use estrutura clara (introdução + argumentos + conclusão) e exemplos concretos.",
              "Carta formal: memorize fórmulas ('Estimado/a señor/a:', 'Me pongo en contacto con usted para...', 'Le saluda atentamente').",
              "Carta informal: use registro próprio, perguntas pessoais e despedidas naturais ('¿Qué tal la familia?', 'Un abrazo fuerte').",
              "Audição: treine com podcasts de notícias e entrevistas em velocidade real. Anote palavras-chave na primeira audição.",
              "Oral: prepare 5 temas genéricos (trabalho, viagens, tecnologia, meio ambiente, educação) e pratique argumentar a favor e contra.",
              "Vocabulário-chave: expressões de opinião (desde mi punto de vista, me parece que), hipóteses (si fuera..., en caso de que) e comparativos.",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real.",
              "No dia: leia atentamente os enunciados, gerencie o tempo (a escrita é mais longa no B1) e revise antes de entregar.",
            ],
            itemsEn: [
              "Master the Subjunctive and Conditional: they are required at B1 and appear in every test.",
              "Practice advanced connectors (sin embargo, por lo tanto, en cuanto a, a pesar de, aunque) to boost text cohesion.",
              "Argumentative text: use a clear structure (introduction + arguments + conclusion) and concrete examples.",
              "Formal letter: memorize formulas ('Estimado/a señor/a:', 'Me pongo en contacto con usted para...', 'Le saluda atentamente').",
              "Informal letter: use natural register, personal questions and closings ('¿Qué tal la familia?', 'Un abrazo fuerte').",
              "Listening: practice with news podcasts and interviews at real speed. Note keywords on the first play.",
              "Speaking: prepare 5 generic topics (work, travel, technology, environment, education) and practice arguing for and against.",
              "Key vocabulary: opinion expressions (desde mi punto de vista, me parece que), hypotheses (si fuera..., en caso de que) and comparatives.",
              "Do at least 3 full timed mock exams before the real test.",
              "On exam day: read prompts carefully, manage time (writing is longer at B1) and review before submitting.",
            ],
          },
          {
            kind: "tip",
            text: "O salto do A2 para o B1 é significativo: o B1 exige autonomia linguística, textos mais longos e argumentação. Invista tempo na prática de produção escrita e oral.",
            textEn: "The leap from A2 to B1 is significant: B1 requires linguistic autonomy, longer texts and argumentation. Invest time in written and spoken production practice.",
          },
        ],
      },
      {
        id: "b1-simulado",
        title: "Simulado DELE B1 — modelo da prova",
        titleEn: "DELE B1 mock exam — test model",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (70 min)",
            textEn: "Section 1 — Reading (70 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 5 textos curtos (anúncios, e-mails, notícias) e associar com afirmações.",
              "Exercício 2: ler texto opinativo (300-350 palavras) e responder múltipla escolha.",
              "Exercício 3: completar texto com frases desordenadas.",
              "Exercício 4: ler correspondência formal/informal e responder perguntas de compreensão.",
              "Exercício 5: identificar referentes e conectores em texto narrativo.",
            ],
            itemsEn: [
              "Exercise 1: read 5 short texts (ads, e-mails, news) and match with statements.",
              "Exercise 2: read an opinion text (300-350 words) and answer multiple choice.",
              "Exercise 3: complete a text with jumbled sentences.",
              "Exercise 4: read a formal/informal letter and answer comprehension questions.",
              "Exercise 5: identify references and connectors in a narrative text.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (40 min)",
            textEn: "Section 2 — Listening (40 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 conversas curtas e associar com imagens ou afirmações.",
              "Exercício 2: ouvir entrevista e marcar verdadeiro/falso/não mencionado.",
              "Exercício 3: ouvir instruções e completar formulário ou tabela.",
              "Exercício 4: ouvir monólogo/opinião e responder múltipla escolha.",
              "Exercício 5: ouvir diálogo e identificar intenção ou atitude do locutor.",
            ],
            itemsEn: [
              "Exercise 1: listen to 6 short conversations and match with images or statements.",
              "Exercise 2: listen to an interview and mark true/false/not mentioned.",
              "Exercise 3: listen to instructions and complete a form or table.",
              "Exercise 4: listen to a monologue/opinion and answer multiple choice.",
              "Exercise 5: listen to a dialogue and identify the speaker's intention or attitude.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (60 min)",
            textEn: "Section 3 — Writing (60 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto expositivo ou argumentativo (120-150 palavras) sobre tema de interesse geral. Deve ter introdução, desenvolvimento e conclusão.",
              "Tarefa 2: escrever carta ou e-mail (100-120 palavras) respondendo a um anúncio, reclamação, pedido ou convite. Atente ao registro (formal vs. informal).",
            ],
            itemsEn: [
              "Task 1: write an expository or argumentative text (120-150 words) on a topic of general interest. Must include introduction, development and conclusion.",
              "Task 2: write a letter or e-mail (100-120 words) responding to an ad, complaint, request or invitation. Pay attention to register (formal vs. informal).",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (15 min + 15 prep.)",
            textEn: "Section 4 — Speaking (15 min + 15 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: monólogo preparado (2-3 min) sobre tema cotidiano apresentado no exame. Estruture em introdução, exemplos e conclusão.",
              "Tarefa 2: diálogo simulado com o examinador (3-4 min) em situação prática (reservas, reclamações, pedidos de informação).",
              "Tarefa 3: conversa sobre a Tarefa 2, aprofundando detalhes e motivações.",
              "Tarefa 4: expressão de opinião (2-3 min) a partir de imagens ou afirmações. Use conectores e exemplos concretos.",
            ],
            itemsEn: [
              "Task 1: prepared monologue (2-3 min) on an everyday topic given in the exam. Structure with introduction, examples and conclusion.",
              "Task 2: simulated dialogue with the examiner (3-4 min) in a practical situation (bookings, complaints, information requests).",
              "Task 3: conversation about Task 2, deepening details and motivations.",
              "Task 4: expressing an opinion (2-3 min) based on images or statements. Use connectors and concrete examples.",
            ],
          },
        ],
      },
      {
        id: "b1-inscricao",
        title: "Onde se inscrever",
        titleEn: "How to register",
        blocks: [
          {
            kind: "list",
            items: [
              "Site oficial: examenes.cervantes.es",
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países — busque o mais próximo no site.",
              "Custo aproximado: 160-210 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
            ],
            itemsEn: [
              "Official website: examenes.cervantes.es",
              "Exam sessions: several per year (usually February, May, July, September, November).",
              "Exam centers: present in more than 100 countries — find the nearest on the website.",
              "Approximate cost: 160-210 € (varies by country).",
              "Result: released in ~3 months; physical diploma in ~6-8 months.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dele-b2",
    level: "B2",
    title: "DELE B2 — Certificação oficial",
    titleEn: "DELE B2 — Official certification",
    description:
      "Guia completo do exame DELE B2: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível avançado.",
    descriptionEn:
      "Complete guide for the DELE B2 exam: detailed format, section criteria, advanced tips and a mock test model for the upper-intermediate level.",
    duration: "≈ 4h 20min",
    passScore: "60/100",
    sections: [
      {
        id: "b2-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE B2 (Diploma de Español como Lengua Extranjera, nível B2) certifica a competência avançada em espanhol. O candidato deve ser capaz de interagir com fluidez e espontaneidade, compreender textos complexos, produzir textos claros e bem estruturados, e defender um ponto de vista com argumentos sólidos.",
            textEn:
              "The DELE B2 certifies upper-intermediate competence in Spanish. The candidate must interact with fluency and spontaneity, understand complex texts, produce clear and well-structured texts, and defend a point of view with solid arguments.",
          },
        ],
      },
      {
        id: "b2-formato",
        title: "Formato do exame DELE B2",
        titleEn: "DELE B2 exam format",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
            headersEn: ["Test", "Duration", "Tasks", "Points"],
            rows: [
              [
                "1. Compreensão de leitura",
                "70 min",
                "4 tarefas / 30 itens",
                "25",
              ],
              [
                "2. Compreensão auditiva",
                "40 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "3. Expressão e interação escritas",
                "80 min",
                "2 tarefas (texto argumentativo + carta/artigo)",
                "25",
              ],
              [
                "4. Expressão e interação orais",
                "20 min (+20 prep.)",
                "3 tarefas (monólogo, diálogo, debate)",
                "25",
              ],
            ],
          },
        ],
      },
      {
        id: "b2-criterios",
        title: "Critérios de aprovação",
        titleEn: "Pass criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
            itemsEn: [
              "Minimum score: 60/100 overall.",
              "You must score at least 30/50 in EACH group: (Reading + Writing) and (Listening + Speaking).",
              "Result: PASS or FAIL (no numerical grade on the diploma).",
              "Lifelong diploma, internationally recognized.",
            ],
          },
        ],
      },
      {
        id: "b2-secao",
        title: "Avaliação por seção — o que esperam de você",
        titleEn: "What each section evaluates",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos extensos (400-500 palavras), opinativos, narrativos e informativos. Estratégia: leia as perguntas antes, identifique conectores, referentes e tom do autor.",
              "AUDIÇÃO: conversas, entrevistas, debates, instruções e mensagens em velocidade natural. Os áudios são reproduzidos 2 vezes. Atenção à entonação, conectores e intenção do locutor.",
              "ESCRITA — Tarefa 1: texto argumentativo (150-200 palavras) sobre tema de interesse geral. Tarefa 2: carta formal, artigo de opinião ou resposta a uma situação (150-200 palavras). Avaliam: adequação, coerência, coesão, correção e alcance lexical.",
              "ORAL — Tarefa 1: exposição preparada (3-4 min) sobre tema dado no exame. Tarefa 2: diálogo com o examinador sobre o tema da Tarefa 1 (3-4 min). Tarefa 3: debate sobre um tema diferente, defendendo uma posição (3-4 min).",
            ],
            itemsEn: [
              "READING: long texts (400-500 words), opinion, narrative and informative. Strategy: read questions first, identify connectors, references and author's tone.",
              "LISTENING: conversations, interviews, debates, instructions and messages at natural speed. Audio is played twice. Pay attention to intonation, connectors and speaker's intention.",
              "WRITING — Task 1: argumentative text (150-200 words) on a topic of general interest. Task 2: formal letter, opinion article or response to a situation (150-200 words). Evaluated: adequacy, coherence, cohesion, correctness and lexical range.",
              "SPEAKING — Task 1: prepared presentation (3-4 min) on a topic given in the exam. Task 2: dialogue with the examiner about Task 1 (3-4 min). Task 3: debate on a different topic, defending a position (3-4 min).",
            ],
          },
        ],
      },
      {
        id: "b2-dicas",
        title: "Dicas específicas de preparatorização de preparação",
        titleEn: "Specific prep tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine o Subjuntivo Imperfecto e Pluscuamperfecto — são obrigatórios no B2.",
              "Pratique condicionais mistos (pasado→presente e presente→pasado).",
              "Use conectores formais avançados (no obstante, dado que, por consiguiente, en cuanto a) para elevar a coesão.",
              "Texto argumentativo: estrutura clara (introdução + 3 argumentos + contraargumento + conclusão) com exemplos concretos.",
              "Carta formal: fórmulas fixas ('Estimado/a señor/a:', 'Le escribo en relación a...', 'Le saluda atentamente').",
              "Audição: treine com podcasts de notícias, entrevistas e debates em velocidade real. Anote palavras-chave na primeira audição.",
              "Oral: prepare 5 temas genéricos (tecnologia, meio ambiente, educação, saúde, cultura) e pratique argumentar a favor e contra com exemplos.",
              "Vocabulário-chave: expressões de opinião (a mi juicio, en mi opinión, desde mi punto de vista), hipóteses (en caso de que, a menos que, siempre que) e modalizadores (al parecer, por lo visto, que yo sepa).",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real.",
              "No dia: leia atentamente os enunciados, gerencie o tempo (a escrita é mais longa no B2) e revise antes de entregar.",
            ],
            itemsEn: [
              "Master the Imperfect and Pluperfect Subjunctive — they are required at B2.",
              "Practice mixed conditionals (past→present and present→past).",
              "Use advanced formal connectors (no obstante, dado que, por consiguiente, en cuanto a) to boost cohesion.",
              "Argumentative text: clear structure (introduction + 3 arguments + counterargument + conclusion) with concrete examples.",
              "Formal letter: memorize formulas ('Estimado/a señor/a:', 'Le escribo en relación a...', 'Le saluda atentamente').",
              "Listening: practice with news podcasts, interviews and debates at real speed. Note keywords on the first play.",
              "Speaking: prepare 5 generic topics (technology, environment, education, health, culture) and practice arguing for and against with examples.",
              "Key vocabulary: opinion expressions (a mi juicio, en mi opinión, desde mi punto de vista), hypotheses (en caso de que, a menos que, siempre que) and modalizers (al parecer, por lo visto, que yo sepa).",
              "Do at least 3 full timed mock exams before the real test.",
              "On exam day: read prompts carefully, manage time (writing is longer at B2) and review before submitting.",
            ],
          },
          {
            kind: "tip",
            text: "O B2 exige autonomia linguística completa, textos longos e argumentação sólida. Invista tempo na prática de produção escrita e oral com feedback.",
            textEn: "B2 requires full linguistic autonomy, long texts and solid argumentation. Invest time in written and spoken production practice with feedback.",
          },
        ],
      },
      {
        id: "b2-simulado",
        title: "Simulado DELE B2 — modelo da prova",
        titleEn: "DELE B2 mock exam — test model",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (70 min)",
            textEn: "Section 1 — Reading (70 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos curtos (anúncios, e-mails, notícias) e associar com afirmações.",
              "Exercício 2: ler texto opinativo (400-450 palavras) e responder múltipla escolha.",
              "Exercício 3: completar texto com frases desordenadas.",
              "Exercício 4: ler correspondência formal e responder perguntas de compreensão detalhada.",
            ],
            itemsEn: [
              "Exercise 1: read 6 short texts (ads, e-mails, news) and match with statements.",
              "Exercise 2: read an opinion text (400-450 words) and answer multiple choice.",
              "Exercise 3: complete a text with jumbled sentences.",
              "Exercise 4: read a formal letter and answer detailed comprehension questions.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (40 min)",
            textEn: "Section 2 — Listening (40 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 conversas curtas e associar com imagens ou afirmações.",
              "Exercício 2: ouvir entrevista e marcar verdadeiro/falso/não mencionado.",
              "Exercício 3: ouvir instruções e completar formulário ou tabela.",
              "Exercício 4: ouvir monólogo/opinião e responder múltipla escolha.",
              "Exercício 5: ouvir debate e identificar posição de cada interlocutor.",
            ],
            itemsEn: [
              "Exercise 1: listen to 6 short conversations and match with images or statements.",
              "Exercise 2: listen to an interview and mark true/false/not mentioned.",
              "Exercise 3: listen to instructions and complete a form or table.",
              "Exercise 4: listen to a monologue/opinion and answer multiple choice.",
              "Exercise 5: listen to a debate and identify each speaker's position.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (80 min)",
            textEn: "Section 3 — Writing (80 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (150-200 palavras) sobre tema de interesse geral. Deve ter introdução, desenvolvimento com argumentos e conclusão.",
              "Tarefa 2: escrever carta formal, artigo de opinião ou resposta a uma situação (150-200 palavras). Atente ao registro e à estrutura.",
            ],
            itemsEn: [
              "Task 1: write an argumentative text (150-200 words) on a topic of general interest. Must include introduction, argument development and conclusion.",
              "Task 2: write a formal letter, opinion article or response to a situation (150-200 words). Pay attention to register and structure.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
            textEn: "Section 4 — Speaking (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (3-4 min) sobre tema dado no exame. Estruture em introdução, exemplos e conclusão.",
              "Tarefa 2: diálogo com o examinador (3-4 min) sobre o tema da Tarefa 1, aprofundando detalhes e motivações.",
              "Tarefa 3: debate (3-4 min) sobre tema diferente, defendendo uma posição com argumentos e exemplos.",
            ],
            itemsEn: [
              "Task 1: prepared presentation (3-4 min) on a topic given in the exam. Structure with introduction, examples and conclusion.",
              "Task 2: dialogue with the examiner (3-4 min) about Task 1, deepening details and motivations.",
              "Task 3: debate (3-4 min) on a different topic, defending a position with arguments and examples.",
            ],
          },
        ],
      },
      {
        id: "b2-inscricao",
        title: "Onde se inscrever",
        titleEn: "How to register",
        blocks: [
          {
            kind: "list",
            items: [
              "Site oficial: examenes.cervantes.es",
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países — busque o mais próximo no site.",
              "Custo aproximado: 180-250 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
            ],
            itemsEn: [
              "Official website: examenes.cervantes.es",
              "Exam sessions: several per year (usually February, May, July, September, November).",
              "Exam centers: present in more than 100 countries — find the nearest on the website.",
              "Approximate cost: 180-250 € (varies by country).",
              "Result: released in ~3 months; physical diploma in ~6-8 months.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dele-c1",
    level: "C1",
    title: "DELE C1 — Certificação oficial",
    titleEn: "DELE C1 — Official certification",
    description:
      "Guia completo do exame DELE C1: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível de domínio operativo eficaz.",
    descriptionEn:
      "Complete guide for the DELE C1 exam: detailed format, section criteria, advanced tips and a mock test model for effective operational mastery.",
    duration: "≈ 4h 45min",
    passScore: "60/100",
    sections: [
      {
        id: "c1-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE C1 (Diploma de Español como Lengua Extranjera, nível C1) certifica um domínio operativo eficaz do espanhol. O candidato deve ser capaz de compreender textos longos e complexos, expressar-se com fluidez e espontaneidade, utilizar o idioma de forma flexível em contextos sociais, académicos e profissionais, e produzir textos claros, bem estruturados e de tom adequado.",
            textEn:
              "The DELE C1 certifies effective operational command of Spanish. The candidate must understand long and complex texts, express themselves with fluency and spontaneity, use the language flexibly in social, academic and professional contexts, and produce clear, well-structured texts with an appropriate tone.",
          },
        ],
      },
      {
        id: "c1-formato",
        title: "Formato do exame DELE C1",
        titleEn: "DELE C1 exam format",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
            headersEn: ["Test", "Duration", "Tasks", "Points"],
            rows: [
              [
                "1. Compreensão de leitura",
                "90 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "2. Compreensão auditiva",
                "50 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "3. Expressão e interação escritas",
                "80 min",
                "2 tarefas (texto argumentativo + reformulação/resposta formal)",
                "25",
              ],
              [
                "4. Expressão e interação orais",
                "20 min (+20 prep.)",
                "3 tarefas (exposição, diálogo estruturado, debate)",
                "25",
              ],
            ],
          },
        ],
      },
      {
        id: "c1-criterios",
        title: "Critérios de aprovação",
        titleEn: "Pass criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
            itemsEn: [
              "Minimum score: 60/100 overall.",
              "You must score at least 30/50 in EACH group: (Reading + Writing) and (Listening + Speaking).",
              "Result: PASS or FAIL (no numerical grade on the diploma).",
              "Lifelong diploma, internationally recognized.",
            ],
          },
        ],
      },
      {
        id: "c1-secao",
        title: "Avaliação por seção — o que esperam de você",
        titleEn: "What each section evaluates",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos complexos e extensos (500-700 palavras) de diferentes registos (literário, jornalístico, académico). Estratégia: identifique a tese, os argumentos, o tom e as inferências; domine conectores sofisticados e referentes encadeados.",
              "AUDIÇÃO: entrevistas, conferências, debates, palestras e conversas informais em velocidade natural. Os áudios são reproduzidos 2 vezes. Atenção aos registos, ironias, implícitos e funções comunicativas.",
              "ESCRITA — Tarefa 1: texto argumentativo (150-200 palavras) sobre tema de ordem geral, com posição clara, argumentos bem fundamentaldos e conclusão consistente. Tarefa 2: reformulação, resposta formal ou texto expositivo (150-200 palavras) a partir de uma situação. Avaliam: precisão, riqueza lexical, adequação registal, coesão e coerência.",
              "ORAL — Tarefa 1: exposição preparada (4-5 min) sobre tema dado no exame, com introdução, desenvolvimento e conclusão. Tarefa 2: diálogo estruturado com o examinador (4-5 min) sobre o tema da Tarefa 1, aprofundando ideias e exemplos. Tarefa 3: debate (4-5 min) sobre um tema diferente, defendendo uma posição com argumentos, exemplos e contra-argumentos.",
            ],
            itemsEn: [
              "READING: complex and long texts (500-700 words) in different registers (literary, journalistic, academic). Strategy: identify the thesis, arguments, tone and inferences; master sophisticated connectors and chained references.",
              "LISTENING: interviews, conferences, debates, lectures and informal conversations at natural speed. Audio is played twice. Pay attention to registers, irony, implicit meaning and communicative functions.",
              "WRITING — Task 1: argumentative text (150-200 words) on a general topic, with a clear position, well-founded arguments and a consistent conclusion. Task 2: reformulation, formal response or expository text (150-200 words) based on a situation. Evaluated: accuracy, lexical richness, register adequacy, cohesion and coherence.",
              "SPEAKING — Task 1: prepared presentation (4-5 min) on a topic given in the exam, with introduction, development and conclusion. Task 2: structured dialogue with the examiner (4-5 min) about Task 1, deepening ideas and examples. Task 3: debate (4-5 min) on a different topic, defending a position with arguments, examples and counter-arguments.",
            ],
          },
        ],
      },
      {
        id: "c1-dicas",
        title: "Dicas específicas de preparação",
        titleEn: "Specific prep tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine todos os tempos do Subjuntivo e as estruturas de relativo (cuyo, el cual, quien, lo que) em contextos formais.",
              "Pratique o uso de orações concessivas, condicionais e finais sofisticadas (aun cuando, siempre y cuando, con tal de que, para que, de modo que).",
              "Amplie o vocabulário abstracto e académico: nominações (sufixos -ción, -miento, -aje), latinismos (a priori, ex officio, sine qua non) e expressões idiomáticas cultas.",
              "Treine a leitura de textos jornalísticos e ensaios: resuma argumentos, reconheça tom e identifique falácias ou pressupostos.",
              "Escrita argumentativa: estruture com tese, antítese, síntese; use exemplos concretos, dados e citações; evite repetições com sinónimos e referentes.",
              "Audição: ouça podcasts, rádio e conferências em velocidade real; pratique notas em português/inglês e reconstituição do discurso.",
              "Oral: prepare argumentos de ambos os lados de temas controversos (tecnologia, ética, ambiente, migração, cultura) e pratique a reformulação e a cortesia discursiva.",
              "Registo: distingua formal, informal e neutro; domine fórmulas de abertura e encerramento em correspondência académica e profissional.",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real, incluindo a prova oral gravada.",
              "No dia: gerencie bem o tempo, especialmente na leitura (90 min é longa mas exige atenção constante); revise concordância, tempos verbais e pontuação.",
            ],
            itemsEn: [
              "Master all Subjunctive tenses and relative structures (cuyo, el cual, quien, lo que) in formal contexts.",
              "Practice sophisticated concessive, conditional and final clauses (aun cuando, siempre y cuando, con tal de que, para que, de modo que).",
              "Expand abstract and academic vocabulary: nominalizations (-ción, -miento, -aje suffixes), Latinisms (a priori, ex officio, sine qua non) and cultured idioms.",
              "Train with journalistic texts and essays: summarize arguments, recognize tone and identify fallacies or assumptions.",
              "Argumentative writing: structure with thesis, antithesis, synthesis; use concrete examples, data and quotes; avoid repetition through synonyms and references.",
              "Listening: listen to podcasts, radio and lectures at real speed; practice note-taking and speech reconstruction.",
              "Speaking: prepare arguments on both sides of controversial topics (technology, ethics, environment, migration, culture) and practice reformulation and discourse politeness.",
              "Register: distinguish formal, informal and neutral; master opening and closing formulas in academic and professional correspondence.",
              "Do at least 3 full timed mock exams before the real test, including a recorded speaking test.",
              "On exam day: manage time well, especially in reading (90 min is long but requires constant attention); review agreement, verb tenses and punctuation.",
            ],
          },
          {
            kind: "tip",
            text: "O C1 exige não só conhecimento avançado da gramática e do léxico, mas também pensamento crítico e autonomia comunicativa. Invista em leitura de textos complexos e na prática oral com feedback qualificado.",
            textEn: "C1 requires not only advanced grammar and vocabulary knowledge, but also critical thinking and communicative autonomy. Invest in reading complex texts and speaking practice with qualified feedback.",
          },
        ],
      },
      {
        id: "c1-simulado",
        title: "Simulado DELE C1 — modelo da prova",
        titleEn: "DELE C1 mock exam — test model",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (90 min)",
            textEn: "Section 1 — Reading (90 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos extensos (anúncios, crónicas, críticas) e associar com afirmações ou reações.",
              "Exercício 2: ler texto opinativo ou ensaístico (500-600 palavras) e responder múltipla escolha com inferências.",
              "Exercício 3: completar texto com frases desordenadas, identificando referentes e conectores lógicos.",
              "Exercício 4: ler correspondência formal/académica e responder perguntas de compreensão detalhada.",
              "Exercício 5: identificar o tom, o propósito e a posição do autor em textos de diferentes registos.",
            ],
            itemsEn: [
              "Exercise 1: read 6 long texts (ads, chronicles, reviews) and match with statements or reactions.",
              "Exercise 2: read an opinion or essay text (500-600 words) and answer multiple-choice inference questions.",
              "Exercise 3: complete a text with jumbled sentences, identifying references and logical connectors.",
              "Exercise 4: read a formal/academic letter and answer detailed comprehension questions.",
              "Exercise 5: identify tone, purpose and author position in texts from different registers.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (50 min)",
            textEn: "Section 2 — Listening (50 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 excertos curtos e associar com imagens, afirmações ou intenção do locutor.",
              "Exercício 2: ouvir entrevista e marcar verdadeiro/falso/não mencionado com justificação implícita.",
              "Exercício 3: ouvir conferência ou palestra e completar notas, tabela ou esquema.",
              "Exercício 4: ouvir debate e identificar a posição e os argumentos de cada interlocutor.",
              "Exercício 5: ouvir conversa informal e inferir atitudes, relações entre os interlocutores e contexto.",
            ],
            itemsEn: [
              "Exercise 1: listen to 6 short excerpts and match with images, statements or speaker intention.",
              "Exercise 2: listen to an interview and mark true/false/not mentioned with implicit justification.",
              "Exercise 3: listen to a lecture or presentation and complete notes, a table or a diagram.",
              "Exercise 4: listen to a debate and identify each speaker's position and arguments.",
              "Exercise 5: listen to an informal conversation and infer attitudes, relationships between speakers and context.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (80 min)",
            textEn: "Section 3 — Writing (80 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (150-200 palavras) sobre tema de interesse geral. Estruture em tese, argumentos fundamentados e conclusão.",
              "Tarefa 2: escrever resposta formal, artigo de opinião ou reformulação de documento (150-200 palavras). Atente ao registo, à coesão e ao alcance lexical.",
            ],
            itemsEn: [
              "Task 1: write an argumentative text (150-200 words) on a topic of general interest. Structure with thesis, well-founded arguments and conclusion.",
              "Task 2: write a formal response, opinion article or document reformulation (150-200 words). Pay attention to register, cohesion and lexical range.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
            textEn: "Section 4 — Speaking (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (4-5 min) sobre tema dado no exame. Estruture em introdução, desenvolvimento com exemplos e conclusão.",
              "Tarefa 2: diálogo estruturado com o examinador (4-5 min) sobre o tema da Tarefa 1, aprofundando detalhes e implicações.",
              "Tarefa 3: debate (4-5 min) sobre tema diferente, defendendo uma posição com argumentos, exemplos e contra-argumentos, usando conectores formais.",
            ],
            itemsEn: [
              "Task 1: prepared presentation (4-5 min) on a topic given in the exam. Structure with introduction, development with examples and conclusion.",
              "Task 2: structured dialogue with the examiner (4-5 min) about Task 1, deepening details and implications.",
              "Task 3: debate (4-5 min) on a different topic, defending a position with arguments, examples and counter-arguments, using formal connectors.",
            ],
          },
        ],
      },
      {
        id: "c1-inscricao",
        title: "Onde se inscrever",
        titleEn: "How to register",
        blocks: [
          {
            kind: "list",
            items: [
              "Site oficial: examenes.cervantes.es",
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países — busque o mais próximo no site.",
              "Custo aproximado: 200-280 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
            ],
            itemsEn: [
              "Official website: examenes.cervantes.es",
              "Exam sessions: several per year (usually February, May, July, September, November).",
              "Exam centers: present in more than 100 countries — find the nearest on the website.",
              "Approximate cost: 200-280 € (varies by country).",
              "Result: released in ~3 months; physical diploma in ~6-8 months.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "dele-c2",
    level: "C2",
    title: "DELE C2 — Certificação oficial",
    titleEn: "DELE C2 — Official certification",
    description:
      "Guia completo do exame DELE C2: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível de domínio pleno do espanhol.",
    descriptionEn:
      "Complete guide for the DELE C2 exam: detailed format, section criteria, advanced tips and a mock test model for full mastery of Spanish.",
    duration: "≈ 5h 10min",
    passScore: "60/100",
    sections: [
      {
        id: "c2-intro",
        title: "Sobre o exame",
        titleEn: "About the exam",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE C2 (Diploma de Español como Lengua Extranjera, nível C2) certifica um domínio pleno do espanhol, equivalente ao nível de um falante nativo culto. O candidato deve ser capaz de compreender com facilidade praticamente tudo o que ouve ou lê, sintetizar informações, reconstruir argumentos e apresentá-los de forma coerente, e expressar-se de modo espontâneo, muito fluente e preciso, diferenciando matizes de significado mesmo em situações complexas.",
            textEn:
              "The DELE C2 certifies full mastery of Spanish, equivalent to an educated native speaker. The candidate must understand almost everything heard or read with ease, synthesize information, reconstruct arguments and present them coherently, and express themselves spontaneously, very fluently and precisely, distinguishing shades of meaning even in complex situations.",
          },
        ],
      },
      {
        id: "c2-formato",
        title: "Formato do exame DELE C2",
        titleEn: "DELE C2 exam format",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
            headersEn: ["Test", "Duration", "Tasks", "Points"],
            rows: [
              [
                "1. Compreensão de leitura",
                "105 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "2. Compreensão auditiva",
                "55 min",
                "5 tarefas / 30 itens",
                "25",
              ],
              [
                "3. Expressão e interação escritas",
                "90 min",
                "2 tarefas (texto argumentativo + reformulação/análise crítica)",
                "25",
              ],
              [
                "4. Expressão e interação orais",
                "20 min (+20 prep.)",
                "3 tarefas (exposição, diálogo aprofundado, debate)",
                "25",
              ],
            ],
          },
        ],
      },
      {
        id: "c2-criterios",
        title: "Critérios de aprovação",
        titleEn: "Pass criteria",
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
            itemsEn: [
              "Minimum score: 60/100 overall.",
              "You must score at least 30/50 in EACH group: (Reading + Writing) and (Listening + Speaking).",
              "Result: PASS or FAIL (no numerical grade on the diploma).",
              "Lifelong diploma, internationally recognized.",
            ],
          },
        ],
      },
      {
        id: "c2-secao",
        title: "Avaliação por seção — o que esperam de você",
        titleEn: "What each section evaluates",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos complexos, extensos e de alta densidade argumentativa (600-900 palavras), incluindo ensaios, artigos académicos, literários e jurídico-administrativos. Estratégia: identifique a tese central, a estrutura retórica, inferências profundas, pressupostos implícitos e o registo do autor.",
              "AUDIÇÃO: conferências, palestras académicas, debates televisivos, entrevistas jornalísticas, diálogos coloquiais e registos orais variados em velocidade natural. Os áudios são reproduzidos 2 vezes. Exige-se compreensão de implícitos, ironia, atitudes, relações de poder e funções comunicativas sutis.",
              "ESCRITA — Tarefa 1: texto argumentativo (200-250 palavras) sobre tema abstracto ou de ordem geral, com posição clara, argumentos sólidos, dados, exemplos e conclusão consistente. Tarefa 2: reformulação, síntese crítica, análise ou resposta formal (200-250 palavras) a partir de um documento complexo. Avaliam: precisão gramatical, riqueza lexical, adequação registal, coesão sofisticada, coerência e originalidade argumentativa.",
              "ORAL — Tarefa 1: exposição preparada (5-6 min) sobre tema dado no exame, com introdução contextualizada, desenvolvimento argumentado e conclusão. Tarefa 2: diálogo aprofundado com o examinador (5-6 min) sobre o tema da Tarefa 1, explorando nuances, implicações e exemplos. Tarefa 3: debate (5-6 min) sobre um tema diferente, defendendo e matizando uma posição com argumentos, contra-argumentos e conectores formais.",
            ],
            itemsEn: [
              "READING: complex, long and highly argumentative texts (600-900 words), including essays, academic articles, literary and legal-administrative texts. Strategy: identify the central thesis, rhetorical structure, deep inferences, implicit assumptions and the author's register.",
              "LISTENING: conferences, academic lectures, televised debates, journalistic interviews, colloquial dialogues and varied oral registers at natural speed. Audio is played twice. The exam requires understanding of implicit meaning, irony, attitudes, power relations and subtle communicative functions.",
              "WRITING — Task 1: argumentative text (200-250 words) on an abstract or general topic, with a clear position, solid arguments, data, examples and a consistent conclusion. Task 2: reformulation, critical synthesis, analysis or formal response (200-250 words) based on a complex document. Evaluated: grammatical accuracy, lexical richness, register adequacy, sophisticated cohesion, coherence and argumentative originality.",
              "SPEAKING — Task 1: prepared presentation (5-6 min) on a topic given in the exam, with a contextualized introduction, argued development and conclusion. Task 2: in-depth dialogue with the examiner (5-6 min) about Task 1, exploring nuances, implications and examples. Task 3: debate (5-6 min) on a different topic, defending and nuancing a position with arguments, counter-arguments and formal connectors.",
            ],
          },
        ],
      },
      {
        id: "c2-dicas",
        title: "Dicas específicas de preparação",
        titleEn: "Specific prep tips",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine todos os tempos do Modo Subjuntivo, as formas arcaicas do Futuro Subjuntivo (-re) em textos jurídicos e literários, e as perífrases verbais avançadas (haber de, deber de, llegar a, acabar de, dejar de).",
              "Pratique estruturas de relativo cultas (cuyo, el cual, quien, lo que, cualesquiera que sean) e orações concessivas, condicionais, finais, consecutivas e modais sofisticadas.",
              "Amplie o vocabulário de registo elevado: latinismos (a priori, ipso facto, sui generis, mutatis mutandis), cultismos, terminologia académica, jurídica, filosófica e literária.",
              "Treine a reformulação e a síntese: leia textos complexos e reescreva-os de forma concisa sem perder a tese nem os argumentos principais.",
              "Escrita argumentativa: use estrutura dialectal (tese, antítese, síntese), dados, exemplos históricos ou actuais, citações e conectores de alta formalidade (no obstante, con todo, por el contrario, en consecuencia, en lo que respecto a).",
              "Audição: ouça conferências académicas, programas de rádio de análise política e entrevistas a especialistas; pratique notas hierárquicas e reconstrução oral do conteúdo.",
              "Oral: prepare temas abstractos (ética, estética, política, ciência, identidade, globalização) e pratique argumentar com nuances, reconhecer falácias, reformular e usar cortesia estratégica.",
              "Registo e estilo: distingua formal culto, formal neutro, informal e coloquial; domine transições registrais e adaptação ao interlocutor.",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real, incluindo gravação da prova oral com revisão detalhada.",
              "No dia: gerencie o tempo com disciplina, especialmente na leitura (105 min exige concentração prolongada); revise concordância, tempos verbais, registo e pontuação antes de entregar.",
            ],
            itemsEn: [
              "Master all Subjunctive tenses, archaic Future Subjunctive forms (-re) in legal and literary texts, and advanced verbal periphrases (haber de, deber de, llegar a, acabar de, dejar de).",
              "Practice cultured relative structures (cuyo, el cual, quien, lo que, cualesquiera que sean) and sophisticated concessive, conditional, final, consecutive and modal clauses.",
              "Expand high-register vocabulary: Latinisms (a priori, ipso facto, sui generis, mutatis mutandis), learned words, academic, legal, philosophical and literary terminology.",
              "Train reformulation and synthesis: read complex texts and rewrite them concisely without losing the thesis or main arguments.",
              "Argumentative writing: use dialectical structure (thesis, antithesis, synthesis), data, historical or current examples, quotes and high-formality connectors (no obstante, con todo, por el contrario, en consecuencia, en lo que respecto a).",
              "Listening: listen to academic lectures, political analysis radio shows and expert interviews; practice hierarchical note-taking and oral reconstruction of content.",
              "Speaking: prepare abstract topics (ethics, aesthetics, politics, science, identity, globalization) and practice arguing with nuance, recognizing fallacies, reformulating and using strategic politeness.",
              "Register and style: distinguish educated formal, neutral formal, informal and colloquial registers; master register transitions and adaptation to the interlocutor.",
              "Do at least 3 full timed mock exams before the real test, including recording and detailed review of the speaking test.",
              "On exam day: manage time with discipline, especially in reading (105 min requires prolonged concentration); review agreement, verb tenses, register and punctuation before submitting.",
            ],
          },
          {
            kind: "tip",
            text: "O C2 exige não só competência linguística excepcional, mas também cultura geral, pensamento crítico e capacidade de argumentação sofisticada. Leia ensaios, opinião e literatura; pratique a oralidade com feedback rigoroso.",
            textEn: "C2 requires not only exceptional linguistic competence, but also general knowledge, critical thinking and sophisticated argumentation skills. Read essays, opinion pieces and literature; practice speaking with rigorous feedback.",
          },
        ],
      },
      {
        id: "c2-simulado",
        title: "Simulado DELE C2 — modelo da prova",
        titleEn: "DELE C2 mock exam — test model",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (105 min)",
            textEn: "Section 1 — Reading (105 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos complexos (ensaios, editoriais, críticas literárias) e associar com afirmações, reações ou inferências.",
              "Exercício 2: ler texto ensaístico ou académico (700-900 palavras) e responder múltipla escolha com inferências e análise de tom.",
              "Exercício 3: completar texto com frases desordenadas, identificando referentes encadeados, conectores lógicos e progressão argumentativa.",
              "Exercício 4: ler correspondência formal, jurídica ou académica e responder perguntas de compreensão detalhada e de intenção.",
              "Exercício 5: identificar o tom, o propósito, a linha argumentativa e eventuais falácias ou pressupostos em textos de diferentes registos.",
            ],
            itemsEn: [
              "Exercise 1: read 6 complex texts (essays, editorials, literary reviews) and match with statements, reactions or inferences.",
              "Exercise 2: read an essay or academic text (700-900 words) and answer multiple-choice questions involving inference and tone analysis.",
              "Exercise 3: complete a text with jumbled sentences, identifying chained references, logical connectors and argumentative progression.",
              "Exercise 4: read a formal, legal or academic letter and answer detailed comprehension and intention questions.",
              "Exercise 5: identify tone, purpose, argumentative line and possible fallacies or assumptions in texts from different registers.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (55 min)",
            textEn: "Section 2 — Listening (55 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 excertos curtos de registos variados e associar com intenção, atitude ou contexto sociocultural.",
              "Exercício 2: ouvir entrevista jornalística e marcar verdadeiro/falso/não mencionado, justificando inferências.",
              "Exercício 3: ouvir conferência académica ou palestra e completar notas, esquema ou tabela com informações implícitas.",
              "Exercício 4: ouvir debate televisivo e identificar posições, argumentos, estratégias retóricas e relações entre interlocutores.",
              "Exercício 5: ouvir diálogo coloquial ou literário e inferir atitudes, subtextos, relações de poder e matizes de significado.",
            ],
            itemsEn: [
              "Exercise 1: listen to 6 short excerpts from varied registers and match with intention, attitude or sociocultural context.",
              "Exercise 2: listen to a journalistic interview and mark true/false/not mentioned, justifying inferences.",
              "Exercise 3: listen to an academic lecture or presentation and complete notes, a diagram or table with implicit information.",
              "Exercise 4: listen to a televised debate and identify positions, arguments, rhetorical strategies and relationships between speakers.",
              "Exercise 5: listen to a colloquial or literary dialogue and infer attitudes, subtexts, power relations and shades of meaning.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (90 min)",
            textEn: "Section 3 — Writing (90 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (200-250 palavras) sobre tema abstracto de ordem geral. Estruture em tese, antítese, argumentos fundamentados com dados/exemplos e conclusão sintética.",
              "Tarefa 2: escrever reformulação, síntese crítica, análise de documento ou resposta formal (200-250 palavras). Atente ao registo elevado, à coesão sofisticada e ao alcance lexical.",
            ],
            itemsEn: [
              "Task 1: write an argumentative text (200-250 words) on an abstract topic of general interest. Structure with thesis, antithesis, well-founded arguments with data/examples and a synthetic conclusion.",
              "Task 2: write a reformulation, critical synthesis, document analysis or formal response (200-250 words). Pay attention to high register, sophisticated cohesion and lexical range.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
            textEn: "Section 4 — Speaking (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (5-6 min) sobre tema dado no exame. Estruture em introdução contextualizada, desenvolvimento argumentado com exemplos e conclusão.",
              "Tarefa 2: diálogo aprofundado com o examinador (5-6 min) sobre o tema da Tarefa 1, explorando nuances, implicações, exemplos e contra-argumentos.",
              "Tarefa 3: debate (5-6 min) sobre tema diferente, defendendo e matizando uma posição com argumentos sólidos, exemplos concretos e conectores formais.",
            ],
            itemsEn: [
              "Task 1: prepared presentation (5-6 min) on a topic given in the exam. Structure with a contextualized introduction, argued development with examples and conclusion.",
              "Task 2: in-depth dialogue with the examiner (5-6 min) about Task 1, exploring nuances, implications, examples and counter-arguments.",
              "Task 3: debate (5-6 min) on a different topic, defending and nuancing a position with solid arguments, concrete examples and formal connectors.",
            ],
          },
        ],
      },
      {
        id: "c2-inscricao",
        title: "Onde se inscrever",
        titleEn: "How to register",
        blocks: [
          {
            kind: "list",
            items: [
              "Site oficial: examenes.cervantes.es",
              "Convocatórias: várias por ano (geralmente fevereiro, maio, julho, setembro, novembro).",
              "Centros examinadores: presentes em mais de 100 países — busque o mais próximo no site.",
              "Custo aproximado: 220-310 € (varia por país).",
              "Resultado: divulgado em ~3 meses; diploma físico em ~6-8 meses.",
            ],
            itemsEn: [
              "Official website: examenes.cervantes.es",
              "Exam sessions: several per year (usually February, May, July, September, November).",
              "Exam centers: present in more than 100 countries — find the nearest on the website.",
              "Approximate cost: 220-310 € (varies by country).",
              "Result: released in ~3 months; physical diploma in ~6-8 months.",
            ],
          },
        ],
      },
    ],
  },
];

export const getDeleCourse = (id: string) =>
  DELE_COURSES.find((c) => c.id === id);
