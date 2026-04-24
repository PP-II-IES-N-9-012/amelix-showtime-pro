import { useEffect, useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LogOut, Film, Megaphone, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AdminLayout = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground uppercase tracking-wider font-semibold text-sm">Verificando sesión...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: "Supervisar", path: "/admin/dashboard", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0 z-20 shadow-2xl relative">
        <div className="p-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0">
          <Link to="/" className="flex flex-col gap-1 items-start group">
             <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                   A
                 </div>
                 <h1 className="font-heading font-bold text-xl uppercase tracking-tighter">
                   Amelix<span className="text-primary font-light">Pro</span>
                 </h1>
             </div>
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest pl-10 font-bold border-t border-border/50 pt-1 mt-1 w-full text-left">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent w-full h-full pointer-events-none" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? "relative z-10" : "group-hover:text-primary transition-colors duration-300"}`} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-card/50 sticky bottom-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center p-1 shrink-0 overflow-hidden">
               <div className="w-full h-full bg-foreground rounded-full flex items-center justify-center">
                  <span className="text-background font-bold text-xs uppercase">{session.user.email?.slice(0, 2)}</span>
               </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{session.user.email}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-muted/20 relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-30">
           <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                   A
                 </div>
                 <h1 className="font-heading font-bold text-xl uppercase tracking-tighter">
                   Amelix
                 </h1>
             </div>
          <button
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-muted rounded-full"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full">
              <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
