import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import amelixLogo from "@/assets/amelix-logo.png";

const FooterSection = () => {
  return (
    <footer id="ubicacion" className="bg-cinema-dark border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src={amelixLogo} alt="AMELIX Cinema" className="h-12 w-auto mb-4" loading="lazy" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              La mejor experiencia cinematográfica de San Rafael. 
              Tecnología de punta, sonido envolvente y la comodidad que merecés.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider text-sm mb-4 text-gradient-gold">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Av. Gral. José de San Martín 133, San Rafael, Mendoza</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>(0260) 442-7171</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Lun a Dom: 13:00 – 00:00 hs</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider text-sm mb-4 text-gradient-gold">
              Seguinos
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              @amelixcinema
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 AMELIX Cinema — San Rafael, Mendoza. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
