import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '5f4161158073968a49852676a3e682b4'; // Replace with your actual TMDB API key

// Fetch popular TV series
const getPopularSeries = async () => {
  const response = await axios.get(`${API_URL}tv/popular`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data.results;
};

// Fetch currently airing TV series
const getAiringSeries = async () => {
  const response = await axios.get(
    `${API_URL}tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`
  );
  return response.data.results;
};

// Fetch TV series details by ID
const getSeriesDetails = async (seriesId) => {
  const response = await axios.get(`${API_URL}tv/${seriesId}`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data;
};

// Search for TV series
const searchSeries = async (query) => {
  const response = await axios.get(`${API_URL}search/tv`, {
    params: {
      api_key: API_KEY,
      query,
    },
  });
  return response.data.results;
};

// Get TV series by genre
const getSeriesByGenre = async (genreId) => {
  const response = await axios.get(`${API_URL}discover/tv`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
    },
  });
  return response.data.results;
};

// Get trending TV series
const getTrendingSeries = async (timeWindow = 'week') => {
  const response = await axios.get(`${API_URL}trending/tv/${timeWindow}`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data.results;
};

// Get TV series credits (cast and crew)
const getSeriesCredits = async (seriesId) => {
  const response = await axios.get(`${API_URL}tv/${seriesId}/credits`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data;
};

// Get TV series by language
const getSeriesByLanguage = async (languageCode) => {
  const response = await axios.get(`${API_URL}discover/tv`, {
    params: {
      api_key: API_KEY,
      with_original_language: languageCode,
    },
  });
  return response.data.results;
};

const seriesService = {
  getPopularSeries,
  getSeriesDetails,
  searchSeries,
  getSeriesByGenre,
  getTrendingSeries,
  getSeriesCredits,
  getAiringSeries,
  getSeriesByLanguage,
};

export default seriesService;
