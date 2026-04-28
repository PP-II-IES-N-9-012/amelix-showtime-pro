import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Search, Film, Plus, Trash2 } from "lucide-react";
import { searchTMDBMovies, getTMDBMovieDetails, TMDBMovie } from "@/services/tmdbService";

interface MovieDialogProps {
  movie?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const generateTimes = () => {
  const times = [];
  for (let h = 18; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 23 && m > 0) continue; // Up to 23:00
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
    }
  }
  return times;
};

const AVAILABLE_TIMES = generateTimes();

type ShowtimeOption = {
  showing_time: string;
  language_type: string;
  room_name: string;
};

const MovieDialog = ({ movie, isOpen, onClose, onSaved }: MovieDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showtimesList, setShowtimesList] = useState<ShowtimeOption[]>([]);
  const [newShowtime, setNewShowtime] = useState<ShowtimeOption>({
    showing_time: AVAILABLE_TIMES[0],
    language_type: 'Castellano',
    room_name: 'Sala 1'
  });
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    genres: "",
    duration_minutes: "",
    rating: "",
    classification: "",
    poster_url: "",
    trailer_url: "",
    director: "",
    cast_list: "",
    status: "released" // default to cartelera
  });

  // TMDB State
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [isSearchingTMDB, setIsSearchingTMDB] = useState(false);
  const [tmdbResults, setTmdbResults] = useState<TMDBMovie[]>([]);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        overview: movie.overview || "",
        genres: movie.genres || "",
        duration_minutes: movie.duration_minutes ? String(movie.duration_minutes) : "",
        rating: movie.rating || "",
        classification: movie.classification || "",
        poster_url: movie.poster_url || "",
        trailer_url: movie.trailer_url || "",
        director: movie.director || "",
        cast_list: movie.cast_list || "",
        status: movie.status || "released"
      });
      if (movie.showtimes && Array.isArray(movie.showtimes)) {
        setShowtimesList(movie.showtimes.map((st: any) => ({
          showing_time: st.showing_time,
          language_type: st.language_type || 'Castellano',
          room_name: st.room_name || 'Sala 1'
        })));
      } else {
        setShowtimesList([]);
      }
    } else {
      setFormData({
        title: "", overview: "", genres: "", duration_minutes: "", rating: "", classification: "",
        poster_url: "", trailer_url: "", director: "", cast_list: "", status: "released"
      });
      setShowtimesList([]);
    }
    setTmdbQuery("");
    setTmdbResults([]);
  }, [movie, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchTMDB = async () => {
    if (!tmdbQuery) return;
    setIsSearchingTMDB(true);
    try {
      const results = await searchTMDBMovies(tmdbQuery);
      setTmdbResults(results);
      if (results.length === 0) toast.info("No se encontraron resultados en TMDB");
    } catch (err: any) {
      toast.error(err.message || "Error al buscar en TMDB");
    } finally {
      setIsSearchingTMDB(false);
    }
  };

  const handleSelectTMDB = async (tmdbId: number) => {
    setIsSearchingTMDB(true);
    try {
      const details = await getTMDBMovieDetails(tmdbId);
      setFormData({
        ...formData,
        title: details.title,
        overview: details.overview,
        genres: details.genres,
        duration_minutes: details.duration_minutes ? String(details.duration_minutes) : "",
        poster_url: details.poster_url || "",
        trailer_url: details.trailer_url || "",
        director: details.director || "",
        cast_list: details.cast_list || ""
      });
      setTmdbResults([]);
      setTmdbQuery("");
      toast.success("Datos de TMDB cargados correctamente");
    } catch (err: any) {
      toast.error(err.message || "Error al obtener detalles de TMDB");
    } finally {
      setIsSearchingTMDB(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("El título es obligatorio");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        overview: formData.overview || null,
        genres: formData.genres || null,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        classification: formData.classification || null,
        poster_url: formData.poster_url || null,
        trailer_url: formData.trailer_url || null,
        director: formData.director || null,
        cast_list: formData.cast_list || null,
        status: formData.status
      };

      let currentMovieId = movie?.id;

      if (movie && movie.id) {
        const { error } = await supabase.from('movies').update(payload).eq('id', movie.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('movies').insert(payload).select().single();
        if (error) throw error;
        currentMovieId = data.id;
      }

      // Update showtimes
      if (currentMovieId) {
        // Delete old showtimes
        await supabase.from('showtimes').delete().eq('movie_id', currentMovieId);
        
        // Insert new showtimes
        if (showtimesList.length > 0) {
          const showtimesData = showtimesList.map(st => ({
            movie_id: currentMovieId,
            showing_time: st.showing_time,
            is_active: true,
            format: '2D',
            language_type: st.language_type,
            room_name: st.room_name
          }));
          const { error: stError } = await supabase.from('showtimes').insert(showtimesData);
          if (stError) throw new Error(stError.message);
        }
      }

      toast.success(movie ? "Película actualizada correctamente" : "Película creada correctamente");

      onSaved();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al guardar la película");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{movie ? "Editar Película" : "Nueva Película"}</DialogTitle>
          <DialogDescription>
            {movie ? "Actualiza los datos de la película." : "Agrega una nueva película a la cartelera o próximamente."}
          </DialogDescription>
        </DialogHeader>

        {/* Búsqueda TMDB */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border mb-4">
          <Label className="mb-2 block">Autocompletar con TMDB</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Buscar título en TMDB..." 
              value={tmdbQuery} 
              onChange={(e) => setTmdbQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTMDB()}
            />
            <Button variant="secondary" onClick={handleSearchTMDB} disabled={isSearchingTMDB || !tmdbQuery}>
              {isSearchingTMDB ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
          
          {tmdbResults.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto border border-border rounded-md bg-background divide-y divide-border">
              {tmdbResults.map(res => (
                <div key={res.id} className="p-2 flex items-center justify-between hover:bg-muted cursor-pointer" onClick={() => handleSelectTMDB(res.id)}>
                  <div className="flex items-center gap-3">
                    {res.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w92${res.poster_path}`} alt="poster" className="w-8 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-8 h-12 bg-secondary flex items-center justify-center rounded"><Film className="w-4 h-4" /></div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{res.title}</p>
                      <p className="text-xs text-muted-foreground">{res.release_date?.split('-')[0]}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">Seleccionar</Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="overview">Sinopsis</Label>
            <Textarea id="overview" name="overview" value={formData.overview} onChange={handleChange} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genres">Géneros (Separados por coma)</Label>
            <Input id="genres" name="genres" value={formData.genres} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duración (minutos)</Label>
            <Input id="duration_minutes" name="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classification">Clasificación (ej: +13)</Label>
            <Input id="classification" name="classification" value={formData.classification} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Calificación (ej: 8.5)</Label>
            <Input id="rating" name="rating" value={formData.rating} onChange={handleChange} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="director">Director</Label>
            <Input id="director" name="director" value={formData.director} onChange={handleChange} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cast_list">Reparto Principal</Label>
            <Input id="cast_list" name="cast_list" value={formData.cast_list} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="poster_url">URL del Póster</Label>
            <Input id="poster_url" name="poster_url" value={formData.poster_url} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="trailer_url">URL del Tráiler (YouTube Embed)</Label>
            <Input id="trailer_url" name="trailer_url" value={formData.trailer_url} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="status">Estado</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange as any}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="released">En Cartelera</option>
              <option value="upcoming">Próximamente</option>
            </select>
          </div>
          
          <div className="space-y-3 md:col-span-2">
            <Label className="text-center block">Gestión de Horarios</Label>
            <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
              
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1.5 flex-1">
                  <Label className="text-xs">Horario</Label>
                  <select
                    value={newShowtime.showing_time}
                    onChange={(e) => setNewShowtime({...newShowtime, showing_time: e.target.value})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {AVAILABLE_TIMES.map(t => (
                      <option key={t} value={t}>{t.slice(0, 5)} hs</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 flex-1">
                  <Label className="text-xs">Idioma/Formato</Label>
                  <select
                    value={newShowtime.language_type}
                    onChange={(e) => setNewShowtime({...newShowtime, language_type: e.target.value})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Castellano">Castellano</option>
                    <option value="Subtitulada">Subtitulada</option>
                  </select>
                </div>
                <div className="space-y-1.5 flex-1">
                  <Label className="text-xs">Sala</Label>
                  <select
                    value={newShowtime.room_name}
                    onChange={(e) => setNewShowtime({...newShowtime, room_name: e.target.value})}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Sala 1">Sala 1</option>
                    <option value="Sala 2">Sala 2</option>
                    <option value="Sala 3">Sala 3</option>
                  </select>
                </div>
                <Button 
                  type="button"
                  onClick={() => {
                    // Evitar duplicados exactos
                    if (!showtimesList.some(st => st.showing_time === newShowtime.showing_time && st.room_name === newShowtime.room_name)) {
                      setShowtimesList([...showtimesList, newShowtime]);
                    } else {
                      toast.error("Este horario ya está asignado en esta sala.");
                    }
                  }}
                  className="shrink-0 gap-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </Button>
              </div>

              {showtimesList.length > 0 && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {showtimesList.map((st, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-background p-2.5 rounded border border-border">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-bold text-primary">{st.showing_time.slice(0, 5)} hs</span>
                        <span className="text-muted-foreground uppercase text-xs">{st.language_type}</span>
                        <span className="text-muted-foreground font-medium text-xs">{st.room_name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowtimesList(showtimesList.filter((_, i) => i !== idx))}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {showtimesList.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No hay horarios asignados.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDialog;
