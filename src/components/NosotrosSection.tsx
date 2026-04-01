import { motion } from "framer-motion";
import { Film, Users, Award, Sparkles } from "lucide-react";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";

const stats = [
  { icon: Film, value: "2", label: "Salas" },
  { icon: Users, value: "400+", label: "Butacas" },
  { icon: Award, value: "10+", label: "Años de experiencia" },
  { icon: Sparkles, value: "100%", label: "Dolby Audio" },
];

const galeria = [
  { src: gallery1, alt: "Sala de cine AMELIX con butacas premium" },
  { src: gallery2, alt: "Lobby y Candy Bar de AMELIX Cinema" },
  { src: gallery3, alt: "Fachada exterior de AMELIX Cinema" },
];

const NosotrosSection = () => {
  return (
    <section id="nosotros" className="py-20 bg-cinema-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Nosotros</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Conocé AMELIX Cinema
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-heading font-bold uppercase mb-4">
              La mejor experiencia cinematográfica de <span className="text-primary">San Rafael</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Desde hace más de una década, AMELIX Cinema es el punto de encuentro de los amantes del cine en San Rafael, Mendoza. Contamos con tecnología de última generación, pantallas IMAX, sonido Dolby Atmos y las butacas más cómodas de la región.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nuestro compromiso es brindarte una experiencia inolvidable. Desde el momento en que entrás a nuestro lobby hasta que se encienden las luces al final de la película, cada detalle está pensado para que disfrutes al máximo.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center bg-card border border-border rounded-lg p-4"
                >
                  <stat.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-heading font-bold text-gradient-gold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden border border-border glow-red">
              <img
                src={gallery1}
                alt="Interior de AMELIX Cinema"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-40 h-28 rounded-lg overflow-hidden border-2 border-primary shadow-2xl hidden md:block">
              <img
                src={gallery2}
                alt="Candy Bar de AMELIX"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Galería */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-heading font-bold uppercase tracking-tight text-center mb-8">
            Nuestras <span className="text-accent">Instalaciones</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {galeria.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl overflow-hidden border border-border group cursor-pointer"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NosotrosSection;
