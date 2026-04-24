const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  genres: string;
  duration_minutes: number;
  poster_url: string;
  trailer_url: string | null;
  director: string | null;
  cast_list: string | null;
}

export const searchTMDBMovies = async (query: string): Promise<TMDBMovie[]> => {
  if (!TMDB_API_KEY) {
    throw new Error("Falta configurar VITE_TMDB_API_KEY en .env.local");
  }

  const res = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`);
  if (!res.ok) throw new Error("Error al buscar películas en TMDB");
  
  const data = await res.json();
  return data.results || [];
};

export const getTMDBMovieDetails = async (movieId: number): Promise<TMDBMovieDetails> => {
  if (!TMDB_API_KEY) {
    throw new Error("Falta configurar VITE_TMDB_API_KEY en .env.local");
  }

  // Fetch basic details
  const detailsRes = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`);
  if (!detailsRes.ok) throw new Error("Error al obtener detalles de la película");
  const details = await detailsRes.json();

  // Fetch videos (for trailer)
  const videosRes = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=es-ES`);
  const videosData = videosRes.ok ? await videosRes.json() : { results: [] };
  
  // Try to find a YouTube trailer in Spanish. If none, maybe fetch in English (omitted for simplicity, we'll just check what we get).
  const trailer = videosData.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer') 
    || videosData.results?.find((v: any) => v.site === 'YouTube'); // Fallback to any youtube video
  const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;

  // Fetch credits (for director and cast)
  const creditsRes = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=es-ES`);
  const creditsData = creditsRes.ok ? await creditsRes.json() : { cast: [], crew: [] };
  
  const director = creditsData.crew?.find((c: any) => c.job === 'Director')?.name || null;
  const castList = creditsData.cast?.slice(0, 5).map((c: any) => c.name).join(', ') || null;

  const genres = details.genres?.map((g: any) => g.name).join(', ') || '';
  const posterUrl = details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '';

  return {
    id: details.id,
    title: details.title,
    overview: details.overview,
    genres,
    duration_minutes: details.runtime || 0,
    poster_url: posterUrl,
    trailer_url: trailerUrl,
    director,
    cast_list: castList
  };
};
