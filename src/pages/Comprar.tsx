import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Film, Calendar, Clock, 
  Armchair, Candy, Receipt, Loader2, CheckCircle, Plus, Minus, Home 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getBillboardMovies, MovieWithShowtimes, formatShowingDate } from "@/services/movieService";
import { toast } from "sonner";
import amelixLogo from "@/assets/cine-amelix-white.png";
import { useBoleteria } from "@/hooks/useBoleteria";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

const TICKET_TYPES: TicketType[] = [
  { id: "general", name: "General", price: 4500, description: "Sala estándar, butaca regular" },
  { id: "premium", name: "Premium", price: 5500, description: "Butaca premium reclinable, ubicación preferencial" },
  { id: "popular", name: "Miércoles Popular", price: 2800, description: "Tarifa promocional de miércoles" }
];

const COMBOS = [
  { id: "solo", name: "Combo Solo", price: 3200, items: "Pochoclos medianos + Gaseosa 500ml", saving: "Ahorrás $600" },
  { id: "pareja", name: "Combo Pareja", price: 5500, items: "Pochoclos grandes + 2 Gaseosas 500ml", saving: "Ahorrás $900" },
  { id: "familiar", name: "Combo Familiar", price: 8900, items: "2 Pochoclos grandes + 4 Gaseosas + Nachos", saving: "Ahorrás $2.300" },
  { id: "kids", name: "Combo Kids", price: 2800, items: "Pochoclos chicos + Jugo 500ml + Gomitas", saving: "Ahorrás $500" }
];

