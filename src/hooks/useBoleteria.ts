import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { isWithinBusinessHours } from "@/components/SiteStatusBanner";

export const useBoleteria = () => {
  const [isManuallyOpen, setIsManuallyOpen] = useState<boolean | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          setIsManuallyOpen(true);
          return;
        }

        if (data) {
          setIsManuallyOpen(data.is_open);
        }
      } catch (err) {
        console.error(err);
        setIsManuallyOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Check schedule periodically
    setIsScheduleOpen(isWithinBusinessHours());
    const scheduleInterval = setInterval(() => {
      setIsScheduleOpen(isWithinBusinessHours());
    }, 60000);

    // Set up realtime listener for immediate updates
    const uniqueChannelName = `settings_changes_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(uniqueChannelName)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.global' }, (payload: any) => {
        setIsManuallyOpen(payload.new.is_open);
      })
      .subscribe();

    return () => {
      clearInterval(scheduleInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const isOpen = isManuallyOpen === null ? true : isManuallyOpen;

  return { isOpen, isLoading, isManuallyOpen, isScheduleOpen };
};
