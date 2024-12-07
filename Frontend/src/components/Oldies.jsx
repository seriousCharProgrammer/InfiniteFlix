import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router';
export default function Oldies() {
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  // Ref to track the last element for intersection observer
  const observerRef = useRef();
  const navigate = useNavigate();
  // Memoized fetch function to prevent unnecessary re-renders
  const fetchMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&primary_release_date.gte=1995-01-01&primary_release_date.lte=2012-12-31&include_adult=false&sort_by=popularity.desc`;

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
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

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
  const handleMouseEnter = (movieId) => {
    setHoveredMovie(movieId);
  };

  const handleMouseLeave = () => {
    setHoveredMovie(null);
  };
  const getRatingColor = (rating) => {
    if (rating > 8) {
      return 'green';
    } else if (rating < 5) {
      return 'red';
    } else {
      return 'orange';
    }
  };

  return (
    <Container>
      <h2>Oldies</h2>

      <Content>
        {movies &&
          movies.map((movie) => (
            <Wrap
              onClick={() => {
                navigate(`/movies/${movie.id}`);
              }}
              key={movie.id}
              onMouseEnter={() => handleMouseEnter(movie.id)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />

              {hoveredMovie === movie.id && (
                <Popup>
                  <Rating color={getRatingColor(movie.vote_average)}>
                    {movie.vote_average}
                  </Rating>
                </Popup>
              )}
            </Wrap>
          ))}
      </Content>
    </Container>
  );
}

// Styled components

const Container = styled.div`
  margin-top: 20px;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  margin-top: 20px;
`;

const Wrap = styled.div`
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid rgba(249, 249, 249, 0.1);
  box-shadow: rgb(0 0 0 / 69%) 0px 16px 20px -10px,
    rgb(0 0 0 / 73%) 0px 10px 10px -10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  position: relative;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(249, 249, 249, 0.8);
  }
`;

const Popup = styled.div`
  position: absolute;
  top: 0%;
  left: -50px;
  //background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Rating = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  text-align: center;

  background: ${({ color }) => {
    switch (color) {
      case 'green':
        return 'rgba(76, 175, 80, 0.8)'; // Green
      case 'red':
        return 'rgba(244, 67, 54, 0.8)'; // Red
      default:
        return 'rgba(255, 152, 0, 0.8)'; // Orange
    }
  }};
`;
