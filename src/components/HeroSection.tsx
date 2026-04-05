import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Ticket } from "lucide-react";
import heroBg from "@/assets/hero-cinema.jpg";

const useBoleteria = () => {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay(); // 0=dom, 1=lun
      const hour = now.getHours();
      // Lunes cerrado. Resto abre 18:00 a 00:00
      setAbierto(day !== 1 && hour >= 18);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  return abierto;
};

const HeroSection = () => {
  const boleteriaAbierta = useBoleteria();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="AMELIX Cinema"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold uppercase tracking-tight mb-4">
            <span className="text-gradient-gold">AMELIX</span>
          </h1>
          <p className="text-xl md:text-2xl font-heading uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Cinema
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg mx-auto font-light">
            La mejor experiencia cinematográfica de San Rafael, Mendoza
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#cartelera"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
          >
            <Play className="h-4 w-4" />
            Ver Cartelera
          </a>
          <a
            href="#precios"
            className="inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all"
          >
            <Ticket className="h-4 w-4" />
            Ver Precios
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/40 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
