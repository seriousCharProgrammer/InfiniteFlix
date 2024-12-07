import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movie/movieSlice';
import seriesReducer from '../features/series/seriesSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    series: seriesReducer,
  },
});
