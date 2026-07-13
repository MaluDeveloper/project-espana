// Portuguese (pt-BR) — UI strings.
// Conteúdo de aprendizado (frases-exemplo, exercícios, vocabulário, lições)
// permanece em espanhol nos arquivos de dados — não traduzir aqui.

export const pt = {
  // ============= NAVBAR (landing) =============
  nav: {
    comoFunciona: "Como funciona",
    destinos: "Destinos",
    jogos: "Jogos",
    cursos: "Cursos",
    precos: "Preços",
    entrar: "Entrar",
    comecarGratis: "Começar grátis",
    menu: "Menu",
    idioma: "Idioma",
  },

  // ============= HEADER (app autenticado) =============
  appHeader: {
    inicio: "Início",
    cursos: "Cursos",
    jogos: "Jogos",
    perfil: "Perfil",
    sair: "Sair",
    dias: "dias",
    entrar: "Entrar",
    comecarGratis: "Começar grátis",
  },

  // ============= AUTH =============
  auth: {
    login: {
      title: "Bem-vindo de volta",
      subtitle: "Entre e continue sua jornada em espanhol.",
      email: "Email",
      senha: "Senha",
      entrar: "Entrar",
      semConta: "Ainda não tem conta?",
      criar: "Crie agora",
      preenchaCampos: "Preencha email e senha",
      bemVindo: "¡Bienvenido de nuevo!",
    },
    cadastro: {
      title: "Comece grátis hoje",
      subtitle: "3 minutos para criar sua conta. Sem cartão.",
      nome: "Nome",
      email: "Email",
      senha: "Senha",
      criar: "Criar minha conta",
      jaTemConta: "Já tem conta?",
      entrar: "Entrar",
      preenchaTodos: "Preencha todos os campos",
      senhaCurta: "Senha precisa ter ao menos 6 caracteres",
      contaCriada: (name: string) => `¡Hola, ${name}! Tu cuenta está lista.`,
      termos:
        "Ao criar uma conta você concorda com os Termos e Política de Privacidade.",
      placeholderNome: "Tu nombre",
    },
    layout: {
      title: "Aprenda espanhol",
      title2: "com um método de verdade.",
      subtitle:
        "Você avança em cada etapa. Acertos, erros e descobertas — tudo isso faz parte da jornada.",
    },
    google: {
      continue: "Continuar com Google",
      or: "ou",
      success: "¡Bienvenido! Login com Google realizado.",
      error: "Não foi possível entrar com o Google. Tente novamente.",
    },
  },

  // ============= LANDING =============
  hero: {
    titlePart1: "Aprenda",
    titleHighlight: "espanhol",
    titlePart2: "com inteligência artificial",
    subtitle:
      "Cursos A1–C2, jogos, correção inteligente por IA e conteúdos sobre o DELE. Aprenda no seu ritmo.",
    ctaPrimary: "Comece agora grátis",
    ctaSecondary: "Ver como funciona",
    badgeNoCard: "Sem cartão",
    badgeMinutes: "5 min/dia",
    badgeStudents: "+12.000 alunos",
  },

  features: {
    eyebrow: "COMO FUNCIONA",
    titlePart1: "Tudo o que você precisa.",
    titleHighlight: "Nada que você não precise.",
    subtitle:
      "Uma plataforma completa, desenhada para quem quer falar espanhol de verdade.",
    items: {
      book: {
        title: "Livro online A1 → C2",
        desc: "Currículo estruturado com gramática, léxico profissional e exercícios de fixação.",
      },
      ai: {
        title: "IA que corrige você",
        desc: "Feedback instantâneo na sua escrita, com sugestões de conectores e vocabulário.",
      },
      games: {
        title: "Jogos interativos",
        desc: "Memória, caça-palavras, lacunas e mais — aprenda jogando, sem cair em rotina.",
      },
      tests: {
        title: "Provas para avançar",
        desc: "Cada nível termina com uma prova de 10 questões. Só passa quem realmente aprendeu.",
      },
      spain: {
        title: "Espanhol da Espanha",
        desc: "Vocabulário, expressões e contexto cultural reais — não traduções genéricas.",
      },
      progress: {
        title: "Progresso visível",
        desc: "Sequências, XP, conquistas e ranking. Sua evolução em tempo real.",
      },
    },
  },

  landingCourses: {
    eyebrow: "CURSOS",
    titlePart1: "Seu caminho até o",
    titleHighlight: "espanhol ibérico.",
    subtitle:
      "Três etapas. Uma jornada cultural completa pelo idioma da Espanha — do primeiro hola à fluência refinada de um nativo culto.",
    explorar: "Explorar nível",
    ctaStartFree: "Começar grátis",
    ctaStartNow: "Começar agora",
    ctaLocked: "Bloqueado",
    levels: {
      a1: {
        module: "MÓDULO 01",
        level: "A1 — A2 · Iniciante",
        title: "Primeiros passos na península",
        description:
          "O primeiro passo na sua jornada. Aprenda a base essencial, saudações e situações do dia a dia com o sotaque claro da península.",
        imageAlt: "Cidade das Artes e Ciências em Valência ao pôr do sol",
      },
      b1: {
        module: "MÓDULO 02",
        level: "B1 — B2 · Intermediário",
        title: "Fluidez no coração de Madri",
        description:
          "Ganhe independência. Comece a debater ideias, entender a cultura ibérica profundamente e falar com fluidez em contextos sociais e profissionais.",
        imageAlt: "Gran Vía de Madrid iluminada com a vida noturna vibrante",
      },
      c1: {
        module: "MÓDULO 03",
        level: "C1 — C2 · Avançado",
        title: "Maestria com alma andaluza",
        description:
          "Maestria total. Refine nuances linguísticas, domine expressões regionais complexas e alcance o nível de um nativo culto.",
        imageAlt: "Plaza de España em Sevilha com sua arquitetura monumental",
      },
    },
  },

  landingGames: {
    eyebrow: "JOGOS",
    titlePart1: "Aprenda espanhol",
    titleHighlight: "jogando de verdade",
    subtitle: (available: number, total: number) =>
      `${available} jogos disponíveis e mais a caminho — ${total}+ fases para treinar vocabulário, gramática e compreensão sem cair em rotina.`,
    emBreve: "Em breve",
    fases: "fases",
    jogar: "Jogar",
    verTodos: "Ver todos os jogos",
    cards: {
      memoria: {
        title: "Jogo da memória",
        tagline: "Combine palavra e tradução",
        description:
          "Encontre os pares de cartas escondidas. Treine vocabulário rapidamente.",
      },
      "caza-palabras": {
        title: "Caça-palavras",
        tagline: "Encontre palavras na sopa",
        description:
          "Sopa de letras temática. Encontre todas as palavras antes que o tempo acabe.",
      },
      lacunas: {
        title: "Preencher lacunas",
        tagline: "Frases com palavras faltando",
        description:
          "Escolha a palavra certa para completar a frase. Gramática em contexto.",
      },
      crucigrama: {
        title: "Palavras cruzadas",
        tagline: "Pistas e palavras cruzadas",
        description: "Resolva definições e complete a grade. Em breve.",
      },
      historias: {
        title: "Ler histórias",
        tagline: "Compreensão de leitura",
        description: "Contos curtos com perguntas. Aprenda lendo. Em breve.",
      },
      objetos: {
        title: "Encontrar objetos",
        tagline: "Procure na imagem",
        description:
          "Localize objetos em cenas reais. Vocabulário visual. Em breve.",
      },
      describir: {
        title: "Descrever imagens",
        tagline: "Escreva o que você vê",
        description: "A IA avalia a sua descrição. Em breve.",
      },
      "crear-historia": {
        title: "Criar histórias",
        tagline: "Escreva com palavras dadas",
        description: "A IA fornece palavras e você cria a história. Em breve.",
      },
    },
  },

  landingCities: {
    eyebrow: "DESTINOS 🇪🇸",
    titlePart1: "Cidades que",
    titleHighlight: "falam espanhol",
    subtitle:
      "Cada região tem seu sotaque, seu ritmo, sua alma. Clique em uma cidade para descobrir como se fala lá.",
    sobreCidade: "Sobre a cidade",
    comoSeFala: "Como se fala aqui",
    saibaMais: (name: string) => `Saiba mais sobre ${name}`,
  },

  landingTestimonials: {
    eyebrow: "Depoimentos",
    titlePart1: "Alunos que já estão",
    titleHighlight: "falando espanhol.",
  },

  pricing: {
    eyebrow: "PREÇOS",
    titlePart1: "Simples.",
    titleHighlight: "Como deve ser.",
    subtitle: "Cancele quando quiser. Sem letras miúdas.",
    mostPopular: "Mais popular",
    plans: {
      free: {
        name: "Free",
        price: "R$ 0",
        period: "/sempre",
        desc: "Comece a aprender hoje, sem compromisso.",
        features: [
          "Curso A1 completo",
          "5 jogos por dia",
          "IA corretora básica",
          "Comunidade",
        ],
        cta: "Começar grátis",
      },
      pro: {
        name: "Pro",
        price: "R$ 29",
        period: "/mês",
        desc: "Para quem quer fluência de verdade.",
        features: [
          "Todos os cursos A1 → C1",
          "Jogos ilimitados",
          "IA premium com explicações",
          "Provas de nível",
          "Léxico profissional",
          "Sem anúncios",
        ],
        cta: "Assinar Pro",
      },
      teams: {
        name: "Equipes",
        price: "Personalizado",
        period: "",
        desc: "Para empresas e escolas.",
        features: [
          "Tudo do Pro",
          "Painel de administrador",
          "Relatórios",
          "Suporte dedicado",
        ],
        cta: "Falar com vendas",
      },
    },
  },

  cta: {
    title: "Pronto para falar espanhol de verdade?",
    subtitle:
      "Comece hoje e evolua todos os dias. Sua primeira lição leva 5 minutos.",
    button: "Começar grátis agora",
  },

  inlineCtas: {
    afterFeatures: {
      label: "Quero começar agora",
    },
    afterCourses: {
      label: "Começar no nível A1",
      subtext: "Não sabe seu nível? Faça o teste depois do cadastro.",
    },
  },

  pricingTeaser: {
    eyebrow: "Planos",
    title: "Planos a partir de R$ 29/mês",
    subtitle: "Acesso completo a todos os níveis e recursos.",
    button: "Ver planos",
  },

  footer: {
    tagline:
      "Aprenda espanhol da Espanha de forma inteligente com IA, jogos e cursos estruturados do A1 ao C1.",
    product: "Produto",
    company: "Empresa",
    legal: "Legal",
    support: "Suporte",
    links: {
      cursos: "Cursos",
      comoFunciona: "Como funciona",
      jogos: "Jogos",
      precos: "Preços",
      sobre: "Sobre",
      blog: "Blog",
      contato: "Contato",
      termos: "Termos",
      privacidade: "Privacidade",
      cookies: "Cookies",
      ajuda: "Central de Ajuda",
      faq: "FAQ",
      emailSuporte: "suporte@spanishai.app",
    },
    socialLabel: "Redes sociais",
    rights: (year: number) =>
      `© ${year} Spanish AI. Todos os direitos reservados.`,
  },

  preloader: {
    tagline: "Domina el español de España",
  },

  // ============= DASHBOARD =============
  // Interface em português; conteúdo pedagógico (atividades, frases estilizadas
  // em espanhol, nomes de jogos) mantém-se em espanhol propositalmente.
  dashboard: {
    ola: (name: string) => `¡Hola, ${name}!`, // saudação estilizada em espanhol
    titulo1: "Continue construindo seu",
    tituloHighlight: "Espanhol",
    nivel: "Nível",
    intermedio: "Intermediário",
    dias: "dias",
    global: "global",
    proxNivel: (current: number, remaining: number) =>
      `Nível ${current + 1} em ${remaining} XP`,

    cardProgresso: {
      badge: "Seu progresso",
      titulo1: "Acompanhe seu",
      tituloHighlight: "avanço",
      descricao: "Veja quantos capítulos e níveis você já completou.",
      capitulosLabel: "Capítulos",
      niveisLabel: "Níveis",
      quizLabel: "Média quiz",
      cta: "Ver cursos",
    },
    cardJogos: {
      badge: "8 categorias",
      titulo: "Pratique jogando",
      // Nomes de atividades em PT
      descricao:
        "Memória, caça-palavras, lacunas e mais. Ganhe XP enquanto se diverte.",
      cta: "Explorar jogos",
    },

    missoes: {
      eyebrow: "Missões diárias",
      tituloFmt: (done: number, total: number) =>
        `${done} de ${total} completas`,
      reiniciaEm: (time: string) => `Reinicia em ${time}`,
      reclamada: "Recompensa resgatada!",
      items: [
        "Complete 1 capítulo do curso",
        "Jogue 3 partidas de memória",
        "Aprenda 10 palavras novas",
      ],
    },

    ranking: {
      eyebrow: "Ranking semanal",
      titulo: "Top alunos",
      voce: "Você",
      verCompleto: "Ver ranking completo",
    },

    conquistas: {
      eyebrow: "Conquistas",
      tituloFmt: (unlocked: number, total: number) =>
        `${unlocked} de ${total} desbloqueadas`,
      verTodas: "Ver todas",
      items: {
        primerPaso: {
          name: "Primeiro passo",
          desc: "Complete sua primeira lição",
        },
        racha: { name: "Sequência ardente", desc: "7 dias seguidos" },
        memoria: { name: "Memória de ouro", desc: "Vença 10 partidas" },
        poliglota: { name: "Políglota", desc: "Aprenda 100 palavras" },
        conversador: { name: "Conversador", desc: "Complete o nível A2" },
        maestro: { name: "Mestre", desc: "Chegue ao nível B2" },
        imparable: { name: "Imparável", desc: "30 dias seguidos" },
        fluente: { name: "Fluente", desc: "Complete o nível C1" },
      },
    },

    motivacao: {
      titulo: "¡Sigue así, vas genial!", // frase motivacional estilizada em espanhol
      subtitulo:
        "Cada dia conta. Mantenha sua sequência e desbloqueie novas conquistas em breve.",
    },

    cursoOverview: {
      eyebrow: "Seu curso",
      titulo: "Visão geral do nível",
      nivelAtual: "Nível atual",
      capitulosConcluidos: "Capítulos concluídos",
      mediaQuizzes: "Média nos quizzes",
      streak: "Dias estudados seguidos",
      proxRecomendado: "Próximo recomendado",
      semNivel: "Comece o nível A1",
      sequencia: "dias",
      irCapitulo: "Ir para o capítulo",
      verCursos: "Ver todos os cursos",
    },
  },

  // ============= DASHBOARD SIDEBAR =============
  dashboardSidebar: {
    menu: "Menu",
    conta: "Conta",
    visaoGeral: "Visão geral",
    cursos: "Cursos",
    jogos: "Jogos",
    progresso: "Progresso",
    perfil: "Perfil",
    configuracoes: "Configurações",
    sair: "Sair",
    dias: "dias",
  },

  // ============= DASHBOARD VIEWS =============
  dashboardViews: {
    progresso: {
      titulo: "Seu progresso",
      subtitulo: "Acompanhe sua evolução semana a semana.",
      cards: {
        concluido: "Concluído",
        tempo: "Tempo de estudo",
        sequencia: "Sequência atual",
        xpTotal: "XP total",
        geral: "Conclusão geral",
        capitulos: "Capítulos concluídos",
        mediaQuiz: "Média nos quizzes",
      },
      semana: "Atividade da semana",
      semanaSub: "Minutos estudados nos últimos 7 dias",
      conquistasRecentes: "Conquistas recentes",
      niveis: "Progresso por nível",
      historico: "Histórico de quizzes",
      semHistorico:
        "Nenhum quiz feito ainda. Comece um capítulo para registrar seu primeiro resultado.",
    },
    perfil: {
      titulo: "Seu perfil",
      subtitulo: "Veja e edite seus dados pessoais.",
      planoLabel: "Plano atual",
      planoFree: "Free",
      planoPremium: "Premium",
      upgrade: "Fazer upgrade",
      editar: "Editar perfil",
      campos: {
        nome: "Nome",
        email: "Email",
        objetivo: "Objetivo de aprendizado",
        membroDesde: "Membro desde",
      },
      objetivos: {
        travel: "Viajar",
        work: "Trabalho",
        study: "Estudos / DELE",
        culture: "Cultura e lazer",
        other: "Outro",
      },
      espanhol: "Espanhol (Espanha)",
      desde: "Janeiro 2025",
      zonaPerigo: "Zona de perigo",
      sairConta: "Sair da conta",
      sairContaSub: "Encerra sua sessão neste dispositivo",
      sairBtn: "Sair",
      excluirConta: "Excluir conta",
      excluirContaSub: "Remove permanentemente todo o seu progresso",
      excluirBtn: "Excluir",
      confirmarSair: "Tem certeza que deseja sair?",
      confirmarSairDesc:
        "Você precisará entrar novamente para acessar seu progresso.",
      confirmarExcluir: "Excluir conta permanentemente",
      confirmarExcluirDesc: (palavra: string) =>
        `Esta ação não pode ser desfeita. Todo o seu progresso, conquistas e dados serão apagados. Para confirmar, digite ${palavra} abaixo.`,
      confirmarExcluirPalavra: "EXCLUIR",
      confirmarExcluirPlaceholder: (palavra: string) => `Digite ${palavra}`,
      confirmarExcluirBotao: "Excluir conta",
      cancelar: "Cancelar",
      sessaoEncerrada: "Sessão encerrada",
      contaExcluida: "Conta excluída",
    },
    perfilEditar: {
      titulo: "Editar perfil",
      subtitulo: "Atualize suas informações pessoais",
      trocarFoto: "Trocar foto",
      enviarFoto: "Enviar foto",
      remover: "Remover",
      avatarHint: "JPG ou PNG, até 2MB. Opcional.",
      semNome: "Sem nome",
      infBasicas: "Informações básicas",
      nomeCompleto: "Nome completo",
      nomePlaceholder: "Como você quer ser chamado",
      objetivoAprendizado: "Objetivo de aprendizado",
      goals: {
        travel: "Viajar",
        work: "Trabalho",
        study: "Estudos / DELE",
        culture: "Cultura e lazer",
        other: "Outro",
      },
      cancelar: "Cancelar",
      salvar: "Salvar alterações",
      salvando: "Salvando...",
      alterarEmail: "Alterar email",
      emailAtual: "Email atual",
      novoEmail: "Novo email",
      senhaAtualConfirmar: "Senha atual (para confirmar)",
      atualizarEmail: "Atualizar email",
      alterarSenha: "Alterar senha",
      definirSenha: "Definir senha",
      semSenha:
        "Você ainda não tem uma senha cadastrada. Defina uma para proteger sua conta.",
      senhaAtual: "Senha atual",
      novaSenha: "Nova senha",
      confirmarNovaSenha: "Confirmar nova senha",
      novaSenhaMin: "Mínimo 6 caracteres",
      atualizarSenha: "Atualizar senha",
      perfilAtualizado: "Perfil atualizado",
      emailAtualizado: "Email atualizado",
      senhaAtualizada: "Senha atualizada",
      senhaDefinida: "Senha definida",
    },
    config: {
      titulo: "Configurações",
      subtitulo: "Personalize sua experiência.",
      idioma: "Idioma da interface",
      notificacoes: "Notificações",
      notificacoesSub: "Receba lembretes diários para manter sua sequência",
      som: "Sons e efeitos",
      somSub: "Feedback sonoro durante exercícios e jogos",
      conta: "Conta",
      logout: "Sair da conta",
      logoutSub: "Encerrar sessão neste dispositivo",
      prefGerais: "Preferências gerais",
      horarioLembrete: "Horário preferido de lembrete",
      horarioLembreteSub: "Quando enviar o lembrete diário",
      reminderOptions: {
        morning: "Manhã (8h)",
        afternoon: "Tarde (14h)",
        evening: "Noite (20h)",
      },
      secaoEstudo: "Estudo",
      metaDiaria: "Meta diária de estudo",
      metaDiariaSub: "Usada nas missões diárias do dashboard",
      dificuldade: "Dificuldade dos exercícios",
      dificuldadeSub: "Ajusta a complexidade das atividades",
      diffOptions: {
        auto: "Automática (recomendado)",
        easy: "Fácil",
        hard: "Difícil",
      },
      mostrarTraducao: "Mostrar tradução nos flashcards",
      mostrarTraducaoSub:
        "Se desligado, esconde a tradução e força você a adivinhar",
      configSalva: "Configuração salva",
    },
  },

  // ============= CURSOS =============
  cursos: {
    listing: {
      badge: "Livro online · A1 → C1",
      titulo1: "Seu",
      tituloHighlight: "curso completo",
      tituloFim: "de espanhol",
      subtitulo:
        "Capítulos com teoria, exemplos, léxico profissional e exercícios. Aprove a prova final com 70% para passar ao próximo nível.",
      aprovado: "Aprovado",
      bloqueado: "Bloqueado",
      capitulos: "capítulos",
      provaFinal: "10 perguntas · prova final",
      melhorNota: (score: number, total: number) =>
        `Melhor nota: ${score}/${total}`,
      empezar: "Começar",
      repasar: "Revisar",
      continuar: "Continuar",
      concluido: "Concluído",
      capituloFmt: (current: number, total: number) =>
        `Capítulo ${current} de ${total}`,
      aindaNaoIniciado: "Ainda não iniciado",
      completePara: (pct: number, level: string) =>
        `Complete ${pct}% do nível ${level} para desbloquear`,
      deleTitulo: "Guia",
      deleDescricao:
        "Diploma oficial de espanhol como língua estrangeira: formato, critérios de avaliação e dicas específicas para cada nível.",
      deleVerDetalhes: "Ver detalhes",
      preciseAprovar: "Aprove o nível anterior",
      levels: {
        A1: {
          title: "Espanhol A1 · Iniciante",
          description:
            "As bases do idioma: alfabeto, saudações, presente e vocabulário essencial.",
        },
        A2: {
          title: "Espanhol A2 · Básico",
          description:
            "Pretérito simples, descrições e vocabulário do dia a dia.",
        },
        B1: {
          title: "Espanhol B1 · Intermediário",
          description:
            "Domine os tempos do passado, o subjuntivo presente, o futuro e o condicional. Expresse opiniões, hipóteses e situações complexas do cotidiano.",
        },
        B2: {
          title: "Espanhol B2 · Intermediário alto",
          description:
            "Subjuntivo avançado, espanhol dos negócios e léxico profissional.",
        },
        C1: {
          title: "Espanhol C1 · Avançado",
          description:
            "Nuances, registros e domínio de expressões idiomáticas.",
        },
        C2: {
          title: "Espanhol C2 · Maestría",
          description:
            "O domínio pleno do castelhano. Leia, escreva e pense como um nativo culto da Espanha.",
        },
      },
    },
    nivel: {
      voltar: "Voltar para cursos",
      capitulo: "Capítulo",
      topicos: "tópicos",
      lexico: "entradas de léxico",
      lidos: "lidos",
      continuar: "Continuar",
      ler: "Ler",
      provaEyebrow: "Prova final do nível",
      provaTitulo: "15 questões · você precisa de 70% para aprovar",
      melhorNotaFmt: (score: number, total: number, passed: boolean) =>
        `Melhor nota: ${score}/${total} ${passed ? "· Aprovado ✓" : "· Continue tentando"}`,
      naoFeita: "Você ainda não fez a prova.",
      repetir: "Repetir",
      fazer: "Fazer prova",
      leiaTodos: "Leia todos os capítulos",
    },
    capitulo: {
      voltar: (level: string) => `Voltar para o nível ${level}`,
      capitulo: "Capítulo",
      ejemplo: "Exemplo",
      exerciciosTitulo: "Exercícios de fixação",
      respostaPlaceholder: "Sua resposta…",
      correto: "Correto!",
      tenteOutra: "Quase… tente novamente.",
      comprovar: "Comprovar",
      lexicoTitulo: "Léxico do capítulo",
      lexicoSubtitulo:
        "Palavras e expressões que separam o espanhol básico do nível profissional/nativo.",
      todosCapitulos: "Todos os capítulos",
      proxCapitulo: "Próximo capítulo",
      fazerProva: "Fazer prova final",
      tags: {
        profesional: "profissional",
        coloquial: "coloquial",
        formal: "formal",
        expresión: "expressão",
      },
      tabs: {
        conteudo: "Conteúdo",
        exercicios: "Exercícios",
        quiz: "Quiz",
        revisao: "Revisão",
      },
      vocabularioTitulo: "Vocabulário em flashcards",
      vocabularioSub:
        "Clique no cartão para virar e veja a tradução. 'Já sei' remove da pilha; 'Não sei' manda para o fim.",
      flashcards: {
        front: "Espanhol",
        back: "Tradução",
        know: "Já sei",
        review: "Não sei",
        completed: "Vocabulário revisado!",
        restart: "Reiniciar",
        flip: "Toque para virar",
        of: "de",
      },
      quizTitulo: "Quiz do capítulo",
      quizSub: "Responda as questões e atinja 70% para conquistar o badge.",
      quizLabels: {
        title: "Quiz",
        subtitle: "Atinja 70% para concluir",
        question: (c: number, t: number) => `Questão ${c} de ${t}`,
        check: "Verificar",
        next: "Próxima",
        finish: "Finalizar",
        correct: "Correto!",
        incorrect: "Incorreto",
        answer: "Resposta correta:",
        score: (s: number, t: number) => `Acertos: ${s}/${t}`,
        passed: "Capítulo dominado!",
        failed: "Quase lá!",
        retake: "Refazer quiz",
        badge: "Badge desbloqueado",
        bestScore: (s: number, t: number) => `Melhor: ${s}/${t}`,
        placeholder: "Sua resposta…",
        noQuestions: "Este capítulo ainda não tem quiz.",
      },
      revisaoTitulo: "Revisão do capítulo",
      revisaoResumo: "Resumo",
      revisaoErros: "Erros comuns",
      revisaoTopicos: "Tópicos do capítulo",
      revisaoVocab: "Vocabulário-chave",
      audioOuvir: "Ouvir",
      audioLento: "Lento",
      progressoLabel: "Progresso do capítulo",
    },
    prueba: {
      voltar: "Voltar para o nível",
      provaFinal: (pct: number) => `Prova final · ${pct}% para aprovar`,
      perguntaFmt: (current: number, total: number) =>
        `Pergunta ${current} de ${total}`,
      respostaPlaceholder: "Sua resposta…",
      finalizar: "Finalizar prova",
      proxima: "Próxima",
      aprovado: "Aprovado!",
      aprovadoMsg: (score: number, total: number) =>
        `Você fez ${score}/${total}. Desbloqueou o próximo nível.`,
      quase: "Quase lá",
      quaseMsg: (score: number, total: number, min: number) =>
        `Você fez ${score}/${total}. Você precisa de ao menos ${min}.`,
      revise: "Revise os capítulos e tente de novo.",
      respostaCorreta: "Resposta:",
      repetir: "Repetir prova",
      voltarCursos: "Voltar para cursos",
    },
  },

  // ============= JOGOS =============
  jogos: {
    listing: {
      eyebrow: "Categorias de jogos",
      titulo1: "Aprenda jogando,",
      tituloHighlight: "de A1 a C1",
      subtitulo:
        "Escolha uma categoria. Cada uma tem níveis e muitas fases distintas.",
      proximamente: "Em breve",
      nivelLabel: "níveis",
      fases: "fases",
      niveis: "5 níveis",
    },
    levels: {
      labels: {
        A1: "Iniciante",
        A2: "Básico",
        B1: "Intermediário",
        B2: "Intermediário alto",
        C1: "Avançado",
        C2: "Maestría",
      } as Record<"A1" | "A2" | "B1" | "B2" | "C1" | "C2", string>,
    },
    categories: {
      memoria: {
        title: "Jogo da memória",
        tagline: "Combine palavra e tradução",
        description:
          "Encontre os pares de cartas escondidas. Treine vocabulário rapidamente.",
      },
      "caza-palabras": {
        title: "Caça-palavras",
        tagline: "Encontre palavras na sopa",
        description:
          "Sopa de letras temática. Encontre todas as palavras antes que o tempo acabe.",
      },
      lacunas: {
        title: "Completar lacunas",
        tagline: "Frases com palavras faltando",
        description:
          "Escolha a palavra certa para completar a frase. Gramática em contexto.",
      },
      crucigrama: {
        title: "Palavras cruzadas",
        tagline: "Pistas e palavras cruzadas",
        description: "Resolva definições e complete a grade. Em breve.",
      },
      historias: {
        title: "Ler histórias",
        tagline: "Compreensão de leitura",
        description: "Contos curtos com perguntas. Aprenda lendo. Em breve.",
      },
      objetos: {
        title: "Encontrar objetos",
        tagline: "Procure na imagem",
        description:
          "Localize objetos em cenas reais. Vocabulário visual. Em breve.",
      },
      describir: {
        title: "Descrever imagens",
        tagline: "Escreva o que você vê",
        description: "A IA avalia sua descrição. Em breve.",
      },
      "crear-historia": {
        title: "Criar histórias",
        tagline: "Escreva com palavras dadas",
        description: "A IA te dá palavras e você cria a história. Em breve.",
      },
    } as Record<
      string,
      { title: string; tagline: string; description: string }
    >,
    categoria: {
      voltar: "Categorias",
      progresso: (level: string) => `Progresso em ${level}`,
      fasesXp: (done: number, total: number, xp: number) =>
        `${done} / ${total} fases · ${xp} XP`,
      faseBloqueada: (n: number) => `Fase ${n} bloqueada`,
      nivelBloqueadoTitulo: (level: string) => `Nível ${level} bloqueado`,
      nivelBloqueadoDesc: (level: string) =>
        `Para desbloquear os jogos do nível ${level}, primeiro aprove a prova do nível anterior no curso.`,
      irCurso: "Ir para o curso",
    },
    fase: {
      tituloFmt: (cat: string, n: number) => `${cat} · Fase ${n}`,
      nivelFmt: (level: string) => `Nível ${level}`,
      siguienteFase: "Próxima fase",
    },
    stageComplete: {
      titulo: "¡Bien hecho!",
      subtitulo: "Você completou esta fase.",
      repetir: "Repetir",
      proxFase: "Próxima fase",
      voltar: "Voltar",
      fasesCompletadas: "Fases completadas",
    },
    shell: {
      voltar: "Voltar",
    },
    memory: {
      encuentraPares: "Encontre os pares",
      tema: "Tema",
      intentos: "Tentativas",
      cartaOculta: "Carta oculta",
    },
    wordSearch: {
      palabras: "Palavras",
    },
    gaps: {
      fraseFmt: (current: number, total: number) =>
        `Frase ${current} de ${total}`,
      calculando: "Calculando resultado…",
      correctasFmt: (correct: number, total: number) =>
        `${correct} de ${total} corretas`,
      muyBien: "Muito bem!",
      respuestaFmt: (answer: string) => `Resposta: ${answer}`,
      siguiente: "Próxima",
    },
  },

  // ============= AULA (escrita guiada) =============
  aula: {
    etapas: ["Imagem", "Lacunas", "Escrita", "Resultado"] as const,
    etapaFmt: (lesson: string, current: number, total: number) =>
      `${lesson} · Etapa ${current} de ${total}`,

    imagem: {
      titulo1: "O que você vê na",
      tituloHighlight: "imagem?",
      subtitulo:
        "Escreva pelo menos 3 palavras em espanhol que descrevam a cena.",
      placeholder: "Escribe una palabra...",
      jaAdicionou: "Você já adicionou essa palavra",
      naoEsta: (word: string) => `"${word}" não está nesta imagem`,
      acertoToast: (word: string) => `¡Correcto! "${word}"`,
      acertosFmt: "Acertos:",
      continuar: "Continuar",
    },

    lacunas: {
      titulo1: "Complete as",
      tituloHighlight: "frases",
      subtitulo: "Use palavras do vocabulário para preencher as lacunas.",
      corretas: "Corretas:",
      voltar: "Voltar",
      continuar: "Continuar",
    },

    escrita: {
      titulo1: "Escreva sua",
      tituloHighlight: "história",
      placeholder: "Empieza tu historia aquí...",
      dica: "Dica:",
      dicaTexto: "use conectores como",
      palavras: "palavras",
      voltar: "Voltar",
      analisar: "Analisar com IA",
    },

    resultado: {
      pensando: "Pensando en español...",
      analisando: "A IA está analisando sua escrita.",
      concluida: "Aula concluída · +80 XP",
      textoCorrigido: "Texto corrigido",
      errosMelhorias: "Erros e melhorias",
      conectores: "Conectores sugeridos",
      vocabulario: "Vocabulário extra",
      voltarDashboard: "Voltar ao dashboard",
      proxAula: "Próxima aula",
      falhaAnalise: "Falha ao analisar. Tente novamente.",
    },
  },

  // ============= COMMON =============
  common: {
    voltar: "Voltar",
    proximo: "Próximo",
    cancelar: "Cancelar",
    confirmar: "Confirmar",
  },

  // ============= NOT FOUND =============
  notFound: {
    title: "404",
    subtitle: "Ops! Página não encontrada",
    home: "Voltar para o início",
  },
} as const;
