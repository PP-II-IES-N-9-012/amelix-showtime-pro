import { supabase } from '@/lib/supabase';
import { Movie, Showtime, Promotion } from '@/types/database.types';

export type MovieWithShowtimes = Movie & {
  showtimes: Showtime[];
};

export const getBillboardMovies = async (): Promise<MovieWithShowtimes[]> => {
  // Clean up old showtimes dynamically
  await cleanupOldShowtimes();

  // Fetch movies that are released
  const { data: movies, error: movieError } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'released');

  if (movieError) {
    console.error('Error fetching movies:', movieError);
    return [];
  }

  if (!movies || movies.length === 0) return [];

  const movieIds = movies.map((m: Movie) => m.id);

  // Fetch showtimes for these movies
  const { data: showtimes, error: showtimesError } = await supabase
    .from('showtimes')
    .select('*')
    .in('movie_id', movieIds)
    .eq('is_active', true)
    .order('showing_date', { ascending: true })
    .order('showing_time', { ascending: true });

  if (showtimesError) {
    console.error('Error fetching showtimes:', showtimesError);
  }

  // Combine movies with their showtimes
  const moviesWithShowtimes = movies.map((movie: Movie) => {
    return {
      ...movie,
      showtimes: showtimes ? showtimes.filter((s: Showtime) => s.movie_id === movie.id) : [],
    };
  });

  return moviesWithShowtimes;
};

export const getAllMoviesWithShowtimes = async (): Promise<MovieWithShowtimes[]> => {
  // Clean up old showtimes dynamically
  await cleanupOldShowtimes();

  // Fetch all movies ordered by creation date (newest first)
  const { data: movies, error: movieError } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (movieError) {
    console.error('Error fetching all movies:', movieError);
    return [];
  }

  if (!movies || movies.length === 0) return [];

  const movieIds = movies.map((m: Movie) => m.id);

  // Fetch showtimes for these movies
  const { data: showtimes, error: showtimesError } = await supabase
    .from('showtimes')
    .select('*')
    .in('movie_id', movieIds)
    .eq('is_active', true)
    .order('showing_date', { ascending: true })
    .order('showing_time', { ascending: true });

  if (showtimesError) {
    console.error('Error fetching showtimes:', showtimesError);
  }

  // Combine movies with their showtimes
  const moviesWithShowtimes = movies.map((movie: Movie) => {
    return {
      ...movie,
      showtimes: showtimes ? showtimes.filter((s: Showtime) => s.movie_id === movie.id) : [],
    };
  });

  return moviesWithShowtimes;
};


export const getUpcomingMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'upcoming')
    .order('release_date', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming movies:', error);
    return [];
  }

  return data || [];
};

export const getPromotions = async (): Promise<Promotion[]> => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }

  const now = new Date();
  const activePromos = (data || []).filter((promo: Promotion) => {
    if (!promo.valid_until) return true;
    return new Date(promo.valid_until) > now;
  });

  return activePromos;
};

export const getCinemaWeekDays = () => {
  const today = new Date();
  
  // Find current Thursday (Cinema Week Start)
  const day = today.getDay();
  const daysSinceThursday = (day - 4 + 7) % 7;
  const currentThursday = new Date(today);
  currentThursday.setDate(today.getDate() - daysSinceThursday);
  currentThursday.setHours(0, 0, 0, 0);

  const formatWeekDay = (date: Date) => {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const name = dayNames[date.getDay()];
    const dayStr = String(date.getDate()).padStart(2, '0');
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    return `${name} ${dayStr}/${monthStr}`;
  };

  const formatDateValue = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const list = [];
  
  // Current Week (Thursday to Wednesday)
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentThursday);
    d.setDate(currentThursday.getDate() + i);
    list.push({
      value: formatDateValue(d),
      label: `${formatWeekDay(d)} (Semana Actual)`
    });
  }

  // Next Week (Thursday to Wednesday)
  for (let i = 7; i < 14; i++) {
    const d = new Date(currentThursday);
    d.setDate(currentThursday.getDate() + i);
    list.push({
      value: formatDateValue(d),
      label: `${formatWeekDay(d)} (Semana Siguiente)`
    });
  }

  return list;
};

export const formatShowingDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "-";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const name = dayNames[date.getDay()];
  const day = parts[2];
  const month = parts[1];
  return `${name} ${day}/${month}`;
};

export const cleanupOldShowtimes = async (): Promise<void> => {
  try {
    const today = new Date();
    const day = today.getDay();
    const daysSinceThursday = (day - 4 + 7) % 7;
    const currentThursday = new Date(today);
    currentThursday.setDate(today.getDate() - daysSinceThursday);
    currentThursday.setHours(0, 0, 0, 0);

    const yyyy = currentThursday.getFullYear();
    const mm = String(currentThursday.getMonth() + 1).padStart(2, '0');
    const dd = String(currentThursday.getDate()).padStart(2, '0');
    const currentThursdayStr = `${yyyy}-${mm}-${dd}`;

    // Get all showtimes with showing_date < currentThursdayStr
    const { data: oldShowtimes, error: selectError } = await supabase
      .from('showtimes')
      .select('id')
      .lt('showing_date', currentThursdayStr);

    if (selectError) throw selectError;

    if (oldShowtimes && oldShowtimes.length > 0) {
      const oldShowtimeIds = oldShowtimes.map(st => st.id);
      
      // Delete old bookings first to avoid foreign key violations
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .in('showtime_id', oldShowtimeIds);
        
      if (bookingsError) {
        console.error('Error deleting old bookings:', bookingsError);
      }

      // Delete the old showtimes
      const { error: deleteError } = await supabase
        .from('showtimes')
        .delete()
        .in('id', oldShowtimeIds);

      if (deleteError) throw deleteError;
      console.log(`Cleaned up ${oldShowtimes.length} old showtimes and their bookings.`);
    }
  } catch (error) {
    console.error('Failed to cleanup old showtimes:', error);
  }
};

