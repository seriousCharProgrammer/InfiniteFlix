import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '5f4161158073968a49852676a3e682b4'; // Replace with your actual TMDB API key

// Fetch popular movies
const getPopularMovies = async () => {
  const response = await axios.get(`${API_URL}movie/popular`, {
    params: {
      api_key: API_KEY,
    },
  });

  return response.data.results;
};

const getNowPlayingMovies = async () => {
  const response = await axios.get(
    `${API_URL}movie/now_playing?api_key=${API_KEY}&language=en-US&page=3`
  );
  return response.data.results;
};

// Fetch movie details by ID
const getMovieDetails = async (movieId) => {
  const response = await axios.get(`${API_URL}movie/${movieId}`, {
    params: {
      api_key: API_KEY,
    },
  });

  return response.data;
};

const searchEverything = async (query) => {
  try {
    const response = await axios.get(`${API_URL}search/multi`, {
      params: {
        api_key: API_KEY,
        query,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from TMDB:', error);
    throw error;
  }
};

// Search for movies by query
const searchMovies = async (query) => {
  const response = await axios.get(`${API_URL}search/movie`, {
    params: {
      api_key: API_KEY,
      query,
    },
  });

  return response.data.results;
};

// Get movies by genre
const getMoviesByGenre = async (genreId) => {
  const response = await axios.get(`${API_URL}discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
    },
  });

  return response.data.results;
};

// Get trending movies
const getTrendingMovies = async (timeWindow) => {
  const response = await axios.get(`${API_URL}trending/movie/${timeWindow}`, {
    params: {
      api_key: API_KEY,
    },
  });

  return response.data.results;
};

// Get movie credits (cast and crew)
const getMovieCredits = async (movieId) => {
  const response = await axios.get(`${API_URL}movie/${movieId}/credits`, {
    params: {
      api_key: API_KEY,
    },
  });

  return response.data;
};

// Get movie recommendations based on a specific movie
const getMovieRecommendations = async () => {
  const response = await axios.get(`${API_URL}movie/upcoming`, {
    params: {
      api_key: API_KEY,
    },
  });

  return response.data.results;
};

const getMoviesByLanguage = async () => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_URL}&primary_release_date.gte=1995-01-01&primary_release_date.lte=2012-12-31&include_adult=false&sort_by=popularity.desc`,
    {
      params: {
        api_key: API_KEY,
        // Language code (e.g., "en" for English, "fr" for French)
      },
    }
  );

  return response.data.results;
};

const movieService = {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  getMoviesByGenre,
  getTrendingMovies,
  getMovieCredits,
  getMovieRecommendations,
  getNowPlayingMovies,
  getMoviesByLanguage,
  searchEverything,
};

export default movieService;
