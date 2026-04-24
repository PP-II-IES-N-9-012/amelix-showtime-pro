import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Film, Megaphone } from "lucide-react";
import SettingsManager from "@/components/admin/SettingsManager";
import MoviesManager from "@/components/admin/MoviesManager";
import PromotionsManager from "@/components/admin/PromotionsManager";

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-heading font-bold uppercase tracking-tight">
          Panel de <span className="text-primary">Control</span>
        </h2>
        <p className="text-muted-foreground mt-1">Gestiona el contenido y estado de la aplicación.</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full lg:w-[600px] grid-cols-3 h-14 bg-card/60 backdrop-blur-xl border border-border shadow-sm rounded-xl p-1 shrink-0 overflow-x-auto">
          <TabsTrigger value="settings" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full transition-all flex items-center gap-2 text-xs md:text-sm">
            <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Configuración</span><span className="sm:hidden">Ajustes</span>
          </TabsTrigger>
          <TabsTrigger value="cartelera" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full transition-all flex items-center gap-2 text-xs md:text-sm">
            <Film className="w-4 h-4" /> Cartelera
          </TabsTrigger>
          <TabsTrigger value="promociones" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full transition-all flex items-center gap-2 text-xs md:text-sm">
            <Megaphone className="w-4 h-4" /> Anuncios
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="settings" className="mt-0 outline-none">
            <SettingsManager />
          </TabsContent>
          
          <TabsContent value="cartelera" className="mt-0 outline-none">
            <MoviesManager />
          </TabsContent>
          
          <TabsContent value="promociones" className="mt-0 outline-none">
            <PromotionsManager />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
