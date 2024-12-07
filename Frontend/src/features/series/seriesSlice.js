import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import seriesService from './seriesService';
import { extractErrorMessage } from '../../utils';

const initialState = {
  popularSeries: null,
  trendingSeries: null,
  seriesByGenre: null,
  searchedSeries: null,
  airingSeries: null,
  seriesByLanguage: null,
  seriesDetails: null,
  loading: false,
  error: null,
};

// Fetch popular series
export const getPopularSeries = createAsyncThunk(
  'series/getPopular',
  async (_, thunkAPI) => {
    try {
      const response = await seriesService.getPopularSeries();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch trending series
export const getTrendingSeries = createAsyncThunk(
  'series/getTrending',
  async (timeWindow = 'year', thunkAPI) => {
    try {
      const response = await seriesService.getTrendingSeries(timeWindow);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch series by genre
export const getSeriesByGenre = createAsyncThunk(
  'series/getByGenre',
  async (genreId, thunkAPI) => {
    try {
      const response = await seriesService.getSeriesByGenre(genreId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Search for series
export const searchSeries = createAsyncThunk(
  'series/search',
  async (query, thunkAPI) => {
    try {
      const response = await seriesService.searchSeries(query);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch airing series
export const getAiringSeries = createAsyncThunk(
  'series/getAiring',
  async (_, thunkAPI) => {
    try {
      const response = await seriesService.getAiringSeries();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch series details
export const getSeriesDetails = createAsyncThunk(
  'series/getDetails',
  async (seriesId, thunkAPI) => {
    try {
      const response = await seriesService.getSeriesDetails(seriesId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const getSeriesByLanguage = createAsyncThunk(
  'series/getByLanguage',
  async (languageCode, thunkAPI) => {
    try {
      const response = await seriesService.getSeriesByLanguage(languageCode);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Series slice
export const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular series
      .addCase(getPopularSeries.fulfilled, (state, action) => {
        state.popularSeries = action.payload;
      })

      // Trending series
      .addCase(getTrendingSeries.fulfilled, (state, action) => {
        state.trendingSeries = action.payload;
      })

      // Series by genre
      .addCase(getSeriesByGenre.fulfilled, (state, action) => {
        state.seriesByGenre = action.payload;
      })

      // Searched series
      .addCase(searchSeries.fulfilled, (state, action) => {
        state.searchedSeries = action.payload;
      })

      // Airing series
      .addCase(getAiringSeries.fulfilled, (state, action) => {
        state.airingSeries = action.payload;
      })

      // Series details
      .addCase(getSeriesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSeriesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.tvDetails = action.payload;
      })
      .addCase(getSeriesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Series by language
      .addCase(getSeriesByLanguage.pending, (state) => {
        state.seriesByLanguage = null; // Reset language-specific series while loading
      })
      .addCase(getSeriesByLanguage.fulfilled, (state, action) => {
        state.seriesByLanguage = action.payload;
      })
      .addCase(getSeriesByLanguage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetError } = seriesSlice.actions;
export default seriesSlice.reducer;
