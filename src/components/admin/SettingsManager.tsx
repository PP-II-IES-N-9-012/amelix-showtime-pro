import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Store } from "lucide-react";

const SettingsManager = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("is_open")
          .eq("id", "global")
          .single();

        if (error) throw error;
        if (data) setIsOpen(data.is_open);
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ id: "global", is_open: checked, updated_at: new Date().toISOString() });

      if (error) {
        throw error;
      }
      setIsOpen(checked);
      toast.success(`Establecimiento marcado como ${checked ? "ABIERTO" : "CERRADO"}`);
    } catch (err: any) {
      console.error(err);
      toast.error("Error al actualizar el estado. ¿Creaste la tabla settings según las instrucciones?");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl overflow-hidden relative">
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Store className="w-6 h-6 text-primary" />
              Estado del Establecimiento
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Controla si el complejo está abierto o cerrado al público.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 p-6 rounded-xl border border-border bg-background/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-semibold text-lg">Modo Apertura</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Al desactivar esta opción, los visitantes verán un aviso indicando que el establecimiento 
              se encuentra momentáneamente cerrado.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-card px-4 py-3 rounded-lg border border-border shadow-inner">
            <span className={`text-sm font-bold uppercase tracking-wider ${!isOpen ? "text-destructive" : "text-muted-foreground"}`}>
              Cerrado
            </span>
            <Switch
              checked={isOpen}
              onCheckedChange={handleToggle}
              disabled={isUpdating}
              className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-sm font-bold uppercase tracking-wider ${isOpen ? "text-green-500" : "text-muted-foreground"}`}>
              Abierto
            </span>
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsManager;
