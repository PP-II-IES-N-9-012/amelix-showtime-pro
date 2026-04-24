import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { getPromotions } from "@/services/movieService";
import { Promotion } from "@/types/database.types";
import PromotionDialog from "./PromotionDialog";

const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar promociones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedPromotion(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta promoción?")) return;
    
    try {
      const { error } = await supabase.from('promotions').delete().eq('id', id);
      if (error) throw error;
      toast.success("Promoción eliminada correctamente");
      fetchPromotions();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al eliminar la promoción");
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl">
      <CardHeader className="pb-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold">Anuncios y Promociones</CardTitle>
          <CardDescription className="mt-1">
            Administra los banners promocionales de la página principal.
          </CardDescription>
        </div>
        <Button onClick={handleAddNew} className="shrink-0 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Anuncio
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No hay anuncios activos en este momento.
          </div>
        ) : (
          <div className="overflow-x-auto relative min-h-[300px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[120px]">Imagen</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="w-24 h-12 bg-muted rounded overflow-hidden">
                        {promo.image_url ? (
                          <img src={promo.image_url} alt={promo.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{promo.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-md uppercase tracking-wider">
                         {promo.promo_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => handleEdit(promo)} variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border-blue-400/20" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(promo.id)} variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-red-300 hover:bg-destructive/10 border-destructive/20" title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <PromotionDialog 
        promotion={selectedPromotion} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSaved={fetchPromotions} 
      />
    </Card>
  );
};

export default PromotionsManager;
