// ============================================================
// Banco rotativo de questões das provas finais (A1 → C2)
// 30 múltipla escolha + 10 discursivas por nível.
// Em cada tentativa: 10 MC + 5 discursivas sorteadas.
// Estado de uso persistido em localStorage (spanish-ai-exam-used-{level}).
// ============================================================

import type { LevelId } from "./games";

export interface ExamMC {
  id: string;
  question: string;
  questionEn?: string;
  options: string[];
  optionsEn?: string[];
  answer: string;
}

export interface ExamDiscursive {
  id: string;
  /** Enunciado em português. */
  question: string;
  /** Exemplo de resposta correta em espanhol. */
  example: string;
  /** Dica curta para o aluno. */
  tip: string;
}

export interface ExamBank {
  multipleChoice: ExamMC[];
  discursive: ExamDiscursive[];
}

// ============================================================
// A1
// ============================================================
const A1: ExamBank = {
  multipleChoice: [
    { id: "a1b-mc-1", question: "Como se cumprimenta às 10h da manhã?", options: ["Buenos días", "Buenas tardes", "Buenas noches"], answer: "Buenos días" },
    { id: "a1b-mc-2", question: "Letra exclusiva do alfabeto espanhol:", options: ["Ç", "Ñ", "K"], answer: "Ñ" },
    { id: "a1b-mc-3", question: "Tú ___ de Brasil.", options: ["soy", "eres", "es"], answer: "eres" },
    { id: "a1b-mc-4", question: "Yo ___ cansado hoy.", options: ["soy", "estoy", "es"], answer: "estoy" },
    { id: "a1b-mc-5", question: "Vosotros ___ pizza.", options: ["coméis", "comen", "comemos"], answer: "coméis" },
    { id: "a1b-mc-6", question: "Voy ___ mercado.", options: ["a el", "al", "del"], answer: "al" },
    { id: "a1b-mc-7", question: "Es un ___ amigo. (bom)", options: ["bueno", "buen", "bien"], answer: "buen" },
    { id: "a1b-mc-8", question: "Yo ___ dos hermanos.", options: ["tiengo", "tengo", "teno"], answer: "tengo" },
    { id: "a1b-mc-9", question: "Negação correta:", options: ["Tengo nada", "No tengo nada", "No tengo algo"], answer: "No tengo nada" },
    { id: "a1b-mc-10", question: "'Amarillo' significa:", options: ["azul", "amarelo", "vermelho"], answer: "amarelo" },
    { id: "a1b-mc-11", question: "Plural de 'lápiz':", options: ["lápizes", "lápices", "lápizs"], answer: "lápices" },
    { id: "a1b-mc-12", question: "Artigo correto: ___ agua está fría.", options: ["la", "el", "lo"], answer: "el" },
    { id: "a1b-mc-13", question: "Nosotros ___ en Madrid.", options: ["vivís", "viven", "vivimos"], answer: "vivimos" },
    { id: "a1b-mc-14", question: "Forma feminina de 'profesor':", options: ["profesora", "profesore", "profesorra"], answer: "profesora" },
    { id: "a1b-mc-15", question: "Hoy es ___ de marzo.", options: ["el primero", "uno", "el uno"], answer: "el uno" },
    { id: "a1b-mc-16", question: "¿Qué hora es? — ___ tres.", options: ["Es la", "Son las", "Está las"], answer: "Son las" },
    { id: "a1b-mc-17", question: "Mi padre ___ médico.", options: ["está", "es", "tiene"], answer: "es" },
    { id: "a1b-mc-18", question: "Demonstrativo: ___ libro (perto de mim).", options: ["aquel", "ese", "este"], answer: "este" },
    { id: "a1b-mc-19", question: "Posesivo: ___ casa es grande. (de nosotros)", options: ["nuestra", "vuestra", "su"], answer: "nuestra" },
    { id: "a1b-mc-20", question: "Conjugue: 'hacer' (yo, presente).", options: ["haco", "hago", "hace"], answer: "hago" },
    { id: "a1b-mc-21", question: "Conjugue: 'ir' (yo, presente).", options: ["voy", "vo", "iré"], answer: "voy" },
    { id: "a1b-mc-22", question: "Día da semana depois de 'lunes':", options: ["martes", "miércoles", "domingo"], answer: "martes" },
    { id: "a1b-mc-23", question: "Como pergunto a idade?", options: ["¿Qué edad eres?", "¿Cuántos años tienes?", "¿Cuánto años eres?"], answer: "¿Cuántos años tienes?" },
    { id: "a1b-mc-24", question: "Estação do ano: 'invierno' =", options: ["verão", "inverno", "outono"], answer: "inverno" },
    { id: "a1b-mc-25", question: "Verbo gostar: 'A mí ___ el café'.", options: ["gusto", "gusta", "gustan"], answer: "gusta" },
    { id: "a1b-mc-26", question: "A mí ___ los perros.", options: ["gusta", "gustan", "gusto"], answer: "gustan" },
    { id: "a1b-mc-27", question: "Cor 'vermelho' em espanhol:", options: ["rojo", "rosa", "rubio"], answer: "rojo" },
    { id: "a1b-mc-28", question: "Hay → significa:", options: ["é/são", "está/estão", "há/existe(m)"], answer: "há/existe(m)" },
    { id: "a1b-mc-29", question: "'Muy' e 'mucho': El café está ___ caliente.", options: ["mucho", "muy", "más"], answer: "muy" },
    { id: "a1b-mc-30", question: "Tradução de 'desayuno':", options: ["almoço", "café da manhã", "jantar"], answer: "café da manhã" },
  ],
  discursive: [
    { id: "a1b-d-1", question: "Apresente-se em espanhol dizendo nome, idade e país (2–3 frases).", example: "Me llamo Ana, tengo 28 años y soy de Brasil.", tip: "Use SER para nacionalidade e TENER para idade." },
    { id: "a1b-d-2", question: "Descreva sua família em 2–3 frases (SER, TENER, profissões).", example: "Tengo dos hermanos. Mi padre es ingeniero y mi madre es profesora.", tip: "Profissões vão sem artigo: 'es médico'." },
    { id: "a1b-d-3", question: "Escreva 3 frases sobre sua rotina diária no Presente.", example: "Me levanto a las siete. Desayuno y voy al trabajo. Por la tarde estudio español.", tip: "Use verbos reflexivos: levantarse, ducharse." },
    { id: "a1b-d-4", question: "Traduza: 'A minha casa é grande e tem três quartos. Eu moro com a minha família.'", example: "Mi casa es grande y tiene tres habitaciones. Vivo con mi familia.", tip: "'Quarto' = habitación; cuidado: 'cuarto' também serve." },
    { id: "a1b-d-5", question: "Escreva um diálogo curto (4 falas) pedindo um café em um bar.", example: "—Hola, ¿qué desea? —Un café con leche, por favor. —¿Algo más? —No, gracias. ¿Cuánto es?", tip: "Use 'por favor' e 'gracias'." },
    { id: "a1b-d-6", question: "Descreva o que você gosta e o que não gosta de comer (2 frases).", example: "Me gusta mucho la pasta, pero no me gustan las verduras.", tip: "'gusta' com singular, 'gustan' com plural." },
    { id: "a1b-d-7", question: "Diga as horas em 3 frases diferentes.", example: "Son las tres. Es la una y media. Son las ocho menos cuarto.", tip: "'Es la' só com 1h; 'Son las' com as demais." },
    { id: "a1b-d-8", question: "Escreva 2 frases descrevendo o tempo (clima) onde você mora.", example: "Hoy hace mucho calor y está soleado. En invierno hace frío y llueve.", tip: "Use 'hace + sustantivo' (calor, frío, sol)." },
    { id: "a1b-d-9", question: "Apresente um amigo: nome, idade, de onde é, o que faz (3 frases).", example: "Mi amigo se llama Pedro. Tiene 30 años, es de Argentina y trabaja como cocinero.", tip: "Use a 3ª pessoa do singular." },
    { id: "a1b-d-10", question: "Escreva uma frase usando 'hay' e outra usando 'está/están'.", example: "En mi calle hay un parque. El parque está cerca de mi casa.", tip: "'Hay' existência; 'estar' localização." },
  ],
};

