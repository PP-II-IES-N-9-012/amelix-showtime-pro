import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, Calendar, X, Film, Users, PlayCircle } from "lucide-react";
import movie1 from "@/assets/movie1.jpg";
import movie2 from "@/assets/movie2.jpg";
import movie3 from "@/assets/movie3.jpg";
import movie4 from "@/assets/movie4.jpg";

type Pelicula = {
  titulo: string;
  genero: string;
  duracion: string;
  clasificacion: string;
  rating: number;
  imagen: string;
  horarios: string[];
  sala: string;
  idioma: string;
  descripcion: string;
  reparto: string;
  director: string;
  trailerUrl: string;
};

const peliculas: Pelicula[] = [
  {
    titulo: "Te van a matar",
    genero: "Terror / Comedia / Acción",
    duracion: "1:50 hs",
    clasificacion: "SAM 16",
    rating: 8.5,
    imagen: movie1,
    horarios: ["20:30 hs (Vier y Dom Subt.)"],
    sala: "Sala 1",
    idioma: "Latino y Subtitulado",
    descripcion: "Una comedia de terror imperdible. No te pierdas esta increíble película.",
    reparto: "No disponible",
    director: "No disponible",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    titulo: "Hoppers: Operación Castor",
    genero: "Infantil / Familiar / Animación",
    duracion: "2:00 hs",
    clasificacion: "ATP",
    rating: 7.8,
    imagen: movie2,
    horarios: ["18:15 hs"],
    sala: "Sala 2",
    idioma: "Latino y Subtitulado",
    descripcion: "Una divertida aventura animada para toda la familia donde un grupo de animales deberá trabajar en equipo.",
    reparto: "Voces Originales",
    director: "Animación",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    titulo: "Proyecto fin del mundo",
    genero: "Ciencia Ficción",
    duracion: "2:45 hs",
    clasificacion: "SAM 13",
    rating: 8.2,
    imagen: movie3,
    horarios: ["22:10 hs (Jue y Sáb Subt.)"],
    sala: "Sala 1",
    idioma: "Latino y Subtitulado",
    descripcion: "La humanidad se enfrenta a su mayor desafío cuando un experimento científico desencadena eventos cataclísmicos.",
    reparto: "No disponible",
    director: "No disponible",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    titulo: "Super Mario Galaxy La película",
    genero: "Fantasía / Familiar / Aventura",
    duracion: "1:50 hs",
    clasificacion: "ATP",
    rating: 9.0,
    imagen: movie4,
    horarios: ["18:00 hs", "20:05 hs", "22:35 hs"],
    sala: "Sala 2",
    idioma: "Latino y Subtitulado",
    descripcion: "Mario viaja a través del espacio para rescatar a la Princesa Peach en esta espectacular aventura galáctica.",
    reparto: "Chris Pratt",
    director: "Illumination",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
];

const CarteleraSection = () => {
  const [selectedMovie, setSelectedMovie] = useState<Pelicula | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  return (
    <section id="cartelera" className="py-20 bg-cinema-gradient relative">
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
          <div className="flex flex-col items-center justify-center gap-3 mt-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <p className="text-sm uppercase tracking-wider font-semibold">Del 02 de ABR al 8 de ABR</p>
            </div>
            <p className="text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full font-medium border border-primary/20">
              HORARIOS DE BOLETERÍA: LUNES Cerrado. Resto de la semana 17:30 hs
            </p>
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
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all group cursor-pointer"
              onClick={() => setSelectedMovie(peli)}
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
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-border hover:border-primary cursor-default"
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

      {/* Modal / Overlay de detalles */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMovie(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-background/80 hover:bg-background text-foreground rounded-full backdrop-blur-md transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative group">
                <img 
                  src={selectedMovie.imagen} 
                  alt={selectedMovie.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div 
                  className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 md:bg-transparent md:group-hover:bg-black/40 flex items-center justify-center cursor-pointer z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrailer(selectedMovie.trailerUrl);
                  }}
                >
                  <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none md:hidden z-0" />
              </div>
              
              <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded">
                    {selectedMovie.clasificacion}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mr-3">
                    <Clock className="h-3 w-3" /> {selectedMovie.duracion}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-accent" /> {selectedMovie.rating}
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-2">
                  <span className="text-gradient-gold">{selectedMovie.titulo}</span>
                </h3>
                
                <p className="text-sm text-primary mb-6 font-medium">
                  {selectedMovie.genero} • {selectedMovie.idioma}
                </p>
                
                <p className="text-sm text-foreground/80 mb-8 leading-relaxed">
                  {selectedMovie.descripcion}
                </p>
                
                <div className="space-y-4 text-sm mt-auto bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="flex items-start gap-3">
                    <Film className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground/90 uppercase text-xs tracking-wider mb-1">Director</span>
                      <span className="text-muted-foreground">{selectedMovie.director}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground/90 uppercase text-xs tracking-wider mb-1">Reparto Principal</span>
                      <span className="text-muted-foreground">{selectedMovie.reparto}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal del trailer */}
      <AnimatePresence>
        {selectedTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrailer(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-12 bg-background/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border"
            >
              <button
                onClick={() => setSelectedTrailer(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-background/50 hover:bg-background/90 text-white rounded-full backdrop-blur-md transition-colors shadow-sm"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <iframe
                className="w-full h-full"
                src={`${selectedTrailer}?autoplay=1`}
                title="Trailer de la película"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CarteleraSection;
