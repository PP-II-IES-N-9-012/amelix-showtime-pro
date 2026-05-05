import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Search, Film } from "lucide-react";
import { Promotion } from "@/types/database.types";
import { searchTMDBMovies, getTMDBMovieDetails, TMDBMovie } from "@/services/tmdbService";

interface PromotionDialogProps {
  promotion?: Promotion | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const PromotionDialog = ({ promotion, isOpen, onClose, onSaved }: PromotionDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    promo_type: "general",
    order_index: 0,
    valid_until: "",
    is_active: true
  });

  // TMDB State
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [isSearchingTMDB, setIsSearchingTMDB] = useState(false);
  const [tmdbResults, setTmdbResults] = useState<TMDBMovie[]>([]);

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title || "",
        image_url: promotion.image_url || "",
        promo_type: promotion.promo_type || "general",
        order_index: promotion.order_index || 0,
        valid_until: promotion.valid_until ? promotion.valid_until.slice(0, 16) : "",
        is_active: promotion.is_active !== undefined ? promotion.is_active : true
      });
    } else {
      setFormData({
        title: "",
        image_url: "",
        promo_type: "general",
        order_index: 0,
        valid_until: "",
        is_active: true
      });
    }
    setTmdbQuery("");
    setTmdbResults([]);
  }, [promotion, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
        title: `Estreno: ${details.title}`,
        image_url: details.backdrop_url || details.poster_url || "",
        promo_type: "estreno"
      });
      setTmdbResults([]);
      setTmdbQuery("");
      toast.success("Imagen de TMDB cargada correctamente");
    } catch (err: any) {
      toast.error(err.message || "Error al obtener detalles de TMDB");
    } finally {
      setIsSearchingTMDB(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      toast.error("El título y la imagen son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        image_url: formData.image_url,
        promo_type: formData.promo_type,
        order_index: typeof formData.order_index === 'string' ? parseInt(formData.order_index) : formData.order_index,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        is_active: formData.is_active
      };

      if (promotion && promotion.id) {
        const { error } = await supabase.from('promotions').update(payload).eq('id', promotion.id);
        if (error) throw error;
        toast.success("Promoción actualizada");
      } else {
        const { error } = await supabase.from('promotions').insert(payload);
        if (error) throw error;
        toast.success("Promoción creada");
      }
      onSaved();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al guardar la promoción");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{promotion ? "Editar Promoción" : "Nueva Promoción"}</DialogTitle>
          <DialogDescription>
            Configura el banner promocional. Pega la URL de la imagen o busca un estreno en TMDB.
          </DialogDescription>
        </DialogHeader>

        {/* Búsqueda TMDB */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4 mb-2">
          <Label className="mb-2 block">Autocompletar Banner desde TMDB</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Buscar película..." 
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

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de Imagen *</Label>
            <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." required />
            {formData.image_url && (
              <div className="mt-2 w-full h-32 rounded bg-muted overflow-hidden border border-border">
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo_type">Tipo de Promoción</Label>
            <select
              id="promo_type"
              name="promo_type"
              value={formData.promo_type}
              onChange={handleChange as any}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="general">General / Anuncio</option>
              <option value="descuento">Descuento Especial</option>
              <option value="estreno">Próximo Estreno</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_index">Orden (Prioridad)</Label>
              <Input id="order_index" name="order_index" type="number" value={formData.order_index} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valid_until">Válido Hasta</Label>
              <Input 
                id="valid_until" 
                name="valid_until" 
                type="datetime-local" 
                value={formData.valid_until} 
                onChange={handleChange} 
              />
              <p className="text-[10px] text-muted-foreground">Opcional. Deja vacío para no caducar.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange as any}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="is_active">Activa (Visible en la web)</Label>
          </div>
        </div>

        <DialogFooter>
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

export default PromotionDialog;