// ============================================================
// A2
// ============================================================
const A2: ExamBank = {
  multipleChoice: [
    { id: "a2b-mc-1", question: "Ella ___ a las 8 ayer.", options: ["llegó", "llega", "llegará"], answer: "llegó" },
    { id: "a2b-mc-2", question: "Mañana ___ a estudiar mucho.", options: ["voy", "fui", "iba"], answer: "voy" },
    { id: "a2b-mc-3", question: "Comparativo irregular de 'bueno':", options: ["más bueno", "mejor", "buenísimo"], answer: "mejor" },
    { id: "a2b-mc-4", question: "___ a María desde hace años.", options: ["Sé", "Conozco", "Pido"], answer: "Conozco" },
    { id: "a2b-mc-5", question: "Conector de causa:", options: ["porque", "pero", "además"], answer: "porque" },
    { id: "a2b-mc-6", question: "Para experimentar roupa, vou ao:", options: ["andén", "probador", "mostrador"], answer: "probador" },
    { id: "a2b-mc-7", question: "Le + lo doy →", options: ["le lo doy", "se lo doy", "lo le doy"], answer: "se lo doy" },
    { id: "a2b-mc-8", question: "Gracias ___ todo.", options: ["por", "para", "de"], answer: "por" },
    { id: "a2b-mc-9", question: "Este regalo es ___ ti.", options: ["por", "para", "a"], answer: "para" },
    { id: "a2b-mc-10", question: "Forma de 'ir' (yo, Indefinido):", options: ["iba", "fui", "voy"], answer: "fui" },
    { id: "a2b-mc-11", question: "Cuando era niño, ___ mucho.", options: ["jugué", "jugaba", "juego"], answer: "jugaba" },
    { id: "a2b-mc-12", question: "Hoy ___ café tres veces.", options: ["tomé", "he tomado", "tomaba"], answer: "he tomado" },
    { id: "a2b-mc-13", question: "Participio de 'escribir':", options: ["escribido", "escrito", "escribo"], answer: "escrito" },
    { id: "a2b-mc-14", question: "Superlativo de 'fácil':", options: ["facilísimo", "muy fácil", "más fácil"], answer: "facilísimo" },
    { id: "a2b-mc-15", question: "Pronome OD: Veo a Juan → Lo veo. E 'Veo a María':", options: ["lo veo", "la veo", "le veo"], answer: "la veo" },
    { id: "a2b-mc-16", question: "Imperativo afirmativo TÚ de 'hablar':", options: ["habla", "hable", "hablas"], answer: "habla" },
    { id: "a2b-mc-17", question: "Indefinido de 'tener' (yo):", options: ["tuve", "tenía", "tení"], answer: "tuve" },
    { id: "a2b-mc-18", question: "Hace + tiempo: Vivo aquí ___ tres años.", options: ["por", "hace", "desde"], answer: "hace" },
    { id: "a2b-mc-19", question: "Conector de adição:", options: ["pero", "sin embargo", "además"], answer: "además" },
    { id: "a2b-mc-20", question: "Marcador de Indefinido:", options: ["ayer", "hoy", "ahora"], answer: "ayer" },
    { id: "a2b-mc-21", question: "Marcador de Imperfecto:", options: ["la semana pasada", "antes", "el lunes"], answer: "antes" },
    { id: "a2b-mc-22", question: "Estar + gerundio: Ahora ___ comiendo.", options: ["soy", "estoy", "tengo"], answer: "estoy" },
    { id: "a2b-mc-23", question: "Pedir / preguntar: Le ___ por su familia.", options: ["pedí", "pregunté", "dije"], answer: "pregunté" },
    { id: "a2b-mc-24", question: "Forma futura (yo) de 'hacer':", options: ["haré", "haceré", "hago"], answer: "haré" },
    { id: "a2b-mc-25", question: "'Acabar de + infinitivo' indica:", options: ["passado próximo", "futuro", "habitualidade"], answer: "passado próximo" },
    { id: "a2b-mc-26", question: "Tradução: 'tienda' =", options: ["loja", "tenda (acampamento)", "ambos"], answer: "ambos" },
    { id: "a2b-mc-27", question: "Pronome reflexivo: Yo ___ ducho por la mañana.", options: ["me", "te", "se"], answer: "me" },
    { id: "a2b-mc-28", question: "Conjunção condicional simples:", options: ["si", "aunque", "cuando"], answer: "si" },
    { id: "a2b-mc-29", question: "'Quedarse' significa:", options: ["sair", "ficar/permanecer", "perder"], answer: "ficar/permanecer" },
    { id: "a2b-mc-30", question: "Indefinido 3ª pessoa de 'leer':", options: ["leó", "leyó", "lió"], answer: "leyó" },
  ],
  discursive: [
    { id: "a2b-d-1", question: "Conte em 3–4 frases o que você fez no último fim de semana usando o Pretérito Indefinido.", example: "El sábado fui al cine con amigos. Vimos una película y luego cenamos en un restaurante. El domingo descansé en casa.", tip: "Use marcadores: ayer, el sábado, anoche." },
    { id: "a2b-d-2", question: "Descreva como era sua infância em 3 frases (use o Imperfecto).", example: "Cuando era niño, vivía en una ciudad pequeña. Jugaba en el parque todos los días y tenía muchos amigos.", tip: "Imperfecto descreve hábitos passados." },
    { id: "a2b-d-3", question: "Escreva 3 frases sobre seus planos para o próximo ano (IR A + INFINITIVO).", example: "El año que viene voy a estudiar más español. Voy a viajar a España y voy a buscar un trabajo mejor.", tip: "Estrutura: voy/vas/va a + infinitivo." },
    { id: "a2b-d-4", question: "Traduza: 'Quando eu era criança, brincava no parque todos os dias. Agora vou estudar para conseguir o B1.'", example: "Cuando era niño, jugaba en el parque todos los días. Ahora voy a estudiar para conseguir el B1.", tip: "Imperfecto para hábito + IR A para futuro próximo." },
    { id: "a2b-d-5", question: "Diálogo curto (4 falas) entre cliente e vendedor numa loja de roupas.", example: "—Hola, ¿en qué puedo ayudarle? —Busco una camisa azul, talla M. —Aquí tiene. El probador está al fondo. —Gracias, me la llevo.", tip: "Vocabulário: talla, probador, llevarse." },
    { id: "a2b-d-6", question: "Compare duas cidades que você conhece (3 frases, use comparativos).", example: "Madrid es más grande que mi ciudad. Sin embargo, mi ciudad es más tranquila. Las dos tienen buena comida.", tip: "más … que / menos … que / tan … como." },
    { id: "a2b-d-7", question: "Escreva 3 frases sobre uma viagem inesquecível usando Pretérito Indefinido.", example: "El verano pasado viajé a Barcelona. Visité la Sagrada Familia y comí mucha paella. Fue una experiencia genial.", tip: "Indefinido = ações concluídas no passado." },
    { id: "a2b-d-8", question: "Dê instruções para chegar à estação de trem (4 frases, imperativo).", example: "Sigue todo recto. Gira a la derecha en la segunda calle. Cruza la plaza. La estación está enfrente.", tip: "Imperativo TÚ: sigue, gira, cruza." },
    { id: "a2b-d-9", question: "Escreva um e-mail curto (3 frases) cancelando uma reserva de hotel.", example: "Estimado señor: Le escribo para cancelar mi reserva del 12 al 15 de junio a nombre de Ana Lima. Disculpe las molestias. Saludos cordiales.", tip: "Use registro formal: estimado, le escribo, saludos cordiales." },
    { id: "a2b-d-10", question: "Conte uma experiência recente usando o Pretérito Perfecto (3 frases).", example: "Esta semana he empezado un curso nuevo. He conocido a mucha gente y ya he hecho amigos.", tip: "Perfecto = passado conectado com o presente (hoy, esta semana)." },
  ],
};

