import { motion } from "framer-motion";


import { Reveal } from "./Reveal";

const dialects = [
  {
    city: "Madrid",
    flag: "🏛️",
    accent: "Castellano clásico",
    examples: [
      { es: "¿Qué tal, tío?", pt: "E aí, cara?" },
      { es: "Mola mucho", pt: "É muito legal" },
      { es: "Vale, vamos", pt: "Beleza, vamos" },
    ],
    accentColor: "from-primary/20 to-primary/5",
  },
  {
    city: "Barcelona",
    flag: "🌊",
    accent: "Influência catalã",
    examples: [
      { es: "Adéu", pt: "Tchau (catalão)" },
      { es: "Pasta = dinero", pt: "Grana / dinheiro" },
      { es: "Estoy flipando", pt: "Estou pasmo" },
    ],
    accentColor: "from-secondary/30 to-secondary/5",
  },
  {
    city: "Sevilla",
    flag: "💃",
    accent: "Andaluz cantarino",
    examples: [
      { es: "¿Ze pué?", pt: "¿Se puede? (entrar)" },
      { es: "Mi arma", pt: "Querido(a)" },
      { es: "Chiquillo", pt: "Garoto / amigo" },
    ],
    accentColor: "from-primary/15 to-secondary/15",
  },
];

export const LandingDialects = () => {
  return (
    <section className="container py-24 md:py-32 relative">
      <div>
        {/* Dialect cards */}
        <div>
          <Reveal>
            <div className="text-center lg:text-left mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
                🇪🇸 Dialetos da Espanha
              </span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
                Madrid, Barcelona, Sevilla — <span className="text-gradient-spain">tres mundos</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                O Touro te guia pelas diferenças regionais que nenhum livro tradicional ensina.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4">
            {dialects.map((d, i) => (
              <Reveal key={d.city} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`relative rounded-2xl bg-gradient-to-br ${d.accentColor} bg-card border border-border p-6 shadow-sm hover:shadow-elevated h-full`}
                >
                  <div className="text-3xl mb-3">{d.flag}</div>
                  <h3 className="font-display font-extrabold text-xl mb-1">{d.city}</h3>
                  <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-4">
                    {d.accent}
                  </p>
                  <ul className="space-y-2">
                    {d.examples.map((ex) => (
                      <li key={ex.es} className="text-sm">
                        <div className="font-bold text-foreground">{ex.es}</div>
                        <div className="text-xs text-muted-foreground">→ {ex.pt}</div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
