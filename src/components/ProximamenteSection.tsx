import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Play, X, Loader2, Film } from "lucide-react";
import { getUpcomingMovies } from "@/services/movieService";
import { Movie } from "@/types/database.types";

const ProximamenteSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setIsLoading(true);
      try {
        const data = await getUpcomingMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  // Función para extraer el ID de YouTube si es necesario, caso contrario asumimos que guardaremos el ID directamente o manejaremos la URL
  const extractTrailerId = (url: string | null) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/) || url.match(/embed\/([^?]+)/);
      return match ? match[1] : null;
    }
    return url; // Retorna tal cual si no es una URL parseable (como el viejo dQw4w9WgXcQ)
  };

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

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Cargando estrenos...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay estrenos programados por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {movies.map((peli, i) => (
              <motion.div
                key={peli.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-xl overflow-hidden bg-card border border-border"
              >
                <div className="aspect-[2/3] overflow-hidden relative bg-muted">
                  {peli.poster_url ? (
                    <img
                      src={peli.poster_url}
                      alt={peli.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50">
                       <Film className="w-16 h-16 mb-2" />
                       <span className="text-sm uppercase tracking-wider font-semibold">Sin imagen</span>
                    </div>
                  )}
                  {/* Play trailer button */}
                  {peli.trailer_url && (
                    <button
                      onClick={() => setActiveTrailer(extractTrailerId(peli.trailer_url))}
                      className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/40 transition-colors"
                      aria-label={`Ver trailer de ${peli.title}`}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 glow-red">
                        <Play className="h-7 w-7 text-primary-foreground ml-1" />
                      </div>
                    </button>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-accent text-xs font-medium mb-2">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-wider">
                      {peli.release_date ? new Date(peli.release_date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric'}) : "Pronto"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase mb-1 drop-shadow-md">
                    {peli.title}
                  </h3>
                  <p className="text-sm text-primary mb-2 font-medium">{peli.genres}</p>
                  <p className="text-sm text-foreground/80 line-clamp-2 md:line-clamp-3">{peli.overview}</p>
                  
                  {peli.trailer_url && (
                    <button
                      onClick={() => setActiveTrailer(extractTrailerId(peli.trailer_url))}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-primary hover:text-primary/80 transition-colors font-semibold bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/30 hover:border-primary"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Ver Trailer
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
