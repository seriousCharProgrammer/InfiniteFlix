import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SeriesCard = React.forwardRef(({ serie }, ref) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Construct full image URL or fallback to default
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const DEFAULT_POSTER = '/images/no-image.png'; // Ensure this exists in the public folder

  const posterPath = serie.poster_path
    ? `${IMAGE_BASE_URL}${serie.poster_path}`
    : DEFAULT_POSTER;

  // Handle movie click to show details
  const handleMovieClick = () => {
    navigate(`/series/${serie.id}`);
  };

  // Rating color logic
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
    <div ref={ref}>
      <Wrap
        onClick={handleMovieClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={posterPath}
          alt={serie.title || 'Default Movie Poster'}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = DEFAULT_POSTER;
          }}
        />
        {isHovered && (
          <Popup>
            <Rating color={getRatingColor(serie.vote_average)}>
              {serie.vote_average ? serie.vote_average.toFixed(1) : 'N/A'}
            </Rating>
          </Popup>
        )}
      </Wrap>
    </div>
  );
});

const Wrap = styled.div`
  top: 65px;
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
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  display: flex;
  justify-content: flex-end;
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

export default SeriesCard;
