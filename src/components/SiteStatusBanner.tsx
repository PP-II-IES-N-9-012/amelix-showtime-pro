import { useState, useEffect } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const isWithinBusinessHours = (): boolean => {
  const now = new Date();
  const argentinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  
  const dayOfWeek = argentinaTime.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
  const hours = argentinaTime.getHours();
  const minutes = argentinaTime.getMinutes();

  // Closed on Monday
  if (dayOfWeek === 1) {
    return false;
  }

  const timeInMinutes = hours * 60 + minutes;
  // Open from 17:00 (1020 minutes) to 23:59 (1439 minutes)
  if (timeInMinutes >= 1020 && timeInMinutes <= 1439) {
    return true;
  }
  
  return false;
};

const SiteStatusBanner = () => {
  const [isManuallyOpen, setIsManuallyOpen] = useState<boolean | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(true);

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
          setIsManuallyOpen(true); 
          return;
        }

        if (data) {
          setIsManuallyOpen(data.is_open);
        }
      } catch (err) {
        console.error(err);
        setIsManuallyOpen(true);
      }
    };

    fetchStatus();

    // Check schedule periodically
    setIsScheduleOpen(isWithinBusinessHours());
    const scheduleInterval = setInterval(() => {
      setIsScheduleOpen(isWithinBusinessHours());
    }, 60000); // Check every minute

    // Set up realtime listener for immediate updates
    const channel = supabase
      .channel('public:settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.global' }, (payload) => {
        setIsManuallyOpen(payload.new.is_open);
      })
      .subscribe();

    return () => {
      clearInterval(scheduleInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // The cinema is open if it's manually open AND within business hours
  const isCurrentlyOpen = isManuallyOpen === null ? true : (isManuallyOpen && isScheduleOpen);

  // Don't render anything if it's open or loading
  if (isCurrentlyOpen) return null;

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
