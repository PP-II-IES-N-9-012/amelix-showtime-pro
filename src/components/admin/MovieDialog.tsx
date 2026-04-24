import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Search, Film } from "lucide-react";
import { searchTMDBMovies, getTMDBMovieDetails, TMDBMovie } from "@/services/tmdbService";

interface MovieDialogProps {
  movie?: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const MovieDialog = ({ movie, isOpen, onClose, onSaved }: MovieDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
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
    } else {
      setFormData({
        title: "", overview: "", genres: "", duration_minutes: "", rating: "", classification: "",
        poster_url: "", trailer_url: "", director: "", cast_list: "", status: "released"
      });
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
        overview: formData.overview,
        genres: formData.genres,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        classification: formData.classification,
        poster_url: formData.poster_url,
        trailer_url: formData.trailer_url,
        director: formData.director,
        cast_list: formData.cast_list,
        status: formData.status
      };

      if (movie && movie.id) {
        const { error } = await supabase.from('movies').update(payload).eq('id', movie.id);
        if (error) throw error;
        toast.success("Película actualizada");
      } else {
        const { error } = await supabase.from('movies').insert(payload);
        if (error) throw error;
        toast.success("Película creada");
      }
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
