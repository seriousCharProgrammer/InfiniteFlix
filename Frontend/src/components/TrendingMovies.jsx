import styled from 'styled-components';
import { useNavigate } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getTrendingMovies } from '../features/movie/movieSlice';

export default function TrendingMovies() {
  const dispatch = useDispatch();
  const { trendingMovies } = useSelector((state) => state.movies);
  const navigate = useNavigate();
  // State for tracking hover movie id
  const [hoveredMovie, setHoveredMovie] = useState(null);

  useEffect(() => {
    dispatch(getTrendingMovies());
  }, [dispatch]);

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
      <h2>Trending and Hot</h2>

      <Content>
        {trendingMovies &&
          trendingMovies.map((movie) => (
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