// ============================================================
// B1
// ============================================================
const B1: ExamBank = {
  multipleChoice: [
    { id: "b1b-mc-1", question: "Hoy ___ mucho trabajo.", options: ["tuve", "he tenido", "tenía"], answer: "he tenido" },
    { id: "b1b-mc-2", question: "Cuando era niño, ___ en Sevilla.", options: ["viví", "vivía", "he vivido"], answer: "vivía" },
    { id: "b1b-mc-3", question: "Participio irregular de 'hacer':", options: ["hacido", "hecho", "hacho"], answer: "hecho" },
    { id: "b1b-mc-4", question: "Si yo ___ tú, hablaría con él.", options: ["soy", "fuera", "sería"], answer: "fuera" },
    { id: "b1b-mc-5", question: "Quiero que (tú) ___ pronto.", options: ["vienes", "vengas", "vendrás"], answer: "vengas" },
    { id: "b1b-mc-6", question: "Cuando ___, te llamo.", options: ["llego", "llegue", "llegaré"], answer: "llegue" },
    { id: "b1b-mc-7", question: "Imperativo TÚ de 'venir':", options: ["viene", "ven", "vení"], answer: "ven" },
    { id: "b1b-mc-8", question: "Se ___ pisos en este edificio.", options: ["vende", "venden", "vendía"], answer: "venden" },
    { id: "b1b-mc-9", question: "'Estoy cansado' → Dijo que ___ cansado.", options: ["estoy", "estaba", "está"], answer: "estaba" },
    { id: "b1b-mc-10", question: "Conector formal de contraste:", options: ["pero", "sin embargo", "porque"], answer: "sin embargo" },
    { id: "b1b-mc-11", question: "Pluscuamperfecto: Cuando llegué, ya ___.", options: ["se fue", "se había ido", "se iba"], answer: "se había ido" },
    { id: "b1b-mc-12", question: "Condicional simples (yo, 'poder'):", options: ["podería", "podría", "puedería"], answer: "podría" },
    { id: "b1b-mc-13", question: "Subjuntivo presente (nosotros, 'ser'):", options: ["seamos", "somos", "seámos"], answer: "seamos" },
    { id: "b1b-mc-14", question: "Imperativo negativo (tú, 'hablar'):", options: ["no habla", "no hables", "no hablas"], answer: "no hables" },
    { id: "b1b-mc-15", question: "Antes de que (él) ___, prepara la cena.", options: ["llega", "llegue", "llegará"], answer: "llegue" },
    { id: "b1b-mc-16", question: "Verbo + preposição: Soñar ___ ti.", options: ["en", "con", "de"], answer: "con" },
    { id: "b1b-mc-17", question: "'Por más que ___, no lo conseguirás'.", options: ["intentas", "intentes", "intentarás"], answer: "intentes" },
    { id: "b1b-mc-18", question: "Conector de consequência:", options: ["por tanto", "aunque", "ya que"], answer: "por tanto" },
    { id: "b1b-mc-19", question: "Estilo indireto: 'Vendré' → Dijo que ___.", options: ["vendrá", "vendría", "vino"], answer: "vendría" },
    { id: "b1b-mc-20", question: "'Llevar + gerundio': ___ dos años estudiando.", options: ["Llevo", "Hago", "Tengo"], answer: "Llevo" },
    { id: "b1b-mc-21", question: "Subjuntivo: Es importante que ___ puntual.", options: ["seas", "eres", "serás"], answer: "seas" },
    { id: "b1b-mc-22", question: "Voz passiva com SER: La carta ___ enviada ayer.", options: ["fue", "estuvo", "está"], answer: "fue" },
    { id: "b1b-mc-23", question: "Imperfecto subjuntivo de 'tener' (yo):", options: ["tuviera", "tenía", "tendría"], answer: "tuviera" },
    { id: "b1b-mc-24", question: "Marcador típico de Pretérito Perfecto:", options: ["ayer", "este año", "en 1999"], answer: "este año" },
    { id: "b1b-mc-25", question: "'Aunque' + Subjuntivo expressa:", options: ["fato", "concessão hipotética", "tempo"], answer: "concessão hipotética" },
    { id: "b1b-mc-26", question: "'Para que' sempre rege:", options: ["indicativo", "subjuntivo", "infinitivo"], answer: "subjuntivo" },
    { id: "b1b-mc-27", question: "Verbo de opinião negado: No creo que ___ verdad.", options: ["es", "sea", "será"], answer: "sea" },
    { id: "b1b-mc-28", question: "'A pesar de + infinitivo': A pesar de ___ cansado, salí.", options: ["estar", "estoy", "esté"], answer: "estar" },
    { id: "b1b-mc-29", question: "Perífrase de obrigação:", options: ["hay que + inf.", "ir a + inf.", "acabar de + inf."], answer: "hay que + inf." },
    { id: "b1b-mc-30", question: "'Echar de menos' significa:", options: ["sentir falta", "criticar", "atrasar"], answer: "sentir falta" },
  ],
  discursive: [
    { id: "b1b-d-1", question: "Escreva 2–3 frases sobre uma experiência marcante usando o Pretérito Perfecto.", example: "He viajado a muchos países, pero nunca he estado en Japón. Este año he empezado a estudiar japonés y he conocido a personas increíbles.", tip: "Perfecto: ações conectadas com o presente." },
    { id: "b1b-d-2", question: "Construa uma frase 'Si' tipo II (Condicional + Subj. Imperfecto) sobre ganhar na loteria.", example: "Si ganara la lotería, viajaría por el mundo y ayudaría a mi familia.", tip: "Si + imperfecto subj. + condicional simples." },
    { id: "b1b-d-3", question: "Parágrafo (3–4 frases) defendendo uma opinião sobre tecnologia, com Subjuntivo e conectores.", example: "Creo que es importante que usemos la tecnología con responsabilidad. Sin embargo, no podemos depender solo de ella. Por consiguiente, debemos buscar un equilibrio entre la vida digital y la real.", tip: "Use 'es importante que + subj.'." },
    { id: "b1b-d-4", question: "Transforme em discurso indireto: María dijo: 'Mañana iré al médico porque estoy enferma.'", example: "María dijo que al día siguiente iría al médico porque estaba enferma.", tip: "Futuro → condicional; presente → imperfecto." },
    { id: "b1b-d-5", question: "Diálogo (4 falas) em que duas pessoas discordam educadamente sobre teletrabalho.", example: "—En mi opinión, el trabajo remoto es más productivo. —No estoy del todo de acuerdo, depende de la persona. —Es verdad, pero permite más libertad. —Sí, aunque echo de menos el contacto con los compañeros.", tip: "Use 'no estoy del todo de acuerdo'." },
    { id: "b1b-d-6", question: "Dê um conselho a um amigo estressado (3 frases, use subjuntivo).", example: "Te recomiendo que descanses más. Es importante que duermas bien y que hagas deporte. Ojalá te sientas mejor pronto.", tip: "'Te recomiendo que + subj.'." },
    { id: "b1b-d-7", question: "Conte uma viagem que mudou sua vida (3 frases, mistura Indefinido + Imperfecto).", example: "Cuando tenía veinte años, viajé sola a Europa. Era invierno y hacía mucho frío, pero conocí a gente maravillosa. Aquella experiencia me cambió para siempre.", tip: "Imperfecto descreve; Indefinido narra." },
    { id: "b1b-d-8", question: "Escreva um e-mail formal (3 frases) reclamando de um produto defeituoso.", example: "Estimados señores: Les escribo para informarles de que el producto recibido el 5 de marzo presenta un defecto en el sistema. Les solicito una sustitución o el reembolso íntegro. Atentamente, Ana Pérez.", tip: "Use 'les escribo', 'les solicito', 'atentamente'." },
    { id: "b1b-d-9", question: "Expresse uma hipótese sobre o futuro com 'cuando + subjuntivo' (2 frases).", example: "Cuando termine la universidad, buscaré un trabajo en el extranjero. Cuando tenga experiencia, abriré mi propia empresa.", tip: "Cuando + subj. presente para futuro." },
    { id: "b1b-d-10", question: "Faça uma reclamação polida em um restaurante (diálogo de 4 falas).", example: "—Disculpe, este plato está frío. —Lo siento mucho, ¿se lo cambio? —Sí, por favor. —En seguida, le pido disculpas por la espera.", tip: "Use formas de cortesia: disculpe, ¿podría…?" },
  ],
};

