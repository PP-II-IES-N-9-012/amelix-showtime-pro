import { useRef } from "react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Film, Tag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import promo1 from "@/assets/gallery1.jpg";
import promo2 from "@/assets/hero-cinema.jpg";
import promo3 from "@/assets/gallery2.jpg";
import movie1 from "@/assets/movie1.jpg";

const promociones = [
  {
    id: 1,
    title: "¡2x1 en Entradas los Martes!",
    description: "Vení con un amigo y pagá una sola entrada en todas las funciones 2D.",
    image: promo1,
    type: "promo",
  },
  {
    id: 2,
    title: "Estreno Exclusivo: Sombras del Pasado",
    description: "No te pierdas el thriller del año. Ya en cartelera.",
    image: movie1, // We'll use object-cover to make it rectangular
    type: "destacada",
  },
  {
    id: 3,
    title: "Combo Familia: 30% OFF en Candy Bar",
    description: "Disfrutá más pagando menos. Válido para pochoclos grandes y 4 bebidas.",
    image: promo3,
    type: "promo",
  },
  {
    id: 4,
    title: "Experiencia AMELIX Premium",
    description: "Descubrí nuestras nuevas salas con sonido envolvente Dolby Atmos.",
    image: promo2,
    type: "destacada",
  },
];

const PromocionesCarouselSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="pt-28 pb-4 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto"
        >
          <Carousel
            plugins={[plugin.current]}
            className="w-full relative shadow-2xl rounded-2xl group"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {promociones.map((promo) => (
                <CarouselItem key={promo.id}>
                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] rounded-2xl overflow-hidden cursor-pointer select-none">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="absolute inset-0 w-full h-full object-cover select-none object-center"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none flex flex-col justify-end h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${promo.type === 'promo' ? 'bg-primary/80 text-white' : 'bg-accent/80 text-accent-foreground'}`}>
                          {promo.type === 'promo' ? <Tag className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                          {promo.type === 'promo' ? 'Promoción' : 'Destacada'}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 drop-shadow-lg">
                        {promo.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 max-w-2xl drop-shadow-md">
                        {promo.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <CarouselPrevious className="left-4 bg-background/50 backdrop-blur-sm border-none hover:bg-background/80 text-white hover:text-white" />
              <CarouselNext className="right-4 bg-background/50 backdrop-blur-sm border-none hover:bg-background/80 text-white hover:text-white" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default PromocionesCarouselSection;
