import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios
import styled from 'styled-components';
const Watchlist = () => {
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [seriesWatchlist, setSeriesWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const navigate = useNavigate();

  // TMDB Configuration
  const API_KEY = process.env.REACT_APP_API_KEY; // Add this to your .env file
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  // Fetch watchlist from TMDB
  const fetchWatchlistFromTMDB = async () => {
    try {
      // Fetch movie watchlist
      const moviePromises = JSON.parse(
        localStorage.getItem('watchlistMovies') || '[]'
      ).map((movie) =>
        axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
        )
      );

      // Fetch series watchlist
      const seriesPromises = JSON.parse(
        localStorage.getItem('watchlistseries') || '[]'
      ).map((series) =>
        axios.get(
          `https://api.themoviedb.org/3/tv/${series.id}?api_key=${API_KEY}`
        )
      );

      // Resolve all promises
      const movieResults = await Promise.all(moviePromises);
      const seriesResults = await Promise.all(seriesPromises);

      // Update state with full details
      setMovieWatchlist(movieResults.map((res) => res.data));
      setSeriesWatchlist(seriesResults.map((res) => res.data));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  // Fetch watchlists on component mount
  useEffect(() => {
    fetchWatchlistFromTMDB();
  }, []);

  // Remove item from watchlist
  // Remove item from watchlist
  const removeFromWatchlist = (id, type) => {
    if (type === 'movies') {
      const updatedWatchlist = movieWatchlist.filter(
        (movie) => movie.id !== id
      );
      setMovieWatchlist(updatedWatchlist);
      localStorage.setItem('watchlistMovies', JSON.stringify(updatedWatchlist));
    } else {
      const updatedWatchlist = seriesWatchlist.filter(
        (series) => series.id !== id
      );
      setSeriesWatchlist(updatedWatchlist);
      localStorage.setItem('watchlistseries', JSON.stringify(updatedWatchlist));
    }
  };

  // Navigate to details page
  const navigateToDetails = (id, type) => {
    navigate(`/${type}/${id}`);
  };

  // Render watchlist items
  const renderWatchlistItems = (items, type) => {
    const DEFAULT_POSTER = '/images/no-image.png'; // Fallback image

    return items.map((item) => {
      // Determine poster path with fallback
      const posterPath = item.poster_path
        ? `${IMAGE_BASE_URL}${item.poster_path}`
        : item.backdrop_path
        ? `${IMAGE_BASE_URL}${item.backdrop_path}`
        : DEFAULT_POSTER;

      return (
        <WatchlistItem key={item.id}>
          <ItemImageWrapper>
            <ItemImage
              src={posterPath}
              alt={item.title || item.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_POSTER;
              }}
              onClick={() => navigateToDetails(item.id, type)}
            />
          </ItemImageWrapper>
          <ItemDetails>
            <ItemTitle>{item.title || item.name}</ItemTitle>
            <RatingRemoveContainer>
              <Rating color={getRatingColor(item.vote_average)}>
                {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </Rating>
              <RemoveButton onClick={() => removeFromWatchlist(item.id, type)}>
                Remove
              </RemoveButton>
            </RatingRemoveContainer>
          </ItemDetails>
        </WatchlistItem>
      );
    });
  };

  // Rating color logic
  const getRatingColor = (rating) => {
    if (rating > 8) return 'green';
    if (rating < 5) return 'red';
    return 'orange';
  };

  return (
    <WatchlistContainer>
      <PageTitle>My Watchlist</PageTitle>
      <TabContainer>
        <Tab
          active={activeTab === 'movies'}
          onClick={() => setActiveTab('movies')}
        >
          Movies ({movieWatchlist.length})
        </Tab>
        <Tab
          active={activeTab === 'series'}
          onClick={() => setActiveTab('series')}
        >
          TV Series ({seriesWatchlist.length})
        </Tab>
      </TabContainer>

      <ItemsContainer>
        {activeTab === 'movies' ? (
          movieWatchlist.length > 0 ? (
            renderWatchlistItems(movieWatchlist, 'movies')
          ) : (
            <EmptyState>No movies in your watchlist</EmptyState>
          )
        ) : seriesWatchlist.length > 0 ? (
          renderWatchlistItems(seriesWatchlist, 'series')
        ) : (
          <EmptyState>No TV series in your watchlist</EmptyState>
        )}
      </ItemsContainer>
    </WatchlistContainer>
  );
};

export default Watchlist;
// Styled Components with Enhanced Styling
/*
const WatchlistContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #090b13;
  min-height: 100vh;
  color: #f9f9f9;
`;
*/
const WatchlistContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 120px; // Increased top padding to push content lower
  background-color: #090b13;
  min-height: 100vh;
  color: #f9f9f9;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #f9f9f9;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(249, 249, 249, 0.1);
`;

const Tab = styled.button`
  padding: 12px 24px;
  margin: 0 10px;
  background-color: ${(props) =>
    props.active ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
  color: ${(props) => (props.active ? '#f9f9f9' : '#888888')};
  border: 1px solid ${(props) => (props.active ? '#f9f9f9' : 'transparent')};
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: #f9f9f9;
    border-color: #f9f9f9;
  }
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  padding: 20px;
`;

const WatchlistItem = styled.div`
  background-color: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease 0s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ItemImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 150%; // Maintains 2:3 aspect ratio
  overflow: hidden;
`;

const ItemImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const ItemDetails = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a2e;
`;

const ItemTitle = styled.h2`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 10px;
  color: #f9f9f9;
  max-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 1.42px;
`;

const RatingRemoveContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Rating = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  color: #f9f9f9;
  background: ${({ color }) => {
    switch (color) {
      case 'green':
        return 'rgba(76, 175, 80, 0.6)';
      case 'red':
        return 'rgba(244, 67, 54, 0.6)';
      default:
        return 'rgba(255, 152, 0, 0.6)';
    }
  }};
`;

const RemoveButton = styled.button`
  background-color: rgba(0, 0, 0, 0.6);
  color: #f9f9f9;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s ease 0s;
  font-size: 0.8rem;
  text-transform: uppercase;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(249, 249, 249, 0.6);
  margin-top: 50px;
  font-size: 1.2rem;
`;