export default function Comprar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isOpen: boleteriaAbierta, isLoading: isLoadingBoleteria } = useBoleteria();
  
  const queryMovieId = searchParams.get("movieId");
  const queryTicketType = searchParams.get("ticketType");

  const [step, setStep] = useState(1);
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  
  // Selection state
  const [selectedMovie, setSelectedMovie] = useState<MovieWithShowtimes | null>(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>("");
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({
    general: 0,
    premium: 0,
    popular: 0
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [comboQuantities, setComboQuantities] = useState<Record<string, number>>({
    solo: 0,
    pareja: 0,
    familiar: 0,
    kids: 0
  });
  
  // Checkout loading / success state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [reservationCode, setReservationCode] = useState<string | null>(null);

  // Load movies on mount
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoadingMovies(true);
      try {
        const data = await getBillboardMovies();
        setMovies(data);
        
        // Handle pre-selections once movies are loaded
        if (queryMovieId) {
          const found = data.find(m => m.id === queryMovieId);
          if (found) setSelectedMovie(found);
        }
        if (queryTicketType && ["general", "premium", "popular"].includes(queryTicketType)) {
          setTicketQuantities(prev => ({
            ...prev,
            [queryTicketType]: 1
          }));
        }
      } catch (err) {
        console.error("Error loading billboard movies:", err);
      } finally {
        setIsLoadingMovies(false);
      }
    };
    loadMovies();
  }, [queryMovieId, queryTicketType]);

  // Fetch occupied seats when showtime changes
  useEffect(() => {
    if (!selectedShowtimeId) {
      setOccupiedSeats([]);
      setSelectedSeats([]);
      return;
    }
    
    const fetchOccupiedSeats = async () => {
      setIsLoadingSeats(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("seat_label")
          .eq("showtime_id", selectedShowtimeId);
        
        if (error) throw error;
        setOccupiedSeats(data ? data.map(b => b.seat_label) : []);
        setSelectedSeats([]); // Reset selection
      } catch (err) {
        console.error("Error fetching occupied seats:", err);
        setOccupiedSeats([]);
      } finally {
        setIsLoadingSeats(false);
      }
    };
    
    fetchOccupiedSeats();

    // Subscribe to seat booking changes for real-time updates on seat map
    const bookingsChannel = supabase
      .channel(`public:bookings:${selectedShowtimeId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings', 
        filter: `showtime_id=eq.${selectedShowtimeId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOccupiedSeats(prev => [...prev, payload.new.seat_label]);
        } else if (payload.eventType === 'DELETE') {
          setOccupiedSeats(prev => prev.filter(s => s !== payload.old.seat_label));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
    };
  }, [selectedShowtimeId]);

  // Calculations
  const selectedShowtime = selectedMovie?.showtimes.find(s => s.id === selectedShowtimeId);
  const totalTickets = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
  const ticketsPrice = Object.entries(ticketQuantities).reduce((sum, [id, qty]) => {
    const type = TICKET_TYPES.find(t => t.id === id);
    return sum + (type ? type.price * qty : 0);
  }, 0);
  const combosPrice = Object.entries(comboQuantities).reduce((sum, [id, qty]) => {
    const type = COMBOS.find(c => c.id === id);
    return sum + (type ? type.price * qty : 0);
  }, 0);
  const totalPrice = ticketsPrice + combosPrice;

  // Handle navigation
  const nextStep = () => {
    if (step === 1) {
      if (!selectedMovie) {
        toast.error("Por favor, selecciona una película.");
        return;
      }
      if (!selectedShowtimeId) {
        toast.error("Por favor, selecciona un horario.");
        return;
      }
    }
    if (step === 2) {
      if (totalTickets <= 0) {
        toast.error("Debes seleccionar al menos una entrada.");
        return;
      }
    }
    if (step === 3) {
      if (selectedSeats.length !== totalTickets) {
        toast.error(`Por favor, selecciona exactamente ${totalTickets} asiento(s) para continuar.`);
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  // Seat map details
  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 8 }, (_, i) => i + 1);

  const toggleSeat = (seatLabel: string) => {
    if (occupiedSeats.includes(seatLabel)) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatLabel)) {
        return prev.filter(s => s !== seatLabel);
      }
      if (prev.length >= totalTickets) {
        return [...prev.slice(1), seatLabel];
      }
      return [...prev, seatLabel];
    });
  };

  const handleConfirmPurchase = async () => {
    if (!customerName || !customerEmail) {
      toast.error("Por favor, completa tus datos de contacto.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Double check seat availability before saving
      const { data: latestOccupied, error: checkError } = await supabase
        .from("bookings")
        .select("seat_label")
        .eq("showtime_id", selectedShowtimeId);

      if (checkError) throw checkError;
      
      const latestOccupiedLabels = latestOccupied ? latestOccupied.map(b => b.seat_label) : [];
      const conflict = selectedSeats.find(s => latestOccupiedLabels.includes(s));
      if (conflict) {
        toast.error(`El asiento ${conflict} ya fue reservado. Por favor, selecciona otro asiento.`);
        setOccupiedSeats(latestOccupiedLabels);
        setSelectedSeats([]);
        setStep(3); // Go back to seat selection
        setIsSubmitting(false);
        return;
      }

      // 2. Insert into bookings
      const bookingRows = selectedSeats.map(seat => ({
        showtime_id: selectedShowtimeId,
        seat_label: seat
      }));

      const { error: insertError } = await supabase
        .from("bookings")
        .insert(bookingRows);

      if (insertError) throw insertError;

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setReservationCode(code);
      toast.success("¡Compra realizada con éxito!");
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Error booking tickets:", err);
      toast.error("Hubo un error al procesar tu compra. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const updateTicketQty = (id: string, delta: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const updateComboQty = (id: string, delta: number) => {
    setComboQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  // If loading box office status
  if (isLoadingBoleteria) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Cargando...</p>
      </div>
    );
  }

  // If box office is closed manually by admin
  if (!boleteriaAbierta) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 bg-card border border-border rounded-2xl shadow-xl flex flex-col items-center">
          <span className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
            <X className="w-8 h-8" />
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">Boletería Cerrada</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            El complejo se encuentra cerrado actualmente. No es posible realizar compras online en este momento.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // If checkout succeeded
  if (reservationCode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">¡Reserva Confirmada!</h2>
          <p className="text-sm text-muted-foreground mt-2">Tu pago ha sido procesado exitosamente.</p>
          
          <div className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 p-6 my-6 font-mono text-xs uppercase text-left relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            <div className="text-center pb-3 border-b border-dashed border-neutral-800">
              <h4 className="font-bold text-sm tracking-wider text-primary">AMELIX CINEMA</h4>
              <p className="text-[8px] text-neutral-500 mt-0.5">San Rafael, Mendoza</p>
            </div>
            
            <div className="py-3 border-b border-dashed border-neutral-800 space-y-1">
              <p className="font-bold text-neutral-200">{selectedMovie?.title}</p>
              <p className="text-[10px] text-neutral-400">Sala: {selectedShowtime?.room_name} ({selectedShowtime?.format})</p>
              <p className="text-[10px] text-neutral-400">Fecha/Hora: {formatShowingDate(selectedShowtime?.showing_date)} - {selectedShowtime?.showing_time?.slice(0, 5)}hs</p>
            </div>

            <div className="py-3 border-b border-dashed border-neutral-800 space-y-1.5">
              <div>
                <span className="text-neutral-600 block text-[9px]">ASIENTOS</span>
                <span className="font-bold text-neutral-200 text-sm">{selectedSeats.join(", ")}</span>
              </div>
              <div>
                <span className="text-neutral-600 block text-[9px]">CÓDIGO DE RESERVA</span>
                <span className="font-bold text-primary text-base tracking-wider">{reservationCode}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col items-center justify-center opacity-60">
              <div className="w-full h-8 bg-neutral-900 border-l border-r border-neutral-700 relative overflow-hidden flex justify-between items-center px-1">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-full"
                    style={{
                      width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                      opacity: i % 5 === 0 ? 0.3 : 1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Muestra el código anterior en boletería física o en el ingreso de la sala para obtener tus boletos.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 rounded-lg font-heading uppercase tracking-wider text-sm font-semibold transition-all glow-red"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 relative z-10">
        <a href="/" className="flex items-center gap-2">
          <img src={amelixLogo} alt="AMELIX Cinema" className="h-10 w-auto" />
        </a>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-semibold"
        >
          <Home className="w-4 h-4" />
          Volver a la cartelera
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full bg-card flex flex-col overflow-hidden">
          
          {/* Steps Indicator Header */}
          <div className="p-6 border-b border-border bg-black/40 relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
            <h2 className="text-xl font-heading font-bold uppercase tracking-tight text-gradient-gold">
              Proceso de Compra
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
              Paso {step} de 5: {
                step === 1 ? "Película y Función" :
                step === 2 ? "Selección de Entradas" :
                step === 3 ? "Selección de Asientos" :
                step === 4 ? "Candy Bar" : "Confirmar Ticket"
              }
            </p>
          </div>

          <div className="bg-black/25 px-6 py-2 flex items-center justify-between border-b border-border gap-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            <div className={`flex items-center gap-1 ${step >= 1 ? "text-primary" : ""}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">1</span>
              Función
            </div>
            <div className="w-4 h-px bg-white/5" />
            <div className={`flex items-center gap-1 ${step >= 2 ? "text-primary" : ""}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">2</span>
              Entradas
            </div>
            <div className="w-4 h-px bg-white/5" />
            <div className={`flex items-center gap-1 ${step >= 3 ? "text-primary" : ""}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">3</span>
              Asientos
            </div>
            <div className="w-4 h-px bg-white/5" />
            <div className={`flex items-center gap-1 ${step >= 4 ? "text-primary" : ""}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">4</span>
              Candy
            </div>
            <div className="w-4 h-px bg-white/5" />
            <div className={`flex items-center gap-1 ${step >= 5 ? "text-primary" : ""}`}>
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">5</span>
              Resumen
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {isLoadingMovies ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Cargando...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          Selecciona la Película
                        </label>
                        <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-2">
                          {movies.map(movie => (
                            <div
                              key={movie.id}
                              onClick={() => {
                                setSelectedMovie(movie);
                                setSelectedShowtimeId("");
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                                selectedMovie?.id === movie.id
                                  ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                                  : "bg-card/40 border-white/5 hover:border-white/20"
                              }`}
                            >
                              <div className="w-12 aspect-[2/3] rounded overflow-hidden flex-shrink-0 bg-muted">
                                {movie.poster_url && (
                                  <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-heading font-bold text-sm uppercase truncate text-foreground">
                                  {movie.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{movie.genres}</p>
                                <div className="flex gap-2 mt-1.5">
                                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-medium">{movie.classification}</span>
                                  <span className="text-[10px] text-muted-foreground">{movie.duration_minutes} min</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                          Selecciona el Horario
                        </label>
                        {selectedMovie ? (
                          selectedMovie.showtimes && selectedMovie.showtimes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2.5 max-h-[40vh] overflow-y-auto pr-2">
                              {selectedMovie.showtimes.map(st => (
                                <div
                                  key={st.id}
                                  onClick={() => setSelectedShowtimeId(st.id)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                    selectedShowtimeId === st.id
                                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                                      : "bg-card/40 border-white/5 hover:border-white/20"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-colors ${
                                      selectedShowtimeId === st.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-primary"
                                    }`}>
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <span className="font-heading font-bold text-lg leading-none block">{st.showing_time?.slice(0, 5)}hs</span>
                                      <span className="text-[10px] text-muted-foreground mt-0.5 block">{formatShowingDate(st.showing_date)}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{st.language_type}</span>
                                    <span className="text-xs font-semibold text-muted-foreground block mt-0.5">{st.room_name} ({st.format})</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-[30vh] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                              <Calendar className="w-8 h-8 text-muted-foreground/40 mb-2" />
                              <p className="text-sm text-muted-foreground">Esta película no tiene funciones hoy.</p>
                            </div>
                          )
                        ) : (
                          <div className="h-[35vh] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                            <Film className="w-10 h-10 text-muted-foreground/30 mb-2 animate-pulse" />
                            <p className="text-sm text-muted-foreground">Por favor, selecciona una película para ver sus horarios.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="max-w-xl mx-auto space-y-4">
                    <h3 className="text-lg font-bold text-center uppercase tracking-wider mb-2">
                      Selecciona la cantidad de entradas
                    </h3>
                    <div className="space-y-3">
                      {TICKET_TYPES.map(ticket => (
                        <div 
                          key={ticket.id} 
                          className="bg-card/40 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-all"
                        >
                          <div className="flex-1">
                            <h4 className="font-heading font-bold uppercase text-sm">{ticket.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{ticket.description}</p>
                            <p className="text-sm font-semibold text-gradient-gold mt-1.5">${ticket.price.toLocaleString("es-AR")}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateTicketQty(ticket.id, -1)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-lg font-bold w-6 text-center">{ticketQuantities[ticket.id]}</span>
                            <button
                              onClick={() => updateTicketQty(ticket.id, 1)}
                              className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center text-sm font-bold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 mt-6 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground uppercase font-semibold">Total Entradas:</span>
                      <span className="font-bold text-base text-foreground">{totalTickets}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-8 text-center">
                      Selecciona tus asientos ({selectedSeats.length} de {totalTickets})
                    </h3>

                    <div className="w-full max-w-lg mb-10 flex flex-col items-center">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_20px_rgba(234,179,8,0.7)]" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-2">Pantalla</p>
                    </div>

                    {isLoadingSeats ? (
                      <div className="py-12 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                        <p className="text-xs text-muted-foreground">Cargando butacas...</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 bg-black/15 p-6 rounded-2xl border border-white/5 max-w-md w-full">
                        {rows.map(row => (
                          <div key={row} className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-bold text-muted-foreground w-4 text-center">{row}</span>
                            <div className="flex-1 flex justify-center gap-1.5">
                              {cols.map(col => {
                                const seatLabel = `${row}${col}`;
                                const isOccupied = occupiedSeats.includes(seatLabel);
                                const isSelected = selectedSeats.includes(seatLabel);
                                return (
                                  <button
                                    key={seatLabel}
                                    disabled={isOccupied}
                                    onClick={() => toggleSeat(seatLabel)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all relative ${
                                      isOccupied
                                        ? "bg-red-500/20 border border-red-500/40 text-red-500 cursor-not-allowed"
                                        : isSelected
                                        ? "bg-primary text-primary-foreground border border-primary shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                                        : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:bg-white/10"
                                    }`}
                                    title={`${seatLabel} - ${isOccupied ? "Ocupado" : isSelected ? "Seleccionado" : "Disponible"}`}
                                  >
                                    <Armchair className="w-4 h-4 opacity-50" />
                                    <span className="absolute bottom-0 text-[7px] leading-none mb-0.5">{col}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <span className="text-xs font-bold text-muted-foreground w-4 text-center">{row}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-center gap-6 mt-8 text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center"><Armchair className="w-3.5 h-3.5 opacity-50" /></div>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-primary border border-primary flex items-center justify-center text-primary-foreground"><Armchair className="w-3.5 h-3.5" /></div>
                        <span>Seleccionado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500"><Armchair className="w-3.5 h-3.5" /></div>
                        <span>Ocupado</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 max-w-xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Candy className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-bold uppercase tracking-wider">
                        Candy Bar (Opcional)
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mb-6">
                      Añade pochoclos y gaseosas directamente en tu compra.
                    </p>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {COMBOS.map(combo => (
                        <div 
                          key={combo.id}
                          className="bg-card/40 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-heading font-bold uppercase text-sm">{combo.name}</h4>
                              <span className="text-[9px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {combo.saving}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{combo.items}</p>
                            <p className="text-sm font-semibold text-gradient-gold mt-2">${combo.price.toLocaleString("es-AR")}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateComboQty(combo.id, -1)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-lg font-bold w-6 text-center">{comboQuantities[combo.id]}</span>
                            <button
                              onClick={() => updateComboQty(combo.id, 1)}
                              className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center text-sm font-bold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-start">
                    <div className="space-y-4 bg-black/15 p-5 rounded-xl border border-white/5">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Información de Contacto
                      </h3>
                      <div className="space-y-3.5">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Nombre Completo</label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Juan Pérez"
                            className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-lg text-sm focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Correo Electrónico</label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={e => setCustomerEmail(e.target.value)}
                            placeholder="juan.perez@example.com"
                            className="w-full bg-black/40 border border-white/10 px-4 py-2.5 rounded-lg text-sm focus:border-primary focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Receipt ticket visual */}
                    <div className="bg-neutral-950 text-white rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col p-6 font-mono text-xs uppercase">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                      
                      <div className="text-center pb-4 border-b border-dashed border-neutral-800">
                        <h4 className="font-bold text-sm tracking-wider text-primary">AMELIX CINEMA</h4>
                        <p className="text-[8px] text-neutral-500 mt-0.5">San Rafael, Mendoza</p>
                      </div>

                      <div className="py-4 space-y-1.5 border-b border-dashed border-neutral-800">
                        <p className="font-bold text-neutral-100">{selectedMovie?.title}</p>
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-neutral-400 mt-1">
                          <div>
                            <span className="text-neutral-600 block">SALA</span>
                            <span>{selectedShowtime?.room_name}</span>
                          </div>
                          <div>
                            <span className="text-neutral-600 block">FORMATO</span>
                            <span>{selectedShowtime?.format}</span>
                          </div>
                          <div>
                            <span className="text-neutral-600 block">FECHA</span>
                            <span>{formatShowingDate(selectedShowtime?.showing_date)}</span>
                          </div>
                          <div>
                            <span className="text-neutral-600 block">HORA</span>
                            <span>{selectedShowtime?.showing_time?.slice(0, 5)}HS</span>
                          </div>
                        </div>
                      </div>

                      <div className="py-4 space-y-2 border-b border-dashed border-neutral-800">
                        <div>
                          <span className="text-neutral-600 block">BUTACAS SELECCIONADAS</span>
                          <span className="font-bold text-neutral-200">{selectedSeats.join(", ")}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-neutral-600 block">DESGLOSE</span>
                          {Object.entries(ticketQuantities).map(([id, qty]) => {
                            if (qty <= 0) return null;
                            const tType = TICKET_TYPES.find(t => t.id === id);
                            return (
                              <div key={id} className="flex justify-between text-neutral-300 text-[10px]">
                                <span>{qty}X {tType?.name}</span>
                                <span>${((tType?.price || 0) * qty).toLocaleString("es-AR")}</span>
                              </div>
                            );
                          })}
                          {Object.entries(comboQuantities).map(([id, qty]) => {
                            if (qty <= 0) return null;
                            const cCombo = COMBOS.find(c => c.id === id);
                            return (
                              <div key={id} className="flex justify-between text-neutral-300 text-[10px]">
                                <span>{qty}X {cCombo?.name}</span>
                                <span>${((cCombo?.price || 0) * qty).toLocaleString("es-AR")}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="py-4 flex justify-between items-center">
                        <span className="font-bold text-neutral-400">TOTAL</span>
                        <span className="font-bold text-base text-primary">${totalPrice.toLocaleString("es-AR")}</span>
                      </div>

                      <div className="pt-4 flex flex-col items-center justify-center border-t border-dashed border-neutral-800 opacity-60">
                        <div className="w-full h-8 bg-neutral-900 border-l border-r border-neutral-700 relative overflow-hidden flex justify-between items-center px-1">
                          {Array.from({ length: 42 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-white h-full"
                              style={{
                                width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                                opacity: i % 5 === 0 ? 0.3 : 1
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[8px] text-neutral-600 tracking-[0.25em] mt-1.5">TICKET-RESERVA-ONLINE</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-5 border-t border-border flex justify-between items-center bg-black/40">
            <div>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-sm font-semibold transition-all hover:text-foreground text-muted-foreground disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-heading uppercase tracking-wider text-xs font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmPurchase}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground px-8 py-3 rounded-lg font-heading uppercase tracking-widest text-xs font-black transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirmar Compra
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
