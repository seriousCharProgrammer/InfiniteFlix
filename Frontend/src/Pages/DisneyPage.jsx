import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
const DisneyPage = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Ref to track the last element for intersection observer
  const observerRef = useRef();

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&with_companies=2&page=${page}`;
      const response = await axios.get(API_URL);
      const newMovies = response.data.results;

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        // Use a Set to ensure unique series across all pages
        setMovies((prevMovies) => {
          const moviesSet = new Set(prevMovies.map((m) => m.id));
          const uniqueMovies = newMovies.filter((m) => !moviesSet.has(m.id));
          return [...prevMovies, ...uniqueMovies];
        });

        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMovies();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchMovies, hasMore, loading]);

  // Initial fetch
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <PageContainer>
      <MoviesGrid>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            ref={index === movies.length - 1 ? observerRef : null}
          />
        ))}
      </MoviesGrid>
      {loading && <Spinner />}
      {!hasMore && <EndMessage>No more movies to show!</EndMessage>}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 20px;
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: gray;
`;

export default DisneyPage;
