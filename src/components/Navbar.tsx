import { useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import amelixLogo from "@/assets/amelix-logo.png";
import { ModeToggle } from "./ModeToggle";

const navLinks = [
  { label: "Cartelera", href: "#cartelera" },
  { label: "Próximamente", href: "#proximamente" },
  { label: "Candy Bar", href: "#candybar" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Precios", href: "#precios" },
  { label: "Ubicación", href: "#ubicacion" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="flex items-center gap-2">
          <img src={amelixLogo} alt="AMELIX Cinema" className="h-10 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-heading"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>San Rafael, Mendoza</span>
          </div>

          <ModeToggle />

          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider font-heading"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-3 text-sm text-muted-foreground border-t border-border mt-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>San Rafael, Mendoza</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
