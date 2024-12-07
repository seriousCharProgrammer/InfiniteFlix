import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieService from './movieService';
import { extractErrorMessage } from '../../utils';

const initialState = {
  popularMovies: null,
  trendingMovies: null,
  moviesByGenre: null,
  searchedMovies: null,
  nowPlayingMovies: null,
  moviesByLanguage: null,
  movieDetails: null,
  loading: false, // Add a loading state
  error: null,
};

// Fetch popular movies
export const getPopularMovies = createAsyncThunk(
  'movies/getPopular',
  async (_, thunkAPI) => {
    try {
      const response = await movieService.getPopularMovies();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch trending movies
export const getTrendingMovies = createAsyncThunk(
  'movies/getTrending',
  async (timeWindow = 'week', thunkAPI) => {
    try {
      const response = await movieService.getTrendingMovies(timeWindow);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch movies by genre
export const getMoviesByGenre = createAsyncThunk(
  'movies/getByGenre',
  async (genreId, thunkAPI) => {
    try {
      const response = await movieService.getMoviesByGenre(genreId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Search for movies
export const searchMovies = createAsyncThunk(
  'movies/search',
  async (query, thunkAPI) => {
    try {
      const response = await movieService.searchMovies(query);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const searchAll = createAsyncThunk(
  'all/search',
  async (query, thunkAPI) => {
    try {
      const response = await movieService.searchEverything(query);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch now playing movies
export const getNowPlayingMovies = createAsyncThunk(
  'movies/getNowPlaying',
  async (_, thunkAPI) => {
    try {
      const response = await movieService.getNowPlayingMovies();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch movie details
export const getMovieDetails = createAsyncThunk(
  'movies/getDetails',
  async (movieId, thunkAPI) => {
    try {
      const response = await movieService.getMovieDetails(movieId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);
export const getMoviesByLanguage = createAsyncThunk(
  'movies/getByLanguage',
  async (languageCode, thunkAPI) => {
    try {
      const response = await movieService.getMoviesByLanguage(languageCode);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Movie slice
// Movie slice
export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular movies
      .addCase(getPopularMovies.fulfilled, (state, action) => {
        state.popularMovies = action.payload;
      })
      // Trending movies
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.trendingMovies = action.payload;
      })

      // Movies by genre
      .addCase(getMoviesByGenre.fulfilled, (state, action) => {
        state.moviesByGenre = action.payload;
      })

      // Searched movies
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchedMovies = action.payload;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.searchedMovies = action.payload;
      })

      // Now-playing movies
      .addCase(getNowPlayingMovies.fulfilled, (state, action) => {
        state.nowPlayingMovies = action.payload;
      })

      // Movie details
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.movieDetails = action.payload;
      })

      // Movies by language
      .addCase(getMoviesByLanguage.pending, (state) => {
        state.moviesByLanguage = null; // Reset language-specific movies while loading
      })
      .addCase(getMoviesByLanguage.fulfilled, (state, action) => {
        state.moviesByLanguage = action.payload;
      })
      .addCase(getMoviesByLanguage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetError } = movieSlice.actions;
export default movieSlice.reducer;

//////////////////////////bestttttttttttttttttttttttttttttttttttttt///////////////////////////////////////////
/* .addCase(getPopularMovies.fulfilled, (state, action) => {
        state.popularMovies = action.payload;
      })*/
