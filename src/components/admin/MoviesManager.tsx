import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Film } from "lucide-react";
import { toast } from "sonner";
import { MovieWithShowtimes, getAllMoviesWithShowtimes } from "@/services/movieService";
import MovieDialog from "./MovieDialog";

const MoviesManager = () => {
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieWithShowtimes | null>(null);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await getAllMoviesWithShowtimes();
      setMovies(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar cartelera");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedMovie(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (movie: MovieWithShowtimes) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta película?")) return;
    
    try {
      const { error } = await supabase.from('movies').delete().eq('id', id);
      if (error) throw error;
      toast.success("Película eliminada correctamente");
      fetchMovies();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al eliminar la película");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const releasedMovies = movies.filter((movie) => movie.status === "released");
  const upcomingMovies = movies.filter((movie) => movie.status === "upcoming");

  const renderMoviesTable = (moviesList: MovieWithShowtimes[], emptyMessage: string) => {
    if (moviesList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {emptyMessage}
        </div>
      );
    }
    return (
      <div className="overflow-x-auto relative">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[80px]">Póster</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Género</TableHead>
              <TableHead className="hidden lg:table-cell">Duración</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moviesList.map((movie) => (
              <TableRow key={movie.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                    {movie.poster_url ? (
                      <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <span className="text-[10px] text-muted-foreground">N/A</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{movie.title}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{movie.genres}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {movie.duration_minutes ? `${movie.duration_minutes} min` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => handleEdit(movie)} variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border-blue-400/20" title="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(movie.id)} variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-red-300 hover:bg-destructive/10 border-destructive/20" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/30 p-5 rounded-xl border border-border/50 backdrop-blur-xl">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Film className="w-5 h-5 text-primary" /> Gestión de Películas
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Administra las películas en cartelera y próximamente.
          </p>
        </div>
        <Button onClick={handleAddNew} className="shrink-0 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Película
        </Button>
      </div>

      {isLoading ? (
        <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Películas en Cartelera */}
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  En Cartelera
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {releasedMovies.length}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Películas visibles actualmente en la cartelera principal.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderMoviesTable(releasedMovies, "No hay películas registradas en la cartelera.")}
            </CardContent>
          </Card>

          {/* Películas en Próximamente */}
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Próximamente
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                    {upcomingMovies.length}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Películas anunciadas para próximos estrenos.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {renderMoviesTable(upcomingMovies, "No hay películas registradas en próximamente.")}
            </CardContent>
          </Card>
        </div>
      )}

      <MovieDialog 
        movie={selectedMovie} 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSaved={fetchMovies} 
      />
    </div>
  );
};

export default MoviesManager;
