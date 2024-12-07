import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../features/movie/movieSlice';
import { searchSeries } from '../features/series/seriesSlice';
import Spinner from '../components/Spinner';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard'; // Assuming you have a MovieCard component
import SeriesCard from '../components/SeriesCard';

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const { searchedMovies, loading, error } = useSelector(
    (state) => state.movies
  );
  const { searchedSeries } = useSelector((state) => state.series);

  useEffect(() => {
    if (query) {
      dispatch(searchMovies(query));
      dispatch(searchSeries(query));
    }
  }, [dispatch, query]);

  if (loading) return <Spinner />;

  return (
    <SearchResultsContainer>
      <SearchHeader>
        Search Results for: <span>"{query}"</span>
      </SearchHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {searchedMovies &&
      searchedMovies.length === 0 &&
      searchSeries &&
      searchSeries.length === 0 ? (
        <NoResultsMessage>
          No movies or Series found matching your search.
        </NoResultsMessage>
      ) : (
        <MovieGrid>
          {searchedMovies?.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              // Add additional props as needed
            />
          ))}
          {searchedSeries?.map((serie) => (
            <SeriesCard key={serie.id} serie={serie} />
          ))}
        </MovieGrid>
      )}
    </SearchResultsContainer>
  );
}

const SearchResultsContainer = styled.div`
  padding: 80px 50px;
  background-color: #212433;
  min-height: 100vh;
`;

const SearchHeader = styled.h1`
  color: #f9f9f9;
  margin-bottom: 30px;
  font-size: 24px;

  span {
    color: #0072ff;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4136;
  text-align: center;
  margin-top: 20px;
`;

const NoResultsMessage = styled.div`
  color: #f9f9f9;
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
