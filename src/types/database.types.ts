export type Movie = {
  id: string;
  tmdb_id: number | null;
  title: string;
  original_title: string | null;
  overview: string | null;
  genres: string | null;
  duration_minutes: number | null;
  classification: string | null;
  rating: number | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  director: string | null;
  cast_list: string | null;
  status: 'released' | 'upcoming';
  release_date: string | null;
  created_at: string;
};

export type Showtime = {
  id: string;
  movie_id: string;
  room_name: string | null;
  language_type: string | null;
  format: string | null;
  showing_date: string | null;
  showing_time: string | null;
  is_active: boolean;
  created_at: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  promo_type: 'promo' | 'destacada';
  is_active: boolean;
  order_index: number;
  created_at: string;
};
