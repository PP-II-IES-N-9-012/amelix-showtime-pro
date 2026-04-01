import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

const MapaSection = () => {
  return (
    <section id="ubicacion" className="py-20 bg-cinema-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Ubicación</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Cómo llegar a AMELIX Cinema
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border glow-red">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.5!2d-68.3364!3d-34.6177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAv.+Gral.+Jos%C3%A9+de+San+Mart%C3%ADn+133%2C+San+Rafael!5e0!3m2!1ses-419!2sar!4v1"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de AMELIX Cinema en San Rafael, Mendoza"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-card border border-border rounded-xl p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-bold uppercase text-sm">Dirección</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Av. Hipólito Yrigoyen 1234<br />
                  San Rafael, Mendoza<br />
                  Argentina (CP 5600)
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="h-5 w-5 text-accent" />
                  <h3 className="font-heading font-bold uppercase text-sm">Cómo llegar</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>🚗 Estacionamiento gratuito</li>
                  <li>🚌 Líneas 1, 3, 7 (parada a 50m)</li>
                  <li>♿ Acceso para personas con movilidad reducida</li>
                </ul>
              </div>

              <a
                href="https://www.google.com/maps/dir//San+Rafael,+Mendoza"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
              >
                <Navigation className="h-4 w-4" />
                Cómo llegar
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapaSection;
