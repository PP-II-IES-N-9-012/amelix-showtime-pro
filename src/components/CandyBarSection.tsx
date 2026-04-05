import { motion } from "framer-motion";
import { IceCreamCone } from "lucide-react";

const combos = [
  {
    nombre: "Combo Solo",
    precio: "$3.200",
    items: ["Pochoclos medianos", "Gaseosa 500ml"],
    ahorro: "Ahorrás $600",
  },
  {
    nombre: "Combo Pareja",
    precio: "$5.500",
    items: ["Pochoclos grandes", "2 Gaseosas 500ml"],
    ahorro: "Ahorrás $900",
    destacado: true,
  },
  {
    nombre: "Combo Familiar",
    precio: "$8.900",
    items: ["2 Pochoclos grandes", "4 Gaseosas 500ml", "Nachos con queso"],
    ahorro: "Ahorrás $2.300",
  },
  {
    nombre: "Combo Kids",
    precio: "$2.800",
    items: ["Pochoclos chicos", "Jugo 500ml", "Gomitas"],
    ahorro: "Ahorrás $500",
  },
];

const CandyBarSection = () => {
  return (
    <section id="candybar" className="py-20 bg-cinema-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Candy Bar</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Pochoclos, bebidas y mucho más
          </p>
        </motion.div>

        {/* Combos destacados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <IceCreamCone className="h-5 w-5 text-accent" />
            <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">
              Combos
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {combos.map((combo, i) => (
              <motion.div
                key={combo.nombre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-5 border text-center flex flex-col relative ${
                  combo.destacado
                    ? "bg-card border-primary glow-red"
                    : "bg-card border-border hover:border-accent/40"
                } transition-colors`}
              >
                {combo.destacado && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-heading uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Más popular
                  </div>
                )}
                <h4 className="font-heading font-bold uppercase text-sm mb-1 mt-1">
                  {combo.nombre}
                </h4>
                <p className="text-3xl font-heading font-bold text-gradient-gold mb-3">
                  {combo.precio}
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3 flex-1">
                  {combo.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 justify-center">
                      <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                  {combo.ahorro}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Además ofrecemos una amplia variedad de snacks, bebidas y golosinas. ¡Consultá en nuestro Candy Bar!
        </p>
      </div>
    </section>
  );
};

export default CandyBarSection;
