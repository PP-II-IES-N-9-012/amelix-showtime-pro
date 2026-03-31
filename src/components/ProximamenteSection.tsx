import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import movie5 from "@/assets/movie5.jpg";
import movie6 from "@/assets/movie6.jpg";

const proximamente = [
  {
    titulo: "Horizonte Infinito",
    genero: "Ciencia Ficción / Épica",
    estreno: "10 de Abril, 2026",
    imagen: movie5,
    descripcion: "Una odisea espacial que desafía los límites de la humanidad.",
  },
  {
    titulo: "La Última Luz",
    genero: "Drama / Biografía",
    estreno: "24 de Abril, 2026",
    imagen: movie6,
    descripcion: "La historia real de un hombre que cambió el mundo para siempre.",
  },
];

const ProximamenteSection = () => {
  return (
    <section id="proximamente" className="py-20 bg-cinema-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Próximamente</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Los estrenos que se vienen
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {proximamente.map((peli, i) => (
            <motion.div
              key={peli.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-xl overflow-hidden"
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={peli.imagen}
                  alt={peli.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={512}
                  height={750}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 text-accent text-xs font-medium mb-2">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wider">{peli.estreno}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase mb-1">
                  {peli.titulo}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{peli.genero}</p>
                <p className="text-sm text-foreground/70">{peli.descripcion}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProximamenteSection;