// ============================================================
// B2
// ============================================================
const B2: ExamBank = {
  multipleChoice: [
    { id: "b2b-mc-1", question: "Si yo ___ tú, hablaría con él.", options: ["soy", "fuera", "sería"], answer: "fuera" },
    { id: "b2b-mc-2", question: "Si hubiera estudiado, ___ aprobado.", options: ["habría", "hubiera", "habrá"], answer: "habría" },
    { id: "b2b-mc-3", question: "Quería que tú ___ pronto.", options: ["vienes", "vinieras", "vendrás"], answer: "vinieras" },
    { id: "b2b-mc-4", question: "Aunque ___ caro, lo compraré (não sei se é).", options: ["es", "sea", "será"], answer: "sea" },
    { id: "b2b-mc-5", question: "Cuando llegué, ya ___.", options: ["se fue", "se había ido", "se iba"], answer: "se había ido" },
    { id: "b2b-mc-6", question: "La puerta ___ por el guardia ayer.", options: ["está cerrada", "fue cerrada", "es cerrada"], answer: "fue cerrada" },
    { id: "b2b-mc-7", question: "Conector formal de causa:", options: ["porque", "dado que", "así"], answer: "dado que" },
    { id: "b2b-mc-8", question: "'Vendré' → Dijo que ___.", options: ["vendrá", "vendría", "vino"], answer: "vendría" },
    { id: "b2b-mc-9", question: "Te llamo para que ___ informado.", options: ["estás", "estés", "estarás"], answer: "estés" },
    { id: "b2b-mc-10", question: "'Tomar una decisión' é uma colocação:", options: ["correta", "errada (deve ser 'hacer')", "informal"], answer: "correta" },
    { id: "b2b-mc-11", question: "Subjuntivo perfecto: Espero que ___ llegado bien.", options: ["hayas", "hubieras", "has"], answer: "hayas" },
    { id: "b2b-mc-12", question: "Pluscuamperfecto subj.: Si ___ sabido…", options: ["hubiera", "habría", "tuviera"], answer: "hubiera" },
    { id: "b2b-mc-13", question: "Conector concessivo formal:", options: ["a pesar de que", "porque", "ya que"], answer: "a pesar de que" },
    { id: "b2b-mc-14", question: "Voz passiva refleja: ___ contratado a tres ingenieros.", options: ["Ha sido", "Se ha", "Se han"], answer: "Se han" },
    { id: "b2b-mc-15", question: "'A no ser que' rege:", options: ["indicativo", "subjuntivo", "infinitivo"], answer: "subjuntivo" },
    { id: "b2b-mc-16", question: "'Hubiera querido + inf.' expressa:", options: ["desejo passado não realizado", "ordem", "presente"], answer: "desejo passado não realizado" },
    { id: "b2b-mc-17", question: "Conector de adição formal:", options: ["asimismo", "también", "y"], answer: "asimismo" },
    { id: "b2b-mc-18", question: "Discurso indireto: 'He terminado' → Dijo que ___.", options: ["terminó", "había terminado", "ha terminado"], answer: "había terminado" },
    { id: "b2b-mc-19", question: "Imperativo de cortesia (usted) de 'hacer':", options: ["haz", "haga", "hace"], answer: "haga" },
    { id: "b2b-mc-20", question: "Construção factitiva: Le ___ reparar el coche.", options: ["hice", "hago", "haga"], answer: "hice" },
    { id: "b2b-mc-21", question: "Marcador de hipótese: Quizás ___ razón.", options: ["tiene", "tenga", "tendrá"], answer: "tenga" },
    { id: "b2b-mc-22", question: "'En cuanto ___, te aviso'.", options: ["llego", "llegue", "llegaré"], answer: "llegue" },
    { id: "b2b-mc-23", question: "Régimen: Constar ___ tres partes.", options: ["en", "de", "con"], answer: "de" },
    { id: "b2b-mc-24", question: "'Llevar a cabo' significa:", options: ["realizar", "carregar", "transportar"], answer: "realizar" },
    { id: "b2b-mc-25", question: "Conector de exemplificação formal:", options: ["por ejemplo", "verbigracia", "ambos"], answer: "ambos" },
    { id: "b2b-mc-26", question: "Subj. imperfecto (-se): Si tuviese / tuviera — são:", options: ["sinônimos", "diferentes", "errados"], answer: "sinônimos" },
    { id: "b2b-mc-27", question: "'Por mucho que ___, no entiendo'.", options: ["leo", "lea", "leeré"], answer: "lea" },
    { id: "b2b-mc-28", question: "Estilo indireto livre é típico de:", options: ["jornalismo factual", "narrativa literária", "manual técnico"], answer: "narrativa literária" },
    { id: "b2b-mc-29", question: "Conjugação culta: 'haber + participio' = tempos:", options: ["simples", "compostos", "imperativos"], answer: "compostos" },
    { id: "b2b-mc-30", question: "'Ponerse las pilas' é:", options: ["expressão coloquial = esforçar-se", "verbo literal", "termo técnico"], answer: "expressão coloquial = esforçar-se" },
  ],
  discursive: [
    { id: "b2b-d-1", question: "Frase Tipo III (Si + Pluscuamperf. Subj. + Cond. Compuesto) sobre uma decisão passada.", example: "Si hubiera aceptado el trabajo en Madrid, habría conocido a gente increíble.", tip: "Estrutura: Si hubiera + part. , habría + part." },
    { id: "b2b-d-2", question: "Reescreva no Estilo Indireto: María dijo: 'Mañana iré al médico porque he estado enferma'.", example: "María dijo que al día siguiente iría al médico porque había estado enferma.", tip: "Futuro→condicional; perfecto→pluscuamperfecto." },
    { id: "b2b-d-3", question: "Abertura e encerramento de carta formal solicitando informação sobre um curso.", example: "Estimado/a señor/a: Me dirijo a usted con el fin de solicitar información sobre el curso anunciado en su página web. (…) En espera de su respuesta, le saluda atentamente, [Nombre].", tip: "Aberturas: 'Me dirijo a usted con el fin de…'." },
    { id: "b2b-d-4", question: "Parágrafo argumentativo (3–4 frases) defendendo o teletrabalho com 3 conectores e Subjuntivo.", example: "En mi opinión, es fundamental que las empresas apuesten por el teletrabajo. Dado que la tecnología lo permite, no hay razón para obligar a desplazamientos diarios. Sin embargo, conviene que se mantenga el contacto presencial. Por consiguiente, el modelo híbrido parece la mejor opción.", tip: "Use 'dado que', 'sin embargo', 'por consiguiente'." },
    { id: "b2b-d-5", question: "Use 'ponerse las pilas' e 'llevar a cabo' em uma frase coerente.", example: "Tenemos que ponernos las pilas si queremos llevar a cabo el proyecto antes de fin de año.", tip: "Encadeie a expressão coloquial com a colocação formal." },
    { id: "b2b-d-6", question: "Escreva uma análise crítica curta (3 frases) sobre redes sociais.", example: "Aunque las redes sociales hayan democratizado la comunicación, también han generado adicción y desinformación. Es necesario que los usuarios desarrollen un sentido crítico. De lo contrario, perderemos la capacidad de discernir.", tip: "Use 'aunque + subj.' e conectores formais." },
    { id: "b2b-d-7", question: "Hipótese irreal no presente (Si + Imperf. Subj. + Cond.): 2 frases.", example: "Si tuviera más tiempo, aprendería tres idiomas más. Si pudiera elegir, viviría seis meses en Madrid y seis en Buenos Aires.", tip: "Tipo II — hipóteses presentes irreais." },
    { id: "b2b-d-8", question: "Escreva um parágrafo formal (4 frases) propondo uma solução para o desemprego juvenil.", example: "El desempleo juvenil constituye uno de los retos más urgentes de la sociedad actual. A fin de mitigarlo, conviene que las administraciones impulsen la formación dual. Asimismo, las empresas deberían ofrecer programas de prácticas remuneradas. Sólo así lograremos integrar a los jóvenes en el mercado laboral.", tip: "Use registro formal e conectores cultos." },
    { id: "b2b-d-9", question: "Reescreva em voz passiva: 'El comité aprobó la propuesta ayer.'", example: "La propuesta fue aprobada por el comité ayer.", tip: "Estrutura: sujeto pasivo + ser + participio + por + agente." },
    { id: "b2b-d-10", question: "Escreva uma crítica de filme em 3 frases (vocabulário avançado).", example: "La película retrata con maestría la soledad contemporánea. La interpretación de la protagonista resulta absolutamente conmovedora. Sin embargo, el guion adolece de cierta lentitud en el segundo acto.", tip: "Use 'retratar', 'resultar', 'adolecer de'." },
  ],
};

