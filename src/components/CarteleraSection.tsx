import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, Calendar, X, Film, Users, PlayCircle, Loader2 } from "lucide-react";
import { getBillboardMovies, MovieWithShowtimes } from "@/services/movieService";

const CarteleraSection = () => {
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithShowtimes | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const data = await getBillboardMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

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
              <p className="text-sm uppercase tracking-wider font-semibold">Tus Películas Favoritas</p>
            </div>
            <p className="text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full font-medium border border-primary/20">
              HORARIOS DE BOLETERÍA: LUNES Cerrado. Resto de la semana 17:30 hs
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Cargando cartelera...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No hay películas en cartelera en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {movies.map((peli, i) => (
              <motion.div
                key={peli.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all group cursor-pointer"
                onClick={() => setSelectedMovie(peli)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-64 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
                    {peli.poster_url ? (
                      <img
                        src={peli.poster_url}
                        alt={peli.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-heading font-bold uppercase">
                          {peli.title}
                        </h3>
                        {peli.classification && (
                          <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded ml-2 flex-shrink-0">
                            {peli.classification}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{peli.genres}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {peli.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {peli.duration_minutes} min
                          </span>
                        )}
                        {peli.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-accent" /> {peli.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-heading">
                        Horarios Disponibles
                      </p>
                      {peli.showtimes && peli.showtimes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {peli.showtimes.map((st) => (
                            <button
                              key={st.id}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 text-[11px] font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-md transition-colors border border-border hover:border-primary cursor-default flex flex-col items-center leading-tight"
                            >
                              <span className="font-bold">{st.showing_time?.slice(0, 5)}</span>
                              <span className="opacity-70 text-[9px] uppercase">{st.language_type}</span>
                              <span className="opacity-70 text-[9px]">{st.format} {st.room_name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Sin horarios programados</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
              className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-background/80 hover:bg-background text-foreground rounded-full backdrop-blur-md transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative group bg-muted flex-shrink-0">
                {selectedMovie.poster_url ? (
                  <img 
                    src={selectedMovie.poster_url} 
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
                
                {selectedMovie.trailer_url && (
                  <div 
                    className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-300 md:bg-transparent md:group-hover:bg-black/40 flex items-center justify-center cursor-pointer z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      if(selectedMovie.trailer_url) {
                        setSelectedTrailer(selectedMovie.trailer_url);
                      }
                    }}
                  >
                    <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none md:hidden z-0" />
              </div>
              
              <div className="p-6 md:p-8 md:w-3/5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  {selectedMovie.classification && (
                    <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded">
                      {selectedMovie.classification}
                    </span>
                  )}
                  {selectedMovie.duration_minutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground mr-3">
                      <Clock className="h-3 w-3" /> {selectedMovie.duration_minutes} min
                    </span>
                  )}
                  {selectedMovie.rating && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-accent" /> {selectedMovie.rating}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-2">
                  <span className="text-gradient-gold">{selectedMovie.title}</span>
                </h3>
                
                <p className="text-sm text-primary mb-6 font-medium">
                  {selectedMovie.genres}
                </p>
                
                <p className="text-sm text-foreground/80 mb-8 leading-relaxed">
                  {selectedMovie.overview || "Sin descripción disponible."}
                </p>
                
                <div className="space-y-4 text-sm mt-auto bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="flex items-start gap-3">
                    <Film className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground/90 uppercase text-xs tracking-wider mb-1">Director</span>
                      <span className="text-muted-foreground">{selectedMovie.director || "No disponible"}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground/90 uppercase text-xs tracking-wider mb-1">Reparto Principal</span>
                      <span className="text-muted-foreground">{selectedMovie.cast_list || "No disponible"}</span>
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
