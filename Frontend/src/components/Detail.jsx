import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMovieDetails } from '../features/movie/movieSlice';
import { toast } from 'react-toastify';

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const { movieDetails, loading } = useSelector((state) => state.movies);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  // Fetch movie details and trailer
  useEffect(() => {
    const fetchMovieDetailsAndTrailer = async () => {
      setImagesLoaded(false);

      // Dispatch movie details
      const detailsAction = await dispatch(getMovieDetails(id));

      // Fetch trailer separately
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );
        const data = await response.json();

        // Find the first trailer or teaser
        const trailer = data.results.find(
          (video) => video.type === 'Trailer' || video.type === 'Teaser'
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    fetchMovieDetailsAndTrailer();
  }, [dispatch, id]);

  const handleTrailerClick = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  };

  const handlePlayClick = () => {
    setShowPlayer(true);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'trailer-overlay') {
      setShowTrailer(false);
    }
    if (e.target.id === 'player-overlay') {
      setShowPlayer(false);
    }
  };

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const onBackButton = () => {
    navigate(-1);
  };

  const handleGroupWatchClick = () => {
    const movieUrl = `https://your-website.com/movies/${id}`;
    navigator.clipboard
      .writeText(movieUrl)
      .then(() => {
        toast.success(
          `The link to the Movie: ${movieDetails.title} copied, Enjoy sharing it with friends 🤩`
        );
      })
      .catch((err) => {
        console.error('Error copying link: ', err);
      });
  };
  const toggleWatchlist = (id) => {
    // Retrieve the current watchlist from localStorage or state
    let watchlist = JSON.parse(localStorage.getItem('watchlistMovies')) || [];

    // Check if the movie is already in the watchlist
    const isInWatchlist = watchlist.some((item) => item.id === id);

    let updatedWatchlist;

    if (isInWatchlist) {
      // Remove from watchlist
      updatedWatchlist = watchlist.filter((item) => item.id !== id);
    } else {
      // Add to watchlist
      updatedWatchlist = [...watchlist, { id }];
    }

    // Save the updated watchlist back to localStorage or state
    localStorage.setItem('watchlistMovies', JSON.stringify(updatedWatchlist));

    // Optionally, trigger a toast notification
    if (isInWatchlist) {
      toast.success('Movie removed from your watchlist');
    } else {
      toast.success('Movie added to your watchlist');
    }
  };

  return (
    <Container>
      {loading ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : (
        movieDetails && (
          <>
            <Background>
              <img
                alt={movieDetails.title}
                src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                onLoad={handleImageLoad} // Trigger image loaded handler
              />
            </Background>
            <ImageTitle isLoading={!imagesLoaded}>
              <img
                src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
                alt={movieDetails.title}
                onLoad={handleImageLoad} // Trigger image loaded handler
              />
            </ImageTitle>
            <ContentMeta>
              <Controls>
                <Player onClick={handlePlayClick}>
                  <img src='/images/play-icon-black.png' alt='Play' />
                  <span>Play</span>
                </Player>
                <Trailer onClick={handleTrailerClick}>
                  <img src='/images/play-icon-white.png' alt='Trailer' />
                  <span>Trailer</span>
                </Trailer>
                <AddList onClick={() => toggleWatchlist(id)}>
                  <span />
                  <span />
                </AddList>
                <GroupWatch onClick={handleGroupWatchClick}>
                  <div>
                    <img src='/images/group-icon.png' alt='Group Watch' />
                  </div>
                </GroupWatch>
                <BackButton onClick={onBackButton}>
                  <div>
                    <img src='/images/back-button.png' alt='Group Watch' />
                  </div>
                </BackButton>
              </Controls>
              <SubTitle>
                <div>{movieDetails.title || 'Subtitle'}</div>
                <div>Released in: {movieDetails.release_date || ''}</div>
                <div>Length: {movieDetails.runtime}m</div>
              </SubTitle>
              <Description>
                {movieDetails.overview || 'No description available.'}
              </Description>
            </ContentMeta>

            {showTrailer && trailerKey && (
              <TrailerOverlay id='trailer-overlay' onClick={handleOutsideClick}>
                <TrailerIframeContainer>
                  <iframe
                    width='100%'
                    height='100%'
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                    allowFullScreen
                    allow='autoplay; encrypted-media'
                    title='Trailer'
                  />
                  <CloseButton onClick={handleCloseTrailer}>X</CloseButton>
                </TrailerIframeContainer>
              </TrailerOverlay>
            )}

            {showPlayer && (
              <PlayerOverlay id='player-overlay' onClick={handleOutsideClick}>
                <PlayerIframeContainer>
                  <iframe
                    width='100%'
                    height='100%'
                    src={`https://embed.su/embed/movie/${id}`}
                    allowFullScreen
                    allow='autoplay; encrypted-media'
                    title='Movie Player'
                  />
                  <CloseButton onClick={handleClosePlayer}>X</CloseButton>
                </PlayerIframeContainer>
              </PlayerOverlay>
            )}
          </>
        )
      )}
    </Container>
  );
}
//`https://flicky.host/embed/movie/?id=${id}`
const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 350px;
    min-width: 200px;
    width: 35vw;
    @media (max-width: 768px) {
      max-width: 90px;
      min-width: 90px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1851px) {
      max-width: 300px;
      min-width: 250px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1600px) {
      max-width: 250px;
      min-width: 250px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1340px) {
      max-width: 200px;
      min-width: 150px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 1080px) {
      max-width: 180px;
      min-width: 150px;
      width: 35vw;
    }
    @media (min-width: 800px) and (max-width: 980px) {
      max-width: 160px;
      min-width: 150px;
      width: 35vw;
    }
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0 22px 0 0;
  padding: 0 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: rgb(249, 249, 249);
  border: none;
  color: rgb(0, 0, 0);

  img {
    width: 32px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }
  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddList = styled.div`
  margin-right: 16px;
  height: 44px;
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const GroupWatch = styled.div`
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(0, 0, 0);
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
`;

const BackButton = styled.div`
  margin-left: 10px;
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;

  div {
    height: 40px;
    width: 40px;
    background: rgb(249, 249, 249);
    border-radius: 50%;
    img {
      width: 100%;
    }
  }
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  display: flex;
  gap: 10px;
  font-family: Avenir-Roman, sans-serif;
  font-size: 17px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TrailerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TrailerIframeContainer = styled.div`
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 900px;
  max-height: 500px;
  iframe {
    border-radius: 8px;
  }
`;

const PlayerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerIframeContainer = styled.div`
  position: relative;
  width: 80vw;
  height: 45vw;
  max-width: 900px;
  max-height: 500px;
  iframe {
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 7px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
