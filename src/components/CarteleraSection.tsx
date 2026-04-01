import { motion } from "framer-motion";
import { Clock, Star, Calendar } from "lucide-react";
import movie1 from "@/assets/movie1.jpg";
import movie2 from "@/assets/movie2.jpg";
import movie3 from "@/assets/movie3.jpg";
import movie4 from "@/assets/movie4.jpg";

const peliculas = [
  {
    titulo: "Sombras del Pasado",
    genero: "Thriller / Suspenso",
    duracion: "2h 15min",
    clasificacion: "+16",
    rating: 8.2,
    imagen: movie1,
    horarios: ["14:30", "17:00", "19:30", "22:00"],
    sala: "Sala 1",
    idioma: "Subtitulada",
  },
  {
    titulo: "Un Amor en París",
    genero: "Comedia Romántica",
    duracion: "1h 50min",
    clasificacion: "ATP",
    rating: 7.5,
    imagen: movie2,
    horarios: ["15:00", "17:30", "20:00"],
    sala: "Sala 2",
    idioma: "Doblada",
  },
  {
    titulo: "El Mundo Mágico",
    genero: "Animación / Aventura",
    duracion: "1h 40min",
    clasificacion: "ATP",
    rating: 8.8,
    imagen: movie3,
    horarios: ["13:00", "15:30", "17:45"],
    sala: "Sala 1",
    idioma: "Doblada",
  },
  {
    titulo: "El Bosque Oscuro",
    genero: "Terror / Sobrenatural",
    duracion: "1h 55min",
    clasificacion: "+16",
    rating: 7.1,
    imagen: movie4,
    horarios: ["20:30", "22:45"],
    sala: "Sala 2",
    idioma: "Subtitulada",
  },
];

const CarteleraSection = () => {
  return (
    <section id="cartelera" className="py-20 bg-cinema-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Cartelera</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <p className="text-sm uppercase tracking-wider">En cartel esta semana</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {peliculas.map((peli, i) => (
            <motion.div
              key={peli.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-64 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={peli.imagen}
                    alt={peli.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={512}
                    height={750}
                  />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-heading font-bold uppercase">
                        {peli.titulo}
                      </h3>
                      <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded ml-2 flex-shrink-0">
                        {peli.clasificacion}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{peli.genero}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {peli.duracion}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-accent" /> {peli.rating}
                      </span>
                      <span className="bg-muted px-2 py-0.5 rounded text-foreground/70">
                        {peli.idioma}
                      </span>
                    </div>
                    <p className="text-xs text-accent font-medium mb-3">{peli.sala}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-heading">
                      Horarios
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {peli.horarios.map((h) => (
                        <button
                          key={h}
                          className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-border hover:border-primary"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarteleraSection;
