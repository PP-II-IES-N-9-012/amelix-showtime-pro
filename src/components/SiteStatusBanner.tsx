import { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SiteStatusBanner = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("is_open")
          .eq("id", "global")
          .single();

        if (error) {
          console.error("Error fetching site status:", error);
          // Fallback to true if we fail to fetch (avoid locking people out randomly)
          setIsOpen(true); 
          return;
        }

        if (data) {
          setIsOpen(data.is_open);
        }
      } catch (err) {
        console.error(err);
        setIsOpen(true);
      }
    };

    fetchStatus();

    // Set up realtime listener for immediate updates
    const channel = supabase
      .channel('public:settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.global' }, (payload) => {
        setIsOpen(payload.new.is_open);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Don't render anything if it's open or loading
  if (isOpen === null || isOpen === true) return null;

  return (
    <div className="bg-destructive/90 text-destructive-foreground px-4 py-3 text-center shadow-lg sticky top-0 z-50 backdrop-blur-md border-b flex items-center justify-center gap-3">
      <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
      <p className="font-bold text-sm md:text-base tracking-wide uppercase">
        Amelix Showtime se encuentra actualmente CERRADO al público.
      </p>
      <Clock className="w-5 h-5 shrink-0 opacity-80" />
    </div>
  );
};

export default SiteStatusBanner;
