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
  aboutEn: string;
  language: string;
  languageEn: string;
  expression: { phrase: string; meaning: string; meaningEn: string };
};

export const cities: City[] = [
  {
    name: "MADRID",
    img: madridImg,
    region: "Comunidade de Madrid · Centro",
    about:
      "Capital da Espanha e coração político e cultural do país. Madrid é caos elegante: tapas até o amanhecer, museus de classe mundial (Prado, Reina Sofía) e a vida nas ruas de La Latina e Malasaña.",
    aboutEn:
      "Capital of Spain and the political and cultural heart of the country. Madrid is elegant chaos: tapas until dawn, world-class museums (Prado, Reina Sofía) and vibrant street life in La Latina and Malasaña.",
    language:
      "Castelhano padrão — a referência do espanhol europeu. Pronúncia clara, uso forte de 'vosotros' e da distinção entre 'c/z' (ceceo) e 's'. É o sotaque que você ouve em telejornais espanhóis.",
    languageEn:
      "Standard Castilian — the benchmark for European Spanish. Clear pronunciation, strong use of 'vosotros' and the distinctive 'c/z' (ceceo) sound. This is the accent you hear on Spanish news broadcasts.",
    expression: { phrase: "¡Mola mazo!", meaning: "É super legal! (gíria muito madrilenha)", meaningEn: "It's super cool! (very Madrileño slang)" },
  },
  {
    name: "BARCELONA",
    img: barcelonaImg,
    region: "Catalunha · Nordeste",
    about:
      "Cidade mediterrânea, modernista e cosmopolita. Berço de Gaudí (Sagrada Família, Park Güell), praias urbanas e o ritmo único do bairro do Eixample. Aqui vive-se entre o mar e a montanha.",
    aboutEn:
      "Mediterranean, modernist and cosmopolitan city. Birthplace of Gaudí (Sagrada Família, Park Güell), urban beaches and the unique rhythm of the Eixample district. Life here unfolds between the sea and the mountains.",
    language:
      "Bilíngue: castelhano + catalão. O espanhol falado tem entoação catalã, com 's' mais marcado e leves trocas de vogais. Você verá placas em catalão e ouvirá ambos os idiomas misturados.",
    languageEn:
      "Bilingual: Castilian + Catalan. The Spanish spoken here has a Catalan intonation, with a more marked 's' and slight vowel shifts. You'll see signs in Catalan and hear both languages blended together.",
    expression: { phrase: "¡Qué fuerte!", meaning: "Que loucura! / Não acredito!", meaningEn: "That's wild! / I can't believe it!" },
  },
  {
    name: "VALENCIA",
    img: valenciaImg,
    region: "Comunidade Valenciana · Mediterrâneo",
    about:
      "Cidade da paella, das Fallas e da futurista Cidade das Artes e Ciências. Valência mistura tradição rural, praia e arquitetura de vanguarda — tudo banhado por um sol generoso.",
    aboutEn:
      "City of paella, the Fallas festival and the futuristic City of Arts and Sciences. Valencia blends rural tradition, beach life and avant-garde architecture — all bathed in generous sunshine.",
    language:
      "Castelhano com forte influência do valenciano (variante do catalão). Sotaque suave, vogais abertas e uso frequente de diminutivos carinhosos como '-et' / '-eta'.",
    languageEn:
      "Castilian with strong influence from Valencian (a variant of Catalan). Soft accent, open vowels and frequent use of affectionate diminutives like '-et' / '-eta'.",
    expression: { phrase: "¡Xe, qué guay!", meaning: "Cara, que bacana! ('xe' é interjeição valenciana)", meaningEn: "Dude, how cool! ('xe' is a typical Valencian interjection)" },
  },
  {
    name: "SEVILLA",
    img: sevillaImg,
    region: "Andaluzia · Sul",
    about:
      "Alma do flamenco, das touradas e da Semana Santa. Sevilha é Plaza de España, bairros como Triana e Santa Cruz, e o ritual sagrado das tapas em pátios cheios de azulejos.",
    aboutEn:
      "The soul of flamenco, bullfighting and Holy Week. Seville is Plaza de España, neighbourhoods like Triana and Santa Cruz, and the sacred ritual of tapas in azulejo-tiled patios.",
    language:
      "Andaluz — um dos sotaques mais musicais do espanhol. Engole o 's' final ('má o meno' por 'más o menos'), aspira o 'j' e usa 'ustedes' no lugar de 'vosotros'.",
    languageEn:
      "Andalusian — one of the most musical accents in Spanish. Drops the final 's' ('má o meno' for 'más o menos'), aspirates the 'j' and uses 'ustedes' instead of 'vosotros'.",
    expression: { phrase: "¡Qué arte tienes!", meaning: "Você tem muito charme/talento!", meaningEn: "You've got so much charm and talent!" },
  },
  {
    name: "TOLEDO",
    img: toledoImg,
    region: "Castela-Mancha · Centro",
    about:
      "Cidade das três culturas (cristã, judaica e árabe), patrimônio da humanidade. Suas ruas medievais labirínticas e o Alcázar guardam séculos de história. A 30 min de Madrid.",
    aboutEn:
      "City of three cultures (Christian, Jewish and Arab) and a UNESCO World Heritage Site. Its labyrinthine medieval streets and the Alcázar hold centuries of history. Just 30 minutes from Madrid.",
    language:
      "Castelhano clássico, considerado um dos espanhóis mais 'puros' por razões históricas. Pronúncia pausada, vocabulário tradicional e o famoso ceceo bem marcado.",
    languageEn:
      "Classical Castilian, considered one of the 'purest' forms of Spanish for historical reasons. Measured pronunciation, traditional vocabulary and the famous ceceo (th-sound) well marked.",
    expression: { phrase: "¡Anda ya!", meaning: "Vai nessa! / Imagina!", meaningEn: "No way! / Come on!" },
  },
  {
    name: "ZARAGOZA",
    img: zaragozaImg,
    region: "Aragão · Nordeste",
    about:
      "Às margens do rio Ebro, abriga a impressionante Basílica del Pilar. Zaragoza é cidade de Goya, do Pilar e de uma vida noturna legítima — sem o turismo massivo das capitais.",
    aboutEn:
      "On the banks of the Ebro river, home to the stunning Basílica del Pilar. Zaragoza is the city of Goya, of El Pilar and a genuine nightlife scene — without the mass tourism of bigger capitals.",
    language:
      "Castelhano aragonês com uma entoação muito particular: 'cantadinha', com palavras que terminam alongadas. Conserva palavras do antigo aragonês como 'majo' (legal/simpático).",
    languageEn:
      "Aragonese Castilian with a very distinctive sing-songy intonation, where words trail off in a drawn-out way. Preserves words from ancient Aragonese such as 'majo' (cool/nice).",
    expression: { phrase: "¡Maño, qué majo eres!", meaning: "Cara, você é gente boa! ('maño' = irmão, no Aragão)", meaningEn: "Buddy, you're awesome! ('maño' = brother/mate, in Aragon)" },
  },
  {
    name: "GRANADA",
    img: granadaImg,
    region: "Andaluzia · Sul",
    about:
      "Última cidade muçulmana da Espanha, dominada pela Alhambra. Mistura mouros, ciganos e estudantes. Tem a tradição mais bonita: você pede uma cerveja e ganha tapa de graça.",
    aboutEn:
      "Spain's last Muslim city, dominated by the Alhambra fortress. A mix of Moorish history, Gypsy culture and students. Home to a wonderful tradition: order a beer and get a free tapa.",
    language:
      "Andaluz oriental — corta sílabas, aspira 's' e tem entoação muito expressiva. Vocabulário com forte herança árabe (almohada, aceituna, ojalá).",
    languageEn:
      "Eastern Andalusian — cuts syllables, aspirates 's' and has very expressive intonation. Vocabulary carries a strong Arabic heritage (almohada, aceituna, ojalá).",
    expression: { phrase: "¡Está chachi!", meaning: "Está ótimo! / Está show!", meaningEn: "It's awesome! / It's great!" },
  },
  {
    name: "MÁLAGA",
    img: malagaImg,
    region: "Costa del Sol · Sul",
    about:
      "Berço de Picasso e porta da Costa del Sol. Málaga é praia, cultura, vinho doce e um centro histórico revitalizado que virou destino top da Andaluzia nos últimos anos.",
    aboutEn:
      "Birthplace of Picasso and gateway to the Costa del Sol. Málaga means beach, culture, sweet wine and a revitalised historic centre that has become a top destination in Andalusia in recent years.",
    language:
      "Andaluz costeiro — rápido, melódico, com 's' praticamente desaparecido. Uso intenso de 'illo/illa' como tratamento informal ('¿qué pasa, illo?' = e aí, mano?).",
    languageEn:
      "Coastal Andalusian — fast, melodic, with the 's' almost entirely absent. Heavy use of 'illo/illa' as informal address ('¿qué pasa, illo?' = what's up, mate?).",
    expression: { phrase: "¡Quillo, qué arte!", meaning: "Mano, que estilo! (contração de 'chiquillo')", meaningEn: "Mate, what style! (contraction of 'chiquillo')" },
  },
  {
    name: "ALICANTE",
    img: alicanteImg,
    region: "Comunidade Valenciana · Costa Blanca",
    about:
      "Castelo de Santa Bárbara sobre a cidade, praias urbanas (Postiguet) e o Mediterrâneo como pano de fundo. Alicante é o destino de quem quer praia espanhola sem turismo massivo.",
    aboutEn:
      "Santa Bárbara Castle towering over the city, urban beaches (Postiguet) and the Mediterranean as a backdrop. Alicante is the go-to for Spanish beach life without the mass tourism.",
    language:
      "Castelhano com influência valenciana. Sotaque ameno, fácil de entender para iniciantes, e mistura com palavras catalãs no dia a dia.",
    languageEn:
      "Castilian with Valencian influence. A mild, easy-to-follow accent for beginners, with Catalan words sprinkled into everyday conversation.",
    expression: { phrase: "¡Vaya tela!", meaning: "Que coisa! / Que situação!", meaningEn: "What a thing! / What a situation!" },
  },
  {
    name: "MURCIA",
    img: murciaImg,
    region: "Região de Murcia · Sudeste",
    about:
      "Conhecida como 'a horta da Europa' pela agricultura. Cidade descontraída, universitária, com gastronomia única (zarangollo, michirones) e clima quase sempre quente.",
    aboutEn:
      "Known as 'the garden of Europe' for its agriculture. A laid-back university city with unique gastronomy (zarangollo, michirones) and an almost permanently warm climate.",
    language:
      "Murciano (panocho) — variante muito particular do espanhol, com vogais finais abertas, perda de 's' e vocabulário próprio. Considerado um dos sotaques mais difíceis para estrangeiros.",
    languageEn:
      "Murcian (panocho) — a very distinctive variant of Spanish with open final vowels, dropped 's' sounds and its own vocabulary. Considered one of the most challenging accents for foreign learners.",
    expression: { phrase: "¡Acho, pijo!", meaning: "Cara, mano! (interjeição típica murciana)", meaningEn: "Hey, mate! (typical Murcian interjection)" },
  },
  {
    name: "A CORUÑA",
    img: corunaImg,
    region: "Galícia · Noroeste",
    about:
      "Cidade atlântica, ventosa e verde. Tem a Torre de Hércules (farol romano em uso há 2 mil anos), marisco fresco e a melhor empanada do mundo. Outro mundo dentro da Espanha.",
    aboutEn:
      "Atlantic, windy and green. Home to the Tower of Hercules (a Roman lighthouse in use for 2,000 years), fresh shellfish and the best empanada in the world. A world of its own within Spain.",
    language:
      "Bilíngue: castelhano + galego. O espanhol falado tem entoação cantada (parecida com o português do Brasil!), 's' suave e empréstimos frequentes do galego.",
    languageEn:
      "Bilingual: Castilian + Galician. The Spanish spoken here has a melodic, sing-song intonation (similar to Brazilian Portuguese!), a soft 's' and frequent loanwords from Galician.",
    expression: { phrase: "¡Qué arte tienes, ho!", meaning: "Que jeito você tem, hein! ('ho' = vocativo galego)", meaningEn: "What a way you have about you! ('ho' is a Galician term of address)" },
  },
];
