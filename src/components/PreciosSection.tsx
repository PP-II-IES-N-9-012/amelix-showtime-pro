import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Popcorn, Star, ShoppingCart, X, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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


interface CartItem {
  nombre: string;
  precio: string;
  precioNum: number;
  cantidad: number;
  tipo: "entrada" | "combo";
}

const PreciosSection = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);

  const addToCart = (nombre: string, precio: string, precioNum: number, tipo: "entrada" | "combo") => {
    setCart((prev) => {
      const existing = prev.find((item) => item.nombre === nombre);
      if (existing) {
        return prev.map((item) =>
          item.nombre === nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { nombre, precio, precioNum, cantidad: 1, tipo }];
    });
    toast({ title: `${nombre} agregado`, description: "Se añadió a tu carrito" });
  };

  const removeFromCart = (nombre: string) => {
    setCart((prev) => prev.filter((item) => item.nombre !== nombre));
  };

  const updateQty = (nombre: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.nombre === nombre ? { ...item, cantidad: Math.max(0, item.cantidad + delta) } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.precioNum * item.cantidad, 0);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowCheckout(false);
      setCart([]);
      toast({
        title: "¡Compra exitosa! 🎬",
        description: "Tu reserva fue confirmada. ¡Disfrutá la película!",
      });
    }, 2000);
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
            Entradas y combos
          </p>
        </motion.div>

        {/* Entradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
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
                onClick={() => addToCart(plan.nombre, plan.precio, plan.precioNum, "entrada")}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
              >
                <ShoppingCart className="h-4 w-4" />
                Comprar
              </button>
            </motion.div>
          ))}
        </div>

        {/* Combos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Popcorn className="h-5 w-5 text-accent" />
            <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">
              Combos Candy Bar
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {combos.map((combo) => (
              <div
                key={combo.nombre}
                className="bg-card border border-border rounded-lg p-5 text-center hover:border-accent/40 transition-colors"
              >
                <h4 className="font-heading font-bold uppercase text-sm mb-1">{combo.nombre}</h4>
                <p className="text-2xl font-heading font-bold text-gradient-gold mb-2">{combo.precio}</p>
                <p className="text-xs text-muted-foreground mb-4">{combo.items}</p>
                <button
                  onClick={() => addToCart(combo.nombre, combo.precio, combo.precioNum, "combo")}
                  className="inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg font-heading uppercase tracking-wider text-xs font-semibold transition-all"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating Cart Button */}
        {cart.length > 0 && !showCheckout && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setShowCheckout(true)}
            className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl glow-red flex items-center gap-2 font-heading uppercase tracking-wider text-sm font-semibold"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="bg-accent text-accent-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {cart.reduce((sum, item) => sum + item.cantidad, 0)}
            </span>
          </motion.button>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowCheckout(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-heading font-bold uppercase mb-6 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Tu Carrito
              </h3>

              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Tu carrito está vacío</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.nombre} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.nombre}</p>
                          <p className="text-xs text-muted-foreground">{item.precio} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.nombre, -1)}
                            className="w-7 h-7 rounded bg-muted flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            −
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateQty(item.nombre, 1)}
                            className="w-7 h-7 rounded bg-muted flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.nombre)}
                            className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-heading font-bold uppercase">Total</span>
                      <span className="text-2xl font-heading font-bold text-gradient-gold">
                        ${total.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    {processing ? "Procesando pago..." : "Pagar ahora"}
                  </button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Pago seguro • Aceptamos todas las tarjetas y Mercado Pago
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreciosSection;
