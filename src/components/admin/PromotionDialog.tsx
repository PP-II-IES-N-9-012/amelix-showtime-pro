import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Promotion } from "@/types/database.types";

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
    is_active: true
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title || "",
        image_url: promotion.image_url || "",
        promo_type: promotion.promo_type || "general",
        order_index: promotion.order_index || 0,
        is_active: promotion.is_active !== undefined ? promotion.is_active : true
      });
    } else {
      setFormData({
        title: "",
        image_url: "",
        promo_type: "general",
        order_index: 0,
        is_active: true
      });
    }
  }, [promotion, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
            Configura el banner promocional. Pega la URL de la imagen.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="order_index">Orden (Prioridad visual)</Label>
            <Input id="order_index" name="order_index" type="number" value={formData.order_index} onChange={handleChange} />
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