// ============================================================
// C1
// ============================================================
const C1: ExamBank = {
  multipleChoice: [
    { id: "c1b-mc-1", question: "Reduplicação de concessão total:", options: ["Sea como es", "Sea como sea", "Es como sea"], answer: "Sea como sea" },
    { id: "c1b-mc-2", question: "'De haberlo sabido…' equivale a:", options: ["Si lo sé…", "Si lo hubiera sabido…", "Si lo supiera…"], answer: "Si lo hubiera sabido…" },
    { id: "c1b-mc-3", question: "Particípio absoluto correto:", options: ["Terminado la reunión", "Terminada la reunión", "Terminar la reunión"], answer: "Terminada la reunión" },
    { id: "c1b-mc-4", question: "'Sine qua non' significa:", options: ["sem dúvida", "indispensável", "porventura"], answer: "indispensável" },
    { id: "c1b-mc-5", question: "Régimen: Me alegro ___ que vengas.", options: ["por", "de", "Ø"], answer: "de" },
    { id: "c1b-mc-6", question: "'Embarazada' significa:", options: ["envergonhada", "grávida", "atrapalhada"], answer: "grávida" },
    { id: "c1b-mc-7", question: "Castelhano peninsular distingue:", options: ["/s/ e /θ/", "/s/ e /ʃ/", "/θ/ e /ʃ/"], answer: "/s/ e /θ/" },
    { id: "c1b-mc-8", question: "'Currar' (Espanha) significa:", options: ["correr", "trabalhar", "comer"], answer: "trabalhar" },
    { id: "c1b-mc-9", question: "'Cabe señalar que…' é típico de:", options: ["coloquial", "acadêmico (hedging)", "ironia"], answer: "acadêmico (hedging)" },
    { id: "c1b-mc-10", question: "Estilo indireto livre funde:", options: ["dois personagens", "voz do narrador + consciência do personagem", "verso e prosa"], answer: "voz do narrador + consciência do personagem" },
    { id: "c1b-mc-11", question: "Régimen culto: Constar ___ varios capítulos.", options: ["en", "de", "con"], answer: "de" },
    { id: "c1b-mc-12", question: "'A fin de que' rege:", options: ["indicativo", "subjuntivo", "infinitivo"], answer: "subjuntivo" },
    { id: "c1b-mc-13", question: "Conector culto de consequência:", options: ["por ende", "porque", "pues"], answer: "por ende" },
    { id: "c1b-mc-14", question: "Latinismo 'grosso modo' significa:", options: ["de forma exata", "aproximadamente", "literalmente"], answer: "aproximadamente" },
    { id: "c1b-mc-15", question: "Plural culto de 'régimen':", options: ["régimens", "regímenes", "régimenes"], answer: "regímenes" },
    { id: "c1b-mc-16", question: "Pronome neutro 'lo': Lo importante es ___.", options: ["la verdad", "estudiar", "ambos servem"], answer: "ambos servem" },
    { id: "c1b-mc-17", question: "Estilo cumprido: 'no se hizo de rogar' significa:", options: ["recusou", "aceitou de imediato", "demorou muito"], answer: "aceitou de imediato" },
    { id: "c1b-mc-18", question: "Marcador de hipótese culta:", options: ["acaso", "tal vez", "ambos"], answer: "ambos" },
    { id: "c1b-mc-19", question: "Gerúndio com valor causal: ___ enfermo, no asistió.", options: ["Estando", "Estado", "Habiendo"], answer: "Estando" },
    { id: "c1b-mc-20", question: "Conector adversativo formal:", options: ["empero", "pero", "y"], answer: "empero" },
    { id: "c1b-mc-21", question: "'Tener a bien' significa:", options: ["dignar-se a", "ter sorte", "estar bem"], answer: "dignar-se a" },
    { id: "c1b-mc-22", question: "Subjuntivo dubitativo: Dudo que ___ verdad.", options: ["es", "sea", "será"], answer: "sea" },
    { id: "c1b-mc-23", question: "'En aras de' significa:", options: ["em prol de", "ao lado de", "contra"], answer: "em prol de" },
    { id: "c1b-mc-24", question: "Castiço: 'estar en sus trece' significa:", options: ["ser teimoso", "ter 13 anos", "estar com sorte"], answer: "ser teimoso" },
    { id: "c1b-mc-25", question: "Voseo é típico de:", options: ["Espanha", "Rio da Prata", "México"], answer: "Rio da Prata" },
    { id: "c1b-mc-26", question: "'Habida cuenta de' significa:", options: ["considerando", "apesar de", "sem contar"], answer: "considerando" },
    { id: "c1b-mc-27", question: "Régimen: Carecer ___ recursos.", options: ["en", "de", "con"], answer: "de" },
    { id: "c1b-mc-28", question: "Lexema culto: 'menester' equivale a:", options: ["necessidade", "ofício", "ambos"], answer: "ambos" },
    { id: "c1b-mc-29", question: "Estrutura ecuacional: 'Es el dinero ___ me preocupa'.", options: ["que", "lo que", "el cual"], answer: "lo que" },
    { id: "c1b-mc-30", question: "'A ciencia cierta' significa:", options: ["com certeza absoluta", "por suposição", "talvez"], answer: "com certeza absoluta" },
  ],
  discursive: [
    { id: "c1b-d-1", question: "Frase com reduplicação de Subjuntivo (concessão total) sobre persistência.", example: "Pase lo que pase, no me rendiré.", tip: "Estrutura: V(subj.) + lo que + V(subj.)." },
    { id: "c1b-d-2", question: "Reescreva como Tipo III com 'De + infinitivo composto': 'Si hubiera llegado antes, lo habría visto.'", example: "De haber llegado antes, lo habría visto.", tip: "'De + haber + part.' substitui 'Si hubiera + part.'." },
    { id: "c1b-d-3", question: "Parágrafo argumentativo (3 frases) sobre cultura espanhola, com 1 latinismo, 1 conector formal e Subjuntivo.", example: "A priori, conviene señalar que la sobremesa es un rasgo identitario de la cultura española. Sin embargo, es necesario que las nuevas generaciones la preserven. De ahí que urja recuperar el ritmo pausado del castellano cotidiano.", tip: "Encaixe um latinismo (a priori, in extremis…)." },
    { id: "c1b-d-4", question: "Abertura formal de carta acadêmica solicitando informação sobre um doutorado em Madrid.", example: "Estimado/a profesor/a: Me dirijo a usted con el fin de solicitar información acerca del programa de doctorado ofrecido por su departamento, así como los requisitos de admisión para el próximo curso académico.", tip: "Use 'me dirijo a usted con el fin de…'." },
    { id: "c1b-d-5", question: "Use 'no andarse con rodeos' e 'llevar a cabo' em uma frase do castelhano culto.", example: "Sin andarse con rodeos, el comité decidió llevar a cabo la reforma de inmediato.", tip: "Combine expressão idiomática + colocação formal." },
    { id: "c1b-d-6", question: "Escreva uma frase com particípio absoluto + uma com gerúndio causal.", example: "Concluida la sesión, los asistentes abandonaron la sala. Estando ya cansado, decidí retirarme temprano.", tip: "Particípio absoluto vai antes da oração principal." },
    { id: "c1b-d-7", question: "Escreva um trecho jornalístico (3 frases) sobre uma reforma política, em registro culto.", example: "El Ejecutivo ha presentado un nuevo proyecto de ley que pretende modernizar la administración pública. Habida cuenta de su impacto, los grupos parlamentarios ya han anunciado enmiendas. Por ende, se prevé un debate intenso en las próximas semanas.", tip: "Use 'habida cuenta de', 'por ende', 'se prevé'." },
    { id: "c1b-d-8", question: "Refaça em estilo elevado: 'No vino porque estaba cansado.'", example: "No asistió, habida cuenta del cansancio que lo aquejaba.", tip: "Substitua subordinadas causais por construções nominais cultas." },
    { id: "c1b-d-9", question: "Escreva um pequeno comentário literário (3 frases) sobre 'Cien años de soledad'.", example: "Cien años de soledad constituye una de las cumbres del realismo mágico. García Márquez logra que lo extraordinario irrumpa con naturalidad en lo cotidiano. De ahí que su prosa siga fascinando a generaciones de lectores.", tip: "Use 'constituye', 'logra que + subj.', 'de ahí que + subj.'." },
    { id: "c1b-d-10", question: "Construa uma definição de 'libertad' em registro filosófico (2 frases).", example: "La libertad no consiste en hacer cuanto se desea, sino en obrar conforme a la razón. En ese sentido, ser libre implica asumir la responsabilidad plena de los propios actos.", tip: "Use 'no … sino', 'en ese sentido', 'implicar'." },
  ],
};

