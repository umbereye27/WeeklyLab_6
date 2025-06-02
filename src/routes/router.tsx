import { useRoutes } from "react-router-dom";
import MovieList from "../pages/MoviesList";
import { MovieDetailPage } from "../pages/MovieDetailPage";
import WatchlistPage from "../pages/WatchlistPage";
import MainLayout from "../layouts/MainLayout";

export const Routes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <MovieList />,
        },
        {
          path: "movie/:id",
          element: <MovieDetailPage />,
        },
        {
          path: "watchlist",
          element: <WatchlistPage />,
        },
      ],
    },
  ]);
  return routes;
};
