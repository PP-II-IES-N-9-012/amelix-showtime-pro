import { motion } from "framer-motion";
import { Check, Star, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useBoleteria } from "@/hooks/useBoleteria";
import { openPurchaseFlow } from "@/lib/events";

const precios = [
  {
    nombre: "General",
    precio: "$4.500",
    precioNum: 4500,
    descripcion: "Entrada estándar",
    features: ["Sala estándar", "Audio Dolby", "Butaca regular"],
    destacado: false,
  },
  {
    nombre: "Premium",
    precio: "$5.500",
    precioNum: 5500,
    descripcion: "Máxima comodidad",
    features: ["Butaca premium reclinable", "Audio Dolby Surround", "Ubicación preferencial"],
    destacado: true,
  },
  {
    nombre: "Miércoles Popular",
    precio: "$2.800",
    precioNum: 2800,
    descripcion: "Todos los miércoles",
    features: ["Todas las salas", "Audio Dolby", "Butaca regular"],
    destacado: false,
  },
];

const PreciosSection = () => {
  const { isOpen: boleteriaAbierta } = useBoleteria();

  const handleComprar = (nombrePlan: string) => {
    if (!boleteriaAbierta) {
      toast({
        title: "Boletería cerrada 🍿",
        description: "El complejo se encuentra cerrado actualmente. No es posible realizar compras en este momento.",
        variant: "destructive",
      });
      return;
    }
    
    const ticketTypeMap: Record<string, string> = {
      "General": "general",
      "Premium": "premium",
      "Miércoles Popular": "popular"
    };

    openPurchaseFlow({ ticketType: ticketTypeMap[nombrePlan] });
  };

  return (
    <section id="precios" className="py-20 bg-cinema-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Precios</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Entradas y salas
          </p>
        </motion.div>

        {/* Entradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {precios.map((plan, i) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-6 border text-center flex flex-col ${
                plan.destacado
                  ? "bg-card border-primary glow-red relative"
                  : "bg-card border-border"
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-heading uppercase tracking-wider px-4 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3" /> Recomendado
                </div>
              )}
              <h3 className="text-lg font-heading font-bold uppercase mt-2">{plan.nombre}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.descripcion}</p>
              <p className="text-4xl font-heading font-bold text-gradient-gold mb-6">{plan.precio}</p>
              <ul className="space-y-3 text-sm text-left flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground/80">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleComprar(plan.nombre)}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
              >
                <ShoppingCart className="h-4 w-4" />
                Comprar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreciosSection;
