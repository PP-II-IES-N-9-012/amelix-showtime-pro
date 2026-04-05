import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const faqs = [
  {
    pregunta: "¿Cuáles son los métodos de pago aceptados?",
    respuesta: "Aceptamos efectivo, tarjetas de débito y crédito (Visa, Mastercard, American Express), Mercado Pago y transferencia bancaria.",
  },
  {
    pregunta: "¿Se pueden reservar entradas con anticipación?",
    respuesta: "Sí, podés reservar tus entradas directamente desde nuestra página web o acercándote a boletería. Las reservas online se mantienen hasta 30 minutos antes de la función.",
  },
  {
    pregunta: "¿Se permite ingresar con alimentos externos?",
    respuesta: "No se permite el ingreso con alimentos o bebidas externos. Nuestro Candy Bar ofrece una amplia variedad de combos a precios accesibles.",
  },
  {
    pregunta: "¿Se puede realizar cumpleaños o eventos privados?",
    respuesta: "¡Por supuesto! Ofrecemos alquiler de salas para cumpleaños, eventos corporativos y funciones privadas. Contactanos para más información.",
  },
];

const ContactoFaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ nombre: "", email: "", mensaje: "" });
      toast({
        title: "¡Mensaje enviado!",
        description: "Te responderemos a la brevedad. Gracias por contactarnos.",
      });
    }, 1200);
  };

  return (
    <section id="contacto" className="py-20 bg-cinema-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight mb-3">
            <span className="text-gradient-gold">Contacto & FAQ</span>
          </h2>
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            ¿Tenés alguna consulta? Estamos para ayudarte
          </p>
        </motion.div>

        {/* Contacto Empresas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 bg-card border border-accent/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-lg font-heading font-bold uppercase tracking-wider mb-2">
            Contacto para Empresas
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            ¿Querés publicitar en nuestras salas? Escribinos para conocer las opciones de pauta publicitaria.
          </p>
          <a
            href="mailto:cineamelix.publi@gmail.com"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold text-sm transition-colors"
          >
            <Send className="h-4 w-4" />
            cineamelix.publi@gmail.com
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-heading font-bold uppercase">Escribinos</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block font-medium">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre completo"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block font-medium">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-heading font-bold uppercase">Preguntas Frecuentes</h3>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm font-medium pr-4">{faq.pregunta}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.respuesta}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactoFaqSection;
