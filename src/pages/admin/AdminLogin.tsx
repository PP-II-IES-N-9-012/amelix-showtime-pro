import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Film, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Credenciales incorrectas o error al iniciar sesión.");
        console.error(error);
      } else if (data.session) {
        toast.success("Inicio de sesión exitoso");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      toast.error("Hubo un problema de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden bg-cinema-gradient px-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
           <div className="w-16 h-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-4xl mb-4 shadow-lg shadow-primary/20">
             A
           </div>
           <h1 className="text-3xl font-heading font-bold uppercase tracking-tight text-center">
             Admin <span className="text-primary">Portal</span>
           </h1>
           <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold mt-2 text-center">
             Acceso restringido
           </p>
        </div>

        <div className="bg-card/60 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1" htmlFor="email">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@amelix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-input/50 focus:border-primary h-12 rounded-xl"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-input/50 focus:border-primary h-12 rounded-xl"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold uppercase tracking-wide shadow-lg shadow-primary/20 mt-4 text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
