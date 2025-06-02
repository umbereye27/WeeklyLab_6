

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  _id: string;
  titleText: { text: string };
  releaseYear?: { year: number };
  primaryImage?: { url: string };
  genres?: { genres: { text: string }[] };
  overview?: string;
  runtime?: number;
  tagline?: string;
  vote_average?: number;
}

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface WatchlistMovie extends Movie {
  overview: string;
  vote_average: number;
}