import { useRef, useEffect, useState } from "react";
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
import { getPromotions } from "@/services/movieService";
import { Promotion } from "@/types/database.types";

const PromocionesCarouselSection = () => {
  const [promociones, setPromociones] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      try {
        const data = await getPromotions();
        setPromociones(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <section className="pt-28 pb-4 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl mx-auto"
        >
          {isLoading ? (
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-2xl relative">
               <div className="w-full h-full absolute inset-0 opacity-20 bg-primary/10 animate-pulse" />
               <div className="z-10 flex flex-col items-center">
                 <Film className="w-12 h-12 text-muted-foreground/50 mb-3 animate-pulse" />
                 <span className="text-muted-foreground uppercase text-xs tracking-widest font-semibold">Cargando destacados...</span>
               </div>
            </div>
          ) : promociones.length === 0 ? (
            <div className="w-full py-16 bg-muted/30 rounded-2xl border border-border flex items-center justify-center text-muted-foreground">
               No hay promociones activas.
            </div>
          ) : (
            <Carousel
              opts={{ loop: true }}
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
                        src={promo.image_url}
                        alt={promo.title}
                        className="absolute inset-0 w-full h-full object-cover select-none object-center"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pointer-events-none flex flex-col justify-end h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md ${promo.promo_type === 'promo' ? 'bg-primary/80 text-white' : 'bg-accent/80 text-accent-foreground'}`}>
                            {promo.promo_type === 'promo' ? <Tag className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                            {promo.promo_type === 'promo' ? 'Promoción' : 'Destacada'}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 drop-shadow-lg">
                          {promo.title}
                        </h2>
                        {promo.description && (
                          <p className="text-sm sm:text-base text-white/80 max-w-2xl drop-shadow-md">
                            {promo.description}
                          </p>
                        )}
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
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PromocionesCarouselSection;
