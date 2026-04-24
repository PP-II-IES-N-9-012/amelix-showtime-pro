import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MovieWithShowtimes, getBillboardMovies } from "@/services/movieService";

const MoviesManager = () => {
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await getBillboardMovies();
      setMovies(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar cartelera");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border shadow-xl">
      <CardHeader className="pb-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold">Películas en Cartelera</CardTitle>
          <CardDescription className="mt-1">
            Administra las películas visibles actualmente en la cartelera.
          </CardDescription>
        </div>
        <Button className="shrink-0 gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Película
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No hay películas registradas en la cartelera.
          </div>
        ) : (
          <div className="overflow-x-auto relative min-h-[400px]">
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
                {movies.map((movie) => (
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
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 border-blue-400/20" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-red-300 hover:bg-destructive/10 border-destructive/20" title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoviesManager;
