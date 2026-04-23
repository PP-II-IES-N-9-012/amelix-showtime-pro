import { supabase } from '@/lib/supabase';
import { Movie, Showtime, Promotion } from '@/types/database.types';

export type MovieWithShowtimes = Movie & {
  showtimes: Showtime[];
};

export const getBillboardMovies = async (): Promise<MovieWithShowtimes[]> => {
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

  return data || [];
};
