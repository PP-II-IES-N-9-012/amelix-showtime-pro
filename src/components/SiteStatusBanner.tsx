import { AlertTriangle, Clock } from "lucide-react";
import { useBoleteria } from "@/hooks/useBoleteria";

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
  // Open from 17:30 (1050 minutes) to 23:59 (1439 minutes)
  if (timeInMinutes >= 1050 && timeInMinutes <= 1439) {
    return true;
  }
  
  return false;
};

const SiteStatusBanner = () => {
  const { isOpen: isCurrentlyOpen, isLoading } = useBoleteria();

  // Don't render anything if it's open or loading
  if (isLoading || isCurrentlyOpen) return null;

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
