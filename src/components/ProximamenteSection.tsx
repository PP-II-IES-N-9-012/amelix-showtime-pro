import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Play, X } from "lucide-react";
import movie5 from "@/assets/movie5.jpg";
import movie6 from "@/assets/movie6.jpg";

const proximamente = [
  {
    titulo: "Horizonte Infinito",
    genero: "Ciencia Ficción / Épica",
    estreno: "10 de Abril, 2026",
    imagen: movie5,
    descripcion: "Una odisea espacial que desafía los límites de la humanidad.",
    trailerId: "dQw4w9WgXcQ",
  },
  {
    titulo: "La Última Luz",
    genero: "Drama / Biografía",
    estreno: "24 de Abril, 2026",
    imagen: movie6,
    descripcion: "La historia real de un hombre que cambió el mundo para siempre.",
    trailerId: "dQw4w9WgXcQ",
  },
];

const ProximamenteSection = () => {
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

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
            Los estrenos que se vienen — mirá los trailers
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
              <div className="aspect-[2/3] overflow-hidden relative">
                <img
                  src={peli.imagen}
                  alt={peli.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={512}
                  height={750}
                />
                {/* Play trailer button */}
                <button
                  onClick={() => setActiveTrailer(peli.trailerId)}
                  className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/40 transition-colors"
                  aria-label={`Ver trailer de ${peli.titulo}`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 glow-red">
                    <Play className="h-7 w-7 text-primary-foreground ml-1" />
                  </div>
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
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
                <button
                  onClick={() => setActiveTrailer(peli.trailerId)}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                  <Play className="h-3.5 w-3.5" />
                  Ver Trailer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {activeTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
              onClick={() => setActiveTrailer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-border shadow-2xl"
            >
              <button
                onClick={() => setActiveTrailer(null)}
                className="absolute -top-12 right-0 z-10 text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2 text-sm font-heading uppercase tracking-wider"
              >
                Cerrar <X className="h-5 w-5" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeTrailer}?autoplay=1&rel=0`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProximamenteSection;
