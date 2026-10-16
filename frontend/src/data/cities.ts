import madridImg from "@/assets/cities/madrid.jpg";
import valenciaImg from "@/assets/cities/valencia.jpg";
import barcelonaImg from "@/assets/cities/barcelona.jpg";
import sevillaImg from "@/assets/cities/sevilla.jpg";
import toledoImg from "@/assets/cities/toledo.jpg";
import zaragozaImg from "@/assets/cities/zaragoza.jpg";
import granadaImg from "@/assets/cities/granada.jpg";
import malagaImg from "@/assets/cities/malaga.jpg";
import alicanteImg from "@/assets/cities/alicante.jpg";
import murciaImg from "@/assets/cities/murcia.jpg";
import corunaImg from "@/assets/cities/coruna.jpg";

export type City = {
  name: string;
  img: string;
  region: string;
  about: string;
  language: string;
  expression: { phrase: string; meaning: string };
};

export const cities: City[] = [
  {
    name: "MADRID",
    img: madridImg,
    region: "Comunidade de Madrid · Centro",
    about:
      "Capital da Espanha e coração político e cultural do país. Madrid é caos elegante: tapas até o amanhecer, museus de classe mundial (Prado, Reina Sofía) e a vida nas ruas de La Latina e Malasaña.",
    language:
      "Castelhano padrão — a referência do espanhol europeu. Pronúncia clara, uso forte de 'vosotros' e da distinção entre 'c/z' (ceceo) e 's'. É o sotaque que você ouve em telejornais espanhóis.",
    expression: { phrase: "¡Mola mazo!", meaning: "É super legal! (gíria muito madrilenha)" },
  },
  {
    name: "BARCELONA",
    img: barcelonaImg,
    region: "Catalunha · Nordeste",
    about:
      "Cidade mediterrânea, modernista e cosmopolita. Berço de Gaudí (Sagrada Família, Park Güell), praias urbanas e o ritmo único do bairro do Eixample. Aqui vive-se entre o mar e a montanha.",
    language:
      "Bilíngue: castelhano + catalão. O espanhol falado tem entoação catalã, com 's' mais marcado e leves trocas de vogais. Você verá placas em catalão e ouvirá ambos os idiomas misturados.",
    expression: { phrase: "¡Qué fuerte!", meaning: "Que loucura! / Não acredito!" },
  },
  {
    name: "VALENCIA",
    img: valenciaImg,
    region: "Comunidade Valenciana · Mediterrâneo",
    about:
      "Cidade da paella, das Fallas e da futurista Cidade das Artes e Ciências. Valência mistura tradição rural, praia e arquitetura de vanguarda — tudo banhado por um sol generoso.",
    language:
      "Castelhano com forte influência do valenciano (variante do catalão). Sotaque suave, vogais abertas e uso frequente de diminutivos carinhosos como '-et' / '-eta'.",
    expression: { phrase: "¡Xe, qué guay!", meaning: "Cara, que bacana! ('xe' é interjeição valenciana)" },
  },
  {
    name: "SEVILLA",
    img: sevillaImg,
    region: "Andaluzia · Sul",
    about:
      "Alma do flamenco, das touradas e da Semana Santa. Sevilha é Plaza de España, bairros como Triana e Santa Cruz, e o ritual sagrado das tapas em pátios cheios de azulejos.",
    language:
      "Andaluz — um dos sotaques mais musicais do espanhol. Engole o 's' final ('má o meno' por 'más o menos'), aspira o 'j' e usa 'ustedes' no lugar de 'vosotros'.",
    expression: { phrase: "¡Qué arte tienes!", meaning: "Você tem muito charme/talento!" },
  },
  {
    name: "TOLEDO",
    img: toledoImg,
    region: "Castela-Mancha · Centro",
    about:
      "Cidade das três culturas (cristã, judaica e árabe), patrimônio da humanidade. Suas ruas medievais labirínticas e o Alcázar guardam séculos de história. A 30 min de Madrid.",
    language:
      "Castelhano clássico, considerado um dos espanhóis mais 'puros' por razões históricas. Pronúncia pausada, vocabulário tradicional e o famoso ceceo bem marcado.",
    expression: { phrase: "¡Anda ya!", meaning: "Vai nessa! / Imagina!" },
  },
  {
    name: "ZARAGOZA",
    img: zaragozaImg,
    region: "Aragão · Nordeste",
    about:
      "Às margens do rio Ebro, abriga a impressionante Basílica del Pilar. Zaragoza é cidade de Goya, do Pilar e de uma vida noturna legítima — sem o turismo massivo das capitais.",
    language:
      "Castelhano aragonês com uma entoação muito particular: 'cantadinha', com palavras que terminam alongadas. Conserva palavras do antigo aragonês como 'majo' (legal/simpático).",
    expression: { phrase: "¡Maño, qué majo eres!", meaning: "Cara, você é gente boa! ('maño' = irmão, no Aragão)" },
  },
  {
    name: "GRANADA",
    img: granadaImg,
    region: "Andaluzia · Sul",
    about:
      "Última cidade muçulmana da Espanha, dominada pela Alhambra. Mistura mouros, ciganos e estudantes. Tem a tradição mais bonita: você pede uma cerveja e ganha tapa de graça.",
    language:
      "Andaluz oriental — corta sílabas, aspira 's' e tem entoação muito expressiva. Vocabulário com forte herança árabe (almohada, aceituna, ojalá).",
    expression: { phrase: "¡Está chachi!", meaning: "Está ótimo! / Está show!" },
  },
  {
    name: "MÁLAGA",
    img: malagaImg,
    region: "Costa del Sol · Sul",
    about:
      "Berço de Picasso e porta da Costa del Sol. Málaga é praia, cultura, vinho doce e um centro histórico revitalizado que virou destino top da Andaluzia nos últimos anos.",
    language:
      "Andaluz costeiro — rápido, melódico, com 's' praticamente desaparecido. Uso intenso de 'illo/illa' como tratamento informal ('¿qué pasa, illo?' = e aí, mano?).",
    expression: { phrase: "¡Quillo, qué arte!", meaning: "Mano, que estilo! (contração de 'chiquillo')" },
  },
  {
    name: "ALICANTE",
    img: alicanteImg,
    region: "Comunidade Valenciana · Costa Blanca",
    about:
      "Castelo de Santa Bárbara sobre a cidade, praias urbanas (Postiguet) e o Mediterrâneo como pano de fundo. Alicante é o destino de quem quer praia espanhola sem turismo massivo.",
    language:
      "Castelhano com influência valenciana. Sotaque ameno, fácil de entender para iniciantes, e mistura com palavras catalãs no dia a dia.",
    expression: { phrase: "¡Vaya tela!", meaning: "Que coisa! / Que situação!" },
  },
  {
    name: "MURCIA",
    img: murciaImg,
    region: "Região de Murcia · Sudeste",
    about:
      "Conhecida como 'a horta da Europa' pela agricultura. Cidade descontraída, universitária, com gastronomia única (zarangollo, michirones) e clima quase sempre quente.",
    language:
      "Murciano (panocho) — variante muito particular do espanhol, com vogais finais abertas, perda de 's' e vocabulário próprio. Considerado um dos sotaques mais difíceis para estrangeiros.",
    expression: { phrase: "¡Acho, pijo!", meaning: "Cara, mano! (interjeição típica murciana)" },
  },
  {
    name: "A CORUÑA",
    img: corunaImg,
    region: "Galícia · Noroeste",
    about:
      "Cidade atlântica, ventosa e verde. Tem a Torre de Hércules (farol romano em uso há 2 mil anos), marisco fresco e a melhor empanada do mundo. Outro mundo dentro da Espanha.",
    language:
      "Bilíngue: castelhano + galego. O espanhol falado tem entoação cantada (parecida com o português do Brasil!), 's' suave e empréstimos frequentes do galego.",
    expression: { phrase: "¡Qué arte tienes, ho!", meaning: "Que jeito você tem, hein! ('ho' = vocativo galego)" },
  },
];