// ============================================================
// C2
// ============================================================
const C2: ExamBank = {
  multipleChoice: [
    { id: "c2b-mc-1", question: "Futuro de Subjuntivo (-RE) aparece em:", options: ["fala juvenil", "textos jurídicos espanhóis", "publicidade"], answer: "textos jurídicos espanhóis" },
    { id: "c2b-mc-2", question: "Leísmo aceito pela RAE refere-se a:", options: ["objeto fem. sing.", "pessoa masc. sing.", "objeto plural"], answer: "pessoa masc. sing." },
    { id: "c2b-mc-3", question: "'Se venden pisos' é SE:", options: ["reflexivo", "pasivo", "de cambio"], answer: "pasivo" },
    { id: "c2b-mc-4", question: "Mudança histórica característica do castelhano:", options: ["F→H", "P→B", "T→D"], answer: "F→H" },
    { id: "c2b-mc-5", question: "'Almohada' tem origem:", options: ["latina", "árabe", "germânica"], answer: "árabe" },
    { id: "c2b-mc-6", question: "Conceptismo associa-se a:", options: ["Lorca", "Quevedo", "Cervantes"], answer: "Quevedo" },
    { id: "c2b-mc-7", question: "'Hielo abrasador' é:", options: ["metáfora", "oxímoron", "ironía"], answer: "oxímoron" },
    { id: "c2b-mc-8", question: "Diálogo literário espanhol usa:", options: ["aspas «»", "travessão —", "parênteses"], answer: "travessão —" },
    { id: "c2b-mc-9", question: "'En virtud de' pertence ao registro:", options: ["coloquial", "jurídico-administrativo", "literário"], answer: "jurídico-administrativo" },
    { id: "c2b-mc-10", question: "Estrutura clássica retórica termina em:", options: ["exordio", "peroratio", "narratio"], answer: "peroratio" },
    { id: "c2b-mc-11", question: "Latinismo 'ad hoc' significa:", options: ["por agora", "para isso", "antes de mais nada"], answer: "para isso" },
    { id: "c2b-mc-12", question: "'Cuyo' é pronome:", options: ["pessoal", "relativo possessivo", "demonstrativo"], answer: "relativo possessivo" },
    { id: "c2b-mc-13", question: "Plural culto de 'currículum':", options: ["currículums", "currícula", "ambos aceitos"], answer: "ambos aceitos" },
    { id: "c2b-mc-14", question: "RAE foi fundada em:", options: ["1492", "1713", "1898"], answer: "1713" },
    { id: "c2b-mc-15", question: "Generación del 27 inclui:", options: ["Cervantes", "Lorca", "Quevedo"], answer: "Lorca" },
    { id: "c2b-mc-16", question: "'Empero' é sinônimo culto de:", options: ["porque", "no entanto", "talvez"], answer: "no entanto" },
    { id: "c2b-mc-17", question: "Anáfora é a repetição de:", options: ["som final", "palavra/expressão no início", "ideia central"], answer: "palavra/expressão no início" },
    { id: "c2b-mc-18", question: "Quiasmo é:", options: ["paralelismo cruzado", "rima interna", "metáfora dupla"], answer: "paralelismo cruzado" },
    { id: "c2b-mc-19", question: "Vossear (voseo) usa 'vos' como:", options: ["tú", "usted", "vosotros"], answer: "tú" },
    { id: "c2b-mc-20", question: "Linguagem inclusiva: a RAE recomenda:", options: ["elle/todes", "masculino genérico", "x/@"], answer: "masculino genérico" },
    { id: "c2b-mc-21", question: "'Sin ambages' significa:", options: ["sem rodeios", "sem dinheiro", "sem permissão"], answer: "sem rodeios" },
    { id: "c2b-mc-22", question: "'Compareció y EXPONE' é fórmula de:", options: ["sentença judicial", "instância administrativa", "carta comercial"], answer: "instância administrativa" },
    { id: "c2b-mc-23", question: "Microrrelato de Monterroso termina com:", options: ["el dinosaurio todavía estaba allí", "y vivieron felices", "the end"], answer: "el dinosaurio todavía estaba allí" },
    { id: "c2b-mc-24", question: "'Habida cuenta de' rege:", options: ["sustantivo/infinitivo", "subjuntivo", "imperativo"], answer: "sustantivo/infinitivo" },
    { id: "c2b-mc-25", question: "'A la sazón' significa:", options: ["então (naquele momento)", "talvez", "imediatamente"], answer: "então (naquele momento)" },
    { id: "c2b-mc-26", question: "Régimen: 'Adolecer ___ falta de claridad'.", options: ["en", "de", "por"], answer: "de" },
    { id: "c2b-mc-27", question: "Particípio dual: 'imprimir' aceita:", options: ["solo 'imprimido'", "solo 'impreso'", "ambos"], answer: "ambos" },
    { id: "c2b-mc-28", question: "Latinismo 'in fine' significa:", options: ["ao final", "ao início", "no meio"], answer: "ao final" },
    { id: "c2b-mc-29", question: "Conector culto consecutivo:", options: ["de suerte que", "porque", "y"], answer: "de suerte que" },
    { id: "c2b-mc-30", question: "'A mayor abundamiento' é típico de:", options: ["conversa informal", "textos jurídicos", "publicidade"], answer: "textos jurídicos" },
  ],
  discursive: [
    { id: "c2b-d-1", question: "Traduza para o castelhano: 'Aconteça o que acontecer, manteremos a palavra dada.'", example: "Pase lo que pase, mantendremos la palabra dada.", tip: "Reduplicação de subjuntivo para concessão total." },
    { id: "c2b-d-2", question: "Reescreva como Tipo III com 'De + infinitivo composto': 'Si lo hubiera sabido, te habría llamado.'", example: "De haberlo sabido, te habría llamado.", tip: "Substitua Si+hubiera por De+haber+part." },
    { id: "c2b-d-3", question: "Escreva uma frase com construção ecuacional para enfatizar 'el trabajo'.", example: "Es el trabajo lo que me preocupa.", tip: "Estrutura: Es + sintagma + lo que/quien…" },
    { id: "c2b-d-4", question: "Escreva a abertura de uma instância administrativa em castelhano.", example: "Don Juan Pérez, mayor de edad, con DNI 12345678A, con domicilio en Madrid, comparece y EXPONE:", tip: "Use o verbo 'comparece y EXPONE/SOLICITA'." },
    { id: "c2b-d-5", question: "Escreva um microrrelato de uma frase ao estilo de Monterroso.", example: "Cuando despertó, el dinosaurio todavía estaba allí.", tip: "Brevidade + virada conceitual no final." },
    { id: "c2b-d-6", question: "Parágrafo filosófico (3 frases) sobre liberdade, em registro culto.", example: "La libertad, lejos de ser un don gratuito, exige una conquista permanente sobre uno mismo. De suerte que sólo es libre quien obra conforme a la razón. En consecuencia, libertad y responsabilidad resultan inseparables.", tip: "Use 'lejos de + inf.', 'de suerte que', 'en consecuencia'." },
    { id: "c2b-d-7", question: "Escreva um editorial breve (3 frases) sobre meio ambiente em registro jornalístico culto.", example: "El cambio climático constituye, sin lugar a dudas, el mayor desafío de nuestro tiempo. Habida cuenta de su urgencia, resulta imprescindible que los gobiernos adopten medidas vinculantes. De lo contrario, las generaciones venideras heredarán un planeta inhóspito.", tip: "'Sin lugar a dudas', 'habida cuenta de', 'de lo contrario'." },
    { id: "c2b-d-8", question: "Análise literária curta (3 frases) sobre uma obra do Século de Ouro.", example: "El Quijote inaugura la novela moderna al instaurar la ironía como principio estructural. Cervantes logra que la ficción y la realidad dialoguen sin tregua. De ahí que cada relectura ofrezca matices insospechados.", tip: "Use 'inaugurar', 'instaurar', 'de ahí que + subj.'." },
    { id: "c2b-d-9", question: "Escreva uma frase com particípio absoluto + outra com 'cuyo' (relativo possessivo).", example: "Aprobada la moción, el pleno levantó la sesión. El autor, cuya obra es de difícil acceso, recibirá próximamente un homenaje.", tip: "Particípio absoluto sempre concorda; 'cuyo' = de quem/cujo." },
    { id: "c2b-d-10", question: "Traduza preservando o registro culto: 'Sem rodeios, é necessário que assumamos a responsabilidade plena.'", example: "Sin ambages, es menester que asumamos la responsabilidad plena.", tip: "'Sin ambages' = sem rodeios; 'es menester que + subj.'." },
  ],
};

// ============================================================
// Export
// ============================================================
export const EXAM_BANKS: Record<LevelId, ExamBank> = {
  A1, A2, B1, B2, C1, C2,
};

export const getExamBank = (level: LevelId): ExamBank | undefined =>
  EXAM_BANKS[level];
