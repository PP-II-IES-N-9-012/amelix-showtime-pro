import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Star, Calendar, X, Film, Users, PlayCircle, Loader2 } from "lucide-react";
import { getBillboardMovies, MovieWithShowtimes, formatShowingDate } from "@/services/movieService";
import { supabase } from "@/lib/supabase";

const CarteleraSection = () => {
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithShowtimes | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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

    // Subscribe to realtime updates for both movies and showtimes
    const moviesChannel = supabase
      .channel('public:movies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movies' }, () => {
        getBillboardMovies().then(setMovies);
      })
      .subscribe();

    const showtimesChannel = supabase
      .channel('public:showtimes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'showtimes' }, () => {
        getBillboardMovies().then(setMovies);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(moviesChannel);
      supabase.removeChannel(showtimesChannel);
    };
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
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
            {movies.map((peli, i) => {
              const todayShowtimes = peli.showtimes ? peli.showtimes.filter(st => st.showing_date === todayStr) : [];
              return (
              <motion.div
                key={peli.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all group cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedMovie(peli)}
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full aspect-[2/3] sm:w-48 sm:aspect-auto sm:h-full flex-shrink-0 overflow-hidden bg-muted">
                    {peli.poster_url ? (
                      <img
                        src={peli.poster_url}
                        alt={peli.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
                    <div>
                      {/* Mobile Header */}
                      <div className="sm:hidden mb-1">
                        <h3 className="text-[13px] font-heading font-bold uppercase line-clamp-2 leading-tight mb-1.5">
                          {peli.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {peli.classification && (
                            <span className="text-[9px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded flex-shrink-0">
                              {peli.classification}
                            </span>
                          )}
                          {peli.duration_minutes && (
                            <span className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                              {peli.duration_minutes} min
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Desktop Header */}
                      <div className="hidden sm:flex items-start justify-between mb-2">
                        <h3 className="text-xl font-heading font-bold uppercase">
                          {peli.title}
                        </h3>
                        {peli.classification && (
                          <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded ml-2 flex-shrink-0">
                            {peli.classification}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1 hidden sm:block">{peli.genres}</p>
                      
                      <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mb-3">
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

                      {/* Mobile "Ver sinopsis" */}
                      <div className="flex sm:hidden items-center gap-1.5 text-primary mt-2 text-[11px] font-medium">
                        <div className="bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">
                          <span className="text-[9px] font-bold font-serif italic">i</span>
                        </div>
                        Ver sinópsis
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-heading hidden sm:block">
                        HORARIOS DE HOY
                      </p>
                      {todayShowtimes.length > 0 ? (
                        <>
                          {/* Desktop schedules */}
                          <div className="hidden sm:flex flex-col gap-2 mt-3">
                            {todayShowtimes.map((st) => (
                              <div
                                key={st.id}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-between w-full p-3 bg-muted/20 hover:bg-muted/50 rounded-xl border border-border transition-all cursor-default group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <span className="font-heading font-bold text-xl tracking-tight">{st.showing_time?.slice(0, 5)}<span className="text-sm font-normal text-muted-foreground ml-1">hs</span></span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-xs font-bold text-primary">{formatShowingDate(st.showing_date)}</span>
                                  <span className="text-[10px] uppercase font-semibold text-muted-foreground mt-0.5">{st.language_type}</span>
                                  <span className="text-xs font-semibold text-muted-foreground mt-0.5">{st.room_name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Mobile schedules */}
                          <div className="flex sm:hidden flex-wrap gap-1.5 mt-2.5">
                            {todayShowtimes.map((st) => (
                              <div
                                key={st.id}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-muted/40 border border-border px-2 py-1 rounded flex flex-col gap-0.5 text-[10px]"
                              >
                                <div className="flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-primary" />
                                  <span className="font-bold text-foreground">{st.showing_time?.slice(0, 5)}</span>
                                </div>
                                <span className="text-[8px] text-muted-foreground text-center font-medium">{formatShowingDate(st.showing_date)}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-[10px] sm:text-xs text-muted-foreground italic mt-2 sm:mt-0">Sin horarios programados</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <div className="flex justify-center mt-12">
            <a
              href="/comprar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 text-primary-foreground px-10 py-4 rounded-xl font-heading uppercase tracking-widest text-sm font-extrabold transition-all shadow-[0_0_25px_rgba(234,179,8,0.35)] glow-red"
            >
              Comprar Ahora
            </a>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMovie(null);
                }}
                className="absolute top-3 right-3 z-50 p-2 bg-background/80 hover:bg-background text-foreground rounded-full backdrop-blur-md transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative group bg-muted flex-shrink-0">
                {selectedMovie.poster_url || selectedMovie.backdrop_url ? (
                  <>
                    <img 
                      src={selectedMovie.poster_url || selectedMovie.backdrop_url || ''} 
                      alt={selectedMovie.title}
                      className="hidden md:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <img 
                      src={selectedMovie.backdrop_url || selectedMovie.poster_url || ''} 
                      alt={selectedMovie.title}
                      className="block md:hidden w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </>
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

                <a
                  href={`/comprar?movieId=${selectedMovie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setSelectedMovie(null)}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground py-3.5 rounded-lg font-heading uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  Comprar ahora
                </a>
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
