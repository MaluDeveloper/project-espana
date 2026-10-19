// Guia DELE (Diploma de Español como Lengua Extranjera)
// Conteúdo migrado das seções "Materiais de Apoio" de A1 e A2 para
// centralizar tudo sobre o exame oficial em um só lugar.

export type DeleBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "tip"; text: string }
  | {
      kind: "table";
      headers: string[];
      rows: string[][];
    };

export interface DeleSection {
  id: string;
  title: string;
  blocks: DeleBlock[];
}

export interface DeleCourse {
  id: string; // slug used in URLs
  level: string; // "A1" | "A2" ...
  title: string;
  description: string;
  duration: string; // e.g. "≈ 1h 15min"
  passScore: string; // "60/100"
  sections: DeleSection[];
}

export const DELE_COURSES: DeleCourse[] = [
  {
    id: "dele-a1",
    level: "A1",
    title: "DELE A1 — Certificação oficial",
    description:
      "Guia completo da prova oficial do Instituto Cervantes para o nível A1: formato, critérios e dicas de preparação.",
    duration: "≈ 1h 45min",
    passScore: "60/100",
    sections: [
      {
        id: "a1-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE A1 (Diploma de Español como Lengua Extranjera, nível A1) é o certificado oficial do Instituto Cervantes que atesta o domínio básico do espanhol.",
          },
        ],
      },
      {
        id: "a1-formato",
        title: "Formato do exame (4 provas)",
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
          },
        ],
      },
      {
        id: "a1-praticas",
        title: "Informações práticas",
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
    description:
      "Tudo sobre o exame DELE A2: formato detalhado, critérios por seção, dicas específicas e simulado modelo da prova.",
    duration: "≈ 2h 40min",
    passScore: "60/100",
    sections: [
      {
        id: "a2-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE (Diploma de Español como Lengua Extranjera) é o certificado oficial emitido pelo Instituto Cervantes em nome do Ministério da Educação da Espanha. Tem validade internacional e vitalícia.",
          },
        ],
      },
      {
        id: "a2-formato",
        title: "Formato do exame DELE A2",
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
          },
        ],
      },
      {
        id: "a2-simulado",
        title: "Simulado DELE A2 — modelo da prova",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (45 min)",
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
    description:
      "Guia completo do exame DELE B1: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível intermédio.",
    duration: "≈ 3h 40min",
    passScore: "60/100",
    sections: [
      {
        id: "b1-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE B1 (Diploma de Español como Lengua Extranjera, nível B1) certifica a competência intermédia em espanhol. O candidato deve ser capaz de compreender os pontos principais de textos e conversas, produzir textos simples e coerentes, e descrever experiências, eventos, sonhos e ambições.",
          },
        ],
      },
      {
        id: "b1-formato",
        title: "Formato do exame DELE B1",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
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
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
          },
        ],
      },
      {
        id: "b1-secao",
        title: "Avaliação por seção — o que esperam de você",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos informativos, narrativos e opinativos (300-400 palavras). Estratégia: leia as perguntas antes, identifique conectores e referentes.",
              "AUDIÇÃO: conversas, entrevistas, mensagens e instruções. Os áudios são reproduzidos 2 vezes. Atenção aos conectores e à entonação.",
              "ESCRITA — Tarefa 1: texto expositivo/argumentativo (120-150 palavras) sobre tema geral. Tarefa 2: carta/e-mail formal ou informal (100-120 palavras) respondendo a uma situação. Avaliam: adequação, coerência, coesão, correção e alcance.",
              "ORAL — Tarefa 1: monólogo preparado sobre tema cotidiano (2-3 min). Tarefa 2: diálogo simulado com o examinador (3-4 min). Tarefa 3: conversa sobre Tarefa 2. Tarefa 4: expressão de opinião a partir de imagens ou afirmações.",
            ],
          },
        ],
      },
      {
        id: "b1-dicas",
        title: "Dicas específicas de preparação",
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
          },
          {
            kind: "tip",
            text: "O salto do A2 para o B1 é significativo: o B1 exige autonomia linguística, textos mais longos e argumentação. Invista tempo na prática de produção escrita e oral.",
          },
        ],
      },
      {
        id: "b1-simulado",
        title: "Simulado DELE B1 — modelo da prova",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (70 min)",
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
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (40 min)",
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
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (60 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto expositivo ou argumentativo (120-150 palavras) sobre tema de interesse geral. Deve ter introdução, desenvolvimento e conclusão.",
              "Tarefa 2: escrever carta ou e-mail (100-120 palavras) respondendo a um anúncio, reclamação, pedido ou convite. Atente ao registro (formal vs. informal).",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (15 min + 15 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: monólogo preparado (2-3 min) sobre tema cotidiano apresentado no exame. Estruture em introdução, exemplos e conclusão.",
              "Tarefa 2: diálogo simulado com o examinador (3-4 min) em situação prática (reservas, reclamações, pedidos de informação).",
              "Tarefa 3: conversa sobre a Tarefa 2, aprofundando detalhes e motivações.",
              "Tarefa 4: expressão de opinião (2-3 min) a partir de imagens ou afirmações. Use conectores e exemplos concretos.",
            ],
          },
        ],
      },
      {
        id: "b1-inscricao",
        title: "Onde se inscrever",
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
          },
        ],
      },
    ],
  },
  {
    id: "dele-b2",
    level: "B2",
    title: "DELE B2 — Certificação oficial",
    description:
      "Guia completo do exame DELE B2: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível avançado.",
    duration: "≈ 4h 20min",
    passScore: "60/100",
    sections: [
      {
        id: "b2-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE B2 (Diploma de Español como Lengua Extranjera, nível B2) certifica a competência avançada em espanhol. O candidato deve ser capaz de interagir com fluidez e espontaneidade, compreender textos complexos, produzir textos claros e bem estruturados, e defender um ponto de vista com argumentos sólidos.",
          },
        ],
      },
      {
        id: "b2-formato",
        title: "Formato do exame DELE B2",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
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
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
          },
        ],
      },
      {
        id: "b2-secao",
        title: "Avaliação por seção — o que esperam de você",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos extensos (400-500 palavras), opinativos, narrativos e informativos. Estratégia: leia as perguntas antes, identifique conectores, referentes e tom do autor.",
              "AUDIÇÃO: conversas, entrevistas, debates, instruções e mensagens em velocidade natural. Os áudios são reproduzidos 2 vezes. Atenção à entonação, conectores e intenção do locutor.",
              "ESCRITA — Tarefa 1: texto argumentativo (150-200 palavras) sobre tema de interesse geral. Tarefa 2: carta formal, artigo de opinião ou resposta a uma situação (150-200 palavras). Avaliam: adequação, coerência, coesão, correção e alcance lexical.",
              "ORAL — Tarefa 1: exposição preparada (3-4 min) sobre tema dado no exame. Tarefa 2: diálogo com o examinador sobre o tema da Tarefa 1 (3-4 min). Tarefa 3: debate sobre um tema diferente, defendendo uma posição (3-4 min).",
            ],
          },
        ],
      },
      {
        id: "b2-dicas",
        title: "Dicas específicas de preparatorização de preparação",
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
          },
          {
            kind: "tip",
            text: "O B2 exige autonomia linguística completa, textos longos e argumentação sólida. Invista tempo na prática de produção escrita e oral com feedback.",
          },
        ],
      },
      {
        id: "b2-simulado",
        title: "Simulado DELE B2 — modelo da prova",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (70 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos curtos (anúncios, e-mails, notícias) e associar com afirmações.",
              "Exercício 2: ler texto opinativo (400-450 palavras) e responder múltipla escolha.",
              "Exercício 3: completar texto com frases desordenadas.",
              "Exercício 4: ler correspondência formal e responder perguntas de compreensão detalhada.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (40 min)",
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
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (80 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (150-200 palavras) sobre tema de interesse geral. Deve ter introdução, desenvolvimento com argumentos e conclusão.",
              "Tarefa 2: escrever carta formal, artigo de opinião ou resposta a uma situação (150-200 palavras). Atente ao registro e à estrutura.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (3-4 min) sobre tema dado no exame. Estruture em introdução, exemplos e conclusão.",
              "Tarefa 2: diálogo com o examinador (3-4 min) sobre o tema da Tarefa 1, aprofundando detalhes e motivações.",
              "Tarefa 3: debate (3-4 min) sobre tema diferente, defendendo uma posição com argumentos e exemplos.",
            ],
          },
        ],
      },
      {
        id: "b2-inscricao",
        title: "Onde se inscrever",
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
          },
        ],
      },
    ],
  },
  {
    id: "dele-c1",
    level: "C1",
    title: "DELE C1 — Certificação oficial",
    description:
      "Guia completo do exame DELE C1: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível de domínio operativo eficaz.",
    duration: "≈ 4h 45min",
    passScore: "60/100",
    sections: [
      {
        id: "c1-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE C1 (Diploma de Español como Lengua Extranjera, nível C1) certifica um domínio operativo eficaz do espanhol. O candidato deve ser capaz de compreender textos longos e complexos, expressar-se com fluidez e espontaneidade, utilizar o idioma de forma flexível em contextos sociais, acadêmicos e profissionais, e produzir textos claros, bem estruturados e de tom adequado.",
          },
        ],
      },
      {
        id: "c1-formato",
        title: "Formato do exame DELE C1",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
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
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
          },
        ],
      },
      {
        id: "c1-secao",
        title: "Avaliação por seção — o que esperam de você",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos complexos e extensos (500-700 palavras) de diferentes registros (literário, jornalístico, acadêmico). Estratégia: identifique a tese, os argumentos, o tom e as inferências; domine conectores sofisticados e referentes encadeados.",
              "AUDIÇÃO: entrevistas, conferências, debates, palestras e conversas informais em velocidade natural. Os áudios são reproduzidos 2 vezes. Atenção aos registros, ironias, implícitos e funções comunicativas.",
              "ESCRITA — Tarefa 1: texto argumentativo (150-200 palavras) sobre tema de ordem geral, com posição clara, argumentos bem fundamentaldos e conclusão consistente. Tarefa 2: reformulação, resposta formal ou texto expositivo (150-200 palavras) a partir de uma situação. Avaliam: precisão, riqueza lexical, adequação registal, coesão e coerência.",
              "ORAL — Tarefa 1: exposição preparada (4-5 min) sobre tema dado no exame, com introdução, desenvolvimento e conclusão. Tarefa 2: diálogo estruturado com o examinador (4-5 min) sobre o tema da Tarefa 1, aprofundando ideias e exemplos. Tarefa 3: debate (4-5 min) sobre um tema diferente, defendendo uma posição com argumentos, exemplos e contra-argumentos.",
            ],
          },
        ],
      },
      {
        id: "c1-dicas",
        title: "Dicas específicas de preparação",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine todos os tempos do Subjuntivo e as estruturas de relativo (cuyo, el cual, quien, lo que) em contextos formais.",
              "Pratique o uso de orações concessivas, condicionais e finais sofisticadas (aun cuando, siempre y cuando, con tal de que, para que, de modo que).",
              "Amplie o vocabulário abstrato e acadêmico: nominações (sufixos -ción, -miento, -aje), latinismos (a priori, ex officio, sine qua non) e expressões idiomáticas cultas.",
              "Treine a leitura de textos jornalísticos e ensaios: resuma argumentos, reconheça tom e identifique falácias ou pressupostos.",
              "Escrita argumentativa: estruture com tese, antítese, síntese; use exemplos concretos, dados e citações; evite repetições com sinónimos e referentes.",
              "Audição: ouça podcasts, rádio e conferências em velocidade real; pratique notas em português/inglês e reconstituição do discurso.",
              "Oral: prepare argumentos de ambos os lados de temas controversos (tecnologia, ética, ambiente, migração, cultura) e pratique a reformulação e a cortesia discursiva.",
              "Registro: distingua formal, informal e neutro; domine fórmulas de abertura e encerramento em correspondência acadêmica e profissional.",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real, incluindo a prova oral gravada.",
              "No dia: gerencie bem o tempo, especialmente na leitura (90 min é longa mas exige atenção constante); revise concordância, tempos verbais e pontuação.",
            ],
          },
          {
            kind: "tip",
            text: "O C1 exige não só conhecimento avançado da gramática e do léxico, mas também pensamento crítico e autonomia comunicativa. Invista em leitura de textos complexos e na prática oral com feedback qualificado.",
          },
        ],
      },
      {
        id: "c1-simulado",
        title: "Simulado DELE C1 — modelo da prova",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (90 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos extensos (anúncios, crônicas, críticas) e associar com afirmações ou reações.",
              "Exercício 2: ler texto opinativo ou ensaístico (500-600 palavras) e responder múltipla escolha com inferências.",
              "Exercício 3: completar texto com frases desordenadas, identificando referentes e conectores lógicos.",
              "Exercício 4: ler correspondência formal/acadêmica e responder perguntas de compreensão detalhada.",
              "Exercício 5: identificar o tom, o propósito e a posição do autor em textos de diferentes registros.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (50 min)",
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
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (80 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (150-200 palavras) sobre tema de interesse geral. Estruture em tese, argumentos fundamentados e conclusão.",
              "Tarefa 2: escrever resposta formal, artigo de opinião ou reformulação de documento (150-200 palavras). Atente ao registro, à coesão e ao alcance lexical.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (4-5 min) sobre tema dado no exame. Estruture em introdução, desenvolvimento com exemplos e conclusão.",
              "Tarefa 2: diálogo estruturado com o examinador (4-5 min) sobre o tema da Tarefa 1, aprofundando detalhes e implicações.",
              "Tarefa 3: debate (4-5 min) sobre tema diferente, defendendo uma posição com argumentos, exemplos e contra-argumentos, usando conectores formais.",
            ],
          },
        ],
      },
      {
        id: "c1-inscricao",
        title: "Onde se inscrever",
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
          },
        ],
      },
    ],
  },
  {
    id: "dele-c2",
    level: "C2",
    title: "DELE C2 — Certificação oficial",
    description:
      "Guia completo do exame DELE C2: formato detalhado, critérios por seção, dicas avançadas e modelo de simulado para o nível de domínio pleno do espanhol.",
    duration: "≈ 5h 10min",
    passScore: "60/100",
    sections: [
      {
        id: "c2-intro",
        title: "Sobre o exame",
        blocks: [
          {
            kind: "paragraph",
            text: "O DELE C2 (Diploma de Español como Lengua Extranjera, nível C2) certifica um domínio pleno do espanhol, equivalente ao nível de um falante nativo culto. O candidato deve ser capaz de compreender com facilidade praticamente tudo o que ouve ou lê, sintetizar informações, reconstruir argumentos e apresentá-los de forma coerente, e expressar-se de modo espontâneo, muito fluente e preciso, diferenciando matizes de significado mesmo em situações complexas.",
          },
        ],
      },
      {
        id: "c2-formato",
        title: "Formato do exame DELE C2",
        blocks: [
          {
            kind: "table",
            headers: ["Prova", "Duração", "Tarefas", "Pontos"],
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
        blocks: [
          {
            kind: "list",
            items: [
              "Pontuação mínima: 60/100 no total.",
              "É necessário alcançar pelo menos 30/50 em CADA grupo: (Leitura + Escrita) e (Audição + Oral).",
              "Resultado: APTO ou NO APTO (não há nota numérica visível no diploma).",
              "Diploma vitalício, reconhecido internacionalmente.",
            ],
          },
        ],
      },
      {
        id: "c2-secao",
        title: "Avaliação por seção — o que esperam de você",
        blocks: [
          {
            kind: "list",
            items: [
              "LEITURA: textos complexos, extensos e de alta densidade argumentativa (600-900 palavras), incluindo ensaios, artigos acadêmicos, literários e jurídico-administrativos. Estratégia: identifique a tese central, a estrutura retórica, inferências profundas, pressupostos implícitos e o registro do autor.",
              "AUDIÇÃO: conferências, palestras acadêmicas, debates televisivos, entrevistas jornalísticas, diálogos coloquiais e registros orais variados em velocidade natural. Os áudios são reproduzidos 2 vezes. Exige-se compreensão de implícitos, ironia, atitudes, relações de poder e funções comunicativas sutis.",
              "ESCRITA — Tarefa 1: texto argumentativo (200-250 palavras) sobre tema abstrato ou de ordem geral, com posição clara, argumentos sólidos, dados, exemplos e conclusão consistente. Tarefa 2: reformulação, síntese crítica, análise ou resposta formal (200-250 palavras) a partir de um documento complexo. Avaliam: precisão gramatical, riqueza lexical, adequação registal, coesão sofisticada, coerência e originalidade argumentativa.",
              "ORAL — Tarefa 1: exposição preparada (5-6 min) sobre tema dado no exame, com introdução contextualizada, desenvolvimento argumentado e conclusão. Tarefa 2: diálogo aprofundado com o examinador (5-6 min) sobre o tema da Tarefa 1, explorando nuances, implicações e exemplos. Tarefa 3: debate (5-6 min) sobre um tema diferente, defendendo e matizando uma posição com argumentos, contra-argumentos e conectores formais.",
            ],
          },
        ],
      },
      {
        id: "c2-dicas",
        title: "Dicas específicas de preparação",
        blocks: [
          {
            kind: "list",
            items: [
              "Domine todos os tempos do Modo Subjuntivo, as formas arcaicas do Futuro Subjuntivo (-re) em textos jurídicos e literários, e as perífrases verbais avançadas (haber de, deber de, llegar a, acabar de, dejar de).",
              "Pratique estruturas de relativo cultas (cuyo, el cual, quien, lo que, cualesquiera que sean) e orações concessivas, condicionais, finais, consecutivas e modais sofisticadas.",
              "Amplie o vocabulário de registro elevado: latinismos (a priori, ipso facto, sui generis, mutatis mutandis), cultismos, terminologia acadêmica, jurídica, filosófica e literária.",
              "Treine a reformulação e a síntese: leia textos complexos e reescreva-os de forma concisa sem perder a tese nem os argumentos principais.",
              "Escrita argumentativa: use estrutura dialectal (tese, antítese, síntese), dados, exemplos históricos ou actuais, citações e conectores de alta formalidade (no obstante, con todo, por el contrario, en consecuencia, en lo que respecto a).",
              "Audição: ouça conferências acadêmicas, programas de rádio de análise política e entrevistas a especialistas; pratique notas hierárquicas e reconstrução oral do conteúdo.",
              "Oral: prepare temas abstratos (ética, estética, política, ciência, identidade, globalização) e pratique argumentar com nuances, reconhecer falácias, reformular e usar cortesia estratégica.",
              "Registro e estilo: distingua formal culto, formal neutro, informal e coloquial; domine transições registrais e adaptação ao interlocutor.",
              "Faça pelo menos 3 simulados completos cronometrados antes do exame real, incluindo gravação da prova oral com revisão detalhada.",
              "No dia: gerencie o tempo com disciplina, especialmente na leitura (105 min exige concentração prolongada); revise concordância, tempos verbais, registro e pontuação antes de entregar.",
            ],
          },
          {
            kind: "tip",
            text: "O C2 exige não só competência linguística excepcional, mas também cultura geral, pensamento crítico e capacidade de argumentação sofisticada. Leia ensaios, opinião e literatura; pratique a oralidade com feedback rigoroso.",
          },
        ],
      },
      {
        id: "c2-simulado",
        title: "Simulado DELE C2 — modelo da prova",
        blocks: [
          {
            kind: "heading",
            text: "Seção 1 — Compreensão de leitura (105 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ler 6 textos complexos (ensaios, editoriais, críticas literárias) e associar com afirmações, reações ou inferências.",
              "Exercício 2: ler texto ensaístico ou acadêmico (700-900 palavras) e responder múltipla escolha com inferências e análise de tom.",
              "Exercício 3: completar texto com frases desordenadas, identificando referentes encadeados, conectores lógicos e progressão argumentativa.",
              "Exercício 4: ler correspondência formal, jurídica ou acadêmica e responder perguntas de compreensão detalhada e de intenção.",
              "Exercício 5: identificar o tom, o propósito, a linha argumentativa e eventuais falácias ou pressupostos em textos de diferentes registros.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 2 — Compreensão auditiva (55 min)",
          },
          {
            kind: "list",
            items: [
              "Exercício 1: ouvir 6 excertos curtos de registros variados e associar com intenção, atitude ou contexto sociocultural.",
              "Exercício 2: ouvir entrevista jornalística e marcar verdadeiro/falso/não mencionado, justificando inferências.",
              "Exercício 3: ouvir conferência acadêmica ou palestra e completar notas, esquema ou tabela com informações implícitas.",
              "Exercício 4: ouvir debate televisivo e identificar posições, argumentos, estratégias retóricas e relações entre interlocutores.",
              "Exercício 5: ouvir diálogo coloquial ou literário e inferir atitudes, subtextos, relações de poder e matizes de significado.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 3 — Expressão escrita (90 min)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: escrever texto argumentativo (200-250 palavras) sobre tema abstrato de ordem geral. Estruture em tese, antítese, argumentos fundamentados com dados/exemplos e conclusão sintética.",
              "Tarefa 2: escrever reformulação, síntese crítica, análise de documento ou resposta formal (200-250 palavras). Atente ao registro elevado, à coesão sofisticada e ao alcance lexical.",
            ],
          },
          {
            kind: "heading",
            text: "Seção 4 — Expressão oral (20 min + 20 prep.)",
          },
          {
            kind: "list",
            items: [
              "Tarefa 1: exposição preparada (5-6 min) sobre tema dado no exame. Estruture em introdução contextualizada, desenvolvimento argumentado com exemplos e conclusão.",
              "Tarefa 2: diálogo aprofundado com o examinador (5-6 min) sobre o tema da Tarefa 1, explorando nuances, implicações, exemplos e contra-argumentos.",
              "Tarefa 3: debate (5-6 min) sobre tema diferente, defendendo e matizando uma posição com argumentos sólidos, exemplos concretos e conectores formais.",
            ],
          },
        ],
      },
      {
        id: "c2-inscricao",
        title: "Onde se inscrever",
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
          },
        ],
      },
    ],
  },
];

export const getDeleCourse = (id: string) =>
  DELE_COURSES.find((c) => c.id === id);
