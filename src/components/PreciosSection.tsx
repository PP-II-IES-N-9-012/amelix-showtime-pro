import { motion } from "framer-motion";
import { Check, Popcorn, Star } from "lucide-react";

const precios = [
  {
    nombre: "General",
    precio: "$4.500",
    descripcion: "Entrada estándar",
    features: ["Sala estándar", "Audio Dolby", "Butaca regular"],
    destacado: false,
  },
  {
    nombre: "IMAX",
    precio: "$6.500",
    descripcion: "La experiencia máxima",
    features: ["Pantalla gigante IMAX", "Audio inmersivo", "Butaca premium", "Gafas 3D incluidas"],
    destacado: true,
  },
  {
    nombre: "Miércoles Popular",
    precio: "$2.800",
    descripcion: "Todos los miércoles",
    features: ["Todas las salas", "Audio Dolby", "Butaca regular"],
    destacado: false,
  },
];

const combos = [
  { nombre: "Combo Individual", precio: "$3.200", items: "Pochoclos medianos + Gaseosa 500ml" },
  { nombre: "Combo Pareja", precio: "$5.500", items: "Pochoclos grandes + 2 Gaseosas 500ml" },
  { nombre: "Combo Familiar", precio: "$8.900", items: "2 Pochoclos grandes + 4 Gaseosas 500ml + Nachos" },
];

const PreciosSection = () => {
  return (
    <section id="precios" className="py-20 bg-cinema-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Precios</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Entradas y combos
          </p>
        </motion.div>

        {/* Entradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {precios.map((plan, i) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-6 border text-center flex flex-col ${
                plan.destacado
                  ? "bg-card border-primary glow-red relative"
                  : "bg-card border-border"
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-heading uppercase tracking-wider px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" /> Recomendado
                </div>
              )}
              <h3 className="text-lg font-heading font-bold uppercase mt-2">{plan.nombre}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.descripcion}</p>
              <p className="text-4xl font-heading font-bold text-gradient-gold mb-6">{plan.precio}</p>
              <ul className="space-y-3 text-sm text-left flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground/80">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Combos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Popcorn className="h-5 w-5 text-accent" />
            <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">
              Combos Candy Bar
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {combos.map((combo) => (
              <div
                key={combo.nombre}
                className="bg-card border border-border rounded-lg p-5 text-center hover:border-accent/40 transition-colors"
              >
                <h4 className="font-heading font-bold uppercase text-sm mb-1">{combo.nombre}</h4>
                <p className="text-2xl font-heading font-bold text-gradient-gold mb-2">{combo.precio}</p>
                <p className="text-xs text-muted-foreground">{combo.items}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PreciosSection;
